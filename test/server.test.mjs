/* Regression tests for the tool listing of the built MCP server (run with: npm test) */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ElicitRequestSchema, ToolListChangedNotificationSchema } from '@modelcontextprotocol/sdk/types.js';

const SERVER = fileURLToPath(new URL('../dist/index.js', import.meta.url));

/* Size budgets (in characters of JSON): raise them deliberately when adding tools, as every client pays for the tool list in every session */
const BUDGET = {
	toolsCount: 150,
	toolsListSize: 250_000,
	toolsListSizeWithoutOutputSchemas: 175_000,
	toolsListSizeWithOutputSchemas: 320_000,
	toolSize: 20_000,
	instructionsSize: 7_000,
	descriptionMinLength: 40,
};

/* Start the server over stdio with the given environment */
async function connect(env = {}, capabilities = {}) {
	const transport = new StdioClientTransport({
		command: process.execPath,
		args: [SERVER],
		env: { PATH: process.env.PATH, EDUBASE_API_URL: 'http://127.0.0.1:9/api', EDUBASE_API_APP: 'app', EDUBASE_API_KEY: 'secret', ...env },
		stderr: 'ignore',
	});
	const client = new Client({ name: 'edubase-mcp-test', version: '1.0.0' }, { capabilities });
	await client.connect(transport);
	return client;
}

