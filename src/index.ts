#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequest, CallToolResult, isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "node:crypto";
import queryString from "query-string";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { InMemoryEventStore } from '@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js';
import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import { getClientIp, getHeaderValue, getFileBuffer } from "./helpers.js";
import { MANIFEST } from "./manifest.js";
import packageJson from '../package.json' with { type: "json" };
import * as z from 'zod/v4';
import { FormData, request } from "undici";

/* Version */
const VERSION = packageJson.version;

/* Enable SSE or Streamable HTTP mode */
const SSE = ((process.env.EDUBASE_SSE_MODE || 'false') == 'true');
const STREAMABLE_HTTP = ((process.env.EDUBASE_STREAMABLE_HTTP_MODE || 'false') == 'true');

/* Check required EduBase environment variables */
const EDUBASE_API_URL = process.env.EDUBASE_API_URL || 'https://www.edubase.net/api';
if (!SSE && !STREAMABLE_HTTP && EDUBASE_API_URL.length == 0) {
	console.error('Error: EDUBASE_API_URL environment variable is required with this transport mode');
	process.exit(1);
}
const EDUBASE_API_APP = process.env.EDUBASE_API_APP || '';
if (!SSE && !STREAMABLE_HTTP && EDUBASE_API_APP.length == 0) {
	console.error('Error: EDUBASE_API_APP environment variable is required with this transport mode');
	process.exit(1);
}
const EDUBASE_API_KEY = process.env.EDUBASE_API_KEY || '';
if (!SSE && !STREAMABLE_HTTP && EDUBASE_API_KEY.length == 0) {
	console.error('Error: EDUBASE_API_KEY environment variable is required with this transport mode');
	process.exit(1);
}

/* OAuth 2.1 Protected Resource discovery */
const EDUBASE_OAUTH_AUTHORIZATION_SERVER = (process.env.EDUBASE_OAUTH_AUTHORIZATION_SERVER || EDUBASE_API_URL.replace(/\/api\/?$/, '') || 'https://www.edubase.net').replace(/\/$/, '');
const EDUBASE_OAUTH_RESOURCE_URL = (process.env.EDUBASE_OAUTH_RESOURCE_URL || EDUBASE_API_URL.replace(/\/api\/?$/, '/mcp') || 'https://www.edubase.net/mcp').replace(/\/$/, '');
const EDUBASE_OAUTH = ((process.env.EDUBASE_OAUTH || 'false') == 'true' && STREAMABLE_HTTP && EDUBASE_OAUTH_AUTHORIZATION_SERVER.length > 0 && EDUBASE_OAUTH_RESOURCE_URL.length > 0);

/* Supported tools and prompts */
import { EDUBASE_API_TOOLS_ANNOTATED } from "./tools.js";
import { EDUBASE_API_PROMPTS } from "./prompts.js";

