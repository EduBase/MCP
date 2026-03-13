import * as z from 'zod/v4';

export const EDUBASE_API_TOOLS_USERS = [
	// GET /users - List managed, non-generated users
	{
		name: 'edubase_get_users',
		description: 'List managed, non-generated users.',
		inputSchema: z.object({
			search: z.string().describe('search string to filter results').optional(),
			limit: z.number().int().describe('limit number of results (default: 16)').optional(),
			page: z.number().int().describe('page number (default: 1), not used in search mode!').optional(),
		}),
		outputSchema: z.object({
			users: z.array(z.object({
				user: z.string().describe('user identification string'),
				name: z.string().describe('full name of the user'),
			})),
		}),
	},

	// GET /user:me - Get/check current user
	{
		name: 'edubase_get_user_me',
		description: 'Get/check current user.',
		inputSchema: z.object({}).optional(),
		outputSchema: z.object({
			user: z.string().describe('user identification string'),
			name: z.string().describe('full name'),
			status: z.boolean().describe('user is enabled'),
			exam: z.boolean().describe('exam (generated) account'),
		}),
	},

	// GET /user - Get/check user
	{
		name: 'edubase_get_user',
		description: 'Get/check user.',
		inputSchema: z.object({
			user: z.string().describe("User identification string. Use 'me' to get the current user, but prefer /user:me endpoint instead."),
		}),
		outputSchema: z.object({
			user: z.string().describe('user identification string'),
			name: z.string().describe('full name'),
			status: z.boolean().describe('user is enabled'),
			exam: z.boolean().describe('exam (generated) account'),
		}),
	},

	// POST /user - Create new user account
	{
		name: 'edubase_post_user',
		description: 'Create new EduBase user account.',
		inputSchema: z.object({
			username: z.string().min(4).max(64).describe('username (4-64 characters)'),
			password: z.string().min(4).max(64).describe('password (4-64 characters) (default: initial random password is automatically generated)').optional(),
			first_name: z.string().min(1).max(64).describe('first name (1-64 characters)'),
			last_name: z.string().min(1).max(64).describe('last name (1-64 characters)'),
			full_name: z.string().min(1).max(255).describe('override automatic full name (1-255 characters)').optional(),
			display_name: z.string().min(1).max(255).describe('override automatic display name (1-255 characters)').optional(),
			email: z.email().describe('valid email address'),
			phone: z.string().describe('valid phone number in format "+prefix number" without special characters').optional(),
			gender: z.enum(['male', 'female', 'other']).describe('gender ("male", "female", or "other")').optional(),
			birthdate: z.string().describe('date of birth').optional(),
			exam: z.boolean().describe('user is only allowed to login when accessing exams (default: false)').optional(),
			group: z.string().describe('name of the user group').optional(),
			template: z.string().describe('a template ID for the new account (default: none)').optional(),
			language: z.string().describe("desired account language (default: API application owner's language)").optional(),
			timezone: z.string().describe("desired timezone (default: API application owner's timezone)").optional(),
			color: z.enum(['default', 'branding', 'red', 'blue', 'yellow', 'green', 'purple', 'gray']).describe('desired favorite color (default/branding/red/blue/yellow/green/purple/gray) (default: default)').optional(),
			must_change_password: z.boolean().describe('user is forced to change password on first login (default: false)').optional(),
			notify: z.boolean().describe('notify user via email (or SMS) (default: false)').optional(),
		}),
		outputSchema: z.object({
			user: z.string().describe('user identification string'),
			username: z.string().describe('username, only if exam=false').optional(),
			password: z.string().describe('password, only if exam=false').optional(),
		}),
	},

	// PATCH /user - Update user
	{
		name: 'edubase_patch_user',
		description: 'Update user.',
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
			active: z.boolean().describe('enable or disable user').optional(),
		}),
		outputSchema: z.object({}).optional(),
	},

	// DELETE /user - Delete user
	{
		name: 'edubase_delete_user',
		description: 'Delete user.',
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /user:name - Get user's name
	{
		name: 'edubase_get_user_name',
		description: "Get user's name.",
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.object({
			user: z.string().describe('the user identification string'),
			first_name: z.string().describe('first name'),
			last_name: z.string().describe('last name'),
			full_name: z.string().describe('full name'),
			display_name: z.string().describe('display name'),
		}),
	},

	// POST /user:name - Update a user's name
	{
		name: 'edubase_post_user_name',
		description: "Update a user's name.",
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
			first_name: z.string().describe('first name (1-64 characters)'),
			last_name: z.string().describe('last name (1-64 characters)'),
			full_name: z.string().describe('full name (1-255 characters)').optional(),
			display_name: z.string().describe('display name (1-255 characters)').optional(),
		}),
		outputSchema: z.object({
			user: z.string().describe('the user identification string'),
			success: z.boolean().describe('operation is successful'),
			changed: z.boolean().describe('name has been changed'),
		}),
	},

	// GET /user:group - Get user's group
	{
		name: 'edubase_get_user_group',
		description: "Get user's group.",
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.object({
			user: z.string().describe('the user identification string'),
			group: z.string().describe('user group code'),
		}),
	},

	// POST /user:group - Update a user's group
	{
		name: 'edubase_post_user_group',
		description: "Update a user's group.",
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
			group: z.string().describe('user group code'),
		}),
		outputSchema: z.object({
			user: z.string().describe('the user identification string'),
			success: z.boolean().describe('operation is successful'),
			changed: z.boolean().describe('group has been changed'),
		}),
	},

	// GET /user:login - Get latest valid login link for user
	{
		name: 'edubase_get_user_login',
		description: 'Get latest valid login link for user.',
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.object({
			user: z.string().describe('the user identification string'),
			url: z.url().describe('the login link'),
			valid: z.string().describe('validity (end of day) of the generated link'),
		}),
	},

	// POST /user:login - Generate login link
	{
		name: 'edubase_post_user_login',
		description: 'Generate login link. If a valid link with the same settings exists, it will be returned instead of creating a new one.',
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
			redirect: z.string().describe('redirect after a successful login (URI path or [{content_type}:{tag}])').optional(),
			exam: z.string().describe('the exam identification string to redirect the user to (mutually exclusive with redirect)').optional(),
			expires: z.union([z.number().int(), z.string()]).describe('expiry in days (1-30) or YYYY-MM-DD (default: 1 day)').optional(),
			logins: z.number().int().max(255).describe('total count the link can be used to login users (default: 1)').optional(),
			template: z.string().describe('a template ID for the login link').optional(),
			short: z.boolean().describe('generate shortened (eduba.se) link (only if feature is enabled on EduBase) (default: false)').optional(),
		}),
		outputSchema: z.object({
			user: z.string().describe('the user identification string'),
			url: z.url().describe('the login link'),
			valid: z.string().describe('validity of the generated link'),
			count: z.number().int().describe('maximum number the link can be used to login'),
		}),
	},

	// DELETE /user:login - Delete a previously generated login link
	{
		name: 'edubase_delete_user_login',
		description: 'Delete a previously generated login link.',
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
			url: z.url().describe('generated login link to be invalidated'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /user:search - Lookup user by email, username or code
	{
		name: 'edubase_get_user_search',
		description: 'Lookup user by email, username or code.',
		inputSchema: z.object({
			query: z.string().describe('query string'),
		}),
		outputSchema: z.object({
			user: z.string().describe('user identification string'),
			exam: z.boolean().describe('exam (generated) account'),
		}),
	},

	// POST /user:assume - Assume user for next requests with assume token
	{
		name: 'edubase_post_user_assume',
		description: 'Assume user for next requests with assume token.',
		inputSchema: z.object({
			user: z.string().describe('user identification string, username or email address'),
			password: z.string().describe('password or user secret').optional(),
		}),
		outputSchema: z.object({
			user: z.string().describe('user identification string'),
			token: z.boolean().describe('assume token'),
			valid: z.string().describe('validity of the generated token'),
		}),
	},

	// DELETE /user:assume - Revoke assume token
	{
		name: 'edubase_delete_user_assume',
		description: 'Revoke assume token.',
		inputSchema: z.object({
			token: z.string().describe('assume token'),
		}),
		outputSchema: z.object({}).optional(),
	},
];
