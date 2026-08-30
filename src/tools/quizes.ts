import * as z from 'zod/v4';

export const EDUBASE_API_TOOLS_QUIZES = [
	// GET /quizes - List owned and managed Quiz sets
	{
		name: 'edubase_get_quizes',
		description: 'List owned and managed Quiz sets. Quiz sets are named collections of questions that sit at the middle level of the EduBase Quiz hierarchy.',
		inputSchema: z.object({
			search: z.string().describe('search string to filter results').optional(),
			limit: z.number().int().describe('limit number of results (default: 16)').optional(),
			page: z.number().int().describe('page number (default: 1), not used in search mode!').optional(),
		}),
		outputSchema: z.object({
			quizes: z.array(z.object({
				quiz: z.string().describe('Quiz identification string'),
				id: z.string().nullable().optional().describe('external unique Quiz identifier (if set for the Quiz)'),
				title: z.string().describe('title of the Quiz set'),
			})),
		}),
	},

	// GET /quiz - Get/check Quiz set
	{
		name: 'edubase_get_quiz',
		description: 'Get/check Quiz set. Containing questions and powering Exams.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
		}),
		outputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
			id: z.string().nullable().optional().describe('external unique Quiz identifier (if set for the Quiz)'),
			title: z.string().describe('title of the Quiz set'),
			language: z.string().describe('language of the Quiz set'),
			description: z.string().optional().describe('short description of the Quiz set (only present if set for the Quiz set)'),
		}),
	},

	// POST /quiz - Create a new Quiz set
	{
		name: 'edubase_post_quiz',
		description: 'Create a new Quiz set. Quiz sets are collections of questions that can be used for practice or to power multiple Exams.',
		inputSchema: z.object({
			language: z.string().describe('desired Quiz set language').optional(),
			title: z.string().describe('title of the Quiz set'),
			id: z.string().min(1).max(64).describe('External unique Quiz identifier. Should be maximum 64 characters long!').optional(),
			description: z.string().describe('short description').optional(),
			copy_settings: z.string().describe('optional Quiz set identification string to copy settings from').optional(),
			copy_questions: z.string().describe('optional Quiz set identification string to copy questions from').optional(),
			mode: z.enum(['TEST', 'TURNS']).describe('Sets how questions are displayed during the Quiz. (default: TEST) - TEST: all questions are displayed at once, user can answer them in any order and switch between them - TURNS: questions are displayed one by one, only one question is visible at a time and the user must answer it before moving to the next question').optional(),
			type: z.enum(['set', 'final', 'exam', 'private']).describe('Type of the Quiz set. (default: set) - set: for practice purposes - final: for course exam purposes - exam: for exam purposes - private: for private purposes (e.g testing)').optional(),
		}),
		outputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
		}),
	},

	// PATCH /quiz - Update the details of an existing Quiz set
	{
		name: 'edubase_patch_quiz',
		description: 'Update the details of an existing Quiz set.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
			title: z.string().min(1).max(255).describe('title of the Quiz set').optional(),
			id: z.string().max(64).describe('external unique Quiz identifier, send an empty value to remove the current identifier').optional(),
			language: z.string().describe('language of the Quiz set').optional(),
			description: z.string().max(255).describe('short description of the Quiz set, send an empty value to remove the current description').optional(),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /quiz:settings - Get the settings of a Quiz set
	{
		name: 'edubase_get_quiz_settings',
		description: 'Get the settings of a Quiz set.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
		}),
		outputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
			shuffle: z.boolean().describe('questions are shuffled for every play'),
			timelimit: z.number().int().nullable().describe('time limit of the whole test in seconds, null if there is no time limit'),
			roundtime: z.number().int().nullable().describe('time limit of a single question in seconds, turn based Quiz sets only, null if there is no time limit'),
		}),
	},

	// POST /quiz:settings - Change individual settings of a Quiz set
	{
		name: 'edubase_post_quiz_settings',
		description: 'Change individual settings of a Quiz set.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
			shuffle: z.boolean().describe('shuffle questions for every play, when disabled the current order of the questions is kept').optional(),
			timelimit: z.union([
				z.number().int().min(0),
				z.string().regex(/^(\d+|default)$/i),
			]).describe('time limit of the whole test in seconds. Accepts a number or a numeric string, 0 or "default" if there is no time limit').optional(),
			roundtime: z.union([
				z.number().int().min(0),
				z.string().regex(/^(\d+|default)$/i),
			]).describe('time limit of a single question in seconds, only available for turn based (TURNS mode) Quiz sets. Accepts a number or a numeric string, 0 or "default" if there is no time limit').optional(),
		}),
		outputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
			shuffle: z.boolean().describe('questions are shuffled for every play'),
			timelimit: z.number().int().nullable().describe('time limit of the whole test in seconds, null if there is no time limit'),
			roundtime: z.number().int().nullable().describe('time limit of a single question in seconds, turn based Quiz sets only, null if there is no time limit'),
		}),
	},

	// PUT /quiz:settings - Replace the complete configuration of a Quiz set with the configuration of another Quiz set
	{
		name: 'edubase_put_quiz_settings',
		description: 'Replace the complete configuration of a Quiz set with the configuration of another Quiz set. Only the configuration is copied, questions and question groups are not. The question selection, filtering and export settings of the target Quiz set are kept as well.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string (the target Quiz set)'),
			source: z.string().describe('Quiz identification string to copy the settings from, must be different from the target Quiz set'),
		}),
		outputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
			source: z.string().describe('Quiz identification string the settings were copied from'),
		}),
	},

	// PATCH /quiz:settings - Copy only those settings that are not configured yet in the target Quiz set
	{
		name: 'edubase_patch_quiz_settings',
		description: 'Copy only those settings from another Quiz set that are not configured yet in the target Quiz set.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string (the target Quiz set)'),
			source: z.string().describe('Quiz identification string to copy the settings from, must be different from the target Quiz set'),
		}),
		outputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
			source: z.string().describe('Quiz identification string the settings were copied from'),
		}),
	},

	// DELETE /quiz - Remove/archive Quiz set
	{
		name: 'edubase_delete_quiz',
		description: 'Remove/archive Quiz set.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /quiz:skills - Get skills defined in a Quiz set
	{
		name: 'edubase_get_quiz_skills',
		description: "Get skills defined in a Quiz set.",
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
		}),
		outputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
			skills: z.array(z.object({
				identifier: z.string().describe('skill identifier'),
				title: z.string().describe('title of the skill'),
				description: z.string().optional().describe('skill description (if set)'),
			})),
		}),
	},

	// GET /quiz:questions - List all questions and question groups in a Quiz set
	{
		name: 'edubase_get_quiz_questions',
		description: 'List all questions and question groups in a Quiz set. Quiz sets contain questions (lowest level) and can be used by exams (highest level).',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
		}),
		outputSchema: z.object({
			items: z.array(z.object({
				question: z.string().describe('question identification string (if question)').optional(),
				id: z.string().describe('external unique question identifier (if question and present)').optional(),
				group: z.string().describe('question group title (if group)').optional(),
				active: z.boolean().describe('active item'),
			})),
		}),
	},

	// POST /quiz:questions - Assign question(s) to a Quiz set, or one of its question group
	{
		name: 'edubase_post_quiz_questions',
		description: 'Assign question(s) to a Quiz set, or one of its question group. Questions can exist independently from Quiz sets.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
			group: z.string().describe('question group title').optional(),
			questions: z.string().describe('comma-separated list of question identification strings'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// DELETE /quiz:questions - Remove question(s) from a Quiz set, or one of its question group
	{
		name: 'edubase_delete_quiz_questions',
		description: 'Remove question(s) from a Quiz set, or one of its question group.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
			group: z.string().describe('question group title').optional(),
			questions: z.string().describe('comma-separated list of question identification strings'),
		}),
		outputSchema: z.object({}).optional(),
	},
];
