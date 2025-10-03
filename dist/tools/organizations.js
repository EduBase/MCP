/* Tool definitions */
export const EDUBASE_API_TOOLS_ORGANIZATIONS = [
    // GET /organizations - List owned and managed organizations
    {
        name: 'edubase_get_organizations',
        description: "List owned and managed organizations.",
        inputSchema: {
            type: 'object',
            properties: {
                search: {
                    type: 'string',
                    description: 'search string to filter results',
                },
                limit: {
                    type: 'number',
                    description: 'limit number of results (default: 16)',
                },
                page: {
                    type: 'number',
                    description: 'page number (default: 1), not used in search mode!',
                },
            },
            required: [],
        },
    },
    // GET /organization - Get/check organization
    {
        name: 'edubase_get_organization',
        description: "Get/check organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
            },
            required: ['organization'],
        },
    },
    // POST /organization - Create an organization
    {
        name: 'edubase_post_organization',
        description: "Create an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'title of the organization',
                },
                description: {
                    type: 'string',
                    description: 'optional short description',
                },
                domain: {
                    type: 'string',
                    description: 'domain name (FQDN) for the organization without www prefix, needs special privileges to set!',
                },
                website: {
                    type: 'string',
                    description: 'homepage URL',
                },
                email: {
                    type: 'string',
                    description: 'contact email address',
                },
                phone: {
                    type: 'string',
                    description: 'contact phone number',
                },
            },
            required: ['name'],
        },
    },
    // PATCH /organization - Update organization
    {
        name: 'edubase_patch_organization',
        description: "Update organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
            },
            required: ['organization'],
        },
    },
    // DELETE /organization - Remove organization
    {
        name: 'edubase_delete_organization',
        description: "Remove organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
            },
            required: ['organization'],
        },
    },
    // GET /organization:members - List all members in an organization
    {
        name: 'edubase_get_organization_members',
        description: "List all members in an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
            },
            required: ['organization'],
        },
    },
    // POST /organization:members - Assign user(s) to an organization
    {
        name: 'edubase_post_organization_members',
        description: "Assign user(s) to an organization. Updates memberships if already member of the organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
                users: {
                    type: 'string',
                    description: 'comma-separated list of user identification strings',
                },
                department: {
                    type: 'string',
                    description: 'optional name of department',
                },
                permission_organization: {
                    type: 'string',
                    description: 'optional permission level to organization (member / teacher / reporter / supervisor / admin) (default: member)',
                },
                permission_content: {
                    type: 'string',
                    description: 'optional permission level to contents in organization (none / view / report / control / modify / grant / admin) (default: none)',
                },
                notify: {
                    type: 'boolean',
                    description: 'notify users (default: false)',
                },
            },
            required: ['organization', 'users'],
        },
    },
    // DELETE /organization:members - Remove user(s) from an organization
    {
        name: 'edubase_delete_organization_members',
        description: "Remove user(s) from an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
                users: {
                    type: 'string',
                    description: 'comma-separated list of user identification strings',
                },
            },
            required: ['organization', 'users'],
        },
    },
    // POST /organizations:members - Assign user(s) to organization(s)
    {
        name: 'edubase_post_organizations_members',
        description: "Assign user(s) to organization(s). Updates memberships if already member of an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organizations: {
                    type: 'string',
                    description: 'comma-separated list of organization identification strings',
                },
                users: {
                    type: 'string',
                    description: 'comma-separated list of user identification strings',
                },
                department: {
                    type: 'string',
                    description: 'optional name of department',
                },
                permission_organization: {
                    type: 'string',
                    description: 'optional permission level to organization (member / teacher / reporter / supervisor / admin) (default: member)',
                },
                permission_content: {
                    type: 'string',
                    description: 'optional permission level to contents in organization (none / view / report / control / modify / grant / admin) (default: none)',
                },
                notify: {
                    type: 'boolean',
                    description: 'notify users (default: false)',
                },
            },
            required: ['organizations', 'users'],
        },
    },
    // GET /user:organizations - List all organizations a user is member of
    {
        name: 'edubase_get_user_organizations',
        description: "List all organizations a user is member of.",
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
    // POST /user:organizations - Assign user to organization(s)
    {
        name: 'edubase_post_user_organizations',
        description: "Assign user to organization(s). Updates membership if already member of an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                user: {
                    type: 'string',
                    description: 'user identification string',
                },
                organizations: {
                    type: 'string',
                    description: 'comma-separated list of organization identification strings',
                },
                department: {
                    type: 'string',
                    description: 'optional name of department',
                },
                permission_organization: {
                    type: 'string',
                    description: 'optional permission level to organization (member / teacher / reporter / supervisor / admin) (default: member)',
                },
                permission_content: {
                    type: 'string',
                    description: 'optional permission level to contents in organization (none / view / report / control / modify / grant / admin) (default: none)',
                },
                notify: {
                    type: 'boolean',
                    description: 'notify user (default: false)',
                },
            },
            required: ['user', 'organizations'],
        },
    },
    // DELETE /user:organizations - Remove user from organization(s)
    {
        name: 'edubase_delete_user_organizations',
        description: "Remove user from organization(s).",
        inputSchema: {
            type: 'object',
            properties: {
                user: {
                    type: 'string',
                    description: 'user identification string',
                },
                organizations: {
                    type: 'string',
                    description: 'comma-separated list of organization identification strings',
                },
            },
            required: ['user', 'organizations'],
        },
    },
    // GET /organization:webhook - Get/check webhook configured in organization
    {
        name: 'edubase_get_organization_webhook',
        description: "Get/check webhook configured in organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
                webhook: {
                    type: 'string',
                    description: 'webhook identification string',
                },
            },
            required: ['organization', 'webhook'],
        },
    },
    // POST /organization:webhook - Create a webhook for an organization
    {
        name: 'edubase_post_organization_webhook',
        description: "Create a webhook for an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
                name: {
                    type: 'string',
                    description: 'title of the webhook',
                },
                trigger_event: {
                    type: 'string',
                    description: "Type of event to trigger webhook:\n" +
                        "- exam-play-result: triggers when a user (must be member of the organization) completes an exam in the organization\n" +
                        "- quiz-play-result: triggers when a user (must be member of the organization) completes a quiz in practice mode in the organization\n" +
                        "- api: triggers when a manual API call is made (useful for testing and debugging)",
                },
                endpoint: {
                    type: 'string',
                    description: 'URL to send webhook notifications to',
                },
                method: {
                    type: 'string',
                    description: "HTTP method to use for webhook notifications (default: POST)\n" +
                        "- POST\n" +
                        "- GET",
                },
                authentication: {
                    type: 'string',
                    description: "Type of authentication (default: none):\n" +
                        "- none: no authentication\n" +
                        "- key: use a secret key (or password) for authentication",
                },
                authentication_send: {
                    type: 'string',
                    description: "How to send authentication data (default: data):\n" +
                        "- header: as header field\n" +
                        "- bearer: as Bearer token in Authorization header\n" +
                        "- data: as data field (in body or query string)",
                },
                authentication_send_header: {
                    type: 'string',
                    description: 'name of header field to send authentication data in, required if authentication is set to key and authentication_send is set to header',
                },
                authentication_send_data: {
                    type: 'string',
                    description: 'name of data field to send authentication data in, required if authentication is set to key and authentication_send is set to data',
                },
                authentication_key: {
                    type: 'string',
                    description: 'secret key (or password) to use for authentication, required if authentication is set to key',
                },
                authentication_key_custom: {
                    type: 'string',
                    description: 'custom field name to use as the authentication key, required if authentication is set to key, mutually exclusive with authentication_key',
                },
                extra_data: {
                    type: 'string',
                    description: 'additional data (as JSON encoded string) to send with the webhook notification',
                },
                retry: {
                    type: 'string',
                    description: "How to retry webhook notifications on failure (default: error):\n" +
                        "- none: no retry\n" +
                        "- error: delayed retry on any error",
                },
            },
            required: ['organization', 'name', 'trigger_event', 'endpoint'],
        },
    },
    // PATCH /organization:webhook - Update organizational webhook
    {
        name: 'edubase_patch_organization_webhook',
        description: "Update organizational webhook.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
                webhook: {
                    type: 'string',
                    description: 'webhook identification string',
                },
                active: {
                    type: 'boolean',
                    description: 'enable or disable webhook',
                },
            },
            required: ['organization', 'webhook'],
        },
    },
    // DELETE /organization:webhook - Remove webhook from organization
    {
        name: 'edubase_delete_organization_webhook',
        description: "Remove organizational webhook.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
                webhook: {
                    type: 'string',
                    description: 'webhook identification string',
                },
            },
            required: ['organization', 'webhook'],
        },
    },
    // POST /organization:webhook:trigger - Trigger an organizational webhook call with optional custom payload
    {
        name: 'edubase_post_organization_webhook_trigger',
        description: "Trigger an organizational webhook call with optional custom payload. Only triggers webhooks with **trigger_event** set to `api`!.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
                webhook: {
                    type: 'string',
                    description: 'webhook identification string',
                },
                data: {
                    type: 'string',
                    description: 'custom payload data to be sent with the webhook call, must be a valid JSON string',
                },
            },
            required: ['organization', 'webhook'],
        },
    },
];
/* Output schema definitions */
export const EDUBASE_API_TOOLS_ORGANIZATIONS_OUTPUT_SCHEMA = {
    // GET /organizations - List owned and managed organizations
    edubase_get_organizations: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
                id: {
                    type: 'string',
                    description: 'external unique organization identifier (if set for the organization)',
                },
                name: {
                    type: 'string',
                    description: 'title of the organization',
                },
            },
        },
    },
    // GET /organization - Get/check organization
    edubase_get_organization: {
        type: 'object',
        properties: {
            organization: {
                type: 'string',
                description: 'organization identification string',
            },
            id: {
                type: 'string',
                description: 'external unique organization identifier (if set for the organization)',
            },
            name: {
                type: 'string',
                description: 'title of the organization',
            },
        },
    },
    // POST /organization - Create an organization
    edubase_post_organization: {
        type: 'object',
        properties: {
            organization: {
                type: 'string',
                description: 'organization identification string',
            },
        },
    },
    // PATCH /organization - Update organization
    edubase_patch_organization: {},
    // DELETE /organization - Remove organization
    edubase_delete_organization: {},
    // GET /organization:members - List all members in an organization
    edubase_get_organization_members: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                user: {
                    type: 'string',
                    description: 'user identification string',
                },
                name: {
                    type: 'string',
                    description: 'name of the member',
                },
                department: {
                    type: 'string',
                    description: 'name of the department (if member)',
                },
                permission: {
                    type: 'array',
                    items: {
                        organization: {
                            type: 'string',
                            description: 'permission level to organization',
                        },
                        content: {
                            type: 'string',
                            description: 'permission level to contents in organization',
                        },
                    },
                },
            },
        },
    },
    // POST /organization:members - Assign user(s) to an organization
    edubase_post_organization_members: {},
    // DELETE /organization:members - Remove user(s) from an organization
    edubase_delete_organization_members: {},
    // POST /organizations:members - Assign user(s) to organization(s)
    edubase_post_organizations_members: {},
    // GET /user:organizations - List all organizations a user is member of
    edubase_get_user_organizations: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string',
                },
                id: {
                    type: 'string',
                    description: 'external unique organization identifier (if set for the organization)',
                },
                name: {
                    type: 'string',
                    description: 'title of the organization',
                },
                link: {
                    type: 'string',
                    description: 'link to the organization manager page',
                },
                department: {
                    type: 'string',
                    description: 'name of the department (if member)',
                },
                permission: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            organization: {
                                type: 'string',
                                description: 'permission level to organization',
                            },
                            content: {
                                type: 'string',
                                description: 'permission level to contents in organization',
                            },
                        },
                    },
                },
            },
        },
    },
    // POST /user:organizations - Assign user to organization(s)
    edubase_post_user_organizations: {},
    // DELETE /user:organizations - Remove user from organization(s)
    edubase_delete_user_organizations: {},
    // GET /organization:webhook - Get/check webhook configured in organization
    edubase_get_organization_webhook: {
        type: 'object',
        properties: {
            organization: {
                type: 'string',
                description: 'organization identification string',
            },
            webhook: {
                type: 'string',
                description: 'webhook identification string',
            },
            name: {
                type: 'string',
                description: 'title of the webhook',
            },
            active: {
                type: 'boolean',
                description: 'webhook is active',
            },
        },
    },
    // POST /organization:webhook - Create a webhook for an organization
    edubase_post_organization_webhook: {
        type: 'object',
        properties: {
            organization: {
                type: 'string',
                description: 'organization identification string',
            },
            webhook: {
                type: 'string',
                description: 'webhook identification string',
            },
        },
    },
    // PATCH /organization:webhook - Update organizational webhook
    edubase_patch_organization_webhook: {},
    // DELETE /organization:webhook - Remove webhook from organization
    edubase_delete_organization_webhook: {},
    // POST /organization:webhook:trigger - Trigger an organizational webhook call with optional custom payload
    edubase_post_organization_webhook_trigger: {},
};
