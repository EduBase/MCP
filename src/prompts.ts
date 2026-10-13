import type { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";
import type { EduBaseToolset } from "./tools.js";
import { EduBasePrompt, EduBasePromptContext, EDUBASE_QUESTION_TYPE_CHOICES } from "./prompts/common.js";
import { getQuestionPrompts } from "./prompts/questions.js";
import { getExamPrompts } from "./prompts/exams.js";

/* Prompt definitions */
export function getPrompts(context: EduBasePromptContext): EduBasePrompt[] {
	return [
		...getQuestionPrompts(context),
		...getExamPrompts(context),
	];
}

/* Prompts usable with the configuration (only the prompts marked as read-only in read-only mode) */
export function selectPrompts(toolsets: EduBaseToolset[], readOnly: boolean, context: EduBasePromptContext): EduBasePrompt[] {
	return getPrompts(context).filter((prompt) => (!readOnly || prompt.readOnly) && prompt.toolsets.every((toolset) => toolsets.includes(toolset)));
}

/* Ask the user for the question types with checkboxes (returns null if the client cannot ask, or the user did not answer) */
export type EduBaseElicitForm = (message: string, properties: Record<string, unknown>, required: string[]) => Promise<Record<string, unknown> | null>;
async function askQuestionTypes(elicit: EduBaseElicitForm): Promise<string | null> {
	const answer = await elicit('Which question types should be used?', {
		types: {
			type: 'array',
			title: 'Question types',
			description: 'The questions are spread across the selected types.',
			minItems: 1,
			items: { anyOf: EDUBASE_QUESTION_TYPE_CHOICES },
			default: ['choice', 'multiple-choice', 'true/false'],
		},
	}, ['types']);
	const types = answer?.types;
	return (Array.isArray(types) && types.length > 0) ? types.join(', ') : null;
}

/* Prompt message (with dynamic toolsets, the needed toolsets are enabled first) */
export async function getPromptResult(prompt: EduBasePrompt, args: Record<string, string | undefined>, options: { dynamic: boolean; readOnly: boolean; elicit?: EduBaseElicitForm }): Promise<GetPromptResult> {
	if (prompt.askQuestionTypes && !(args.types || '').trim() && options.elicit) {
		args = { ...args, types: (await askQuestionTypes(options.elicit)) ?? undefined };
	}
	const text = (options.dynamic ? `First enable the ${prompt.toolsets.join(', ')} toolsets with edubase_enable_toolsets.\n\n` : '') + prompt.text(args, { readOnly: options.readOnly });
	return {
		description: prompt.description,
		messages: [{ role: 'user', content: { type: 'text', text } }],
	};
}