/* Create MCP server with appropriate EduBase configuration */
function getEduBaseApiUrl(req: Request): string | null {
	if (req.query?.config && typeof req.query.config == 'string') {
		/* Use URL from Smithery configuration */
		const smitheryConfig = JSON.parse(Buffer.from(req.query.config, 'base64').toString());
		if (smitheryConfig.edubaseApiUrl && typeof smitheryConfig.edubaseApiUrl == 'string' && smitheryConfig.edubaseApiUrl.length > 0) {
			return smitheryConfig.edubaseApiUrl;
		}
	}
	return null;
}
function getEduBaseAuthentication(req: Request): EduBaseAuthentication | null {
	let EDUBASE_API_APP: string | null = null;
	let EDUBASE_API_KEY: string | null = null;
	if (req.query?.config && typeof req.query.config == 'string') {
		/* Use authentication from Smithery configuration */
		const smitheryConfig = JSON.parse(Buffer.from(req.query.config, 'base64').toString());
		if (smitheryConfig.edubaseApiApp && typeof smitheryConfig.edubaseApiApp == 'string' && smitheryConfig.edubaseApiApp.length > 0) {
			EDUBASE_API_APP = smitheryConfig.edubaseApiApp;
		}
		if (smitheryConfig.edubaseApiKey && typeof smitheryConfig.edubaseApiKey == 'string' && smitheryConfig.edubaseApiKey.length > 0) {
			EDUBASE_API_KEY = smitheryConfig.edubaseApiKey;
		}
	} else if (getHeaderValue(req, 'edubase-api-app') && getHeaderValue(req, 'edubase-api-secret')) {
		/* Use authentication from request headers */
		EDUBASE_API_APP = getHeaderValue(req, 'edubase-api-app');
		EDUBASE_API_KEY = getHeaderValue(req, 'edubase-api-secret');
	} else if (getHeaderValue(req, 'authorization') && getHeaderValue(req, 'authorization')!.startsWith('Bearer ')) {
		/* Forward the bearer token to the EduBase API as is — API server understands both `base64(app:secret)` tokens and OAuth 2.1 IdP-issued access tokens. */
		const raw = getHeaderValue(req, 'authorization')!.slice('Bearer '.length).trim();
		if (raw.length > 0) {
			return { bearer: raw };
		}
	}
	if(EDUBASE_API_APP && EDUBASE_API_KEY) {
		return { app: EDUBASE_API_APP, secret: EDUBASE_API_KEY };
	}
	return null;
}
function createMcpServer(apiUrl: string | null = null, authentication: EduBaseAuthentication | null = null) {
	/* Create MCP server instance */
	const server = new McpServer(
		{
			name: MANIFEST.name,
			title: MANIFEST.title,
			version: VERSION,
			description: MANIFEST.description,
			icons: MANIFEST.icons.map(({ src, sizes, mimeType, theme }) => ({ src, sizes, mimeType, theme })),
			websiteUrl: MANIFEST.websiteUrl,
		},
		{
			capabilities: {
				prompts: {
					listChanged: true
				},
				tools: {
					listChanged: true
				},
			},
		},
	);

	/* Configure request handlers */
	Object.values(EDUBASE_API_PROMPTS).forEach((prompt) => {
		/* Register prompts */
		server.registerPrompt(prompt.name, {description: prompt.description, argsSchema: prompt.argsSchema}, prompt.handler);
	});
	server.registerTool('edubase_mcp_server_version', {
		description: 'Get the MCP server version (only use for debugging).',
		annotations: {
			title: 'Get MCP Server Version',
			readOnlyHint: true,
			destructiveHint: false,
			idempotentHint: true,
			openWorldHint: false,
		},
	}, async (): Promise<CallToolResult> => {
		/* Static response with server version, useful for testing connectivity and authentication */
		return {
			content: [{ type: 'text', text: VERSION }],
			isError: false,
		};
	});
	if((!apiUrl && !EDUBASE_API_URL.match(/dockerhost/)) || (apiUrl && !apiUrl.match(/dockerhost/))) {
		server.registerTool('edubase_mcp_server_api', {
			description: 'Get the MCP server API URL (only use for debugging).',
			annotations: {
				title: 'Get MCP Server API URL',
				readOnlyHint: true,
				destructiveHint: false,
				idempotentHint: true,
				openWorldHint: false,
			},
		}, async (): Promise<CallToolResult> => {
			/* Static response with server API URL, useful for testing connectivity and authentication */
			return {
				content: [{ type: 'text', text: apiUrl || EDUBASE_API_URL }],
				isError: false,
			};
		});
	}
	server.registerTool('edubase_filebin', {
		description: 'Upload a local file or a file from a URL to the EduBase temporary file storage with a link requested from the API in advance.',
		inputSchema: z.object({
			filebin: z.string().describe("valid EduBase temporary filebin URL"),
			source: z.string().describe("file URL or local (absolute) file path on user computer"),
			filename: z.string().describe("the original file name (including extension)"),
		}),
		outputSchema: z.object({}).optional(),
		annotations: {
			title: 'Upload file to EduBase temporary file storage',
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	}, async ({ filebin, source, filename }: { filebin: string; source: string; filename: string }): Promise<CallToolResult> => {
		try {
			/* Get file content */
			const fileResult = await getFileBuffer(source)
			if (!fileResult.success) {
				throw new Error(fileResult.error);
			}

			/* Upload file (as form) */
			const form = new FormData()
			const fileBlob = new Blob([new Uint8Array(fileResult.buffer)])
			form.append('file', fileBlob, filename)
			const uploadResponse = await request(filebin, {
				method: 'POST',
				body: form,
			})
			const text = await uploadResponse.body.text()
			return {
				content: [{ type: 'text', text: text }],
				isError: false,
			};
		} catch (error) {
			/* Request failed */
			return {
				content: [{
					type: 'text',
					text: `${error instanceof Error ? error.message : String(error)}. Use \`curl\` to upload the file manually. Example command: \`curl -s -X POST -F "file=@/path/to/file" -H "Content-Type: multipart/form-data" ${filebin}\``,
				}],
				isError: true,
			};
		}
	});
	Object.values(EDUBASE_API_TOOLS_ANNOTATED).forEach((tool) => {
		/* Register tools */
		server.registerTool(tool.name, {
			description: tool.description,
			inputSchema: tool.inputSchema as any,
			outputSchema: tool.outputSchema as any,
			annotations: tool.annotations,
		}, async (args: any, ctx: any): Promise<CallToolResult> => {
			try {
				const name = tool.name;
				/* Decompose request and check arguments */
				if (!name.match(/^edubase_(get|post|delete)/)) {
					throw new Error('Invalid tool configuration');
				}
				if (!args) {
					throw new Error('No arguments provided');
				}

				/* Prepare and send API request */
				const [ , method, ...endpoint ] = name.split('_');
				const response = await sendEduBaseApiRequest(method, (apiUrl || EDUBASE_API_URL) + '/' + endpoint.join(':'), args, authentication);

				/* Return response */
				if (z.object({}).strict().safeParse(tool.outputSchema).success) {
					/* Endpoint with empty output schema */
					return {
						content: [{ type: 'text', text: '{}' }],
						structuredContent: {},
						isError: false,
					};
				} else if (response.length == 0) {
					/* Endpoint without response */
					return {
						content: [{ type: 'text', text: 'Success.' }],
						isError: false,
					};
				}
				else if (typeof response != 'object') {
					/* Response should be an object (hash or list) at this point */
					throw new Error('Invalid response');
				}
				else
				{
					/* Return response (schema will be validated automatically) */
					return {
						content: [{ type: 'text', text: JSON.stringify(response) }],
						structuredContent: response,
						isError: false,
					};
				}
			} catch (error) {
				/* Request failed */
				return {
					content: [{
						type: 'text',
						text: `${error instanceof Error ? error.message : String(error)}`,
					}],
					isError: true,
				};
			}
		});
	});

	return server;
}

/* EduBase API rate limits (via environment variables or configured defaults) */
const EDUBASE_API_MAXRATE_DEFAULT = {
	second: 10,
	minute: 1000
};
const EDUBASE_API_MAXRATE_ENV = {
	second: parseInt(process.env.EDUBASE_API_MAXRATE || ''),
	minute: parseInt(process.env.EDUBASE_API_MAXRATE60 || '')
};
const EDUBASE_API_MAXRATE = {
	second: Number.isInteger(EDUBASE_API_MAXRATE_ENV.second) ? EDUBASE_API_MAXRATE_ENV.second : EDUBASE_API_MAXRATE_DEFAULT.second,
	minute: Number.isInteger(EDUBASE_API_MAXRATE_ENV.minute) ? EDUBASE_API_MAXRATE_ENV.minute : EDUBASE_API_MAXRATE_DEFAULT.minute,
};
let requestRate = {
	second: 0,
	minute: 0,
	since: {
		second: Date.now(),
		minute: Date.now()
	}
};
function checkRateLimit() {
	const now = Date.now();
	if (now - requestRate.since.second > 1000) {
		/* New second, reset rate */
		requestRate.second = 0;
		requestRate.since.second = now;
	}
	if (now - requestRate.since.minute > 60000) {
		/* New minute, reset rate */
		requestRate.minute = 0;
		requestRate.since.minute = now;
	}
	if (requestRate.second >= EDUBASE_API_MAXRATE.second || requestRate.minute >= EDUBASE_API_MAXRATE.minute) {
		throw new Error('Rate limit exceeded');
	}
	requestRate.second++;
	requestRate.minute++;
}

/* EduBase API requests */
type EduBaseAuthentication = { app?: string; secret?: string; bearer?: string };
async function sendEduBaseApiRequest(method: string, endpoint: string, data: object, authentication: EduBaseAuthentication | null) {
	/* Check method and endpoint */
	method = method.toUpperCase()
	if (!['GET', 'POST', 'DELETE'].includes(method)) {
		throw new Error('Invalid method: "' + method + '"');
	}
	if (endpoint.length == 0) {
		throw new Error('Invalid endpoint');
	}

	/* Check rate limit */
	checkRateLimit();

	/* Prepare authentication: a bearer token (OAuth 2.1 access token, or legacy base64(app:secret))
	 * takes precedence and is forwarded verbatim. Otherwise fall back to the App/Secret pair. */
	if (!authentication) {
		authentication = { app: EDUBASE_API_APP, secret: EDUBASE_API_KEY };
	} else if (!authentication.bearer) {
		if (!authentication.app || authentication.app.length == 0 || EDUBASE_API_APP.length > 0) {
			authentication.app = EDUBASE_API_APP;
		}
		if (!authentication.secret || authentication.secret.length == 0 || EDUBASE_API_KEY.length > 0) {
			authentication.secret = EDUBASE_API_KEY;
		}
	}

	/* Send request with input data */
	let headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'Accept-Encoding': 'gzip',
		'EduBase-API-Client': 'MCP',
		'EduBase-API-Transport': (STREAMABLE_HTTP) ? 'Streamable HTTP' : ((SSE) ? 'SSE' : 'Stdio'),
	};
	if (authentication.bearer) {
		/* Authenticate with Bearer token */
		headers['Authorization'] = 'Bearer ' + authentication.bearer;
	} else if (authentication.app && authentication.secret) {
		/* Authenticate with custom EduBase API App/Secret headers */
		headers['EduBase-API-App'] = authentication.app;
		headers['EduBase-API-Secret'] = authentication.secret;
	}
	const response = await fetch(endpoint + (method == 'GET' ? '?' + queryString.stringify(data) : ''), {
		method: method,
		body: (method != 'GET' ? JSON.stringify(data) : undefined),
		headers: headers
	});
	if (!response.ok) {
		throw new Error(`EduBase API error: ${response.status}` + (response.statusText ? ` ${response.statusText}` : '') + (response.headers.has('EduBase-API-Error') ? ` (${response.headers.get('EduBase-API-Error')})` : ''));
	}

	/* Parse response and return as object */
	let clonedResponse = response.clone();
	try {
		/* First try to decode as JSON */
		return await response.json();
	} catch (error) {
		/* Response might be empty string with a 200 status code */
		return await clonedResponse.text();
	}
}

