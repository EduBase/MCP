#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema, isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "node:crypto";
import queryString from "query-string";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { InMemoryEventStore } from '@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js';
import express from "express";
import bodyParser from "body-parser";
import { getClientIp } from "./helpers.js";
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
/* Supported tools and prompts */
import { EDUBASE_API_TOOLS, EDUBASE_API_TOOLS_OUTPUT_SCHEMA } from "./tools.js";
import { EDUBASE_API_PROMPTS, EDUBASE_API_PROMPTS_HANDLERS } from "./prompts.js";
/* Create MCP server */
const server = new Server({
    name: '@edubase/mcp',
    version: '1.0.18',
}, {
    capabilities: {
        prompts: {},
        tools: {},
    },
});
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
async function sendEduBaseApiRequest(method, endpoint, data, authentication) {
    /* Check method and endpoint */
    method = method.toUpperCase();
    if (!['GET', 'POST', 'DELETE'].includes(method)) {
        throw new Error('Invalid method: "' + method + '"');
    }
    if (endpoint.length == 0) {
        throw new Error('Invalid endpoint');
    }
    /* Check rate limit */
    checkRateLimit();
    /* Prepare authentication (prefer EDUBASE_API_APP and EDUBASE_API_KEY environment variables) */
    if (!authentication) {
        authentication = { app: EDUBASE_API_APP, secret: EDUBASE_API_KEY };
    }
    else {
        if (!authentication.hasOwnProperty('app') || authentication.app.length == 0 || EDUBASE_API_APP.length > 0) {
            authentication.app = EDUBASE_API_APP;
        }
        if (!authentication.hasOwnProperty('secret') || authentication.secret.length == 0 || EDUBASE_API_KEY.length > 0) {
            authentication.secret = EDUBASE_API_KEY;
        }
    }
    /* Send request with input data */
    let headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
        'EduBase-API-Client': 'MCP',
        'EduBase-API-Transport': (STREAMABLE_HTTP) ? 'Streamable HTTP' : ((SSE) ? 'SSE' : 'Stdio'),
        'EduBase-API-App': authentication.app,
        'EduBase-API-Secret': authentication.secret
    };
    const response = await fetch(endpoint + (method == 'GET' ? '?' + queryString.stringify(data) : ''), {
        method: method,
        body: (method != 'GET' ? JSON.stringify(data) : undefined),
        headers: headers
    });
    if (!response.ok) {
        throw new Error(`EduBase API error: ${response.status} ${response.statusText}` + (response.headers.has('EduBase-API-Error') ? ` (${response.headers.get('EduBase-API-Error')})` : ''));
    }
    /* Parse response and return as object */
    let clonedResponse = response.clone();
    try {
        /* First try to decode as JSON */
        return await response.json();
    }
    catch (error) {
        /* Response might be empty string with a 200 status code */
        return await clonedResponse.text();
    }
}
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: Object.values(EDUBASE_API_PROMPTS),
}));
server.setRequestHandler(GetPromptRequestSchema, (request) => {
    try {
        /* Decompose request and check arguments */
        const { name, arguments: args } = request.params;
        const promptHandler = EDUBASE_API_PROMPTS_HANDLERS[name];
        if (!promptHandler) {
            throw new Error('Prompt not found');
        }
        /* Return prompt response */
        return promptHandler;
    }
    catch (error) {
        /* Request failed */
        return {};
    }
});
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: EDUBASE_API_TOOLS,
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        /* Decompose request and check arguments */
        const { name, arguments: args } = request.params;
        if (!name.match(/^edubase_(get|post|delete)/)) {
            throw new Error('Invalid tool configuration');
        }
        if (!args) {
            throw new Error('No arguments provided');
        }
        const meta = request.params._meta || {};
        /* Prepare authentication */
        let authentication = null;
        if (meta && meta.override && meta.override.EDUBASE_API_APP && meta.override.EDUBASE_API_KEY) {
            /* Use authentication from custom configuration */
            authentication = {
                app: meta.override.EDUBASE_API_APP,
                secret: meta.override.EDUBASE_API_KEY
            };
        }
        else if (meta && meta.headers && meta.headers['edubase-api-app'] && meta.headers['edubase-api-secret']) {
            /* Use authentication from request headers */
            authentication = {
                app: meta.headers['edubase-api-app'],
                secret: meta.headers['edubase-api-secret']
            };
        }
        else if (meta && meta.headers && meta.headers['authorization'] && meta.headers['authorization'].startsWith('Bearer ')) {
            /* Use authentication from Bearer token */
            try {
                /* Decode Bearer token */
                const [app, secret] = atob(meta.headers['authorization'].split(' ')[1]).split(':');
                if (app && app.length > 0 && secret && secret.length > 0) {
                    authentication = { app, secret };
                }
            }
            catch (error) {
                /* Probably not encoded as base64 */
                const [app, secret] = meta.headers['authorization'].split(' ')[1].split(':');
                if (app && app.length > 0 && secret && secret.length > 0) {
                    authentication = { app, secret };
                }
            }
        }
        /* Prepare and send API request */
        const [, method, ...endpoint] = name.split('_');
        const response = await sendEduBaseApiRequest(method, (meta?.override?.EDUBASE_API_URL || EDUBASE_API_URL) + '/' + endpoint.join(':'), args, authentication);
        /* Return response */
        const outputSchemaKey = name;
        if (typeof EDUBASE_API_TOOLS_OUTPUT_SCHEMA[outputSchemaKey] == 'object' && Object.keys(EDUBASE_API_TOOLS_OUTPUT_SCHEMA[outputSchemaKey]).length == 0 && typeof response == 'string' && response.length == 0) {
            /* Endpoint without response */
            return {
                content: [{ type: 'text', text: 'Success.' }],
                isError: false,
            };
        }
        else if (typeof response != 'object') {
            /* Response should be an object at this point */
            throw new Error('Invalid response');
        }
        else {
            /* Return response with optional schema */
            return {
                content: [{ type: 'text', text: "Response: " + JSON.stringify(response) + (Object.keys(EDUBASE_API_TOOLS_OUTPUT_SCHEMA[outputSchemaKey]).length > 0 ? "\nResponse schema: " + JSON.stringify(EDUBASE_API_TOOLS_OUTPUT_SCHEMA[outputSchemaKey]) : '') }],
                isError: false,
            };
        }
    }
    catch (error) {
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
/* Start MCP server */
if (STREAMABLE_HTTP) {
    /* Using HTTP with Streamable HTTP transport */
    const app = express();
    app.disable('x-powered-by');
    app.use(bodyParser.json());
    const transports = {};
    app.post('/mcp', async (req, res) => {
        /* Handle POST requests */
        const sessionId = req.headers['mcp-session-id'];
        let transport;
        if (sessionId && transports[sessionId]) {
            /* Use existing session */
            transport = transports[sessionId];
        }
        else if (!sessionId && isInitializeRequest(req.body)) {
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
            await server.connect(transport);
        }
        else {
            console.error("No session found for request");
            res.status(400).send();
            return;
        }
        try {
            let override = { EDUBASE_API_URL: null, EDUBASE_API_APP: null, EDUBASE_API_KEY: null };
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
            await transport.handleRequest(req, res, { ...req.body, params });
        }
        catch (error) {
            console.error("Error handling POST request for session (" + sessionId + "): " + error);
            res.status(500).send();
        }
    });
    app.get('/mcp', async (req, res) => {
        /* Handle GET requests */
        const sessionId = req.headers['mcp-session-id'];
        if (!sessionId || !transports[sessionId]) {
            res.status(400).send('Invalid session ID');
            return;
        }
        try {
            const transport = transports[sessionId];
            await transport.handleRequest(req, res);
        }
        catch (error) {
            console.error("Error handling GET request for session (" + sessionId + "): " + error);
            res.status(500).send();
        }
    });
    app.delete('/mcp', async (req, res) => {
        /* Handle DELETE requests */
        const sessionId = req.headers['mcp-session-id'];
        if (!sessionId || !transports[sessionId]) {
            res.status(400).send('Invalid session ID');
            return;
        }
        try {
            const transport = transports[sessionId];
            await transport.handleRequest(req, res);
        }
        catch (error) {
            console.error("Error handling DELETE request for session (" + sessionId + "): " + error);
            res.status(500).send();
        }
    });
    app.get('/health', async (_, res) => {
        /* Health check endpoint */
        res.status(200).send();
    });
    const EDUBASE_HTTP_PORT = parseInt(process.env.EDUBASE_HTTP_PORT || process.env.PORT || '3000');
    app.listen(EDUBASE_HTTP_PORT, () => {
        console.error("EduBase MCP server is now listening on HTTP port " + EDUBASE_HTTP_PORT + " with Streamable HTTP transport");
    });
    process.on('SIGTERM', () => {
        /* Graceful shutdown */
        console.error("Received SIGTERM, shutting down EduBase MCP server...");
        server.close();
    });
}
else if (SSE) {
    /* Using HTTP with SSE transport */
    const app = express();
    app.use(bodyParser.json());
    app.disable('x-powered-by');
    const transports = {};
    app.get('/sse', async (_, res) => {
        /* Handle SSE sessions */
        const transport = new SSEServerTransport('/messages', res);
        transports[transport.sessionId] = transport;
        res.on('close', () => {
            delete transports[transport.sessionId];
        });
        try {
            await server.connect(transport);
        }
        catch (error) {
            console.error("Error connecting transport to MCP server for session (" + transport.sessionId + "): " + error);
        }
    });
    app.post('/messages', async (req, res) => {
        /* Handle MCP messages */
        const sessionId = req.query.sessionId;
        const transport = transports[sessionId] ?? Object.values(transports)[0];
        if (transport) {
            try {
                let override = { EDUBASE_API_URL: null, EDUBASE_API_APP: null, EDUBASE_API_KEY: null };
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
                await transport.handlePostMessage(req, res, { ...req.body, params });
            }
            catch (error) {
                console.error("Error handling message for session (" + sessionId + "): " + error);
                res.status(500).send();
            }
        }
        else {
            console.error("No transport found for session (" + sessionId + ")");
            res.status(400).send();
        }
    });
    app.get('/health', async (_, res) => {
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
        server.close();
    });
}
else {
    /* Using stdio transport */
    async function runMcpServer() {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("EduBase MCP server is now listening on standard input/output");
    }
    runMcpServer().catch((error) => {
        console.error("Cannot start EduBase MCP server: ", error);
        process.exit(1);
    });
}
