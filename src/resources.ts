import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import type { EduBaseToolset } from "./tools.js";
import { EDUBASE_REFERENCE_QUESTIONS } from "./references/questions.js";
import { EDUBASE_REFERENCE_EXAM_JOURNEYS } from "./references/exam-journeys.js";

/* Reference documents (the formats the skills explain, for the clients without them) */
export type EduBaseReference = { name: string; title: string; description: string; toolset: EduBaseToolset; text: string };
export const EDUBASE_REFERENCES: EduBaseReference[] = [
	{
		name: 'questions',
		title: 'Questions reference',
		description: 'Fields of edubase_post_question with the question types, formatting, parameters, scoring and the other options, with examples.',
		toolset: 'questions',
		text: EDUBASE_REFERENCE_QUESTIONS,
	},
	{
		name: 'exam-journeys',
		title: 'Exam journey format',
		description: 'Portable JSON format of the exam journeys (nodes, their configuration, conditions and settings), used by edubase_get_exam_journey_graph and edubase_put_exam_journey_graph.',
		toolset: 'exams',
		text: EDUBASE_REFERENCE_EXAM_JOURNEYS,
	},
];
export function selectReferences(toolsets: EduBaseToolset[]): EduBaseReference[] {
	return EDUBASE_REFERENCES.filter((reference) => toolsets.includes(reference.toolset));
}
export function getReferenceUri(reference: EduBaseReference): string {
	return `edubase://reference/${reference.name}`;
}

/* Sending EduBase API requests in the name of the session (extra is the request handler context, with the bearer of the request) */
export type EduBaseApiRequest = (method: string, endpoint: string, data: object, extra?: unknown) => Promise<any>;

/* Contents readable as resources, with the endpoints they are read from (the first one gives the title) */
const EDUBASE_CONTENT_RESOURCES = [
	{ type: 'exam', toolset: 'exams', list: 'exams', title: 'Exam', endpoints: { exam: 'exam', settings: 'exam:settings' }, description: 'Details and settings of an exam in EduBase.' },
	{ type: 'quiz', toolset: 'quizzes', list: 'quizes', title: 'Quiz set', endpoints: { quiz: 'quiz', questions: 'quiz:questions' }, description: 'Details and questions of a Quiz set in EduBase.' },
] as const;

/* Register the reference documents and the content resource templates */
export function registerResources(server: McpServer, toolsets: EduBaseToolset[], request: EduBaseApiRequest): void {
	selectReferences(toolsets).forEach((reference) => {
		server.registerResource(reference.name, getReferenceUri(reference), {
			title: reference.title,
			description: reference.description,
			mimeType: 'text/markdown',
		}, async (uri): Promise<ReadResourceResult> => ({
			contents: [{ uri: uri.href, mimeType: 'text/markdown', text: reference.text }],
		}));
	});

	EDUBASE_CONTENT_RESOURCES.filter((content) => toolsets.includes(content.toolset)).forEach((content) => {
		/* Search the contents of the account by their titles */
		const search = async (value: string, extra?: unknown): Promise<{ code: string; title: string }[]> => {
			const response = await request('get', content.list, { search: value || undefined, limit: 16 }, extra);
			return (response?.[content.list] || []).map((item: Record<string, string>) => ({ code: item[content.type], title: item.title }));
		};
		server.registerResource(content.type, new ResourceTemplate(`edubase://${content.type}/{${content.type}}`, {
			list: async (extra) => {
				try {
					return { resources: (await search('', extra)).map((item) => ({ uri: `edubase://${content.type}/${item.code}`, name: item.title, mimeType: 'application/json' })) };
				} catch {
					return { resources: [] };
				}
			},
			complete: {
				[content.type]: async (value) => {
					try {
						return (await search(value)).map((item) => item.code);
					} catch {
						return [];
					}
				},
			},
		}), {
			title: content.title,
			description: content.description + ` The URI holds the identification string of the ${content.title}.`,
			mimeType: 'application/json',
		}, async (uri, variables, extra): Promise<ReadResourceResult> => {
			const code = String(variables[content.type]);
			const data: Record<string, unknown> = {};
			for (const [key, endpoint] of Object.entries(content.endpoints)) {
				data[key] = await request('get', endpoint, { [content.type]: code }, extra);
			}
			return { contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(data) }] };
		});
	});
}