/* OAuth 2.1 metadata */
function getProtectedResourceMetadata(): object {
	return {
		resource: EDUBASE_OAUTH_RESOURCE_URL,
		authorization_servers: [EDUBASE_OAUTH_AUTHORIZATION_SERVER],
		bearer_methods_supported: ['header'],
		scopes_supported: MANIFEST.oauthScopes,
		resource_documentation: MANIFEST.docsUrl,
	};
}

/* MCP app manifests */
function getAppManifest(): Record<string, unknown> {
	return {
		schema_version: 'v1',
		name: MANIFEST.name,
		title: MANIFEST.title,
		version: MANIFEST.version,
		description: MANIFEST.description,
		categories: MANIFEST.categories,
		keywords: MANIFEST.keywords,
		website_url: MANIFEST.websiteUrl,
		documentation_url: MANIFEST.docsUrl,
		support_url: MANIFEST.supportUrl,
		status_url: MANIFEST.statusUrl,
		repository_url: MANIFEST.repositoryUrl,
		privacy_policy_url: MANIFEST.privacyUrl,
		terms_of_service_url: MANIFEST.termsUrl,
		legal_url: MANIFEST.legalUrl,
		contact_email: MANIFEST.contactEmail,
		legal_entity: MANIFEST.legalName,
		icons: MANIFEST.icons,
		icon_url: MANIFEST.icons[0]?.src,
		mcp: {
			endpoint: EDUBASE_OAUTH_RESOURCE_URL,
			transport: STREAMABLE_HTTP ? 'streamable-http' : (SSE ? 'sse' : 'stdio'),
			protocol_version: '2025-06-18',
		},
		auth: {
			type: 'oauth',
			version: '2.1',
			authorization_server: EDUBASE_OAUTH_AUTHORIZATION_SERVER,
			authorization_server_metadata_url: `${EDUBASE_OAUTH_AUTHORIZATION_SERVER}/.well-known/oauth-authorization-server`,
			protected_resource_metadata_url: EDUBASE_OAUTH_RESOURCE_URL.replace(/\/mcp\/?$/, '/.well-known/oauth-protected-resource'),
			scopes: MANIFEST.oauthScopes,
			pkce_required: true,
			dynamic_client_registration: true,
		},
	};
}
function getAiPluginManifest(): Record<string, unknown> {
	return {
		schema_version: 'v1',
		name_for_model: MANIFEST.name.replace(/[^A-Za-z0-9_]/g, '_').replace(/^_+|_+$/g, '').slice(0, 50) || 'edubase',
		name_for_human: MANIFEST.title,
		description_for_model: MANIFEST.description,
		description_for_human: MANIFEST.description,
		auth: {
			type: 'oauth',
			client_url: `${EDUBASE_OAUTH_AUTHORIZATION_SERVER}/oauth/authorize`,
			authorization_url: `${EDUBASE_OAUTH_AUTHORIZATION_SERVER}/oauth/token`,
			scope: MANIFEST.oauthScopes.join(' '),
			authorization_content_type: 'application/x-www-form-urlencoded',
			verification_tokens: {},
		},
		api: {
			type: 'mcp',
			url: `${EDUBASE_OAUTH_RESOURCE_URL}`,
		},
		logo_url: MANIFEST.icons[0]?.src,
		contact_email: MANIFEST.contactEmail,
		legal_info_url: MANIFEST.legalUrl,
	};
}

