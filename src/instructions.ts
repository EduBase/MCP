import { EDUBASE_TOOLSET_NAMES, EduBaseToolset, selectTools } from "./tools.js";

/* Toolset map (helps clients that only show the tool names until a tool is searched for) */
type EduBaseToolsetGuide = {
	summary: string;
	tools?: string[];
	notes?: string[];
	writeNotes?: string[];
};
const EDUBASE_TOOLSET_GUIDES: Record<EduBaseToolset, EduBaseToolsetGuide> = {
	files: {
		summary: 'temporary file uploads for question images, attachments, certificate signatures, etc.',
		tools: ['edubase_post_filebin_upload', 'edubase_filebin'],
		writeNotes: [
			'Files are uploaded in three steps: request an upload link with edubase_post_filebin_upload, upload the file with edubase_filebin, then reference the returned filebin identifier in the tool arguments.',
		],
	},
	questions: {
		summary: 'questions',
		tools: ['edubase_get_questions', 'edubase_post_question', 'edubase_post_question_export'],
		notes: [
			'To read the full content of a question, use edubase_post_question_export, edubase_get_question only checks that the question exists.',
		],
		writeNotes: [
			'edubase_post_question both publishes new questions and updates existing ones (identified by their external id). Use LaTeX for mathematical notation, but NEVER with single dollar sign delimiters ($...$).',
		],
	},
	quizzes: {
		summary: 'Quiz sets, their questions, settings, skills and grading presets',
		tools: ['edubase_get_quizes', 'edubase_post_quiz', 'edubase_post_quiz_questions', 'edubase_get_quiz_settings'],
		notes: [
			'Quiz set tools and fields are spelled "quizes" (e.g. edubase_get_quizes), not "quizzes".',
		],
		writeNotes: [
			'Settings of Quiz sets and exams: edubase_post_*_settings changes individual settings, edubase_put_*_settings replaces the complete configuration with the one of another Quiz set or exam, edubase_patch_*_settings only copies the settings of another one that are not configured yet.',
		],
	},
	exams: {
		summary: 'exams, their settings, users, user data fields, status, rounds, certificates and branding',
		tools: ['edubase_get_exams', 'edubase_post_exam', 'edubase_post_exam_users', 'edubase_get_exam_settings', 'edubase_get_exam_certificates'],
		writeNotes: [
			'edubase_post_exam_users assigns existing users to an exam, edubase_post_exam_users_generate creates new exam accounts from patterns.',
			'edubase_post_exam_status only controls whether new tests can be started, the exam stays active. edubase_post_exam_round closes the running tests and detaches the previous results.',
		],
	},
	results: {
		summary: 'results of Quiz plays and exams, results exports and certificate downloads',
		tools: ['edubase_get_exam_results_user', 'edubase_get_quiz_results_play', 'edubase_post_exam_results_export', 'edubase_get_exam_certificates_user'],
		notes: [
			'Prefer edubase_get_exam_results_user and edubase_get_quiz_results_play, only use edubase_get_exam_results_raw when every given answer is needed. Use edubase_post_exam_results_export to get the results of every examinee as a CSV or XLSX file.',
		],
	},
	users: {
		summary: 'users, their names, groups and login links',
		tools: ['edubase_get_user_me', 'edubase_get_user_search', 'edubase_get_users', 'edubase_post_user'],
		notes: [
			'Use edubase_get_user_me to identify the current user and edubase_get_user_search to look up a user by email, username or code.',
		],
	},
	classes: {
		summary: 'classes, their members and assignments',
		tools: ['edubase_get_classes', 'edubase_get_class_members', 'edubase_post_class_members'],
		writeNotes: [
			'Memberships can be set from either side: edubase_post_class_members assigns users to one class, edubase_post_classes_members assigns users to multiple classes, edubase_post_user_classes assigns one user to multiple classes. Organizations work the same way (edubase_post_organization_members, edubase_post_organizations_members, edubase_post_user_organizations).',
		],
	},
	organizations: {
		summary: 'organizations, their members, departments, competencies, compliance and webhooks',
		tools: ['edubase_get_organizations', 'edubase_get_organization_members', 'edubase_get_organization_departments', 'edubase_get_organization_compliance'],
	},
	integrations: {
		summary: 'API and LMS integrations and their keys',
		tools: ['edubase_get_integrations', 'edubase_get_integration_keys'],
	},
	tags: {
		summary: 'tags and their attachments to contents',
		tools: ['edubase_get_tags', 'edubase_get_content_tags', 'edubase_post_content_tag'],
		notes: [
			'Tag attachments are handled by the same tools for every content type (class, course, event, exam, integration, organization, quiz, scorm, video): pass the content type in type and its identification string in content.',
		],
	},
	permissions: {
		summary: 'user permissions on contents and ownership transfers',
		tools: ['edubase_get_content_permission', 'edubase_post_content_permission', 'edubase_post_content_transfer'],
		notes: [
			'Permissions and ownership transfers are handled by the same tools for every content type (class, course, event, exam, integration, organization, quiz, scorm, tag, video): pass the content type in type and its identification string in content.',
		],
	},
	metrics: {
		summary: 'custom metrics',
		tools: ['edubase_post_metrics_custom'],
	},
};

