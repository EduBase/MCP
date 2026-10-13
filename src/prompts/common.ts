import { completable } from "@modelcontextprotocol/sdk/server/completable.js";
import { randomBytes } from "node:crypto";
import * as z from 'zod/v4';
import type { EduBaseToolset } from "../tools.js";

/* Prompt definition (the text is wrapped into a user message on registration) */
export type EduBasePrompt = {
	name: string;
	title: string;
	description: string;
	toolsets: EduBaseToolset[];
	readOnly?: boolean;
	askQuestionTypes?: boolean;
	argsSchema: Record<string, z.ZodType<string | undefined>>;
	text: (args: Record<string, string | undefined>, options: EduBasePromptOptions) => string;
};
export type EduBasePromptOptions = { readOnly: boolean };

/* Searching the contents of the account while completing the arguments */
export type EduBaseContentType = 'exam' | 'quiz' | 'class';
export type EduBasePromptContext = {
	searchContents: (type: EduBaseContentType, search: string) => Promise<string[]>;
};

/* Question types (the same values as the type of edubase_post_question) */
export const EDUBASE_QUESTION_TYPES = ['choice', 'multiple-choice', 'true/false', 'numerical', 'text', 'free-text', 'order', 'pairing', 'grouping', 'expression', 'set', 'set:text', 'date/time', 'matrix', 'matrix:expression', 'matrix:generic', 'reading', 'hotspot', 'file', 'generic'] as const;
const EDUBASE_QUESTION_TYPE_ALIASES: Record<string, string> = { 'numeric': 'numerical', 'truefalse': 'true/false', 'true-false': 'true/false', 'datetime': 'date/time' };
export const EDUBASE_QUESTION_TYPES_HINT = 'choice (one correct answer), multiple-choice (several correct answers), true/false, numerical, text (short typed answer), free-text (essay, graded manually), order, pairing, grouping, expression (math formula), set, date/time, matrix, hotspot (needs an image), file (upload, graded manually)';

/* Question types offered as checkboxes (the types that can be generated without media) */
export const EDUBASE_QUESTION_TYPE_CHOICES = [
	{ const: 'choice', title: 'Choice (one correct answer)' },
	{ const: 'multiple-choice', title: 'Multiple choice (several correct answers)' },
	{ const: 'true/false', title: 'True/false statements' },
	{ const: 'numerical', title: 'Numerical answer' },
	{ const: 'text', title: 'Short text answer' },
	{ const: 'free-text', title: 'Free text (essay, graded manually)' },
	{ const: 'order', title: 'Put in order' },
	{ const: 'pairing', title: 'Pairing' },
	{ const: 'grouping', title: 'Grouping' },
	{ const: 'expression', title: 'Math expression' },
	{ const: 'date/time', title: 'Date' },
];

/* Pointer to the question writing guides */
export const EDUBASE_QUESTION_GUIDE_TEXT = 'Use the edubase-question-creator skill if available, otherwise read the questions reference with edubase_mcp_reference first';

/* Normalize question types (case-insensitive, with a few common aliases), unknown types are returned as is */
export function normalizeQuestionType(type: string): string {
	const normalized = type.trim().toLowerCase();
	return EDUBASE_QUESTION_TYPE_ALIASES[normalized] || normalized;
}
export function parseQuestionTypes(types: string): string[] {
	return [...new Set(types.split(',').map(normalizeQuestionType).filter((type) => type.length > 0))];
}
export function isQuestionType(type: string): boolean {
	return (EDUBASE_QUESTION_TYPES as readonly string[]).includes(normalizeQuestionType(type));
}

/* Suggest values starting with the typed text */
function suggest(values: readonly string[], typed: string | undefined): string[] {
	const prefix = (typed || '').trim().toLowerCase();
	return values.filter((value) => value.toLowerCase().startsWith(prefix));
}

/* Prompt arguments (clients only receive the name, description and whether an argument is required, so the descriptions list the accepted values, and the clients supporting completions get suggestions) */
export function questionTypeArgument(description: string) {
	return completable(z.string().refine(isQuestionType, { message: 'Unknown question type, use one of: ' + EDUBASE_QUESTION_TYPES.join(', ') }).describe(description), (value) => suggest(EDUBASE_QUESTION_TYPES, value));
}
export function questionTypesArgument(description: string) {
	/* Comma-separated list, the last item is completed */
	return completable(z.string().refine((value) => parseQuestionTypes(value).every(isQuestionType), { message: 'Unknown question type, use a comma-separated list of: ' + EDUBASE_QUESTION_TYPES.join(', ') }).optional().describe(description), (value) => {
		const items = (value || '').split(',');
		const typed = items.pop() || '';
		const selected = items.map(normalizeQuestionType).filter((type) => type.length > 0);
		const prefix = selected.map((type) => type + ', ').join('');
		return suggest(EDUBASE_QUESTION_TYPES.filter((type) => !selected.includes(type)), typed).map((type) => prefix + type);
	});
}
export function questionCountArgument(description: string, maximum: number) {
	return completable(z.string().regex(/^\s*\d+\s*$/, { message: 'Give the number of questions as a whole number' }).refine((value) => parseInt(value) >= 1 && parseInt(value) <= maximum, { message: `The number of questions has to be between 1 and ${maximum}` }).describe(description), (value) => suggest(['5', '10', '15', '20'].filter((count) => parseInt(count) <= maximum), value));
}
export function languageArgument(description: string) {
	return completable(z.string().optional().describe(description), (value) => suggest(['en', 'hu', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'ro', 'sk', 'cs'], value));
}
export function difficultyArgument(description: string) {
	return completable(z.string().optional().describe(description), (value) => suggest(['1', '2', '3', '4', '5', 'mixed'], value));
}

export function contentArgument(context: EduBasePromptContext, type: EduBaseContentType, description: string, optional: boolean = false) {
	/* Titles are suggested (more readable than identification strings), the prompts look up the content by either (the completion is attached to the outermost schema, as the arguments are looked up without unwrapping) */
	return completable((optional ? z.string().optional() : z.string().min(1)).describe(description), async (value) => {
		try {
			return await context.searchContents(type, (value || '').trim());
		} catch {
			return [];
		}
	});
}

/* Instruction to find a content given by its identification string or title */
export function findContentText(type: EduBaseContentType, value: string | undefined): string {
	const tools = { exam: 'edubase_get_exams', quiz: 'edubase_get_quizes', class: 'edubase_get_classes' };
	const names = { exam: 'exam', quiz: 'Quiz set', class: 'class' };
	return `the ${names[type]} "${value}" (an identification string or a title, if it is a title, find it with ${tools[type]} and ask me if there are multiple matches)`;
}

/* Prefix of external identifiers for the contents created by a prompt (re-posting a question with the same id updates it, so every run gets a random suffix) */
export function getContentPrefix(topic: string): string {
	const slug = topic.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24).replace(/-+$/, '');
	return (slug || 'mcp') + '-' + randomBytes(3).toString('hex');
}

/* Language instruction */
export function getLanguageText(language: string | undefined): string {
	return (language && language.trim().length > 0) ? `in the "${language.trim()}" language` : 'in the language the topic was given in';
}
