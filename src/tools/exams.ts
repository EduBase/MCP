import * as z from 'zod/v4';

/*
# Exams (Highest Level in EduBase Hierarchy)

Exams are time-limited, secure instances of Quiz sets in EduBase.
They represent the highest level in the EduBase hierarchy, above both Questions and Quiz sets.

Key characteristics:
- Exams are always created from existing Quiz sets
- They have specific start and end times
- They include additional security features (cheating detection, prevention of simultaneous account access during exam)
- Usually restrict access to hints/solutions
- Generally limited to one attempt per user
- Questions cannot exist directly in Exams without being part of a Quiz set
*/

export const EDUBASE_API_TOOLS_EXAMS = [
	// GET /exams - List owned and managed exams
	{
		name: 'edubase_get_exams',
		description: "List owned and managed exams. Exams are the highest level in the EduBase Quiz hierarchy, built from Quiz sets.",
		inputSchema: z.object({
			search: z.string().optional().describe('search string to filter results'),
			active: z.boolean().nullable().optional().describe('optional filter to only include active exams (if true) or inactive exams (if false)'),
			limit: z.number().int().optional().describe('limit number of results (default: 16)'),
			page: z.number().int().optional().describe('page number (default: 1), not used in search mode!'),
		}),
		outputSchema: z.object({
			exams: z.array(z.object({
				exam: z.string().describe('exam identification string'),
				id: z.string().nullable().optional().describe('external unique exam identifier (if set for the exam)'),
				name: z.string().describe('title of the exam'),
				active: z.boolean().describe('exam is active'),
			})),
		}),
	},

	// GET /exam - Get/check exam
	{
		name: 'edubase_get_exam',
		description: "Get/check exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			id: z.string().nullable().optional().describe('external unique exam identifier (if set for the exam)'),
			name: z.string().describe('title of the exam'),
			quiz: z.string().describe('Quiz identification string. The Quiz set the exam is attached to'),
			active: z.boolean().describe('exam is active'),
			status: z.enum(['INACTIVE', 'ACTIVE', 'PAUSED', 'REVIEW', 'EXPIRED']).describe('exam status (INACTIVE, ACTIVE, PAUSED, REVIEW, EXPIRED)'),
			start: z.string().describe('start date and time'),
			end: z.string().describe('end date and time'),
		}),
	},

	// POST /exam - Create a new exam from an existing Quiz set
	{
		name: 'edubase_post_exam',
		description: "Create a new exam from an existing Quiz set. Exams are at the top level of the EduBase Quiz hierarchy and MUST be created from existing Quiz sets. They are time-constrained, secured assessment instances of Quiz sets.",
		inputSchema: z.object({
			language: z.string().optional().describe('desired exam language'),
			title: z.string().describe('title of the exam'),
			id: z.string().min(1).max(64).optional().describe('external unique exam identifier'),
			copy_settings: z.string().optional().describe('optional exam identification string to copy settings from'),
			keep_certificate_settings: z.boolean().optional().describe('whether to keep certificate settings from the copied exam (default: false)'),
			type: z.enum(['exam', 'championship', 'homework', 'survey']).optional().describe('type of the exam (default: exam)'),
			quiz: z.string().describe('the Quiz set (specified using the Quiz identification string) the exam is attached to'),
			open: z.string().describe('exam start time (in YYYY-MM-DD HH:ii:ss format)'),
			close: z.string().describe('exam end time (in YYYY-MM-DD HH:ii:ss format)'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
	},

	// DELETE /exam - Remove/archive exam
	{
		name: 'edubase_delete_exam',
		description: "Remove/archive exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /exam:users - List all users on an exam
	{
		name: 'edubase_get_exam_users',
		description: "List all users on an exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			users: z.array(z.object({
				user: z.string().describe('user identification string'),
				name: z.string().describe('name of the examinee'),
			})),
		}),
	},

	// POST /exam:users - Assign user(s) to an exam
	{
		name: 'edubase_post_exam_users',
		description: "Assign user(s) to an exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			users: z.string().describe('comma-separated list of user identification strings'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// DELETE /exam:users - Remove user(s) from an exam
	{
		name: 'edubase_delete_exam_users',
		description: "Remove user(s) from an exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			users: z.string().describe('comma-separated list of user identification strings'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// POST /exam:summary - Submit a new exam summary
	{
		name: 'edubase_post_exam_summary',
		description: "Submit a new AI exam summary.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			language: z.string().optional().describe('summary language'),
			type: z.enum(['ai']).optional().describe('type of summary (default: ai)'),
			summary: z.string().describe('summary text (basic HTML formatting allowed, keep concise, avoid personal information)'),
			llm: z.string().optional().describe('name of the Large Language Model used to generate the summary (preferred: openai / claude / gemini)'),
			model: z.string().optional().describe('exact LLM model name used to generate the summary (requires llm)'),
		}).superRefine((data, ctx) => {
			if (data.model && !data.llm) {
				ctx.addIssue({
					code: 'custom',
					message: 'llm must be specified when model is provided',
					path: ['llm'],
				});
			}
		}),
		outputSchema: z.object({}).optional(),
	},
];
