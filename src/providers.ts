import { Request, Response } from "express";

/* Session configuration supplied in the request by a hosting provider (e.g. Smithery), every field is optional */
export type EduBaseProviderConfig = {
	apiUrl?: string;
	apiApp?: string;
	apiKey?: string;
	toolsets?: string;
	readOnly?: boolean;
	dynamic?: boolean;
};
export class EduBaseConfigError extends Error {
	constructor(message: string) { super(message); this.name = 'EduBaseConfigError'; }
}
type EduBaseConfigProvider = {
	name: string;
	/* Configuration of the request, null if the provider did not supply any (throws EduBaseConfigError if the supplied configuration is invalid) */
	parse: (req: Request) => EduBaseProviderConfig | null;
};

/* Helpers for reading provider configuration values */
function getString(config: Record<string, unknown>, key: string): string | undefined {
	const value = config[key];
	return (typeof value == 'string' && value.length > 0) ? value : undefined;
}
function getBoolean(config: Record<string, unknown>, key: string): boolean | undefined {
	const value = config[key];
	return (value === true || value === 'true') ? true : ((value === false || value === 'false') ? false : undefined);
}

/* Smithery: base64-encoded JSON object in the config query parameter (see smithery.yaml) */
const SMITHERY: EduBaseConfigProvider = {
	name: 'Smithery',
	parse: (req) => {
		if (!req.query?.config) {
			return null;
		}
		let config: unknown = null;
		if (typeof req.query.config == 'string') {
			try {
				config = JSON.parse(Buffer.from(req.query.config, 'base64').toString());
			} catch {
				/* Reported below */
			}
		}
		if (!config || typeof config != 'object' || Array.isArray(config)) {
			throw new EduBaseConfigError('Invalid config query parameter: a base64-encoded JSON object is expected');
		}
		const values = config as Record<string, unknown>;
		return {
			apiUrl: getString(values, 'edubaseApiUrl'),
			apiApp: getString(values, 'edubaseApiApp'),
			apiKey: getString(values, 'edubaseApiKey'),
			toolsets: getString(values, 'edubaseToolsets'),
			readOnly: getBoolean(values, 'edubaseReadOnly'),
			dynamic: getBoolean(values, 'edubaseDynamicToolsets'),
		};
	},
};

/* Supported providers, keyed by the name used in the EDUBASE_CONFIG_PROVIDERS environment variable */
const EDUBASE_SUPPORTED_CONFIG_PROVIDERS: Record<string, EduBaseConfigProvider> = {
	smithery: SMITHERY,
};

/* Enabled providers (the configuration of the first enabled provider supplying one is used) */
let enabledProviders: EduBaseConfigProvider[] = [];
export function configureProviders(value: string | null | undefined): { providers: string[]; unknown: string[] } {
	const names = (value || '').split(',').map((name) => name.trim().toLowerCase()).filter((name) => name.length > 0);
	const providers = names.filter((name) => Object.hasOwn(EDUBASE_SUPPORTED_CONFIG_PROVIDERS, name));
	enabledProviders = providers.map((name) => EDUBASE_SUPPORTED_CONFIG_PROVIDERS[name]);
	return { providers, unknown: names.filter((name) => !Object.hasOwn(EDUBASE_SUPPORTED_CONFIG_PROVIDERS, name)) };
}

/* Get the provider configuration of the request */
export function getProviderConfig(req: Request): EduBaseProviderConfig | null {
	for (const provider of enabledProviders) {
		const config = provider.parse(req);
		if (config) {
			return config;
		}
	}
	return null;
}

/* Configuration override passed to the tool handlers in the request metadata */
export function getProviderOverride(req: Request): { EDUBASE_API_URL: string | null; EDUBASE_API_APP: string | null; EDUBASE_API_KEY: string | null } {
	const config = getProviderConfig(req);
	return {
		EDUBASE_API_URL: config?.apiUrl ?? null,
		EDUBASE_API_APP: config?.apiApp ?? null,
		EDUBASE_API_KEY: config?.apiKey ?? null,
	};
}

/* Express middleware rejecting requests with invalid provider configuration upfront */
export function rejectInvalidProviderConfig(req: Request, res: Response, next: () => void) {
	try {
		getProviderConfig(req);
		next();
	} catch (error) {
		res.status(400).json({
			jsonrpc: '2.0',
			id: (req.body && typeof req.body === 'object' && 'id' in req.body) ? (req.body as { id: string | number | null }).id : null,
			error: {
				code: -32602,
				message: error instanceof Error ? error.message : String(error),
			},
		});
	}
}