/* Short description of a toolset */
export function getToolsetSummary(toolset: EduBaseToolset): string {
	return EDUBASE_TOOLSET_GUIDES[toolset].summary;
}

/* Server instructions (sent to the client once during initialization, so shared knowledge does not have to be repeated in every tool description) */
export function getServerInstructions(toolsets: EduBaseToolset[], readOnly: boolean, dynamic: boolean = false): string {
	const sections: string[] = [
		`# EduBase MCP server

EduBase is an assessment and e-learning platform. Tools map to EduBase API endpoints and are named edubase_<method>_<endpoint> (e.g. edubase_get_user_me for GET /user:me), the edubase_*_content_* tools cover the same endpoint of every content type. Tools with the get method only read data.`,

		`## Quiz hierarchy

1. Questions (lowest level): the building blocks, with many types (choice, numerical, expression, text, etc.), can be parametrized.
2. Quiz sets (middle level): collections of questions and question groups, used for practice or to power exams. A question can be used in multiple Quiz sets.
3. Exams (highest level): time-limited, secured instances of exactly one Quiz set, with start and end times, usually one attempt per user.

Exams are always created from an existing Quiz set, questions can never be added to an exam directly. Typical flow: create or find the questions (edubase_post_question), create or find a Quiz set (edubase_post_quiz) and add the questions to it (edubase_post_quiz_questions), then create the exam (edubase_post_exam) and assign users to it (edubase_post_exam_users).`,

		`## Conventions

- Objects are referenced by their identification strings (e.g. question, quiz, exam, user), returned by the list and create tools. The optional id fields are external identifiers set by integrations.
- List tools accept search, limit (default: 16) and page, page is ignored when searching. Search or page through the results instead of guessing identification strings.` + (readOnly ? '' : `
- Deleting, archiving, transferring ownership, starting a new exam round and rotating integration keys cannot be undone, confirm these with the user first.`),
	];

	/* Toolset map and disambiguation notes (only for the enabled toolsets with available tools, and only mentioning the available tools) */
	const selected = selectTools(toolsets, readOnly);
	const enabled = EDUBASE_TOOLSET_NAMES.filter((toolset) => selected.some((tool) => tool.toolset == toolset));
	const available = new Set(selected.map((tool) => tool.name));
	if (!readOnly && toolsets.includes('files')) {
		available.add('edubase_filebin');
	}
	sections.push('## Toolsets\n\n' + enabled.map((toolset) => {
		const guide = EDUBASE_TOOLSET_GUIDES[toolset];
		const tools = (guide.tools || []).filter((tool) => available.has(tool));
		return `- ${toolset}: ${guide.summary}` + (tools.length > 0 ? ` (${tools.join(', ')})` : '');
	}).join('\n'));
	const notes = enabled.flatMap((toolset) => [
		...(EDUBASE_TOOLSET_GUIDES[toolset].notes || []),
		...(readOnly ? [] : EDUBASE_TOOLSET_GUIDES[toolset].writeNotes || []),
	]);
	if (notes.length > 0) {
		sections.push('## Choosing tools\n\n' + notes.map((note) => `- ${note}`).join('\n'));
	}

	/* Describe the limited configuration, so missing tools are not searched for */
	const disabled = EDUBASE_TOOLSET_NAMES.filter((toolset) => !toolsets.includes(toolset));
	const limits: string[] = [];
	if (disabled.length > 0) {
		limits.push(`Tools of the other toolsets (${disabled.join(', ')}) are not available in this session.`);
	}
	if (dynamic) {
		limits.push('Toolsets are enabled on demand: only the file upload tools are available at the start. Enable the toolsets needed for the task with edubase_enable_toolsets before using their tools, and check the enabled toolsets with edubase_list_toolsets.');
	}
	if (readOnly) {
		limits.push('The server runs in read-only mode: only tools that read data are available, nothing can be created, modified or deleted in this session. Tell the user if a request needs changes.');
	}
	if (limits.length > 0) {
		sections.push(`## Configuration\n\n${limits.join('\n')}`);
	}

	return sections.join('\n\n');
}
