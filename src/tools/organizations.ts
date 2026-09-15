import * as z from 'zod/v4';

export const EDUBASE_API_TOOLS_ORGANIZATIONS = [
	// GET /organizations - List owned and managed organizations
	{
		name: 'edubase_get_organizations',
		description: "List owned and managed organizations. Returns organization identification strings, external identifiers and titles.",
		inputSchema: z.object({
			search: z.string().optional().describe('search string to filter results'),
			limit: z.number().int().optional().describe('limit number of results (default: 16)'),
			page: z.number().int().optional().describe('page number (default: 1), not used in search mode!'),
		}),
		outputSchema: z.object({
			organizations: z.array(z.object({
				organization: z.string().describe('organization identification string'),
				id: z.string().nullable().optional().describe('external unique organization identifier (if set for the organization)'),
				title: z.string().describe('title of the organization'),
			})),
		}),
	},

	// GET /organization - Get/check organization
	{
		name: 'edubase_get_organization',
		description: "Get the details of an organization: title, external identifier and description.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
		}),
		outputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			id: z.string().nullable().optional().describe('external unique organization identifier (if set for the organization)'),
			title: z.string().describe('title of the organization'),
			description: z.string().optional().describe('short description of the organization (only present if set for the organization)'),
		}),
	},

	// POST /organization - Create an organization
	{
		name: 'edubase_post_organization',
		description: "Create an organization with a title and optional description, website, contact details and custom fields. Returns the organization identification string.",
		inputSchema: z.object({
			title: z.string().describe('title of the organization'),
			description: z.string().optional().describe('optional short description'),
			domain: z.string().optional().describe('domain name (FQDN) for the organization without www prefix, needs special privileges to set!'),
			website: z.url().optional().describe('homepage URL'),
			email: z.email().optional().describe('contact email address'),
			phone: z.string().optional().describe('contact phone number'),
			custom: z.record(z.string(), z.string()).optional().describe('custom field data, keyed by field name (sent as `custom_{field}`), only if the specified field is configured for the target EduBase instance'),
		}),
		outputSchema: z.object({
			organization: z.string().describe('organization identification string'),
		}),
	},

	// PATCH /organization - Update organization
	{
		name: 'edubase_patch_organization',
		description: "Update the title or custom fields of an organization.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			title: z.string().min(1).max(255).optional().describe('title of the organization'),
			custom: z.record(z.string(), z.string()).optional().describe('custom field data, keyed by field name (sent as `custom_{field}`), only if the specified field is configured for the target EduBase instance'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// DELETE /organization - Remove organization
	{
		name: 'edubase_delete_organization',
		description: "Remove an organization. Confirm with the user first.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /organization:members - List all members in an organization
	{
		name: 'edubase_get_organization_members',
		description: "List the members of an organization, with their names, departments and permission levels (to the organization, its contents and its members).",
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
					members: z.string().describe('permission level to members in organization'),
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
			department: z.string().optional().describe('optional name of department (or its external identifier if no department has this name), the competency assignments of the members moved to another department are updated, the competencies they only had through their previous department are lost'),
			permission_organization: z.enum(['member', 'teacher', 'reporter', 'supervisor', 'admin']).optional().describe('optional permission level to organization (member / teacher / reporter / supervisor / admin) (default: member)'),
			permission_content: z.enum(['none', 'view', 'report', 'control', 'modify', 'grant', 'admin']).optional().describe('optional permission level to contents in organization (none / view / report / control / modify / grant / admin) (default: none)'),
			permission_members: z.enum(['none', 'department', 'organization']).optional().describe('optional permission level to members in organization (none / department / organization) (default: none)'),
			notify: z.boolean().optional().describe('notify users (default: false)'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// DELETE /organization:members - Remove user(s) from an organization
	{
		name: 'edubase_delete_organization_members',
		description: "Remove users from an organization by their user identification strings.",
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
			department: z.string().optional().describe('optional name of department (or its external identifier if no department has this name), the competency assignments of the members moved to another department are updated, the competencies they only had through their previous department are lost'),
			permission_organization: z.enum(['member', 'teacher', 'reporter', 'supervisor', 'admin']).optional().describe('optional permission level to organization (member / teacher / reporter / supervisor / admin) (default: member)'),
			permission_content: z.enum(['none', 'view', 'report', 'control', 'modify', 'grant', 'admin']).optional().describe('optional permission level to contents in organization (none / view / report / control / modify / grant / admin) (default: none)'),
			permission_members: z.enum(['none', 'department', 'organization']).optional().describe('optional permission level to members in organization (none / department / organization) (default: none)'),
			notify: z.boolean().optional().describe('notify users (default: false)'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /organization:departments - List all departments in an organization
	{
		name: 'edubase_get_organization_departments',
		description: "List all departments in an organization, ordered by their hierarchy.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
		}),
		outputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			departments: z.array(z.object({
				department: z.string().describe('name of the department'),
				id: z.string().nullable().optional().describe('external unique department identifier (if set for the department)'),
				parent: z.string().nullable().optional().describe('name of the parent department (null for root level departments)'),
				level: z.number().int().describe('depth of the department within the hierarchy (0 for root level departments)'),
				permission: z.object({
					organization: z.string().describe('permission level to organization'),
					content: z.string().describe('permission level to contents in organization'),
					members: z.string().describe('permission level to members in organization'),
				}).describe('permissions given to the members of the department'),
				members: z.number().int().describe('number of (visible) members in the department'),
				leaders: z.array(z.object({
					user: z.string().describe('user identification string'),
					name: z.string().describe('name of the leader'),
				})).describe('leaders of the department'),
			})),
		}),
	},

	// GET /organization:department - Get/check department of an organization
	{
		name: 'edubase_get_organization_department',
		description: "Get a department of an organization, identified by its name or external identifier: its parent, level in the hierarchy and the permissions given to its members.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			department: z.string().describe('name of the department (or its external identifier if no department has this name)'),
		}),
		outputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			department: z.string().describe('name of the department'),
			id: z.string().nullable().optional().describe('external unique department identifier (if set for the department)'),
			parent: z.string().nullable().optional().describe('name of the parent department (null for root level departments)'),
			level: z.number().int().describe('depth of the department within the hierarchy (0 for root level departments)'),
			permission: z.object({
				organization: z.string().describe('permission level to organization'),
				content: z.string().describe('permission level to contents in organization'),
				members: z.string().describe('permission level to members in organization'),
			}).describe('permissions given to the members of the department'),
			members: z.number().int().describe('number of (visible) members in the department'),
			leaders: z.array(z.object({
				user: z.string().describe('user identification string'),
				name: z.string().describe('name of the leader'),
			})).describe('leaders of the department'),
		}),
	},

	// POST /organization:department - Create a department in an organization
	{
		name: 'edubase_post_organization_department',
		description: "Create a department in an organization. Members of a department can see the members of the departments below it, but permissions are not inherited.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			title: z.string().min(1).max(255).describe('name of the department, must be unique within the organization'),
			id: z.string().max(64).optional().describe('optional external unique department identifier'),
			parent: z.string().optional().describe('optional name (or external identifier) of the parent department'),
			permission_organization: z.enum(['member', 'teacher', 'reporter', 'supervisor', 'admin']).optional().describe('optional permission level to organization given to the members (member / teacher / reporter / supervisor / admin) (default: member)'),
			permission_content: z.enum(['none', 'view', 'report', 'control', 'modify', 'grant', 'admin']).optional().describe('optional permission level to contents in organization given to the members (none / view / report / control / modify / grant / admin) (default: none)'),
			permission_members: z.enum(['none', 'department', 'organization']).optional().describe('optional permission level to members in organization given to the members (none / department / organization) (default: none)'),
			leaders: z.string().optional().describe('optional comma-separated list of user identification strings of the leaders (must be members of the organization, maximum 5)'),
		}),
		outputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			department: z.string().describe('name of the department'),
			id: z.string().nullable().optional().describe('external unique department identifier (if set for the department)'),
		}),
	},

	// PATCH /organization:department - Update department of an organization
	{
		name: 'edubase_patch_organization_department',
		description: "Update department of an organization. Changed permissions are applied to every member of the department.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			department: z.string().describe('name of the department (or its external identifier if no department has this name)'),
			title: z.string().min(1).max(255).optional().describe('new name of the department, must be unique within the organization'),
			id: z.string().max(64).optional().describe('external unique department identifier, empty string removes it'),
			parent: z.string().optional().describe('name (or external identifier) of the parent department, empty string moves the department to the root level, the department itself or a department below it cannot be the parent'),
			permission_organization: z.enum(['member', 'teacher', 'reporter', 'supervisor', 'admin']).optional().describe('permission level to organization given to the members (member / teacher / reporter / supervisor / admin)'),
			permission_content: z.enum(['none', 'view', 'report', 'control', 'modify', 'grant', 'admin']).optional().describe('permission level to contents in organization given to the members (none / view / report / control / modify / grant / admin)'),
			permission_members: z.enum(['none', 'department', 'organization']).optional().describe('permission level to members in organization given to the members (none / department / organization)'),
			leaders: z.string().optional().describe('comma-separated list of user identification strings of the leaders (must be members of the organization, maximum 5), replaces the current leaders, empty string removes every leader'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// DELETE /organization:department - Remove department from an organization
	{
		name: 'edubase_delete_organization_department',
		description: "Remove department from an organization. Members of the department are left without a department and lose the permissions and competencies given by it, departments below it are moved one level up.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			department: z.string().describe('name of the department (or its external identifier if no department has this name)'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /organization:competencies - List all competencies of an organization
	{
		name: 'edubase_get_organization_competencies',
		description: "List all competencies of an organization. Library and competencies must be enabled for the organization.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
		}),
		outputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			competencies: z.array(z.object({
				competency: z.string().describe('competency identification string'),
				id: z.string().nullable().optional().describe('external unique competency identifier (if set for the competency)'),
				title: z.string().describe('title of the competency'),
				description: z.string().nullable().optional().describe('description of the competency (if set)'),
				requirements: z.number().int().describe('number of requirements'),
				documents: z.number().int().describe('number of library documents attached'),
				assignments: z.object({
					all: z.boolean().describe('assigned to every member of the organization'),
					departments: z.number().int().describe('number of departments assigned to'),
					members: z.number().int().describe('number of members assigned to individually'),
				}),
				assigned: z.number().int().describe('number of visible members assigned to the competency'),
				status: z.object({
					completed: z.number().int().describe('completed'),
					progress: z.number().int().describe('in progress'),
					waiting: z.number().int().describe('waiting for completion'),
					expired: z.number().int().describe('expired'),
					due: z.number().int().describe('due soon'),
					overdue: z.number().int().describe('past the deadline'),
					outdated: z.number().int().describe('outdated'),
				}).describe('number of assigned members by their competency status'),
			})),
		}),
	},

	// GET /organization:competency:requirements - List the requirements of a competency
	{
		name: 'edubase_get_organization_competency_requirements',
		description: "List the requirements of a competency, ordered by their priority. Library and competencies must be enabled for the organization of the competency.",
		inputSchema: z.object({
			competency: z.string().describe('competency identification string (or its external identifier when organization is specified)'),
			organization: z.string().optional().describe('optional organization identification string'),
		}),
		outputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			competency: z.string().describe('competency identification string'),
			id: z.string().nullable().optional().describe('external unique competency identifier (if set for the competency)'),
			title: z.string().describe('title of the competency'),
			requirements: z.array(z.object({
				requirement: z.string().describe('requirement identification string'),
				title: z.string().nullable().describe('title of the requirement'),
				type: z.enum(['exam', 'class', 'document', 'todo']).describe('type of the requirement'),
				optional: z.boolean().describe('requirement is optional'),
				description: z.string().optional().describe('description of the requirement (only present if set for the requirement)'),
				deadline: z.object({
					type: z.enum(['date', 'days']).describe('type of the deadline'),
					date: z.string().optional().describe('fixed deadline (only if type is date)'),
					days: z.number().int().optional().describe('number of days available to complete the requirement (only if type is days)'),
				}).optional().describe('deadline of the requirement (only present if a deadline is configured)'),
				exam: z.object({
					exam: z.string().describe('exam identification string'),
					id: z.string().nullable().optional().describe('external unique exam identifier (if set for the exam)'),
					title: z.string().describe('title of the exam'),
				}).nullable().optional().describe('the required exam (only present if type is exam, null if the exam is not available)'),
				class: z.object({
					class: z.string().describe('class identification string'),
					id: z.string().nullable().optional().describe('external unique class identifier (if set for the class)'),
					title: z.string().describe('title of the class'),
				}).nullable().optional().describe('the required class (only present if type is class, null if the class is not available)'),
				document: z.object({
					document: z.string().describe('document identification string'),
					prefix: z.string().nullable().optional().describe('prefix of the document'),
					title: z.string().describe('title of the document'),
					archived: z.boolean().describe('document is archived'),
				}).nullable().optional().describe('the required library document (only present if type is document, null if the document is not available)'),
				todo: z.object({
					type: z.enum(['default', 'document', 'exam', 'training']).describe('type of the task'),
					attachments: z.boolean().describe('attachments can be uploaded'),
					educators: z.array(z.object({
						user: z.string().describe('user identification string'),
						name: z.string().describe('name of the educator'),
					})).optional().describe('educators of the training (only present if type is training, visible users only)'),
					fields: z.array(z.string()).optional().describe('labels of the fields to fill (only present if type is default)'),
				}).optional().describe('the required task (only present if type is todo)'),
				documents: z.array(z.string()).optional().describe('identification strings of the library documents attached to the requirement (only present if there are any)'),
			})).describe('requirements ordered by their priority'),
		}),
	},

	// GET /organization:compliance - Get the competency compliance overview of an organization
	{
		name: 'edubase_get_organization_compliance',
		description: "Get the competency compliance overview of an organization, grouped by departments. Organization reporters see every visible member, department leaders only the members of the departments they lead. Library and competencies must be enabled for the organization.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
		}),
		outputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			scope: z.enum(['organization', 'departments']).describe('scope of the overview: organization (whole organization) / departments (only the departments led by the user)'),
			competencies: z.array(z.object({
				competency: z.string().describe('competency identification string'),
				id: z.string().nullable().optional().describe('external unique competency identifier (if set for the competency)'),
				title: z.string().describe('title of the competency'),
			})).describe('competencies with any assigned member within the scope'),
			departments: z.array(z.object({
				department: z.string().nullable().describe('name of the department (null for the members without a department, in organization scope only)'),
				id: z.string().nullable().optional().describe('external unique department identifier (if set for the department)'),
				parent: z.string().nullable().optional().describe('name of the parent department (null for root level departments)'),
				level: z.number().int().describe('depth of the department within the hierarchy (0 for root level departments)'),
				members: z.number().int().describe('number of members in the department'),
				competencies: z.array(z.object({
					competency: z.string().describe('competency identification string'),
					assigned: z.number().int().describe('number of members assigned to the competency'),
					status: z.object({
						completed: z.number().int().describe('completed'),
						progress: z.number().int().describe('in progress'),
						waiting: z.number().int().describe('waiting for completion'),
						expired: z.number().int().describe('expired'),
						due: z.number().int().describe('due soon'),
						overdue: z.number().int().describe('past the deadline'),
						outdated: z.number().int().describe('outdated'),
					}).describe('number of assigned members by their competency status'),
				})).describe('competency statistics of the department (only competencies with assigned members are listed)'),
			})).describe('departments with any member or progress within the scope, ordered by their hierarchy'),
			assigned: z.number().int().describe('total number of competency assignments within the scope'),
			status: z.object({
				completed: z.number().int().describe('completed'),
				progress: z.number().int().describe('in progress'),
				waiting: z.number().int().describe('waiting for completion'),
				expired: z.number().int().describe('expired'),
				due: z.number().int().describe('due soon'),
				overdue: z.number().int().describe('past the deadline'),
				outdated: z.number().int().describe('outdated'),
			}).describe('total number of competency assignments by their status'),
		}),
	},

	// GET /user:organizations - List all organizations a user is member of
	{
		name: 'edubase_get_user_organizations',
		description: "List the organizations a user is member of, with their titles, links, the department of the user and the permission levels.",
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
		}),
		outputSchema: z.object({
			organizations: z.array(z.object({
				organization: z.string().describe('organization identification string'),
				id: z.string().nullable().optional().describe('external unique organization identifier (if set for the organization)'),
				title: z.string().describe('title of the organization'),
				link: z.string().describe('link to the organization manager page'),
				department: z.string().nullable().optional().describe('name of the department (if member)'),
				permission: z.object({
					organization: z.string().describe('permission level to organization'),
					content: z.string().describe('permission level to contents in organization'),
					members: z.string().describe('permission level to members in organization'),
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
			department: z.string().optional().describe('optional name of department (or its external identifier if no department has this name), the competency assignments of the members moved to another department are updated, the competencies they only had through their previous department are lost'),
			permission_organization: z.enum(['member', 'teacher', 'reporter', 'supervisor', 'admin']).optional().describe('optional permission level to organization (member / teacher / reporter / supervisor / admin) (default: member)'),
			permission_content: z.enum(['none', 'view', 'report', 'control', 'modify', 'grant', 'admin']).optional().describe('optional permission level to contents in organization (none / view / report / control / modify / grant / admin) (default: none)'),
			permission_members: z.enum(['none', 'department', 'organization']).optional().describe('optional permission level to members in organization (none / department / organization) (default: none)'),
			notify: z.boolean().optional().describe('notify user (default: false)'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// DELETE /user:organizations - Remove user from organization(s)
	{
		name: 'edubase_delete_user_organizations',
		description: "Remove a user from organizations by their organization identification strings.",
		inputSchema: z.object({
			user: z.string().describe('user identification string'),
			organizations: z.string().describe('comma-separated list of organization identification strings'),
		}),
		outputSchema: z.object({}).optional(),
	},

	// GET /organization:webhook - Get/check webhook configured in organization
	{
		name: 'edubase_get_organization_webhook',
		description: "Get a webhook of an organization: its title and whether it is active.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			webhook: z.string().describe('webhook identification string'),
		}),
		outputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			webhook: z.string().describe('webhook identification string'),
			title: z.string().describe('title of the webhook'),
			active: z.boolean().describe('webhook is active'),
		}),
	},

	// POST /organization:webhook - Create a webhook for an organization
	{
		name: 'edubase_post_organization_webhook',
		description: "Create a webhook for an organization, called on exam results, Quiz practice results or manual API triggers, with optional authentication and retries. Returns the webhook identification string. Test it with edubase_post_organization_webhook_trigger.",
		inputSchema: z.object({
			organization: z.string().describe('organization identification string'),
			title: z.string().describe('title of the webhook'),
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
		description: "Enable or disable a webhook of an organization.",
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
		description: "Remove a webhook from an organization, no more notifications are sent to its endpoint. Use edubase_patch_organization_webhook to only disable it.",
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
