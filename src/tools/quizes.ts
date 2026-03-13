import * as z from 'zod/v4';

export const EDUBASE_API_TOOLS_QUIZES = [
	// GET /quizes - List owned and managed Quiz sets
	{
		name: 'edubase_get_quizes',
		description: 'List owned and managed Quiz sets. Quiz sets are named collections of questions that sit at the middle level of the EduBase Quiz hierarchy.',
		inputSchema: z.object({
			search: z.string().describe('search string to filter results').optional(),
			limit: z.number().describe('limit number of results (default: 16)').optional(),
			page: z.number().describe('page number (default: 1), not used in search mode!').optional(),
		}),
		outputSchema: z.array(z.object({
			quiz: z.string().describe('Quiz identification string'),
			id: z.string().describe('external unique Quiz identifier (if set for the Quiz)').optional(),
			name: z.string().describe('title of the Quiz set'),
		})),
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
			id: z.string().describe('external unique Quiz identifier (if set for the Quiz)').optional(),
			name: z.string().describe('title of the Quiz set'),
		}),
	},

	// POST /quiz - Create a new Quiz set
	{
		name: 'edubase_post_quiz',
		description: 'Create a new Quiz set. Quiz sets are collections of questions that can be used for practice or to power multiple Exams.',
		inputSchema: z.object({
			language: z.string().describe('desired Quiz set language').optional(),
			title: z.string().describe('title of the Quiz set'),
			id: z.string().describe('External unique Quiz identifier. Should be maximum 64 characters long!').optional(),
			description: z.string().describe('short description').optional(),
			mode: z.string().describe('Sets how questions are displayed during the Quiz. (default: TEST) - TEST: all questions are displayed at once, user can answer them in any order and switch between them - TURNS: questions are displayed one by one, only one question is visible at a time and the user must answer it before moving to the next question').optional(),
			type: z.string().describe('Type of the Quiz set. (default: set) - set: for practice purposes - exam: for exam purposes - private: for private purposes (e.g testing)').optional(),
		}),
		outputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
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

	// GET /quiz:questions - List all questions and question groups in a Quiz set
	{
		name: 'edubase_get_quiz_questions',
		description: 'List all questions and question groups in a Quiz set. Quiz sets contain questions (lowest level) and can be used by exams (highest level).',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz identification string'),
		}),
		outputSchema: z.array(z.union([
			z.object({
				id: z.string().describe('external unique question identifier (if present)').optional(),
				question: z.string().describe('question identification string (if question)'),
				active: z.boolean().describe('active item'),
			}).strict(),
			z.object({
				id: z.string().describe('external unique question identifier (if present)').optional(),
				group: z.string().describe('question group title (if group)'),
				active: z.boolean().describe('active item'),
			}).strict(),
		])),
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
