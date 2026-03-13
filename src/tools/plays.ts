import * as z from 'zod/v4';

export const EDUBASE_API_TOOLS_PLAYS = [
	// GET /quiz:results:play - Get detailed results for a specific Quiz play
	{
		name: 'edubase_get_quiz_play_results',
		description: 'Get detailed results for a specific Quiz play.',
		inputSchema: z.object({
			play: z.string().describe('Quiz play identification string'),
		}),
		outputSchema: z.object({
			play: z.string().describe('Quiz play identification string'),
			user: z.string().describe('user identification string'),
			time_start: z.string().describe('start time'),
			time_end: z.string().describe('end time'),
			questions_total: z.number().describe('total number of questions asked'),
			questions_correct: z.number().describe('number of correctly answered questions'),
			points_total: z.number().describe('total points'),
			points_correct: z.number().describe('total points scored'),
			valid: z.boolean().describe('result is valid'),
			successful: z.boolean().describe('attempt passed grading threshold (if applicable)'),
			questions: z.array(z.object({
			index: z.string().describe('question index'),
			id: z.string().describe('external unique question identifier (if present)').optional(),
			question: z.string().describe('question identification string'),
			time_answer: z.number().describe('number of seconds spent on question (if available)').optional(),
			points_maximum: z.number().describe('maximum points'),
			points: z.number().describe('points scored'),
			})),
		}),
	},

	// GET /quiz:results:user - Get user results for a specific Quiz set
	{
		name: 'edubase_get_quiz_results_user',
		description: 'Get user results for a specific Quiz set.',
		inputSchema: z.object({
			quiz: z.string().describe('Quiz set identification string'),
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.array(z.object({
			play: z.string().describe('Quiz play identification string'),
			user: z.string().describe('user identification string'),
			time_start: z.string().describe('start time'),
			time_end: z.string().describe('end time'),
			questions_total: z.number().describe('total number of questions asked'),
			questions_correct: z.number().describe('number of correctly answered questions'),
			points_total: z.number().describe('total points'),
			points_correct: z.number().describe('total points scored'),
			valid: z.boolean().describe('result is valid'),
			successful: z.boolean().describe('attempt passed grading threshold (if applicable)'),
		})),
	},

	// GET /exam:results:user - Get user results for a specific exam
	{
		name: 'edubase_get_exam_results_user',
		description: 'Get user results for a specific exam.',
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.array(z.object({
			play: z.string().describe('Quiz play identification string'),
			user: z.string().describe('user identification string'),
			time_start: z.string().describe('start time'),
			time_end: z.string().describe('end time'),
			questions_total: z.number().describe('total number of questions asked'),
			questions_correct: z.number().describe('number of correctly answered questions'),
			points_total: z.number().describe('total points'),
			points_correct: z.number().describe('total points scored'),
			attempt: z.number().describe('index of attempt'),
			valid: z.boolean().describe('result is valid'),
			successful: z.boolean().describe('attempt passed grading threshold (if applicable)'),
		})),
	},

	// GET /exam:results:raw - Get raw results for a specific exam
	{
		name: 'edubase_get_exam_results_raw',
		description: 'Get raw results for a specific exam.\n- This endpoint returns raw results, including all answers given by the user. It is not meant to be displayed to the user.\n- This might require additional permissions.',
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			users: z.array(z.object({
			results: z.number().describe('achieved score in percentage'),
			play: z.unknown().describe('Quiz play details'),
			ready: z.boolean().describe('all questions are evaluated, not requiring further review'),
			points: z.object({
				correct: z.unknown().describe('total points scored'),
				total: z.unknown().describe('maximum points'),
			}),
			flow: z.unknown().describe('Quiz Flow data, describing detailed user interaction and logs about the test attempt'),
			stats: z.unknown().describe('detailed evaluation data'),
			time: z.unknown().describe('time needed for the test and each question'),
			})),
			questions: z.unknown().describe('most important details about the questions asked'),
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
			eligible: z.boolean().describe('result is eligible for a certificate'),
			certified: z.boolean().describe('result is eligible and also certified'),
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
			url: z.string().describe('download link for the certificate'),
			valid: z.string().describe('date of link expiration'),
		}),
	},
];