/* Start MCP server */
if (STREAMABLE_HTTP) {
	/* Using HTTP with Streamable HTTP transport */
	const app = express();
	app.disable('x-powered-by');
	app.use(bodyParser.json());
	const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};
	if(EDUBASE_OAUTH) {
		/* Add OAuth 2.1 endpoints */
		app.get('/.well-known/oauth-protected-resource', (req: Request, res: Response) => { res.json(getProtectedResourceMetadata()); });
		app.get('/.well-known/oauth-protected-resource/mcp', (req: Request, res: Response) => { res.json(getProtectedResourceMetadata()); });
		app.get('/.well-known/mcp-app.json', (req: Request, res: Response) => { res.json(getAppManifest()); });
		app.get('/.well-known/openai-app.json', (req: Request, res: Response) => { res.json(getAppManifest()); });
		app.get('/.well-known/ai-plugin.json', (req: Request, res: Response) => { res.json(getAiPluginManifest()); });
		app.get('/manifest.json', (req: Request, res: Response) => { res.json(getAppManifest()); });
	}
	app.post('/mcp', async (req: Request, res: Response) => {
		if (EDUBASE_OAUTH && !getEduBaseAuthentication(req)) {
			/* Reject unauthenticated requests with a 401 status and a WWW-Authenticate header pointing the client at the IdP for discovery */
			const resourceMetadataUrl = EDUBASE_OAUTH_RESOURCE_URL.replace(/\/mcp\/?$/, '/.well-known/oauth-protected-resource');
			res.setHeader('WWW-Authenticate', `Bearer realm="edubase-mcp", resource_metadata="${resourceMetadataUrl}"`);
			res.status(401).json({ error: 'invalid_token', error_description: 'Authentication required. Discover the authorization server via the WWW-Authenticate header.' });
			return;
		}
		/* Handle POST requests */
		const sessionId = req.headers['mcp-session-id'] as string | undefined;
		let transport: StreamableHTTPServerTransport;
		if (sessionId && transports[sessionId]) {
			/* Use existing session */
			transport = transports[sessionId];
		} else if (!sessionId && isInitializeRequest(req.body)) {
			/* New session */
			const eventStore = new InMemoryEventStore();
			transport = new StreamableHTTPServerTransport({
				sessionIdGenerator: () => randomUUID(),
				eventStore,
				onsessioninitialized: (sessionId) => {
					transports[sessionId] = transport;
				}
			});
			transport.onclose = () => {
				if (transport.sessionId) {
					delete transports[transport.sessionId];
				}
			};
			const server = createMcpServer(getEduBaseApiUrl(req), getEduBaseAuthentication(req));
			await server.connect(transport);
		} else {
			console.error("No session found for request");
			res.status(400).send();
			return;
		}
		try {
			type EduBaseOverrideConfiguration = { EDUBASE_API_URL: string | null; EDUBASE_API_APP: string | null; EDUBASE_API_KEY: string | null };
			let override: EduBaseOverrideConfiguration = { EDUBASE_API_URL: null, EDUBASE_API_APP: null, EDUBASE_API_KEY: null };
			if (req.query?.config && typeof req.query.config == 'string') {
				/* Apply Smithery configuration */
				const smitheryConfig = JSON.parse(Buffer.from(req.query.config, 'base64').toString());
				if (smitheryConfig.edubaseApiUrl && typeof smitheryConfig.edubaseApiUrl == 'string' && smitheryConfig.edubaseApiUrl.length > 0) {
					override.EDUBASE_API_URL = smitheryConfig.edubaseApiUrl;
				}
				if (smitheryConfig.edubaseApiApp && typeof smitheryConfig.edubaseApiApp == 'string' && smitheryConfig.edubaseApiApp.length > 0) {
					override.EDUBASE_API_APP = smitheryConfig.edubaseApiApp;
				}
				if (smitheryConfig.edubaseApiKey && typeof smitheryConfig.edubaseApiKey == 'string' && smitheryConfig.edubaseApiKey.length > 0) {
					override.EDUBASE_API_KEY = smitheryConfig.edubaseApiKey;
				}
			}
			const params = req.body?.params || {};
			params._meta = {
				ip: getClientIp(req),
				headers: req.headers,
				override: override,
			};
			await transport!.handleRequest(req, res, {...req.body, params});
		} catch (error) {
			console.error("Error handling POST request for session (" + sessionId + "): " + error);
			res.status(500).send();
		}
	});
	app.get('/mcp', async (req: Request, res: Response) => {
		/* GET requests should not be supported in stateless mode according to specification */
		res.status(405).set('Allow', 'POST').send('Method Not Allowed');
	});
	app.delete('/mcp', async (req: Request, res: Response) => {
		/* Handle DELETE requests */
		const sessionId = req.headers['mcp-session-id'] as string | undefined;
		if (!sessionId || !transports[sessionId]) {
			res.status(400).send('Invalid session ID');
			return;
		}
		try {
			const transport = transports[sessionId];
			await transport!.handleRequest(req, res);
		} catch (error) {
			console.error("Error handling DELETE request for session (" + sessionId + "): " + error);
			res.status(500).send();
		}
	});
	app.get('/health', async (_: Request, res: Response) => {
		/* Health check endpoint */
		res.status(200).send();
	});
	const EDUBASE_HTTP_PORT = parseInt(process.env.EDUBASE_HTTP_PORT || process.env.PORT || '3000');
	app.listen(EDUBASE_HTTP_PORT, () => {
		console.error("EduBase MCP server is now listening on HTTP port " + EDUBASE_HTTP_PORT + " with Streamable HTTP transport" + (EDUBASE_OAUTH ? " and OAuth 2.1 authentication" : ""));
	});
	process.on('SIGTERM', () => {
		/* Graceful shutdown */
		console.error("Received SIGTERM, shutting down EduBase MCP server...");
	});
} else if (SSE) {
	/* Using HTTP with SSE transport */
	const app = express();
	app.use(bodyParser.json());
	app.disable('x-powered-by');
	const transports: { [sessionId: string]: SSEServerTransport } = {};
	app.get('/sse', async (req: Request, res: Response) => {
		/* Handle SSE sessions (but prefer Streamable HTTP) */
		const transport = new SSEServerTransport('/messages', res);
		transports[transport.sessionId] = transport;
		res.on('close', () => {
			delete transports[transport.sessionId];
		});
		try {
			const server = createMcpServer(getEduBaseApiUrl(req), getEduBaseAuthentication(req));
			await server.connect(transport);
		} catch (error) {
			console.error("Error connecting transport to MCP server for session (" + transport.sessionId + "): " + error);
		}
	});
	app.post('/messages', async (req: Request, res: Response) => {
		/* Handle MCP messages */
		const sessionId = req.query.sessionId as string;
		const transport = transports[sessionId] ?? Object.values(transports)[0];
		if (transport) {
			try {
				type EduBaseOverrideConfiguration = { EDUBASE_API_URL: string | null; EDUBASE_API_APP: string | null; EDUBASE_API_KEY: string | null };
				let override: EduBaseOverrideConfiguration = { EDUBASE_API_URL: null, EDUBASE_API_APP: null, EDUBASE_API_KEY: null };
				if (req.query?.config && typeof req.query.config == 'string') {
					/* Apply Smithery configuration */
					const smitheryConfig = JSON.parse(Buffer.from(req.query.config, 'base64').toString());
					if (smitheryConfig.edubaseApiUrl && typeof smitheryConfig.edubaseApiUrl == 'string' && smitheryConfig.edubaseApiUrl.length > 0) {
						override.EDUBASE_API_URL = smitheryConfig.edubaseApiUrl;
					}
					if (smitheryConfig.edubaseApiApp && typeof smitheryConfig.edubaseApiApp == 'string' && smitheryConfig.edubaseApiApp.length > 0) {
						override.EDUBASE_API_APP = smitheryConfig.edubaseApiApp;
					}
					if (smitheryConfig.edubaseApiKey && typeof smitheryConfig.edubaseApiKey == 'string' && smitheryConfig.edubaseApiKey.length > 0) {
						override.EDUBASE_API_KEY = smitheryConfig.edubaseApiKey;
					}
				}
				const params = req.body?.params || {};
				params._meta = {
					ip: getClientIp(req),
					headers: req.headers,
					override: override,
				};
				await transport!.handlePostMessage(req, res, {...req.body, params});
			} catch (error) {
				console.error("Error handling message for session (" + sessionId + "): " + error);
				res.status(500).send();
			}
		} else {
			console.error("No transport found for session (" + sessionId + ")");
			res.status(400).send();
		}
	});
	app.get('/health', async (_: Request, res: Response) => {
		/* Health check endpoint */
		res.status(200).send();
	});
	const EDUBASE_HTTP_PORT = parseInt(process.env.EDUBASE_HTTP_PORT || process.env.PORT || '3000');
	app.listen(EDUBASE_HTTP_PORT, () => {
		console.error("EduBase MCP server is now listening on HTTP port " + EDUBASE_HTTP_PORT + " with SSE transport");
	});
	process.on('SIGTERM', () => {
		/* Graceful shutdown */
		console.error("Received SIGTERM, shutting down EduBase MCP server...");
	});
} else {
	/* Using stdio transport */
	async function runMcpServer() {
		const transport = new StdioServerTransport();
		const server = createMcpServer();
		await server.connect(transport);
		console.error("EduBase MCP server is now listening on standard input/output");
	}
	runMcpServer().catch((error) => {
		console.error("Cannot start EduBase MCP server: ", error);
		process.exit(1);
	});
}
