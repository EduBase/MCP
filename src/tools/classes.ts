import * as z from 'zod/v4';

/* Tool definitions */
export const EDUBASE_API_TOOLS_CLASSES = [
	// GET /classes - List owned and managed classes
	{
		name: 'edubase_get_classes',
		description: "List owned and managed classes.",
		inputSchema: z.object({
			search: z.string().optional().describe('search string to filter results'),
			limit: z.number().optional().describe('limit number of results (default: 16)'),
			page: z.number().optional().describe('page number (default: 1), not used in search mode!'),
		}),
		outputSchema: z.array(z.object({
			class: z.string().describe('class identification string'),
			id: z.string().optional().describe('external unique class identifier (if set for the class)'),
			name: z.string().describe('title of the class'),
		})),
	},

	// GET /class - Get/check class
	{
		name: 'edubase_get_class',
		description: "Get/check class.",
		inputSchema: z.object({
			class: z.string().describe('class identification string'),
		}),
		outputSchema: z.object({
			class: z.string().describe('class identification string'),
			id: z.string().optional().describe('external unique class identifier (if set for the class)'),
			name: z.string().describe('title of the class'),
			start: z.string().optional().describe('start date and time (if set)'),
			end: z.string().optional().describe('end date and time (if set)'),
		}),
	},

	// GET /class:assignments - List all assignments in a class
	{
		name: 'edubase_get_class_assignments',
		description: "List all assignments in a class.",
		inputSchema: z.object({
			class: z.string().describe('class identification string'),
		}),
		outputSchema: z.array(z.object({
			assignment: z.string().describe('assignment identification string'),
			name: z.string().describe('title of the assignment'),
			link: z.string().describe('link to the assignment page'),
			status: z.string().describe('assignment and submission state (INACTIVE, ACTIVE, STARTED, SUBMITTED, GRADED)'),
			starts: z.string().describe('when the assignment submission starts'),
			ends: z.string().describe('when the assignment submission ends'),
		})),
	},

	// GET /class:members - List all members in a class
	{
		name: 'edubase_get_class_members',
		description: "List all members in a class.",
		inputSchema: z.object({
			class: z.string().describe('class identification string'),
		}),
		outputSchema: z.array(z.object({
			user: z.string().describe('user identification string'),
			name: z.string().describe('name of the member'),
			active: z.boolean().describe('active membership (approved and not expired)'),
		})),
	},

	// POST /class:members - Assign user(s) to a class
	{
		name: 'edubase_post_class_members',
		description: "Assign user(s) to a class. Updates memberships if already member of the class.",
		inputSchema: z.object({
			class: z.string().describe('class identification string'),
			users: z.string().describe('comma-separated list of user identification strings'),
			expires: z.string().optional().describe('expiry in days or YYYY-MM-DD HH:ii:ss'),
			notify: z.boolean().optional().describe('notify users (default: false)'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// DELETE /class:members - Remove user(s) from a class
	{
		name: 'edubase_delete_class_members',
		description: "Remove user(s) from a class.",
		inputSchema: z.object({
			class: z.string().describe('class identification string'),
			users: z.string().describe('comma-separated list of user identification strings'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// POST /classes:members - Assign user(s) to class(es)
	{
		name: 'edubase_post_classes_members',
		description: "Assign user(s) to class(es). Updates memberships if already member of a class.",
		inputSchema: z.object({
			classes: z.string().describe('comma-separated list of class identification strings'),
			users: z.string().describe('comma-separated list of user identification strings'),
			expires: z.string().optional().describe('expiry in days or YYYY-MM-DD HH:ii:ss'),
			notify: z.boolean().optional().describe('notify users (default: false)'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /user:classes - List all classes a user is member of
	{
		name: 'edubase_get_user_classes',
		description: "List all classes a user is member of.",
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.array(z.object({
			class: z.string().describe('class identification string'),
			id: z.string().optional().describe('external unique class identifier (if set for the class)'),
			name: z.string().describe('title of the class'),
			link: z.string().describe('link to the class page'),
			active: z.boolean().describe('active membership (approved and not expired)'),
		})),
	},

	// POST /user:classes - Assign user to class(es)
	{
		name: 'edubase_post_user_classes',
		description: "Assign user to class(es). Updates membership if already member of a class.",
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
			classes: z.string().describe('comma-separated list of class identification strings'),
			expires: z.string().optional().describe('expiry in days or YYYY-MM-DD HH:ii:ss'),
			notify: z.boolean().optional().describe('notify user (default: false)'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// DELETE /user:classes - Remove user from class(es)
	{
		name: 'edubase_delete_user_classes',
		description: "Remove user from class(es).",
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
			classes: z.string().describe('comma-separated list of class identification strings'),
		}),
		outputSchema: z.object({}).optional(),
	},
];
