import { Tool } from "@modelcontextprotocol/sdk/types.js";

/* Tool definitions */
export const EDUBASE_API_TOOLS_INTEGRATIONS: Tool[] = [
	// GET /integrations - List owned and managed integrations
	{
		name: 'edubase_get_integrations',
		description: "List owned and managed integrations.",
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

	// GET /integration - Get/check integration
	{
		name: 'edubase_get_integration',
		description: "Get/check integration.",
		inputSchema: {
			type: 'object',
			properties: {
				integration: {
					type: 'string',
					description: 'integration identification string',
				},
			},
			required: ['integration'],
		},
	},

	// POST /integration - Create a new API or LMS integration
	{
		name: 'edubase_post_integration',
		description: "Create a new API or LMS integration.",
		inputSchema: {
			type: 'object',
			properties: {
				title: {
					type: 'string',
					description: 'title of the integration',
				},
				description: {
					type: 'string',
					description: 'optional short description',
				},
				type: {
					type: 'string',
					description: 'type of the integration (api / moodle / canvas / d2l / schoology / lms)',
				},
				lti: {
					type: 'string',
					description: 'LTI version (1.0/1.1 / 1.3), only necessary for LMS integrations!',
				},
				platform: {
					type: 'string',
					description: 'LMS platform URL, only necessary for LMS integrations!',
				},
			},
			required: ['title'],
		},
	},

	// PATCH /integration - Update integration
	{
		name: 'edubase_patch_integration',
		description: "Update integration.",
		inputSchema: {
			type: 'object',
			properties: {
				integration: {
					type: 'string',
					description: 'integration identification string',
				},
				active: {
					type: 'boolean',
					description: 'enable or disable the integration',
				},
			},
			required: ['integration'],
		},
	},

	// DELETE /integration - Remove integration
	{
		name: 'edubase_delete_integration',
		description: "Remove integration.",
		inputSchema: {
			type: 'object',
			properties: {
				integration: {
					type: 'string',
					description: 'integration identification string',
				},
			},
			required: ['integration'],
		},
	},

	// GET /integration:keys - Get integration keys/secrets
	{
		name: 'edubase_get_integration_keys',
		description: "Get integration keys/secrets.",
		inputSchema: {
			type: 'object',
			properties: {
				integration: {
					type: 'string',
					description: 'integration identification string',
				},
			},
			required: ['integration'],
		},
	},

	// POST /integration:keys - Rotate integration keys/secrets
	{
		name: 'edubase_post_integration_keys',
		description: "Rotate integration keys/secrets.",
		inputSchema: {
			type: 'object',
			properties: {
				integration: {
					type: 'string',
					description: 'integration identification string',
				},
			},
			required: ['integration'],
		},
	},
];

/* Output schema definitions */
export const EDUBASE_API_TOOLS_INTEGRATIONS_OUTPUT_SCHEMA: object = {
	// GET /integrations - List owned and managed integrations
	edubase_get_integrations: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				integration: {
					type: 'string',
					description: 'integration identification string',
				},
				id: {
					type: 'string',
					description: 'external unique integration identifier (if set for the integration)',
				},
				name: {
					type: 'string',
					description: 'title of the integration',
				},
			},
		},
	},

	// GET /integrations - Get/check integration
	edubase_get_integration: {
		type: 'object',
		properties: {
			integration: {
				type: 'string',
				description: 'integration identification string',
			},
			id: {
				type: 'string',
				description: 'external unique integration identifier (if set for the integration)',
			},
			name: {
				type: 'string',
				description: 'title of the integration',
			},
			type: {
				type: 'string',
				description: 'type of the integration',
			},
			active: {
				type: 'boolean',
				description: 'integration is active',
			},
			lti: {
				type: 'string',
				description: 'LTI version, only present if the integration is an LMS',
			},
		},
	},

	// PATCH /integration - Update integration
	edubase_patch_integration: {},

	// DELETE /integration - Remove integration
	edubase_delete_integration: {},

	// GET /integration:keys - Get integration keys/secrets
	edubase_get_integration_keys: {
		type: 'object',
		properties: {
			app: {
				type: 'string',
				description: 'API application identification string, only present if the integration is an API integration',
			},
			consumer: {
				type: 'string',
				description: 'consumer key, only present if the integration is an LMS integration using LTI 1.0/1.1',
			},
			secret: {
				type: 'string',
				description: 'secret key, only present if the integration is an API integration or an LMS integration using LTI 1.0/1.1',
			},
			jwk: {
				type: 'string',
				description: 'URL for the JWK (JSON Web Key) set, only present if the integration is an LMS integration using LTI 1.3',
			},
			pem: {
				type: 'string',
				description: 'PEM formatted public key, only present if the integration is an LMS integration using LTI 1.3',
			},
		},
	},

	// POST /integration:keys - Rotate integration keys/secrets
	edubase_post_integration_keys: {
		type: 'object',
		properties: {
			app: {
				type: 'string',
				description: 'API application identification string, only present if the integration is an API integration',
			},
			consumer: {
				type: 'string',
				description: 'consumer key, only present if the integration is an LMS integration using LTI 1.0/1.1',
			},
			secret: {
				type: 'string',
				description: 'secret key, only present if the integration is an API integration or an LMS integration using LTI 1.0/1.1',
			},
			jwk: {
				type: 'string',
				description: 'URL for the JWK (JSON Web Key) set, only present if the integration is an LMS integration using LTI 1.3',
			},
			pem: {
				type: 'string',
				description: 'PEM formatted public key, only present if the integration is an LMS integration using LTI 1.3',
			},
		},
	},
};
