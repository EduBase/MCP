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
			organization: z.string().optional().describe('organization identification string to assign the exam to, only an organization of the API application owner can be used, always the organization of the user for organizational members'),
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
			organization: z.string().optional().describe('organization identification string to move the exam to, only an organization of the API application owner can be used, only the owner of the exam (or an administrator) can change the organization, send "none" (or an empty value) to remove the exam from its current organization, always the organization of the user for organizational members'),
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
		description: "Get the settings of an exam. Surveys are never graded and their results cannot be viewed later, so the grading and the results viewing settings are not returned for them. The columns of the results export cannot be configured for surveys either, only the format and the ordering of the exported file.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			nonblocking: z.boolean().describe('exam accounts are exclusively assigned to the exam and cannot be assigned to other exams during the exam period'),
			pausable: z.boolean().describe('tests can be paused and continued later during the exam period'),
			timelimit: z.number().int().nullable().describe('time limit of the whole test in seconds (as a number), null if the setting of the Quiz set is used, or 0 if there is no time limit'),
			roundtime: z.number().int().nullable().describe('time limit of a single question in seconds (as a number), turn based Quiz sets only, null if the setting of the Quiz set is used, or 0 if there is no time limit'),
			freeze_round: z.boolean().describe('the current round of the exam is frozen, no new round can be started'),
			archive: z.boolean().describe('the users who already have a result can be archived'),
			grading: z.string().nullable().optional().describe('grading of the exam, the code of the grading preset in use, "custom" for a manually configured grading, or "none" when grading is disabled, null if the setting of the Quiz set is used (never returned for surveys)'),
			grading_threshold: z.number().int().optional().describe('threshold of the grading in percentage (only present if a threshold is configured for the exam)'),
			view_results: z.enum(['after', 'always', 'datetime', 'datetime_blind', 'manual', 'none']).optional().describe('when the examinees can see their results (after: right after the test is submitted, until the end of the exam, always: any time during the exam period, the examinees can log back in to see their results, datetime: after the test is submitted, and again from the start of the results viewing period, datetime_blind: only in the results viewing period, the solutions and the details of the evaluation are hidden right after the test, manual: only after the result is published separately, test by test, none: never), never returned for surveys'),
			view_results_start: z.string().nullable().optional().describe('start of the results viewing period (only present if view_results is datetime or datetime_blind)'),
			view_results_identifier: z.string().nullable().optional().describe('label of the custom user data field the examinees can look up their results with (only present if view_results is datetime or datetime_blind)'),
			results_url: z.url().optional().describe('URL where examinees can look up their own results with the identifier (only present if the identifier based results page is available)'),
			results_page: z.boolean().optional().describe('the examinees are redirected to the results page after the test'),
			hide_ingame_results: z.boolean().optional().describe('the results are hidden while the test is taken'),
			hide_points: z.boolean().optional().describe('the points are hidden during the test and on the results page'),
			hide_grade: z.boolean().optional().describe('the grade is hidden on the results page'),
			show_in_lasthour: z.boolean().optional().describe('the results are only shown in the last hour of the exam'),
			export_format: z.enum(['csv', 'xlsx']).describe('format of the exported results file (csv: semicolon separated values, xlsx: Excel 2007+ workbook)'),
			export_sort: z.enum(['default', 'name']).describe('ordering of the examinees in the exported results file (default: the same order they are listed in on the users page of the exam, name: by the name of the examinees)'),
			export_stats: z.boolean().optional().describe('the statistics of every question are exported (never returned for surveys)'),
			export_answers: z.boolean().optional().describe('the answers given by the examinees are exported (never returned for surveys)'),
			export_points: z.boolean().optional().describe('the points scored on every question are exported (never returned for surveys)'),
			export_suspicion: z.boolean().optional().describe('the suspicious test taking indicator is exported (never returned for surveys)'),
			export_finished_only: z.boolean().optional().describe('only the examinees who finished their test are exported (never returned for surveys)'),
			export_custom_fields: z.boolean().optional().describe('the user data fields filled in by the examinees are exported (see edubase_get_exam_fields), never returned for surveys'),
			export_skills: z.boolean().optional().describe('the skill results of the examinees are exported, only exported when the Quiz set of the exam has skills (never returned for surveys)'),
			export_gender: z.boolean().optional().describe('the gender of the registered examinees is exported (never returned for surveys)'),
			export_attendance: z.boolean().optional().describe('the attendance of the examinees is exported, read only as the attendance is configured together with its source on the interface (never returned for surveys)'),
		}),
	},

	// POST /exam:settings - Change individual settings of an exam
	{
		name: 'edubase_post_exam_settings',
		description: "Change individual settings of an exam. The columns of the export (every setting from export_stats on) cannot be configured for surveys, only the export_format and the export_sort settings are available for them. The export_attendance setting is read only, the attendance is configured together with its source on the interface.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			nonblocking: z.boolean().optional().describe('exam accounts are exclusively assigned to the exam and cannot be assigned to other exams during the exam period, always true for homeworks and surveys, cannot be disabled when the exam already has results or when some tests are currently paused'),
			pausable: z.boolean().optional().describe('allow tests to be paused and continued later during the exam period, only available for non-blocking exams and always true for homeworks, cannot be disabled when some tests are currently paused, automatically disabled when nonblocking is disabled'),
			timelimit: z.union([
				z.number().int().min(0),
				z.string().regex(/^(\d+|default)$/i),
			]).optional().describe('time limit of the whole test in seconds, overriding the setting of the Quiz set. Accepts a number or a numeric string, 0 if there is no time limit, or "default" if the setting of the Quiz set should be used'),
			roundtime: z.union([
				z.number().int().min(0),
				z.string().regex(/^(\d+|default)$/i),
			]).optional().describe('time limit of a single question in seconds, overriding the setting of the Quiz set, only available for turn based (TURNS mode) Quiz sets. Accepts a number or a numeric string, 0 if there is no time limit, or "default" if the setting of the Quiz set should be used'),
			grading: z.string().optional().describe('grading of the exam, the code of a grading preset (see edubase_get_quiz_grading_presets), "none" to disable grading, or "default" to use the setting of the Quiz set, not available for surveys as they are never graded'),
			grading_threshold: z.number().min(0).max(100).optional().describe('threshold of the grading in percentage, between 0 and 100, only available for grading presets with a configurable threshold (of the go-nogo-custom type), can be changed without selecting the grading preset again'),
			freeze_round: z.boolean().optional().describe('freeze the current round of the exam, so the Quiz set cannot be replaced and no new round can be started, only available for the managers of the exam'),
			archive: z.boolean().optional().describe('allow archiving the users who already have a result, only available for the managers of the exam'),
			view_results: z.enum(['after', 'always', 'datetime', 'datetime_blind', 'manual', 'none']).optional().describe('when the examinees can see their results (after: right after the test is submitted, until the end of the exam, always: any time during the exam period, the examinees can log back in to see their results, datetime: after the test is submitted, and again from the start of the results viewing period, datetime_blind: only in the results viewing period, the solutions and the details of the evaluation are hidden right after the test, manual: only after the result is published separately, test by test, none: never), not available for surveys (default: after)'),
			view_results_start: z.string().optional().describe('start of the results viewing period (in YYYY-MM-DD HH:ii:ss format), only available with the datetime and datetime_blind types where it is mandatory, has to be between the start and the end of the exam, no further tests and no new rounds can be started once the period has begun'),
			view_results_identifier: z.string().optional().describe('label of the unique free text custom user data field the examinees can look up their results with, only available with the datetime and datetime_blind types, the field has to be a unique free text (text, email or phone) custom field of the exam (see edubase_get_exam_fields), send "none" (or an empty value) to disable the identifier based results page'),
			results_page: z.boolean().optional().describe('redirect the examinees to the results page after the test, can only be disabled with the datetime_blind, manual and none types'),
			hide_ingame_results: z.boolean().optional().describe('hide the results while the test is taken'),
			hide_points: z.boolean().optional().describe('hide the points during the test and on the results page, always enabled with the none type'),
			hide_grade: z.boolean().optional().describe('hide the grade on the results page, can only be enabled together with hide_points, always enabled with the none type'),
			show_in_lasthour: z.boolean().optional().describe('only show the results in the last hour of the exam, only available with the after type'),
			export_format: z.enum(['csv', 'xlsx']).optional().describe('format of the exported results file (csv: semicolon separated values, xlsx: Excel 2007+ workbook), default: xlsx'),
			export_sort: z.enum(['default', 'name']).optional().describe('ordering of the examinees in the exported results file (default: the same order they are listed in on the users page of the exam, name: by the name of the examinees), default: default'),
			export_stats: z.boolean().optional().describe('export the statistics of every question, not available for surveys (default: false)'),
			export_answers: z.boolean().optional().describe('export the answers given by the examinees, not available for surveys (default: false)'),
			export_points: z.boolean().optional().describe('export the points scored on every question, not available for surveys (default: false)'),
			export_suspicion: z.boolean().optional().describe('export the suspicious test taking indicator, not available for surveys (default: false)'),
			export_finished_only: z.boolean().optional().describe('only export the examinees who finished their test, not available for surveys (default: false)'),
			export_custom_fields: z.boolean().optional().describe('export the user data fields filled in by the examinees (see edubase_get_exam_fields), not available for surveys (default: true)'),
			export_skills: z.boolean().optional().describe('export the skill results of the examinees, only exported when the Quiz set of the exam has skills, not available for surveys (default: true)'),
			export_gender: z.boolean().optional().describe('export the gender of the registered examinees, needs special privileges to enable, not available for surveys (default: false)'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			nonblocking: z.boolean().describe('exam accounts are exclusively assigned to the exam and cannot be assigned to other exams during the exam period'),
			pausable: z.boolean().describe('tests can be paused and continued later during the exam period'),
			timelimit: z.number().int().nullable().describe('time limit of the whole test in seconds (as a number), null if the setting of the Quiz set is used, or 0 if there is no time limit'),
			roundtime: z.number().int().nullable().describe('time limit of a single question in seconds (as a number), turn based Quiz sets only, null if the setting of the Quiz set is used, or 0 if there is no time limit'),
			freeze_round: z.boolean().describe('the current round of the exam is frozen, no new round can be started'),
			archive: z.boolean().describe('the users who already have a result can be archived'),
			grading: z.string().nullable().optional().describe('grading of the exam, the code of the grading preset in use, "custom" for a manually configured grading, or "none" when grading is disabled, null if the setting of the Quiz set is used (never returned for surveys)'),
			grading_threshold: z.number().int().optional().describe('threshold of the grading in percentage (only present if a threshold is configured for the exam)'),
			view_results: z.enum(['after', 'always', 'datetime', 'datetime_blind', 'manual', 'none']).optional().describe('when the examinees can see their results (after: right after the test is submitted, until the end of the exam, always: any time during the exam period, the examinees can log back in to see their results, datetime: after the test is submitted, and again from the start of the results viewing period, datetime_blind: only in the results viewing period, the solutions and the details of the evaluation are hidden right after the test, manual: only after the result is published separately, test by test, none: never), never returned for surveys'),
			view_results_start: z.string().nullable().optional().describe('start of the results viewing period (only present if view_results is datetime or datetime_blind)'),
			view_results_identifier: z.string().nullable().optional().describe('label of the custom user data field the examinees can look up their results with (only present if view_results is datetime or datetime_blind)'),
			results_url: z.url().optional().describe('URL where examinees can look up their own results with the identifier (only present if the identifier based results page is available)'),
			results_page: z.boolean().optional().describe('the examinees are redirected to the results page after the test'),
			hide_ingame_results: z.boolean().optional().describe('the results are hidden while the test is taken'),
			hide_points: z.boolean().optional().describe('the points are hidden during the test and on the results page'),
			hide_grade: z.boolean().optional().describe('the grade is hidden on the results page'),
			show_in_lasthour: z.boolean().optional().describe('the results are only shown in the last hour of the exam'),
			export_format: z.enum(['csv', 'xlsx']).describe('format of the exported results file (csv: semicolon separated values, xlsx: Excel 2007+ workbook)'),
			export_sort: z.enum(['default', 'name']).describe('ordering of the examinees in the exported results file (default: the same order they are listed in on the users page of the exam, name: by the name of the examinees)'),
			export_stats: z.boolean().optional().describe('the statistics of every question are exported (never returned for surveys)'),
			export_answers: z.boolean().optional().describe('the answers given by the examinees are exported (never returned for surveys)'),
			export_points: z.boolean().optional().describe('the points scored on every question are exported (never returned for surveys)'),
			export_suspicion: z.boolean().optional().describe('the suspicious test taking indicator is exported (never returned for surveys)'),
			export_finished_only: z.boolean().optional().describe('only the examinees who finished their test are exported (never returned for surveys)'),
			export_custom_fields: z.boolean().optional().describe('the user data fields filled in by the examinees are exported (see edubase_get_exam_fields), never returned for surveys'),
			export_skills: z.boolean().optional().describe('the skill results of the examinees are exported, only exported when the Quiz set of the exam has skills (never returned for surveys)'),
			export_gender: z.boolean().optional().describe('the gender of the registered examinees is exported (never returned for surveys)'),
			export_attendance: z.boolean().optional().describe('the attendance of the examinees is exported, read only as the attendance is configured together with its source on the interface (never returned for surveys)'),
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

	// GET /exam:fields - Get the user data fields of an exam
	{
		name: 'edubase_get_exam_fields',
		description: "Get the user data fields of an exam. These are the built-in name, email address and phone number fields, and the custom fields the examinees fill in before they start their test.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			name: z.union([
				z.boolean(),
				z.string(),
			]).describe('the full name of the examinee is requested (false: the field is not used, true: the field is used with its default label, otherwise the custom label of the field)'),
			email: z.union([
				z.boolean(),
				z.string(),
			]).describe('the email address of the examinee is requested (false: the field is not used, true: the field is used with its default label, otherwise the custom label of the field)'),
			phone: z.union([
				z.boolean(),
				z.string(),
			]).describe('the phone number of the examinee is requested (false: the field is not used, true: the field is used with its default label, otherwise the custom label of the field)'),
			fields: z.array(z.object({
				label: z.string().describe('label of the field, shown to the examinee'),
				type: z.string().describe('type of the field'),
				required: z.boolean().describe('the field has to be filled in'),
				description: z.string().optional().describe('description shown under the field (if set)'),
				icon: z.string().optional().describe('Font Awesome icon class name of the field (if set)'),
				options: z.array(z.string()).optional().describe('the selectable options (select fields only)'),
				filtering: z.record(z.string(), z.string()).optional().describe('short labels the examinees are grouped and filtered with in the exam manager and the reports, keyed by option (select fields only, if set)'),
				from: z.number().optional().describe('lowest selectable value (from-to fields only)'),
				to: z.number().optional().describe('highest selectable value (from-to fields only)'),
				step: z.number().optional().describe('difference between the selectable values (from-to fields only, if set)'),
				minlength: z.number().int().optional().describe('minimum length of the value (free text fields only, if set)'),
				maxlength: z.number().int().optional().describe('maximum length of the value (free text fields only, if set)'),
				pattern: z.string().optional().describe('regular expression the value has to match (free text fields only, if set)'),
				unique: z.boolean().optional().describe('the value has to be unique within the exam (free text fields only, if set)'),
			})).describe('the custom fields of the exam'),
		}),
	},

	// POST /exam:fields - Change the built-in user data fields of an exam, and replace the complete list of its custom fields
	{
		name: 'edubase_post_exam_fields',
		description: "Change the built-in user data fields of an exam, and replace the complete list of its custom fields. The view_results_identifier setting of the exam is cleared when the selected custom field is not a unique free text field anymore.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			name: z.union([
				z.boolean(),
				z.string().min(1).max(255),
			]).optional().describe('request the full name of the examinee (true: use the field with its default label, false: do not use the field but keep its other settings, any other value is used as the label of the field)'),
			email: z.union([
				z.boolean(),
				z.string().min(1).max(255),
			]).optional().describe('request the email address of the examinee (true: use the field with its default label, false: do not use the field but keep its other settings, any other value is used as the label of the field)'),
			phone: z.union([
				z.boolean(),
				z.string().min(1).max(255),
			]).optional().describe('request the phone number of the examinee (true: use the field with its default label, false: do not use the field but keep its other settings, any other value is used as the label of the field)'),
			fields: z.array(z.object({
				label: z.string().describe('label of the field, shown to the examinee, the label identifies the field so it has to be unique within the exam, the settings of the previous field with the same label are used as the defaults'),
				type: z.enum(['text', 'email', 'phone', 'select', 'number', 'from-to', 'yes-no', 'yes', 'no', 'true-false', 'gender']).optional().describe('type of the field (text: free text, email: email address, phone: phone number, select: one of the given options, number: number, from-to: number selected from a range, yes-no: yes or no, yes: yes only and the examinee has to accept it, no: no only, true-false: true or false, gender: male, female or other), default: text'),
				required: z.boolean().optional().describe('the field has to be filled in (default: true)'),
				description: z.string().optional().describe('description shown under the field'),
				icon: z.string().optional().describe('Font Awesome icon class name of the field, in fa-{style} fa-{name} format where style is solid, regular, light, thin or brands (example: fa-regular fa-id-card)'),
				options: z.array(z.string()).optional().describe('the selectable options, mandatory for select fields, empty options are dropped'),
				filtering: z.record(z.string(), z.string()).optional().describe('short labels the examinees are grouped and filtered with in the exam manager and the reports, keyed by option, only used for select fields and only the options of the field can be used as keys, the previously stored labels are kept when it is not specified'),
				from: z.number().optional().describe('lowest selectable value, mandatory for from-to fields, has to be lower than to'),
				to: z.number().optional().describe('highest selectable value, mandatory for from-to fields'),
				step: z.number().optional().describe('difference between the selectable values, only used for from-to fields and it cannot be 0'),
				minlength: z.number().int().min(1).max(255).optional().describe('minimum length of the value, between 1 and 255, only used for the free text (text, email and phone) fields'),
				maxlength: z.number().int().min(1).max(255).optional().describe('maximum length of the value, between 1 and 255, only used for the free text (text, email and phone) fields'),
				pattern: z.string().min(1).max(255).optional().describe('regular expression the value has to match, only used for the free text (text, email and phone) fields, has to be a valid expression and it is matched against the whole value, needs special privileges to set and the previously stored pattern is kept for everyone else'),
				unique: z.boolean().optional().describe('require the value to be unique within the exam, only used for the free text (text, email and phone) fields (default: false)'),
			})).min(1).optional().describe('the custom fields of the exam, in the order they are shown to the examinee, the submitted list replaces the current one so send every custom field that should be kept, use edubase_delete_exam_fields to remove every custom field'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			name: z.union([
				z.boolean(),
				z.string(),
			]).describe('the full name of the examinee is requested (false: the field is not used, true: the field is used with its default label, otherwise the custom label of the field)'),
			email: z.union([
				z.boolean(),
				z.string(),
			]).describe('the email address of the examinee is requested (false: the field is not used, true: the field is used with its default label, otherwise the custom label of the field)'),
			phone: z.union([
				z.boolean(),
				z.string(),
			]).describe('the phone number of the examinee is requested (false: the field is not used, true: the field is used with its default label, otherwise the custom label of the field)'),
			fields: z.array(z.object({
				label: z.string().describe('label of the field, shown to the examinee'),
				type: z.string().describe('type of the field'),
				required: z.boolean().describe('the field has to be filled in'),
				description: z.string().optional().describe('description shown under the field (if set)'),
				icon: z.string().optional().describe('Font Awesome icon class name of the field (if set)'),
				options: z.array(z.string()).optional().describe('the selectable options (select fields only)'),
				filtering: z.record(z.string(), z.string()).optional().describe('short labels the examinees are grouped and filtered with in the exam manager and the reports, keyed by option (select fields only, if set)'),
				from: z.number().optional().describe('lowest selectable value (from-to fields only)'),
				to: z.number().optional().describe('highest selectable value (from-to fields only)'),
				step: z.number().optional().describe('difference between the selectable values (from-to fields only, if set)'),
				minlength: z.number().int().optional().describe('minimum length of the value (free text fields only, if set)'),
				maxlength: z.number().int().optional().describe('maximum length of the value (free text fields only, if set)'),
				pattern: z.string().optional().describe('regular expression the value has to match (free text fields only, if set)'),
				unique: z.boolean().optional().describe('the value has to be unique within the exam (free text fields only, if set)'),
			})).describe('the custom fields of the exam'),
		}),
	},

	// DELETE /exam:fields - Remove every custom field of an exam
	{
		name: 'edubase_delete_exam_fields',
		description: "Remove every custom field of an exam. The built-in name, email address and phone number fields are kept, use edubase_post_exam_fields to turn those off. The values the examinees already entered are kept, but they are not shown anymore. The view_results_identifier setting of the exam is cleared as well.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /exam:status - Get the status of an exam
	{
		name: 'edubase_get_exam_status',
		description: "Get the status of an exam, showing whether new tests can be started.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			active: z.boolean().describe('exam is active'),
			status: z.boolean().describe('new tests can be started'),
			modified: z.string().nullable().describe('date and time the status was changed at'),
			scheduled: z.string().nullable().describe('date and time starting new tests is automatically disabled at'),
		}),
	},

	// POST /exam:status - Enable or disable starting new tests on an exam
	{
		name: 'edubase_post_exam_status',
		description: "Enable or disable starting new tests on an exam. The exam itself stays active, only the start of further tests is controlled. The status can only be changed while the exam is active and has not closed yet. New tests cannot be started in the results viewing period. Disabling new tests also cancels the scheduled automatic disabling of the exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			status: z.boolean().describe('allow new tests to be started'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			active: z.boolean().describe('exam is active'),
			status: z.boolean().describe('new tests can be started'),
			modified: z.string().nullable().describe('date and time the status was changed at'),
			scheduled: z.string().nullable().describe('date and time starting new tests is automatically disabled at'),
		}),
	},

	// GET /exam:round - Get the current round of an exam
	{
		name: 'edubase_get_exam_round',
		description: "Get the current round of an exam.",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			round: z.number().int().describe('index of the current round'),
			started: z.string().nullable().describe('date and time the current round was started at'),
			results: z.boolean().describe('the current round already has results'),
			frozen: z.boolean().describe('the current round is frozen, no new round can be started'),
		}),
	},

	// POST /exam:round - Start a new round of the exam
	{
		name: 'edubase_post_exam_round',
		description: "Start a new round of the exam. The running tests are closed, the results of the previous round are detached from the exam accounts and the generated accounts are reset, so the exam can be taken again by another group of examinees. A new round cannot be started when the exam is locked, archived, the current round is frozen (see the freeze_round setting of edubase_post_exam_settings), or the results viewing period of the exam has already begun (see the view_results_start setting of edubase_post_exam_settings).",
		inputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			force: z.boolean().optional().describe('start a new round even if the current one has no results yet (default: false)'),
			notify: z.boolean().optional().describe('notify the assigned users about the exam (default: false)'),
		}),
		outputSchema: z.object({
			exam: z.string().describe('exam identification string'),
			round: z.number().int().describe('index of the current round'),
			started: z.string().nullable().describe('date and time the current round was started at'),
			results: z.boolean().describe('the current round already has results'),
			frozen: z.boolean().describe('the current round is frozen, no new round can be started'),
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
