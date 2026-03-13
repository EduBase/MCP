import * as z from 'zod/v4';
export const EDUBASE_API_TOOLS_ORGANIZATIONS = [
    // GET /organizations - List owned and managed organizations
    {
        name: 'edubase_get_organizations',
        description: "List owned and managed organizations.",
        inputSchema: z.object({
            search: z.string().optional().describe('search string to filter results'),
            limit: z.number().int().optional().describe('limit number of results (default: 16)'),
            page: z.number().int().optional().describe('page number (default: 1), not used in search mode!'),
        }),
        outputSchema: z.object({
            organizations: z.array(z.object({
                organization: z.string().describe('organization identification string'),
                id: z.string().nullable().optional().describe('external unique organization identifier (if set for the organization)'),
                name: z.string().describe('title of the organization'),
            })),
        }),
    },
    // GET /organization - Get/check organization
    {
        name: 'edubase_get_organization',
        description: "Get/check organization.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
        }),
        outputSchema: z.object({
            organization: z.string().describe('organization identification string'),
            id: z.string().nullable().optional().describe('external unique organization identifier (if set for the organization)'),
            name: z.string().describe('title of the organization'),
        }),
    },
    // POST /organization - Create an organization
    {
        name: 'edubase_post_organization',
        description: "Create an organization.",
        inputSchema: z.object({
            name: z.string().describe('title of the organization'),
            description: z.string().optional().describe('optional short description'),
            domain: z.string().optional().describe('domain name (FQDN) for the organization without www prefix, needs special privileges to set!'),
            website: z.url().optional().describe('homepage URL'),
            email: z.email().optional().describe('contact email address'),
            phone: z.string().optional().describe('contact phone number'),
        }),
        outputSchema: z.object({
            organization: z.string().describe('organization identification string'),
        }),
    },
    // PATCH /organization - Update organization
    {
        name: 'edubase_patch_organization',
        description: "Update organization.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // DELETE /organization - Remove organization
    {
        name: 'edubase_delete_organization',
        description: "Remove organization.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // GET /organization:members - List all members in an organization
    {
        name: 'edubase_get_organization_members',
        description: "List all members in an organization.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
        }),
        outputSchema: z.object({
            members: z.array(z.object({
                user: z.string().describe('user identification string'),
                name: z.string().describe('name of the member'),
                department: z.string().nullable().optional().describe('name of the department (if member)'),
                permission: z.object({
                    organization: z.string().describe('permission level to organization'),
                    content: z.string().describe('permission level to contents in organization'),
                }).describe('permissions'),
            })),
        }),
    },
    // POST /organization:members - Assign user(s) to an organization
    {
        name: 'edubase_post_organization_members',
        description: "Assign user(s) to an organization. Updates memberships if already member of the organization.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
            users: z.string().describe('comma-separated list of user identification strings'),
            department: z.string().optional().describe('optional name of department'),
            permission_organization: z.enum(['member', 'teacher', 'reporter', 'supervisor', 'admin']).optional().describe('optional permission level to organization (member / teacher / reporter / supervisor / admin) (default: member)'),
            permission_content: z.enum(['none', 'view', 'report', 'control', 'modify', 'grant', 'admin']).optional().describe('optional permission level to contents in organization (none / view / report / control / modify / grant / admin) (default: none)'),
            notify: z.boolean().optional().describe('notify users (default: false)'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // DELETE /organization:members - Remove user(s) from an organization
    {
        name: 'edubase_delete_organization_members',
        description: "Remove user(s) from an organization.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
            users: z.string().describe('comma-separated list of user identification strings'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // POST /organizations:members - Assign user(s) to organization(s)
    {
        name: 'edubase_post_organizations_members',
        description: "Assign user(s) to organization(s). Updates memberships if already member of an organization.",
        inputSchema: z.object({
            organizations: z.string().describe('comma-separated list of organization identification strings'),
            users: z.string().describe('comma-separated list of user identification strings'),
            department: z.string().optional().describe('optional name of department'),
            permission_organization: z.enum(['member', 'teacher', 'reporter', 'supervisor', 'admin']).optional().describe('optional permission level to organization (member / teacher / reporter / supervisor / admin) (default: member)'),
            permission_content: z.enum(['none', 'view', 'report', 'control', 'modify', 'grant', 'admin']).optional().describe('optional permission level to contents in organization (none / view / report / control / modify / grant / admin) (default: none)'),
            notify: z.boolean().optional().describe('notify users (default: false)'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // GET /user:organizations - List all organizations a user is member of
    {
        name: 'edubase_get_user_organizations',
        description: "List all organizations a user is member of.",
        inputSchema: z.object({
            user: z.string().describe('user identification string'),
        }),
        outputSchema: z.object({
            organizations: z.array(z.object({
                organization: z.string().describe('organization identification string'),
                id: z.string().nullable().optional().describe('external unique organization identifier (if set for the organization)'),
                name: z.string().describe('title of the organization'),
                link: z.string().describe('link to the organization manager page'),
                department: z.string().nullable().optional().describe('name of the department (if member)'),
                permission: z.object({
                    organization: z.string().describe('permission level to organization'),
                    content: z.string().describe('permission level to contents in organization'),
                }).describe('permissions'),
            })),
        }),
    },
    // POST /user:organizations - Assign user to organization(s)
    {
        name: 'edubase_post_user_organizations',
        description: "Assign user to organization(s). Updates membership if already member of an organization.",
        inputSchema: z.object({
            user: z.string().describe('user identification string'),
            organizations: z.string().describe('comma-separated list of organization identification strings'),
            department: z.string().optional().describe('optional name of department'),
            permission_organization: z.enum(['member', 'teacher', 'reporter', 'supervisor', 'admin']).optional().describe('optional permission level to organization (member / teacher / reporter / supervisor / admin) (default: member)'),
            permission_content: z.enum(['none', 'view', 'report', 'control', 'modify', 'grant', 'admin']).optional().describe('optional permission level to contents in organization (none / view / report / control / modify / grant / admin) (default: none)'),
            notify: z.boolean().optional().describe('notify user (default: false)'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // DELETE /user:organizations - Remove user from organization(s)
    {
        name: 'edubase_delete_user_organizations',
        description: "Remove user from organization(s).",
        inputSchema: z.object({
            user: z.string().describe('user identification string'),
            organizations: z.string().describe('comma-separated list of organization identification strings'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // GET /organization:webhook - Get/check webhook configured in organization
    {
        name: 'edubase_get_organization_webhook',
        description: "Get/check webhook configured in organization.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
            webhook: z.string().describe('webhook identification string'),
        }),
        outputSchema: z.object({
            organization: z.string().describe('organization identification string'),
            webhook: z.string().describe('webhook identification string'),
            name: z.string().describe('title of the webhook'),
            active: z.boolean().describe('webhook is active'),
        }),
    },
    // POST /organization:webhook - Create a webhook for an organization
    {
        name: 'edubase_post_organization_webhook',
        description: "Create a webhook for an organization.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
            name: z.string().describe('title of the webhook'),
            trigger_event: z.enum(['exam-play-result', 'quiz-play-result', 'api']).describe('Type of event to trigger webhook: - exam-play-result: triggers when a user (must be member of the organization) completes an exam in the organization - quiz-play-result: triggers when a user (must be member of the organization) completes a quiz in practice mode in the organization - api: triggers when a manual API call is made (useful for testing and debugging)'),
            endpoint: z.url().describe('URL to send webhook notifications to'),
            method: z.enum(['POST', 'GET']).optional().describe('HTTP method to use for webhook notifications (default: POST) - POST - GET'),
            authentication: z.enum(['none', 'key']).optional().describe('Type of authentication (default: none): - none: no authentication - key: use a secret key (or password) for authentication'),
            authentication_send: z.enum(['header', 'bearer', 'data']).optional().describe('How to send authentication data (default: data): - header: as header field - bearer: as Bearer token in Authorization header - data: as data field (in body or query string)'),
            authentication_send_header: z.string().optional().describe('name of header field to send authentication data in, required if authentication is set to key and authentication_send is set to header'),
            authentication_send_data: z.string().optional().describe('name of data field to send authentication data in, required if authentication is set to key and authentication_send is set to data'),
            authentication_key: z.string().optional().describe('secret key (or password) to use for authentication, required if authentication is set to key'),
            authentication_key_custom: z.string().optional().describe('custom field name to use as the authentication key, required if authentication is set to key, mutually exclusive with authentication_key'),
            extra_data: z.string().optional().describe('additional data (as JSON encoded string) to send with the webhook notification'),
            retry: z.enum(['none', 'error']).optional().describe('How to retry webhook notifications on failure (default: error): - none: no retry - error: delayed retry on any error'),
        }),
        outputSchema: z.object({
            organization: z.string().describe('organization identification string'),
            webhook: z.string().describe('webhook identification string'),
        }),
    },
    // PATCH /organization:webhook - Update organizational webhook
    {
        name: 'edubase_patch_organization_webhook',
        description: "Update organizational webhook.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
            webhook: z.string().describe('webhook identification string'),
            active: z.boolean().optional().describe('enable or disable webhook'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // DELETE /organization:webhook - Remove webhook from organization
    {
        name: 'edubase_delete_organization_webhook',
        description: "Remove organizational webhook.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
            webhook: z.string().describe('webhook identification string'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // POST /organization:webhook:trigger - Trigger an organizational webhook call with optional custom payload
    {
        name: 'edubase_post_organization_webhook_trigger',
        description: "Trigger an organizational webhook call with optional custom payload. Only triggers webhooks with **trigger_event** set to `api`!.",
        inputSchema: z.object({
            organization: z.string().describe('organization identification string'),
            webhook: z.string().describe('webhook identification string'),
            data: z.string().optional().describe('custom payload data to be sent with the webhook call, must be a valid JSON string'),
        }),
        outputSchema: z.object({}).optional(),
    },
];
