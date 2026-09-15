/* Regression tests for the tool listing of the built MCP server (run with: npm test) */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ToolListChangedNotificationSchema } from '@modelcontextprotocol/sdk/types.js';

const SERVER = fileURLToPath(new URL('../dist/index.js', import.meta.url));

/* Size budgets (in characters of JSON): raise them deliberately when adding tools, as every client pays for the tool list in every session */
const BUDGET = {
	toolsCount: 150,
	toolsListSize: 250_000,
	toolsListSizeWithoutOutputSchemas: 175_000,
	toolsListSizeWithOutputSchemas: 300_000,
	toolSize: 20_000,
	instructionsSize: 7_000,
	descriptionMinLength: 40,
};

/* Start the server over stdio with the given environment */
async function connect(env = {}) {
	const transport = new StdioClientTransport({
		command: process.execPath,
		args: [SERVER],
		env: { PATH: process.env.PATH, EDUBASE_API_URL: 'http://127.0.0.1:9/api', EDUBASE_API_APP: 'app', EDUBASE_API_KEY: 'secret', ...env },
		stderr: 'ignore',
	});
	const client = new Client({ name: 'edubase-mcp-test', version: '1.0.0' });
	await client.connect(transport);
	return client;
}
async function listTools(client) {
	return (await client.listTools()).tools;
}

test('tool list stays within the size budgets', async () => {
	const client = await connect();
	try {
		const tools = await listTools(client);
		const size = JSON.stringify(tools).length;
		console.log(`tools: ${tools.length}, tools/list: ${size} characters, instructions: ${client.getInstructions()?.length} characters`);
		assert.ok(tools.length <= BUDGET.toolsCount, `${tools.length} tools, budget is ${BUDGET.toolsCount}`);
		assert.ok(size <= BUDGET.toolsListSize, `tools/list is ${size} characters, budget is ${BUDGET.toolsListSize}`);
		for (const tool of tools) {
			const toolSize = JSON.stringify(tool).length;
			assert.ok(toolSize <= BUDGET.toolSize, `${tool.name} is ${toolSize} characters, budget is ${BUDGET.toolSize}`);
		}
		assert.ok(client.getInstructions().length <= BUDGET.instructionsSize, `instructions are ${client.getInstructions().length} characters, budget is ${BUDGET.instructionsSize}`);
	} finally {
		await client.close();
	}
});

test('output schemas follow the configured mode', async () => {
	/* Schema descriptions are strings, properties named description are objects */
	const countDescriptions = (value) => (value && typeof value == 'object') ? Object.entries(value).reduce((count, [key, item]) => count + ((key == 'description' && typeof item == 'string') ? 1 : countDescriptions(item)), 0) : 0;

	const off = await connect({ EDUBASE_OUTPUT_SCHEMAS: 'off' });
	try {
		const tools = await listTools(off);
		const size = JSON.stringify(tools).length;
		console.log(`tools/list without output schemas: ${size} characters`);
		assert.deepEqual(tools.filter((tool) => tool.outputSchema).map((tool) => tool.name), []);
		assert.ok(size <= BUDGET.toolsListSizeWithoutOutputSchemas, `tools/list without output schemas is ${size} characters, budget is ${BUDGET.toolsListSizeWithoutOutputSchemas}`);
	} finally {
		await off.close();
	}

	const on = await connect({ EDUBASE_OUTPUT_SCHEMAS: 'on' });
	try {
		const tools = await listTools(on);
		const size = JSON.stringify(tools).length;
		console.log(`tools/list with output schemas: ${size} characters`);
		assert.ok(tools.some((tool) => tool.name == 'edubase_get_exams' && countDescriptions(tool.outputSchema) > 0), 'output schemas with descriptions are missing');
		assert.ok(size <= BUDGET.toolsListSizeWithOutputSchemas, `tools/list with output schemas is ${size} characters, budget is ${BUDGET.toolsListSizeWithOutputSchemas}`);
	} finally {
		await on.close();
	}

	const fields = await connect();
	try {
		const tools = await listTools(fields);
		const size = JSON.stringify(tools).length;
		const exams = tools.find((tool) => tool.name == 'edubase_get_exams');
		assert.ok(exams.outputSchema?.properties?.exams, 'output schema fields are missing');
		assert.deepEqual(tools.filter((tool) => countDescriptions(tool.outputSchema) > 0).map((tool) => tool.name), [], 'output schemas still have descriptions');
	} finally {
		await fields.close();
	}

	const child = spawn(process.execPath, [SERVER], { env: { PATH: process.env.PATH, EDUBASE_API_APP: 'app', EDUBASE_API_KEY: 'secret', EDUBASE_OUTPUT_SCHEMAS: 'true' }, stdio: ['pipe', 'ignore', 'ignore'] });
	const [code] = await once(child, 'exit');
	assert.equal(code, 1, 'invalid output schemas mode should stop the server');
});

