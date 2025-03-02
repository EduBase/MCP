#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequest, CallToolRequestSchema, ListToolsRequestSchema, Tool } from "@modelcontextprotocol/sdk/types.js";
import queryString from "query-string";

/* Check required EduBase environment variables */
const EDUBASE_API_URL = process.env.EDUBASE_API_URL!;
const EDUBASE_API_APP = process.env.EDUBASE_API_APP!;
const EDUBASE_API_KEY = process.env.EDUBASE_API_KEY!;
if (!EDUBASE_API_URL) {
	console.error('Error: EDUBASE_API_URL environment variable is required');
	process.exit(1);
}
if (!EDUBASE_API_APP) {
	console.error('Error: EDUBASE_API_APP environment variable is required');
	process.exit(1);
}
if (!EDUBASE_API_KEY) {
	console.error('Error: EDUBASE_API_KEY environment variable is required');
	process.exit(1);
}

/* Supported tools */
import { EDUBASE_API_TOOLS, EDUBASE_API_TOOLS_OUTPUT_SCHEMA } from "./tools.js";

/* Create MCP server */
const server = new Server(
	{
		name: '@edubase/mcp',
		version: '1.0.0',
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

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
async function sendEduBaseApiRequest(method: string, endpoint: string, data: object) {
	/* Check method and endpoint */
	method = method.toUpperCase()
	if (!['GET', 'POST', 'DELETE'].includes(method)) {
		throw new Error('Invalid method: "' + method + '"');
	}
	if (endpoint.length == 0) {
		throw new Error('Invalid endpoint');
	}
	if (endpoint[0] != '/')
		endpoint = '/' + endpoint;

	/* Check rate limit */
	checkRateLimit();

	/* Send request with input data */
	let headers = {
		'Content-Type': 'application/json',
		'Accept-Encoding': 'gzip',
		'EduBase-API-Client': 'MCP',
		'EduBase-API-App': EDUBASE_API_APP,
		'EduBase-API-Secret': EDUBASE_API_KEY
	};
	const response = await fetch(EDUBASE_API_URL + endpoint + (method == 'GET' ? '?' + queryString.stringify(data) : ''), {
		method: method,
		body: (method != 'GET' ? JSON.stringify(data) : undefined),
		headers: headers
	});
	if (!response.ok) {
		throw new Error(`EduBase API error: ${response.status} ${response.statusText}\n${await response.text()}`);
	}

	/* Parse response and return as object */
	return await response.json();
}

/* Configure request handlers */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: EDUBASE_API_TOOLS,
}));
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
	try {
		/* Decompose request and check arguments */
		const { name, arguments: args } = request.params;
		if (!name.match(/^edubase_(get|post|delete)/)) {
			throw new Error('Invalid tool configuration');
		}
		if (!args) {
			throw new Error('No arguments provided');
		}

		/* Send API request */
		const [ , method, ...endpoint ] = name.split('_');
		const response = await sendEduBaseApiRequest(method, '/'+endpoint.join(':'), args);

		/* Return response */
		const outputSchemaKey = name as keyof typeof EDUBASE_API_TOOLS_OUTPUT_SCHEMA;
		return {
			content: [{ type: 'text', text: "Response: " + JSON.stringify(response) + "\nResponse schema: " + JSON.stringify(EDUBASE_API_TOOLS_OUTPUT_SCHEMA[outputSchemaKey]) }],
			isError: false,
		};
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

/* Start MCP server on stdio */
async function runMcpServer() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("EduBase MCP server is now listening on standard input/output");
}
runMcpServer().catch((error) => {
	console.error("Cannot start EduBase MCP server:", error);
	process.exit(1);
});