/* Fake EduBase API recording the requests, answering with the response of the endpoint (an empty object by default) */
async function startApi(responses = {}) {
	const requests = [];
	const api = createServer((req, res) => {
		let body = '';
		req.on('data', (chunk) => body += chunk);
		req.on('end', () => {
			const url = new URL(req.url, 'http://localhost');
			requests.push({ method: req.method, endpoint: url.pathname.replace(/^\/api\//, ''), query: Object.fromEntries(url.searchParams), body: body ? JSON.parse(body) : null });
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(responses[url.pathname.replace(/^\/api\//, '')] ?? {}));
		});
	});
	api.listen(0, '127.0.0.1');
	await once(api, 'listening');
	return { api, requests, url: `http://127.0.0.1:${api.address().port}/api`, site: `http://127.0.0.1:${api.address().port}` };
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

/* Example arguments of the prompts */
const PROMPT_EXAMPLES = {
	edubase_prompt_create_question: { type: 'CHOICE', subject: 'Photosynthesis' },
	edubase_prompt_questions_from_document: { document: 'attached', questions: '', quiz: 'Biology' },
	edubase_prompt_create_exam: { topic: 'Photosynthesis', questions: '6', types: 'choice, numerical' },
	edubase_prompt_create_exam_journey: { topic: 'Photosynthesis', questions: '6' },
	edubase_prompt_copy_exam: { exam: 'Photosynthesis', schedule: 'next Monday' },
	edubase_prompt_assign_class_to_exam: { exam: 'Photosynthesis', class: '9.B' },
	edubase_prompt_summarize_exam_results: { exam: 'Photosynthesis', save: 'yes' },
	edubase_prompt_exam_journey_status: { exam: 'Photosynthesis' },
};

test('prompts are described and only reference existing tools', async () => {
	for (const env of [{}, { EDUBASE_READONLY: 'true' }]) {
		const client = await connect(env);
		try {
			const names = new Set((await listTools(client)).map((tool) => tool.name));
			const { prompts } = await client.listPrompts();
			assert.deepEqual(prompts.map((prompt) => prompt.name).sort(), Object.keys(PROMPT_EXAMPLES).filter((name) => !env.EDUBASE_READONLY || ['edubase_prompt_summarize_exam_results', 'edubase_prompt_exam_journey_status'].includes(name)).sort());
			for (const prompt of prompts) {
				assert.ok(prompt.title, `${prompt.name} has no title`);
				assert.ok((prompt.description || '').length >= BUDGET.descriptionMinLength, `${prompt.name} has a too short description`);
				for (const argument of prompt.arguments || []) {
					assert.ok((argument.description || '').length >= 20, `${prompt.name} argument ${argument.name} has a too short description`);
				}
				const result = await client.getPrompt({ name: prompt.name, arguments: PROMPT_EXAMPLES[prompt.name] });
				const text = result.messages[0].content.text;
				const unknown = [...new Set(text.match(/edubase_[a-z_]+[a-z]/g))].filter((name) => !names.has(name));
				assert.deepEqual(unknown, [], `${prompt.name} references unknown tools`);
			}
		} finally {
			await client.close();
		}
	}

	const client = await connect();
	try {
		await assert.rejects(client.getPrompt({ name: 'edubase_prompt_create_exam', arguments: { topic: 'Photosynthesis', questions: '6', types: 'choice, unknown' } }), /question type/);
		await assert.rejects(client.getPrompt({ name: 'edubase_prompt_create_exam', arguments: { topic: 'Photosynthesis', questions: 'many' } }), /whole number/);
		const types = await client.complete({ ref: { type: 'ref/prompt', name: 'edubase_prompt_create_exam' }, argument: { name: 'types', value: 'choice, mu' } });
		assert.deepEqual(types.completion.values, ['choice, multiple-choice']);
	} finally {
		await client.close();
	}

	const limited = await connect({ EDUBASE_TOOLSETS: 'tags' });
	try {
		assert.equal(limited.getServerCapabilities().prompts, undefined, 'prompts are announced without their toolsets');
	} finally {
		await limited.close();
	}
});

test('prompt arguments suggest the contents of the account', async () => {
	const { api, requests, url } = await startApi({ exams: { exams: [{ exam: 'EXAM1', title: 'Photosynthesis' }, { exam: 'EXAM2', title: 'Photosynthesis retake' }] } });
	const client = await connect({ EDUBASE_API_URL: url });
	try {
		const result = await client.complete({ ref: { type: 'ref/prompt', name: 'edubase_prompt_copy_exam' }, argument: { name: 'exam', value: 'photo' } });
		assert.deepEqual(result.completion.values, ['Photosynthesis', 'Photosynthesis retake']);
		assert.deepEqual(requests.map(({ method, endpoint, query }) => [method, endpoint, query.search]), [['GET', 'exams', 'photo']]);
	} finally {
		await client.close();
		api.close();
	}
});

test('the user is asked with forms if the client supports it', async () => {
	const { api, requests, url } = await startApi();
	const client = await connect({ EDUBASE_API_URL: url }, { elicitation: {} });
	const asked = [];
	let answer = null;
	client.setRequestHandler(ElicitRequestSchema, async (request) => {
		asked.push(request.params);
		return answer;
	});
	try {
		/* Question types with checkboxes */
		answer = { action: 'accept', content: { types: ['numerical', 'order'] } };
		const prompt = await client.getPrompt({ name: 'edubase_prompt_create_exam', arguments: { topic: 'Photosynthesis', questions: '6' } });
		assert.match(prompt.messages[0].content.text, /question types as evenly as the content allows: numerical, order\./);
		assert.equal(asked[0].requestedSchema.properties.types.type, 'array');
		answer = { action: 'cancel' };
		const defaults = await client.getPrompt({ name: 'edubase_prompt_create_exam', arguments: { topic: 'Photosynthesis', questions: '6' } });
		assert.match(defaults.messages[0].content.text, /choice, multiple-choice, true\/false\./);

		/* Confirming the changes that cannot be undone */
		answer = { action: 'accept', content: { confirm: false } };
		const declined = await client.callTool({ name: 'edubase_delete_exam', arguments: { exam: 'EXAM' } });
		assert.ok(declined.isError);
		assert.match(asked[asked.length - 1].message, /exam: EXAM/);
		assert.equal(requests.length, 0, 'the exam was deleted without confirmation');
		answer = { action: 'accept', content: { confirm: true } };
		const confirmed = await client.callTool({ name: 'edubase_delete_exam', arguments: { exam: 'EXAM' } });
		assert.ok(!confirmed.isError, JSON.stringify(confirmed.content));
		assert.deepEqual(requests.map(({ method, endpoint }) => [method, endpoint]), [['DELETE', 'exam']]);

		/* Other changes are not confirmed */
		const count = asked.length;
		await client.callTool({ name: 'edubase_post_exam_users', arguments: { exam: 'EXAM', users: 'USER' } });
		assert.equal(asked.length, count);
	} finally {
		await client.close();
		api.close();
	}
});

test('tool results link to the contents in EduBase', async () => {
	const { api, url, site } = await startApi({ exam: { exam: 'EXAM' }, exams: { exams: [] } });
	const client = await connect({ EDUBASE_API_URL: url });
	try {
		const created = await client.callTool({ name: 'edubase_post_exam', arguments: { title: 'Test', quiz: 'QUIZ', start: '2026-01-01 10:00:00', end: '2026-01-02 10:00:00' } });
		assert.ok(!created.isError, JSON.stringify(created.content));
		assert.deepEqual(JSON.parse(created.content[0].text), { exam: 'EXAM' });
		assert.deepEqual(created.content.filter((item) => item.type == 'resource_link').map((item) => item.uri), [`${site}/exam/manager/EXAM`, `${site}/quiz/manager/QUIZ`]);
		const listed = await client.callTool({ name: 'edubase_get_exams', arguments: {} });
		assert.equal(listed.content.length, 1, 'lists should not get links');
	} finally {
		await client.close();
		api.close();
	}
});

test('reference documents and contents are available as resources', async () => {
	const { api, requests, url } = await startApi({ exam: { exam: 'EXAM', title: 'Photosynthesis' }, 'exam:settings': { exam: 'EXAM' }, exams: { exams: [{ exam: 'EXAM', title: 'Photosynthesis' }] } });
	const client = await connect({ EDUBASE_API_URL: url });
	try {
		const { resources } = await client.listResources();
		assert.ok(resources.some((resource) => resource.uri == 'edubase://reference/questions'));
		assert.ok(resources.some((resource) => resource.uri == 'edubase://exam/EXAM' && resource.name == 'Photosynthesis'));
		const reference = await client.readResource({ uri: 'edubase://reference/exam-journeys' });
		assert.match(reference.contents[0].text, /complete_on/);
		const tool = await client.callTool({ name: 'edubase_mcp_reference', arguments: { reference: 'questions' } });
		assert.match(tool.content[0].text, /multiple-choice/);
		const { resourceTemplates } = await client.listResourceTemplates();
		assert.deepEqual(resourceTemplates.map((template) => template.uriTemplate).sort(), ['edubase://exam/{exam}', 'edubase://quiz/{quiz}']);
		const exam = await client.readResource({ uri: 'edubase://exam/EXAM' });
		assert.deepEqual(JSON.parse(exam.contents[0].text), { exam: { exam: 'EXAM', title: 'Photosynthesis' }, settings: { exam: 'EXAM' } });
		assert.deepEqual(requests.slice(-2).map(({ endpoint, query }) => [endpoint, query.exam]), [['exam', 'EXAM'], ['exam:settings', 'EXAM']]);
	} finally {
		await client.close();
	}

	/* Content resources turned off: only the reference documents remain, and the account is not read */
	const count = requests.length;
	const off = await connect({ EDUBASE_API_URL: url, EDUBASE_CONTENT_RESOURCES: 'false' });
	try {
		assert.deepEqual((await off.listResources()).resources.map((resource) => resource.uri).sort(), ['edubase://reference/exam-journeys', 'edubase://reference/questions']);
		assert.deepEqual((await off.listResourceTemplates()).resourceTemplates, []);
		assert.equal(requests.length, count, 'the account was read');
	} finally {
		await off.close();
		api.close();
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

test('tools with an empty output schema return structured content', async () => {
	/* Fake EduBase API answering with an empty body (like PATCH /exam) or with an object */
	let body = '';
	const api = createServer((req, res) => {
		req.resume();
		req.on('end', () => {
			res.setHeader('Content-Type', 'application/json');
			res.end(body);
		});
	});
	api.listen(0, '127.0.0.1');
	await once(api, 'listening');
	const client = await connect({ EDUBASE_API_URL: `http://127.0.0.1:${api.address().port}/api` });
	try {
		for (body of ['', '{"exam":"EXAM"}']) {
			const result = await client.callTool({ name: 'edubase_patch_exam', arguments: { exam: 'EXAM', end: '2028-01-31 22:59:00' } });
			assert.ok(!result.isError, JSON.stringify(result.content));
			assert.deepEqual(result.structuredContent, {});
		}
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

		/* Content resources are turned off by the session configuration */
		const listTemplates = async (sessionConfig) => {
			const query = `?config=${encodeURIComponent(Buffer.from(JSON.stringify(sessionConfig)).toString('base64'))}`;
			const response = await initialize(query);
			const id = response.headers.get('mcp-session-id');
			await response.text();
			const templates = await fetch(`${base}/mcp${query}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream', 'mcp-session-id': id },
				body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'resources/templates/list' }),
			});
			const line = (await templates.text()).split('\n').find((line) => line.startsWith('data: '));
			return JSON.parse(line.slice(6)).result.resourceTemplates.map((template) => template.uriTemplate);
		};
		assert.deepEqual(await listTemplates({ edubaseToolsets: 'exams' }), ['edubase://exam/{exam}']);
		assert.deepEqual(await listTemplates({ edubaseToolsets: 'exams', edubaseContentResources: false }), []);
	} finally {
		child.kill();
	}
});