test('tools have unique names, descriptive descriptions and annotations', async () => {
	const client = await connect();
	try {
		const tools = await listTools(client);
		assert.equal(new Set(tools.map((tool) => tool.name)).size, tools.length, 'duplicate tool names');
		for (const tool of tools) {
			assert.match(tool.name, /^edubase_[a-z_]+$/, `invalid tool name: ${tool.name}`);
			assert.ok((tool.description || '').length >= BUDGET.descriptionMinLength, `${tool.name} has a too short description: "${tool.description}"`);
			assert.equal(typeof tool.annotations?.readOnlyHint, 'boolean', `${tool.name} has no readOnlyHint annotation`);
		}
	} finally {
		await client.close();
	}
});

test('instructions only reference existing tools', async () => {
	const client = await connect();
	try {
		const names = new Set((await listTools(client)).map((tool) => tool.name));
		const references = [...new Set(client.getInstructions().match(/edubase_[a-z_]+[a-z]/g))];
		/* Patterns like edubase_post_*_settings are matched as their method prefix only */
		const unknown = references.filter((name) => !names.has(name) && !/^edubase_(get|post|put|patch|delete)$/.test(name));
		assert.deepEqual(unknown, [], 'instructions reference unknown tools');
	} finally {
		await client.close();
	}
});

test('read-only mode only exposes read-only tools', async () => {
	const client = await connect({ EDUBASE_READONLY: 'true' });
	try {
		const tools = await listTools(client);
		assert.ok(tools.length > 0);
		assert.deepEqual(tools.filter((tool) => tool.annotations?.readOnlyHint !== true).map((tool) => tool.name), []);
		assert.ok(tools.some((tool) => tool.name == 'edubase_post_question_export'), 'download link tools should stay available');
		assert.match(client.getInstructions(), /read-only mode/);
	} finally {
		await client.close();
	}
});

test('toolsets limit the tools and reject unknown names', async () => {
	const client = await connect({ EDUBASE_TOOLSETS: 'tags' });
	try {
		const names = (await listTools(client)).map((tool) => tool.name);
		assert.ok(names.includes('edubase_post_content_tag'));
		assert.ok(names.includes('edubase_post_filebin_upload'), 'the files toolset is always enabled');
		assert.ok(!names.some((name) => name.startsWith('edubase_get_exam')), 'tools of disabled toolsets are listed');
	} finally {
		await client.close();
	}

	const child = spawn(process.execPath, [SERVER], { env: { PATH: process.env.PATH, EDUBASE_API_APP: 'app', EDUBASE_API_KEY: 'secret', EDUBASE_TOOLSETS: 'exams,unknown' }, stdio: ['pipe', 'ignore', 'ignore'] });
	const [code] = await once(child, 'exit');
	assert.equal(code, 1, 'unknown toolsets should stop the server');
});

test('dynamic toolsets are enabled on demand', async () => {
	const client = await connect({ EDUBASE_DYNAMIC_TOOLSETS: 'true' });
	try {
		const initial = (await listTools(client)).map((tool) => tool.name);
		assert.ok(initial.includes('edubase_list_toolsets'));
		assert.ok(initial.includes('edubase_enable_toolsets'));
		assert.ok(!initial.includes('edubase_get_exams'), 'toolsets should be disabled at the start');
		assert.ok(initial.length < 15, `${initial.length} tools are listed at the start`);

		const changed = new Promise((resolve) => client.setNotificationHandler(ToolListChangedNotificationSchema, resolve));
		const result = await client.callTool({ name: 'edubase_enable_toolsets', arguments: { toolsets: ['exams'] } });
		assert.ok(!result.isError, JSON.stringify(result.content));
		assert.ok(JSON.parse(result.content[0].text).tools.includes('edubase_get_exams'));
		await changed;

		const enabled = (await listTools(client)).map((tool) => tool.name);
		assert.ok(enabled.includes('edubase_get_exams'));
		assert.ok(!enabled.includes('edubase_get_users'), 'only the requested toolsets should be enabled');

		const listed = await client.callTool({ name: 'edubase_list_toolsets', arguments: {} });
		assert.equal(JSON.parse(listed.content[0].text).toolsets.find((toolset) => toolset.toolset == 'exams').enabled, true);
	} finally {
		await client.close();
	}
});

