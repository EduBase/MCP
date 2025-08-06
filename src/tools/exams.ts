import { Tool } from "@modelcontextprotocol/sdk/types.js";

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

/* Tool definitions */
export const EDUBASE_API_TOOLS_EXAMS: Tool[] = [
	// GET /exams - List owned and managed exams
	{
		name: 'edubase_get_exams',
		description: "List owned and managed exams. Exams are the highest level in the EduBase Quiz hierarchy, built from Quiz sets.",
		inputSchema: {
			type: 'object',
			properties: {
				search: {
					type: 'string',
					description: 'search string to filter results',
				},
				limit: {
					type: 'number',
					description: 'limit number of results (default: 16)',
				},
				page: {
					type: 'number',
					description: 'page number (default: 1), not used in search mode!',
				},
			},
			required: [],
		},
	},

	// GET /exam - Get/check exam
	{
		name: 'edubase_get_exam',
		description: "Get/check exam.",
		inputSchema: {
			type: 'object',
			properties: {
				exam: {
					type: 'string',
					description: 'exam identification string',
				},
			},
			required: ['exam'],
		},
	},

	// POST /exam - Create a new exam from an existing Quiz set
	{
		name: 'edubase_post_exam',
		description: "Create a new exam from an existing Quiz set. Exams are at the top level of the EduBase Quiz hierarchy and MUST be created from existing Quiz sets. They are time-constrained, secured assessment instances of Quiz sets.",
		inputSchema: {
			type: 'object',
			properties: {
				language: {
					type: 'string',
					description: 'desired exam language',
				},
				title: {
					type: 'string',
					description: 'title of the exam',
				},
				type: {
					type: 'string',
					description:
						"Type of the exam. (default: exam)\n" +
						"- exam: regular exam\n" +
						"- championship: exam with championship features enabled\n" +
						"- homework: homework assignment, can be paused and continued during the exam period\n" +
						"- survey: survey (optionally anonymous) with no grading"
				},
				quiz: {
					type: 'string',
					description: 'the Quiz set (specified using the quiz identification string) the exam is attached to',
				},
				open: {
					type: 'string',
					description: 'exam start time (in YYYY-mm-dd HH:ii:ss format)',
				},
				close: {
					type: 'string',
					description: 'exam end time (in YYYY-mm-dd HH:ii:ss format)',
				},
			},
			required: ['title', 'quiz', 'open', 'close'],
		},
	},

	// DELETE /exam - Remove/archive exam
	{
		name: 'edubase_delete_exam',
		description: "Remove/archive exam.",
		inputSchema: {
			type: 'object',
			properties: {
				exam: {
					type: 'string',
					description: 'exam identification string',
				},
			},
			required: ['exam'],
		},
	},

	// GET /exam:users - List all users on an exam
	{
		name: 'edubase_get_exam_users',
		description: "List all users on an exam.",
		inputSchema: {
			type: 'object',
			properties: {
				exam: {
					type: 'string',
					description: 'exam identification string',
				},
			},
			required: ['exam'],
		},
	},

	// POST /exam:users - Assign user(s) to an exam
	{
		name: 'edubase_post_exam_users',
		description: "Assign user(s) to an exam.",
		inputSchema: {
			type: 'object',
			properties: {
				exam: {
					type: 'string',
					description: 'exam identification string',
				},
				users: {
					type: 'string',
					description: 'comma-separated list of user identification strings',
				},
			},
			required: ['exam', 'users'],
		},
	},

	// DELETE /exam:users - Remove user(s) from an exam
	{
		name: 'edubase_delete_exam_users',
		description: "Remove user(s) from an exam.",
		inputSchema: {
			type: 'object',
			properties: {
				exam: {
					type: 'string',
					description: 'exam identification string',
				},
				users: {
					type: 'string',
					description: 'comma-separated list of user identification strings',
				},
			},
			required: ['exam', 'users'],
		},
	},

	// POST /exam:summary - Submit a new exam summary
	{
		name: 'edubase_post_exam_summary',
		description: "Submit a new AI exam summary.",
		inputSchema: {
			type: 'object',
			properties: {
				exam: {
					type: 'string',
					description: 'exam identification string',
				},
				language: {
					type: 'string',
					description: 'summary language',
				},
				type: {
					type: 'string',
					description:
						"Type of summary. (default: ai)\n" +
						"- ai: AI-generated summary"
				},
				summary: {
					type: 'string',
					description:
						"Summary text. \n" +
						"- basic HTML formatting allowed, but avoid complex designs\n" +
						"- keep the summary short and concise\n" +
						"- try to avoid including personal information (such as usernames, names and contact addresses)"
				},
				llm: {
					type: 'string',
					description:
						"Name of the Large Language Model used to generate the summary.\n" +
						"- preferred values: openai / claude / gemini"
				},
				model: {
					type: 'string',
					description: 'Exact LLM model name used to generate the summary',
				},
			},
			required: ['exam', 'type', 'summary', 'llm', 'model'],
		},
	},
];

/* Output schema definitions */
export const EDUBASE_API_TOOLS_EXAMS_OUTPUT_SCHEMA: object = {
	// GET /exams - List owned and managed exams
	edubase_get_exams: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				code: {
					type: 'string',
					description: 'exam identification string',
				},
				name: {
					type: 'string',
					description: 'title of the exam',
				},
				active: {
					type: 'boolean',
					description: 'exam is active',
				},
			},
		},
	},

	// GET /exam - Get/check exam
	edubase_get_exam: {
		type: 'object',
		properties: {
			exam: {
				type: 'string',
				description: 'exam identification string',
			},
			name: {
				type: 'string',
				description: 'title of the exam',
			},
			quiz: {
				type: 'string',
				description:
					"Quiz identification string.\n" +
					"- The Quiz set the exam is attached to"
			},
			active: {
				type: 'boolean',
				description: 'exam is active',
			},
			status: {
				type: 'string',
				description: 'exam status (INACTIVE, ACTIVE, PAUSED, REVIEW, EXPIRED)',
			},
			start: {
				type: 'string',
				description: 'start date and time',
			},
			end: {
				type: 'string',
				description: 'end date and time',
			},
		},
	},

	// GET /exam - Get/check exam
	edubase_post_exam: {
		type: 'object',
		properties: {
			exam: {
				type: 'string',
				description: 'exam identification string',
			},
		},
	},

	// DELETE /exam - Remove/archive exam
	edubase_delete_exam: {},

	// GET /exam:users - List all users on an exam
	edubase_get_exam_users: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				code: {
					type: 'string',
					description: 'user identification string',
				},
				name: {
					type: 'string',
					description: 'name of the examinee',
				},
			},
		},
	},

	// POST /exam:users - Assign user(s) to an exam
	edubase_post_exam_users: {},

	// DELETE /exam:users - Remove user(s) from an exam
	edubase_delete_exam_users: {},

	// POST /exam:summary - Submit a new exam summary
	edubase_post_exam_summary: {},
};
