import { Request } from "express";
import { Agent, Dispatcher, request } from "undici";
import fs from "node:fs";
import dns from "node:dns/promises";
import net from "node:net";

/* Get request client IP address */
export function getClientIp(req: Request): string | null {
	return (req.get('x-forwarded-for')?.split(',')[0] || req.get('x-real-ip') || req.ip || req.socket.remoteAddress || null);
}

/* Get header value */
export function getHeaderValue(req: Request, name: string): string | null {
	const raw = req.headers?.[name.toLowerCase()];
	if (typeof raw === "string" && raw.length > 0) return raw;
	if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string") return raw[0];
	return null;
}

/* SSRF protection: classify private / loopback / link-local / reserved addresses */
function isDisallowedIpv4(ip: string): boolean {
	const parts = ip.split('.').map((n) => Number(n));
	if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
	const [a, b, c] = parts;
	if (a === 0) return true;                             /* 0.0.0.0/8   "this host" */
	if (a === 10) return true;                            /* 10.0.0.0/8  private */
	if (a === 127) return true;                           /* 127.0.0.0/8 loopback */
	if (a === 169 && b === 254) return true;              /* 169.254.0.0/16 link-local (incl. cloud metadata) */
	if (a === 172 && b >= 16 && b <= 31) return true;     /* 172.16.0.0/12 private */
	if (a === 192 && b === 168) return true;              /* 192.168.0.0/16 private */
	if (a === 100 && b >= 64 && b <= 127) return true;    /* 100.64.0.0/10 CGNAT */
	if (a === 192 && b === 0 && c === 0) return true;     /* 192.0.0.0/24 IETF protocol assignments */
	if (a === 198 && (b === 18 || b === 19)) return true; /* 198.18.0.0/15 benchmarking */
	if (a >= 224) return true;                            /* 224.0.0.0/4 multicast + 240.0.0.0/4 reserved + broadcast */
	return false;
}
function isDisallowedIpv6(ip: string): boolean {
	let addr = ip.toLowerCase();
	const zone = addr.indexOf('%');
	if (zone !== -1) addr = addr.slice(0, zone);           /* strip scope id (fe80::1%eth0) */
	const embedded = addr.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
	if (embedded && (addr.startsWith('::ffff:') || addr.startsWith('::'))) {
		/* IPv4-mapped / IPv4-compatible addresses embed a v4 address — validate that instead */
		return isDisallowedIpv4(embedded[1]);
	}
	if (addr === '::1') return true;                       /* loopback */
	if (addr === '::') return true;                        /* unspecified */
	const firstHextet = parseInt(addr.split(':')[0] || '0', 16) || 0;
	if ((firstHextet & 0xffc0) === 0xfe80) return true;    /* fe80::/10 link-local */
	if ((firstHextet & 0xfe00) === 0xfc00) return true;    /* fc00::/7  unique local */
	if ((firstHextet & 0xff00) === 0xff00) return true;    /* ff00::/8  multicast */
	return false;
}
export function isDisallowedIp(ip: string): boolean {
	const kind = net.isIP(ip);
	if (kind === 4) return isDisallowedIpv4(ip);
	if (kind === 6) return isDisallowedIpv6(ip);
	return true;
}

/* Resolve a hostname and reject if any resolved address is a disallowed range. Returns a single validated address to pin the connection to (so the socket cannot be swapped to a different IP between validation and connect — DNS rebinding). */
async function resolveToValidatedIp(hostname: string): Promise<{ address: string; family: number }> {
	if (net.isIP(hostname)) {
		if (isDisallowedIp(hostname)) throw new Error(`Blocked address: ${hostname}`);
		return { address: hostname, family: net.isIP(hostname) };
	}
	let records: { address: string; family: number }[];
	try {
		records = await dns.lookup(hostname, { all: true });
	} catch {
		throw new Error(`DNS resolution failed for host: ${hostname}`);
	}
	if (records.length === 0) throw new Error(`No DNS records for host: ${hostname}`);
	for (const record of records) {
		if (isDisallowedIp(record.address)) throw new Error(`Blocked address for ${hostname}: ${record.address}`);
	}
	return records[0];
}

/* Build an undici dispatcher that only connects to the pre-validated IP, keeping the original hostname for the Host header and TLS servername (so cert validation is intact). */
async function buildPinnedDispatcher(parsed: URL): Promise<Agent> {
	const pinned = await resolveToValidatedIp(parsed.hostname);
	return new Agent({
		connect: {
			lookup: (_hostname: string, options: any, callback: (err: NodeJS.ErrnoException | null, address: any, family?: number) => void) => {
				if (options && options.all) callback(null, [{ address: pinned.address, family: pinned.family }]);
				else callback(null, pinned.address, pinned.family);
			},
		},
	});
}

/* Perform an outbound HTTP request. When `enforceSsrfProtection` is set, only http(s) URLs are allowed and the destination is validated + pinned against private/reserved ranges. The full response body is buffered so the pinned dispatcher can be closed safely. */
export async function guardedRequest(
	url: string,
	options: { method?: Dispatcher.HttpMethod; body?: any } = {},
	enforceSsrfProtection = false,
): Promise<{ statusCode: number; body: Buffer }> {
	if (!enforceSsrfProtection) {
		const response = await request(url, options);
		return { statusCode: response.statusCode, body: Buffer.from(await response.body.arrayBuffer()) };
	}
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error(`Invalid URL: ${url}`);
	}
	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
		throw new Error(`Blocked URL scheme: ${parsed.protocol}`);
	}
	const dispatcher = await buildPinnedDispatcher(parsed);
	try {
		const response = await request(url, { ...options, dispatcher });
		return { statusCode: response.statusCode, body: Buffer.from(await response.body.arrayBuffer()) };
	} finally {
		await dispatcher.close().catch(() => {});
	}
}

/* Fetch files from URLs or local paths */
export function parseFileUri(source: string): string {
	if (!source.startsWith("file://"))
		return source
	try {
		return decodeURIComponent(new URL(source).pathname)
	} catch {
		return source.replace(/^file:\/\//, "")
	}
}
export async function fetchFileFromUrl(url: string, enforceSsrfProtection = false): Promise<Buffer> {
	const response = await guardedRequest(url, {}, enforceSsrfProtection)
	return response.body
}
export function readLocalFile(filePath: string): { success: true; buffer: Buffer } | { success: false; error: string } {
	if (!fs.existsSync(filePath))
		return { success: false, error: `File does not exist: ${filePath}` }
	const buffer = fs.readFileSync(filePath)
	return { success: true, buffer }
}
export async function getFileBuffer(
	source: string,
	options: { allowLocalFiles?: boolean; enforceSsrfProtection?: boolean } = {},
): Promise<{ success: true; buffer: Buffer } | { success: false; error: string }> {
	const allowLocalFiles = options.allowLocalFiles ?? true;
	const enforceSsrfProtection = options.enforceSsrfProtection ?? false;
	if (source.startsWith("http://") || source.startsWith("https://")) {
		try {
			const buffer = await fetchFileFromUrl(source, enforceSsrfProtection)
			return { success: true, buffer }
		} catch (error) {
			return { success: false, error: `Failed to fetch file from URL: ${error instanceof Error ? error.message : String(error)}` }
		}
	} else {
		if (!allowLocalFiles) {
			return { success: false, error: `Local file paths are not allowed in this deployment mode; provide an http(s) URL instead.` }
		}
		const filePath = parseFileUri(source)
		return readLocalFile(filePath)
	}
}