test('content tools are routed to the endpoint of the content type', async () => {
	/* Fake EduBase API recording the requests */
	const requests = [];
	const api = createServer((req, res) => {
		let body = '';
		req.on('data', (chunk) => body += chunk);
		req.on('end', () => {
			requests.push({ method: req.method, url: req.url, body: body ? JSON.parse(body) : null });
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({ tag: 'TAG', content: { type: 'exam', code: 'EXAM', id: null }, success: true }));
		});
	});
	api.listen(0, '127.0.0.1');
	await once(api, 'listening');
	const client = await connect({ EDUBASE_API_URL: `http://127.0.0.1:${api.address().port}/api` });
	try {
		const result = await client.callTool({ name: 'edubase_post_content_tag', arguments: { type: 'exam', content: 'EXAM', tag: 'TAG' } });
		assert.ok(!result.isError, JSON.stringify(result.content));
		assert.equal(requests.length, 1);
		assert.equal(requests[0].method, 'POST');
		assert.equal(requests[0].url, '/api/exam:tag');
		assert.deepEqual(requests[0].body, { exam: 'EXAM', tag: 'TAG' });
	} finally {
		await client.close();
		api.close();
	}
});

/* Start the server with Streamable HTTP transport */
async function startHttp(env = {}) {
	const port = 20000 + Math.floor(Math.random() * 20000);
	const child = spawn(process.execPath, [SERVER], { env: { PATH: process.env.PATH, EDUBASE_STREAMABLE_HTTP_MODE: 'true', EDUBASE_HTTP_PORT: String(port), ...env }, stdio: 'ignore' });
	const base = `http://127.0.0.1:${port}`;
	for (let i = 0; i < 50; i++) {
		try { if ((await fetch(`${base}/health`)).ok) break; } catch { /* Not listening yet */ }
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
	const initialize = (query, headers = {}) => fetch(`${base}/mcp${query}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream', ...headers },
		body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1.0.0' } } }),
	});
	return { child, base, initialize };
}

test('HTTP mode ignores provider configuration unless the provider is enabled', async () => {
	const { child, initialize } = await startHttp();
	try {
		const response = await initialize('?config=not-json');
		assert.equal(response.status, 200);
		await response.text();
	} finally {
		child.kill();
	}
});

test('HTTP mode rejects invalid Smithery configuration and applies session options', async () => {
	const { child, base, initialize } = await startHttp({ EDUBASE_CONFIG_PROVIDERS: 'smithery' });
	try {

		const invalid = await initialize('?config=not-json');
		assert.equal(invalid.status, 400);
		assert.match((await invalid.json()).error.message, /config/);

		const unknown = await initialize('?toolsets=unknown');
		assert.equal(unknown.status, 400);

		const config = Buffer.from(JSON.stringify({ edubaseToolsets: 'metrics', edubaseReadOnly: false })).toString('base64');
		const valid = await initialize(`?config=${encodeURIComponent(config)}`);
		assert.equal(valid.status, 200);
		const session = valid.headers.get('mcp-session-id');
		await valid.text();
		const list = await fetch(`${base}/mcp?config=${encodeURIComponent(config)}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream', 'mcp-session-id': session },
			body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }),
		});
		const data = (await list.text()).split('\n').find((line) => line.startsWith('data: '));
		const names = JSON.parse(data.slice(6)).result.tools.map((tool) => tool.name);
		assert.ok(names.includes('edubase_post_metrics_custom'));
		assert.ok(!names.includes('edubase_get_exams'));
	} finally {
		child.kill();
	}
});
