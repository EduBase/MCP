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
				title: z.string().describe('title of the exam'),
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
			title: z.string().describe('title of the exam'),
			description: z.string().optional().describe('description of the exam (only present if set for the exam)'),
			language: z.string().describe('language of the exam'),
			quiz: z.string().describe('Quiz identification string. The Quiz set the exam is attached to'),
			active: z.boolean().describe('exam is active'),
			status: z.enum(['INACTIVE', 'ACTIVE', 'PAUSED', 'REVIEW', 'EXPIRED']).describe('exam status (INACTIVE, ACTIVE, PAUSED, REVIEW, EXPIRED)'),
			secure: z.boolean().describe('exam can only be started with the Safe Exam Browser'),
			start: z.string().describe('start date and time'),
			end: z.string().describe('end date and time'),
			deadline: z.string().nullable().optional().describe('latest date and time the exam can be started at (if set for the exam)'),
			seb_launch_url: z.url().optional().describe('Safe Exam Browser launch URL (only present if secure is true)'),
			seb_config_url: z.url().optional().describe('Safe Exam Browser configuration file URL (only present if secure is true)'),
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
			start: z.string().describe('exam start time (in YYYY-MM-DD HH:ii:ss format)'),
			end: z.string().describe('exam end time (in YYYY-MM-DD HH:ii:ss format)'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
	},

	// PATCH /exam - Update the details of an existing exam
	{
		name: 'edubase_patch_exam',
		description: "Update the details of an existing exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			title: z.string().min(1).max(255).optional().describe('title of the exam'),
			id: z.string().max(64).optional().describe('external unique exam identifier, send an empty value to remove the current identifier'),
			language: z.string().optional().describe('language of the exam'),
			description: z.string().optional().describe('description of the exam, basic HTML formatting is kept and scripts are removed, send an empty value to remove the current description'),
			start: z.string().optional().describe('exam start time (in YYYY-MM-DD HH:ii:ss format), can only be changed until the first result arrives'),
			end: z.string().optional().describe('exam end time (in YYYY-MM-DD HH:ii:ss format)'),
			deadline: z.string().optional().describe('latest date and time the exam can be started at (in YYYY-MM-DD HH:ii:ss format), should be within the exam period, send "none" (or an empty value) to remove the current deadline'),
		}),
		outputSchema: z.object({}).optional(),
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

	// GET /exam:settings - Get the settings of an exam
	{
		name: 'edubase_get_exam_settings',
		description: "Get the settings of an exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			nonblocking: z.boolean().describe('exam accounts are exclusively assigned to the exam and cannot be assigned to other exams during the exam period'),
			pausable: z.boolean().describe('tests can be paused and continued later during the exam period'),
			timelimit: z.number().int().nullable().describe('time limit of the whole test in seconds (as a number), null if the setting of the Quiz set is used, or 0 if there is no time limit'),
			roundtime: z.number().int().nullable().describe('time limit of a single question in seconds (as a number), turn based Quiz sets only, null if the setting of the Quiz set is used, or 0 if there is no time limit'),
		}),
	},

	// POST /exam:settings - Change individual settings of an exam
	{
		name: 'edubase_post_exam_settings',
		description: "Change individual settings of an exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			nonblocking: z.boolean().optional().describe('exam accounts are exclusively assigned to the exam and cannot be assigned to other exams during the exam period, always true for homeworks and surveys, cannot be disabled when the exam already has results or when some tests are currently paused'),
			pausable: z.boolean().optional().describe('allow tests to be paused and continued later during the exam period, only available for non-blocking exams and always true for homeworks, cannot be disabled when some tests are currently paused, automatically disabled when nonblocking is disabled'),
			timelimit: z.union([
				z.number().int(),
				z.literal('default'),
			]).optional().describe('time limit of the whole test in seconds (as a number), overriding the setting of the Quiz set, 0 if there is no time limit, or "default" if Quiz settings should be used'),
			roundtime: z.union([
				z.number().int(),
				z.literal('default'),
			]).optional().describe('time limit of a single question in seconds (as a number), overriding the setting of the Quiz set, only available for turn based (TURNS mode) Quiz sets, 0 if there is no time limit, or "default" if Quiz settings should be used'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			nonblocking: z.boolean().describe('exam accounts are exclusively assigned to the exam and cannot be assigned to other exams during the exam period'),
			pausable: z.boolean().describe('tests can be paused and continued later during the exam period'),
			timelimit: z.number().int().nullable().describe('time limit of the whole test in seconds (as a number), null if the setting of the Quiz set is used, or 0 if there is no time limit'),
			roundtime: z.number().int().nullable().describe('time limit of a single question in seconds (as a number), turn based Quiz sets only, null if the setting of the Quiz set is used, or 0 if there is no time limit'),
		}),
	},

	// PUT /exam:settings - Replace the complete configuration of an exam with the configuration of another exam
	{
		name: 'edubase_put_exam_settings',
		description: "Replace the complete configuration of an exam with the configuration of another exam. Exam specific data and state (automatic account generation, rounds, notifications, login settings and previously used patterns) is never copied. Branding, and the attached learning materials (course, SCORM package and video) of the target exam are kept as well.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string (the target exam)'),
			source: z.string().describe('exam identification string to copy the settings from, must be different from the target exam'),
			keep_certificate_settings: z.boolean().optional().describe('whether to copy the certificate settings as well (default: false)'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			source: z.string().describe('exam identification string the settings were copied from'),
		}),
	},

	// PATCH /exam:settings - Copy only those settings that are not configured yet in the target exam
	{
		name: 'edubase_patch_exam_settings',
		description: "Copy only those settings from another exam that are not configured yet in the target exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string (the target exam)'),
			source: z.string().describe('exam identification string to copy the settings from, must be different from the target exam'),
			keep_certificate_settings: z.boolean().optional().describe('whether to copy the certificate settings as well (default: false)'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			source: z.string().describe('exam identification string the settings were copied from'),
		}),
	},

	// GET /exam:autologin - Get the automatic login configuration of an exam
	{
		name: 'edubase_get_exam_autologin',
		description: "Get the automatic login configuration of an exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			autologin: z.boolean().describe('automatic login is enabled'),
			pin: z.string().optional().describe('PIN code of the exam (only present if autologin is true)'),
			url: z.url().optional().describe('login URL of the exam, the shortlink or the Safe Exam Browser launch URL if configured (only present if autologin is true)'),
			results_url: z.url().optional().describe('URL where examinees can look up their own results (only present if autologin is true and results can be viewed with an identifier)'),
			autoadd: z.boolean().optional().describe('new exam accounts are generated automatically on demand (only present if autologin is true)'),
			autojoin: z.boolean().optional().describe('already registered users can join the exam automatically (only present if autologin is true)'),
			autojoin_limited: z.boolean().optional().describe('automatic joining is limited to the assigned users (only present if autojoin is true)'),
		}),
	},

	// POST /exam:autologin - Enable or reconfigure automatic login for an exam
	{
		name: 'edubase_post_exam_autologin',
		description: "Enable or reconfigure automatic login for an exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			se: z.string().optional().describe('shortlink for the login URL, at least 3 characters long (with a + sign automatically prepended), send an empty value to remove the current shortlink, needs the shortlink feature to be enabled and cannot be used with secure (Safe Exam Browser) exams'),
			autoadd: z.boolean().optional().describe('generate new exam accounts automatically on demand, needs special privileges to set!'),
			autojoin: z.boolean().optional().describe('allow already registered users to join the exam automatically, needs special privileges to set!'),
			autojoin_limited: z.boolean().optional().describe('limit automatic joining to the users assigned to the exam, only used when autojoin is enabled, needs special privileges to set! (default: false)'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			autologin: z.boolean().describe('automatic login is enabled'),
			pin: z.string().optional().describe('PIN code of the exam (only present if autologin is true)'),
			url: z.url().optional().describe('login URL of the exam, the shortlink or the Safe Exam Browser launch URL if configured (only present if autologin is true)'),
			results_url: z.url().optional().describe('URL where examinees can look up their own results (only present if autologin is true and results can be viewed with an identifier)'),
			autoadd: z.boolean().optional().describe('new exam accounts are generated automatically on demand (only present if autologin is true)'),
			autojoin: z.boolean().optional().describe('already registered users can join the exam automatically (only present if autologin is true)'),
			autojoin_limited: z.boolean().optional().describe('automatic joining is limited to the assigned users (only present if autojoin is true)'),
		}),
	},

	// DELETE /exam:autologin - Disable automatic login for an exam
	{
		name: 'edubase_delete_exam_autologin',
		description: "Disable automatic login for an exam. The PIN code and the shortlink of the exam are removed as well.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// POST /exam:users:generate - Generate exam accounts from patterns and assign them to an exam
	{
		name: 'edubase_post_exam_users_generate',
		description: "Generate exam accounts from patterns and assign them to an exam. The following placeholders can be used in the patterns: {index} (the index of the generated account), {random:N} (a random alphanumeric string of N characters, unambiguous characters only in passwords), {number:N} (a random numeric string of N characters), {name} and {Name} (the name of the account, only when names is specified, as given and capitalized) and {username} (the generated username, in the name pattern only). Patterns are stored with the exam and reused as defaults for the next call.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			username: z.string().min(1).max(64).optional().describe('username pattern, defaults to the pattern used previously for this exam, mandatory if the exam has no previously used pattern'),
			password: z.string().min(1).max(64).optional().describe('password pattern, defaults to the pattern used previously for this exam, mandatory if the exam has no previously used pattern'),
			name: z.string().min(1).max(128).optional().describe('full name pattern, defaults to the pattern used previously for this exam, mandatory if the exam has no previously used pattern'),
			names: z.union([
				z.array(z.string()),
				z.string(),
			]).optional().describe('list of names to generate the accounts for, either a list or a comma or newline separated string, the number of accounts generated is the number of names specified and count is ignored'),
			emails: z.union([
				z.array(z.string()),
				z.string(),
			]).optional().describe('list of email addresses for the generated accounts, either a list or a comma or newline separated string, only used together with names and the number of items must match the number of names, invalid addresses are replaced with a generated one'),
			count: z.number().int().optional().describe('number of accounts to generate, between 1 and 500, ignored when names is specified (default: 1)'),
			start: z.number().int().optional().describe('index to start the generation at (default: the index after the previously generated accounts, 1 for the first call)'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			users: z.array(z.object({
				user: z.string().describe('user identification string'),
				username: z.string().describe('username of the generated account'),
				name: z.string().describe('full name of the generated account'),
				password: z.string().nullable().describe('password of the generated account (if available)'),
			})),
		}),
	},

	// GET /exam:skills - Get skills defined in the Quiz set used by an exam
	{
		name: 'edubase_get_exam_skills',
		description: "Get skills defined in the Quiz set used by an exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			skills: z.array(z.object({
				identifier: z.string().describe('skill identifier'),
				title: z.string().describe('title of the skill'),
				description: z.string().optional().describe('skill description (if set)'),
			})),
		}),
	},

	// GET /exam:branding - Get exam branding configuration
	{
		name: 'edubase_get_exam_branding',
		description: "Get exam branding configuration.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			enabled: z.boolean().describe('whether branding is configured and enabled'),
			type: z.enum(['foreground', 'background']).optional().describe('type of branding image (foreground: image is used as a logo, background: image is used as a cover), only present if branding is enabled'),
			color: z.string().optional().describe('branding color, only present if branding is enabled'),
		}),
	},

	// POST /exam:branding - Configure or update exam branding
	{
		name: 'edubase_post_exam_branding',
		description: "Configure or update exam branding.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			type: z.enum(['foreground', 'background']).optional().describe('branding image type (foreground: image is used as a logo, background: image is used as a cover), default: foreground'),
			image: z.string().describe('branding image, either a base64-encoded image or a URL, supported formats: PNG, JPEG, WebP'),
			color: z.enum(['branding', 'red', 'blue', 'yellow', 'green', 'purple', 'gray']).describe('branding color'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// DELETE /exam:branding - Remove branding from an exam
	{
		name: 'edubase_delete_exam_branding',
		description: "Remove branding from an exam.",
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
