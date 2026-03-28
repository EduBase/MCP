import { Request } from "express";
import { request } from "undici";
import fs from "node:fs";

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
export async function fetchFileFromUrl(url: string): Promise<Buffer> {
	const response = await request(url)
	return Buffer.from(await response.body.arrayBuffer())
}
export function readLocalFile(filePath: string): { success: true; buffer: Buffer } | { success: false; error: string } {
	if (!fs.existsSync(filePath))
		return { success: false, error: `File does not exist: ${filePath}` }
	const buffer = fs.readFileSync(filePath)
	return { success: true, buffer }
}
export async function getFileBuffer(source: string): Promise<{ success: true; buffer: Buffer } | { success: false; error: string }> {
	if (source.startsWith("http://") || source.startsWith("https://")) {
		try {
			const buffer = await fetchFileFromUrl(source)
			return { success: true, buffer }
		} catch (error) {
			return { success: false, error: `Failed to fetch file from URL: ${error}` }
		}
	} else {
		const filePath = parseFileUri(source)
		return readLocalFile(filePath)
	}
}
