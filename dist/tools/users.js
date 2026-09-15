import * as z from 'zod/v4';
export const EDUBASE_API_TOOLS_USERS = [
    // GET /users - List managed, non-generated users
    {
        name: 'edubase_get_users',
        description: "List managed users, excluding generated exam accounts. Returns user identification strings and names. Use edubase_get_user_search to find a user by email address, username or code.",
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
        description: "Get the current user the requests are made as: identification string, name, whether the account is enabled and whether it is a generated exam account.",
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
        description: "Get a user: name, whether the account is enabled and whether it is a generated exam account. Use edubase_get_user_search if only the email address or username is known.",
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
        description: "Create a new EduBase user account with a username, name, email address and optional details (group, language, timezone, custom fields, etc.). A random initial password is generated if none is given. Returns the user identification string, and the username and password for non-exam accounts.",
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
            custom: z.record(z.string(), z.string()).optional().describe('custom field data, keyed by field name (sent as `custom_{field}`), only if the specified field is configured for the target EduBase instance'),
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
        description: "Enable or disable a user account, identified by its user identification string.",
        inputSchema: z.object({
            user: z.string().describe('user identification string'),
            active: z.boolean().describe('enable or disable user').optional(),
        }),
        outputSchema: z.object({}).optional(),
    },
    // DELETE /user - Delete user
    {
        name: 'edubase_delete_user',
        description: "Delete a user account. Only the users created through the API or generated by the current user can be deleted. Confirm with the user first.",
        inputSchema: z.object({
            user: z.string().describe('user identification string'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // GET /user:name - Get user's name
    {
        name: 'edubase_get_user_name',
        description: "Get the first, last, full and display name of a user.",
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
        description: "Update the name of a user: first and last name, optionally the full and display name. Returns whether the name was changed.",
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
        description: "Get the code of the user group a user belongs to.",
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
        description: "Move a user to another user group, identified by its code. Returns whether the group was changed.",
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
        description: "Get the latest valid login link of a user and its validity. Generate a new link with edubase_post_user_login.",
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
        description: "Invalidate a login link previously generated for a user.",
        inputSchema: z.object({
            user: z.string().describe('user identification string'),
            url: z.url().describe('generated login link to be invalidated'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // GET /user:search - Lookup user by email, username or code
    {
        name: 'edubase_get_user_search',
        description: "Look up a user by email address, username or user identification string. Returns the user identification string and whether it is a generated exam account.",
        inputSchema: z.object({
            query: z.string().describe('query string'),
        }),
        outputSchema: z.object({
            user: z.string().describe('user identification string'),
            exam: z.boolean().describe('exam (generated) account'),
        }),
    },
    /* The /user:assume endpoints are not exposed: the MCP server cannot send the assume token with the following requests */
];
