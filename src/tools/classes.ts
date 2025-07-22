import { Tool } from "@modelcontextprotocol/sdk/types.js";

/* Tool definitions */
export const EDUBASE_API_TOOLS_CLASSES: Tool[] = [
	// GET /classes - List owned and managed classes
	{
		name: 'edubase_get_classes',
		description: "List owned and managed classes.",
		inputSchema: {
			type: 'object',
			properties: {
				search: {
					type: 'string',
					description: 'search string to filter results',
				},
				limit: {
					type: 'number',
					description: 'limit number of results (default, in search mode: 16)',
				},
				page: {
					type: 'number',
					description: 'page number (default: 1), not used in search mode!',
				},
			},
			required: [],
		},
	},

	// GET /class - Get/check class
	{
		name: 'edubase_get_class',
		description: "Get/check class.",
		inputSchema: {
			type: 'object',
			properties: {
				class: {
					type: 'string',
					description: 'class identification string',
				},
			},
			required: ['class'],
		},
	},

	// GET /class:assignments - List all assignments in a class
	{
		name: 'edubase_get_class_assignments',
		description: "List all assignments in a class.",
		inputSchema: {
			type: 'object',
			properties: {
				class: {
					type: 'string',
					description: 'class identification string',
				},
			},
			required: ['class'],
		},
	},

	// GET /class:members - List all members in a class
	{
		name: 'edubase_get_class_members',
		description: "List all members in a class.",
		inputSchema: {
			type: 'object',
			properties: {
				class: {
					type: 'string',
					description: 'class identification string',
				},
			},
			required: ['class'],
		},
	},

	// POST /class:members - Assign user(s) to a class
	{
		name: 'edubase_post_class_members',
		description: "Assign user(s) to a class. Updates memberships if already member of the class.",
		inputSchema: {
			type: 'object',
			properties: {
				class: {
					type: 'string',
					description: 'class identification string',
				},
				users: {
					type: 'string',
					description: 'comma-separated list of user identification strings',
				},
				expires: {
					type: 'string',
					description: 'expiry in days or YYYY-MM-DD HH:ii:ss',
				},
				notify: {
					type: 'boolean',
					description: 'notify users (default: false)',
				},
			},
			required: ['class', 'users'],
		},
	},

	// DELETE /class:members - Remove user(s) from a class
	{
		name: 'edubase_delete_class_members',
		description: "Remove user(s) from a class.",
		inputSchema: {
			type: 'object',
			properties: {
				class: {
					type: 'string',
					description: 'class identification string',
				},
				users: {
					type: 'string',
					description: 'comma-separated list of user identification strings',
				},
			},
			required: ['class', 'users'],
		},
	},

	// POST /classes:members - Assign user(s) to class(es)
	{
		name: 'edubase_post_classes_members',
		description: "Assign user(s) to class(es). Updates memberships if already member of a class.",
		inputSchema: {
			type: 'object',
			properties: {
				classes: {
					type: 'string',
					description: 'comma-separated list of class identification strings',
				},
				users: {
					type: 'string',
					description: 'comma-separated list of user identification strings',
				},
				expires: {
					type: 'string',
					description: 'expiry in days or YYYY-MM-DD HH:ii:ss',
				},
				notify: {
					type: 'boolean',
					description: 'notify users (default: false)',
				},
			},
			required: ['classes', 'users'],
		},
	},

	// GET /user:classes - List all classes a user is member of
	{
		name: 'edubase_get_user_classes',
		description: "List all classes a user is member of.",
		inputSchema: {
			type: 'object',
			properties: {
				user: {
					type: 'string',
					description: 'user identification string',
				},
			},
			required: ['user'],
		},
	},

	// POST /user:classes - Assign user to class(es)
	{
		name: 'edubase_post_user_classes',
		description: "Assign user to class(es). Updates membership if already member of a class.",
		inputSchema: {
			type: 'object',
			properties: {
				user: {
					type: 'string',
					description: 'user identification string',
				},
				classes: {
					type: 'string',
					description: 'comma-separated list of class identification strings',
				},
				expires: {
					type: 'string',
					description: 'expiry in days or YYYY-MM-DD HH:ii:ss',
				},
				notify: {
					type: 'boolean',
					description: 'notify user (default: false)',
				},
			},
			required: ['user', 'classes'],
		},
	},

	// DELETE /user:classes - Remove user from class(es)
	{
		name: 'edubase_delete_user_classes',
		description: "Remove user from class(es).",
		inputSchema: {
			type: 'object',
			properties: {
				user: {
					type: 'string',
					description: 'user identification string',
				},
				classes: {
					type: 'string',
					description: 'comma-separated list of class identification strings',
				},
			},
			required: ['user', 'classes'],
		},
	},
];

/* Output schema definitions */
export const EDUBASE_API_TOOLS_CLASSES_OUTPUT_SCHEMA: object = {
	// GET /classes - List owned and managed classes
	edubase_get_classes: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				code: {
					type: 'string',
					description: 'class identification string',
				},
				name: {
					type: 'string',
					description: 'title of the class',
				},
			},
		},
	},

	// GET /class - Get/check class
	edubase_get_class: {
		type: 'object',
		properties: {
			class: {
				type: 'string',
				description: 'class identification string',
			},
			name: {
				type: 'string',
				description: 'title of the class',
			},
			start: {
				type: 'string',
				description: 'start date and time (if set)',
			},
			end: {
				type: 'string',
				description: 'end date and time (if set)',
			},
		},
	},

	// GET /class:assignments - List all assignments in a class
	edubase_get_class_assignments: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				code: {
					type: 'string',
					description: 'assignment identification string',
				},
				name: {
					type: 'string',
					description: 'title of the assignment',
				},
				link: {
					type: 'string',
					description: 'link to the assignment page',
				},
				status: {
					type: 'string',
					description: 'assignment and submission state (INACTIVE, ACTIVE, STARTED, SUBMITTED, GRADED)',
				},
				starts: {
					type: 'string',
					description: 'when the assignment submission starts',
				},
				ends: {
					type: 'string',
					description: 'when the assignment submission ends',
				},
			},
		},
	},

	// GET /class:members - List all members in a class
	edubase_get_class_members: {
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
					description: 'name of the member',
				},
				active: {
					type: 'boolean',
					description: 'active membership (approved and not expired)',
				},
			},
		},
	},

	// POST /class:members - Assign user(s) to a class
	edubase_post_class_members: {},

	// DELETE /class:members - Remove user(s) from a class
	edubase_delete_class_members: {},

	// POST /classes:members - Assign user(s) to class(es)
	edubase_post_classes_members: {},

	// GET /user:classes - List all classes a user is member of
	edubase_get_user_classes: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				code: {
					type: 'string',
					description: 'class identification string',
				},
				name: {
					type: 'string',
					description: 'title of the class',
				},
				link: {
					type: 'string',
					description: 'link to the class page',
				},
				active: {
					type: 'boolean',
					description: 'active membership (approved and not expired)',
				},
			},
		},
	},

	// POST /user:classes - Assign user to class(es)
	edubase_post_user_classes: {},

	// DELETE /user:classes - Remove user from class(es)
	edubase_delete_user_classes: {},
};
