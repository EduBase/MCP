import * as z from 'zod/v4';

export const EDUBASE_API_TOOLS_PLAYS = [
	// GET /quiz:results:play - Get detailed results for a specific Quiz play
	{
		name: 'edubase_get_quiz_results_play',
		description: 'Get detailed results for a specific Quiz play.',
		inputSchema: z.object({
			play: z.string().describe('Quiz play identification string'),
		}),
		outputSchema: z.object({
			play: z.string().describe('Quiz play identification string'),
			user: z.string().describe('user identification string'),
			time_start: z.string().describe('start time'),
			time_end: z.string().describe('end time'),
			questions_total: z.number().int().describe('total number of questions asked'),
			questions_correct: z.number().int().describe('number of correctly answered questions'),
			points_total: z.number().describe('total points'),
			points_correct: z.number().describe('total points scored'),
			valid: z.boolean().describe('result is valid'),
			successful: z.boolean().nullable().describe('attempt passed grading threshold (if applicable)'),
			questions: z.array(z.object({
			index: z.string().describe('question index'),
			id: z.string().nullable().optional().describe('external unique question identifier (if present)'),
			question: z.string().describe('question identification string'),
			time_answer: z.number().describe('number of seconds spent on question (if available)').optional(),
			points_maximum: z.number().describe('maximum points'),
			points: z.number().describe('points scored'),
			})),
		}),
	},

	// DELETE /quiz:results:play - Archive or forget the result of a Quiz play
	{
		name: 'edubase_delete_quiz_results_play',
		description: 'Archive or forget the result of a Quiz play. An exam result is archived: it disappears from the result lists and the reports of the exam, but it is kept and can be restored by adding the archived user back to the exam. A result outside of an exam is forgotten: the play is detached from the user and only kept for the statistics. Exam results can only be archived when archiving is enabled for the exam (see the archive setting of edubase_post_exam_settings), and only the current result of the user can be archived. Results outside of an exam can only be forgotten by administrators.',
		inputSchema: z.object({
			play: z.string().describe('Quiz play identification string'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /quiz:results:user - Get user results for a specific Quiz set
	{
		name: 'edubase_get_quiz_results_user',
		description: 'Get user results for a specific Quiz set.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz set identification string'),
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.object({
			results: z.array(z.object({
				play: z.string().describe('Quiz play identification string'),
				user: z.string().describe('user identification string'),
				time_start: z.string().describe('start time'),
				time_end: z.string().describe('end time'),
				questions_total: z.number().int().describe('total number of questions asked'),
				questions_correct: z.number().int().describe('number of correctly answered questions'),
				points_total: z.number().describe('total points'),
				points_correct: z.number().describe('total points scored'),
				valid: z.boolean().describe('result is valid'),
				successful: z.boolean().nullable().describe('attempt passed grading threshold (if applicable)'),
			})),
		}),
	},

	// GET /exam:results:user - Get user results for a specific exam
	{
		name: 'edubase_get_exam_results_user',
		description: 'Get user results for a specific exam.',
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.object({
			results: z.array(z.object({
				play: z.string().describe('Quiz play identification string'),
				user: z.string().describe('user identification string'),
				time_start: z.string().describe('start time'),
				time_end: z.string().describe('end time'),
				questions_total: z.number().int().describe('total number of questions asked'),
				questions_correct: z.number().int().describe('number of correctly answered questions'),
				points_total: z.number().describe('total points'),
				points_correct: z.number().describe('total points scored'),
				attempt: z.number().int().describe('index of attempt'),
				valid: z.boolean().describe('result is valid'),
				successful: z.boolean().nullable().describe('attempt passed grading threshold (if applicable)'),
			})),
		}),
	},

	// GET /exam:results:raw - Get raw results for a specific exam
	{
		name: 'edubase_get_exam_results_raw',
		description: 'Get raw results for a specific exam. Only use this if very detailed results are needed! This endpoint returns raw results, including all answers given by the user. It is not meant to be displayed to the user. This might require additional permissions!',
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			users: z.array(z.unknown()).describe('details of the user and their results'),
			questions: z.looseObject({}).describe('most important details about the questions asked'),
		}),
	},

	// POST /exam:results:export - Generate a download link for the results of an exam
	{
		name: 'edubase_post_exam_results_export',
		description: 'Generate a download link for the results of an exam. The generated link is not authenticated, so it can be handed over to any service, but it can only be used once and it expires in an hour. Only those examinees are exported that are visible for the current user, and the exported columns are controlled by the export settings of the exam (see edubase_get_exam_settings). Exporting the results needs reporting permission for the exam.',
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			format: z.enum(['csv', 'xlsx']).describe('format of the exported file (csv: semicolon separated values, xlsx: Excel 2007+ workbook), default: the export_format setting of the exam').optional(),
			preset: z.enum(['default', 'answers']).describe('content of the exported file (default: the examinees with their results, answers: the answers only, without the examinees), the answers preset is only available for anonymous surveys (default: default)').optional(),
			sort: z.enum(['default', 'name']).describe('ordering of the examinees in the exported file (default: the same order they are listed in on the users page of the exam, name: by the name of the examinees), default: the export_sort setting of the exam').optional(),
			round: z.number().int().describe('export the results of a previous round instead of the current one, only available when the exam is configured to keep the results of its previous rounds, has to be the number of an already closed round (see edubase_get_exam_round)').optional(),
			filters: z.record(z.string(), z.union([
				z.array(z.string()),
				z.string(),
			])).describe('only export the examinees matching the given user data, keyed by the label of a custom user data field of the exam (see edubase_get_exam_fields), only those select custom fields can be used that have their filtering configured, the value is one of the filterable options of the field or a list of them, the examinees have to match any of the values given for the same field and all of the fields specified, cannot be combined with round as the results of a previous round cannot be filtered').optional(),
			language: z.string().describe('language of the exported file (default: the language of the user)').optional(),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			format: z.enum(['csv', 'xlsx']).describe('format of the exported file'),
			url: z.url().describe('download link for the results'),
			valid: z.string().describe('date and time of link expiration'),
		}),
	},

	// GET /exam:certificates:user - Get (the latest) certificate details for a specific exam and user
	{
		name: 'edubase_get_exam_certificates_user',
		description: 'Get (the latest) certificate details for a specific exam and user.',
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.object({
			play: z.string().describe('Quiz play identification string'),
			user: z.string().describe('user identification string'),
			archived: z.boolean().describe('exam result is archived'),
			eligible: z.boolean().describe('result is eligible for certification'),
			certified: z.boolean().describe('result is eligible for certification and also certified'),
			serial: z.string().describe('serial number of the certificate, only present if the result is certified and serial numbering is enabled').optional(),
			expires: z.string().describe('date of expiration, only present if the result is certified and expiration is configured').optional(),
		}),
	},

	// POST /exam:certificates:user:download - Generate download link for the latest user exam certificate
	{
		name: 'edubase_post_exam_certificates_user_download',
		description: 'Generate download link for the latest user exam certificate. If a previous valid link exists, it will be returned instead.',
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.object({
			play: z.string().describe('Quiz play identification string'),
			user: z.string().describe('user identification string'),
			url: z.url().describe('download link for the certificate'),
			valid: z.string().describe('date of link expiration'),
		}),
	},
];
