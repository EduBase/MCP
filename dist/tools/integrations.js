import * as z from 'zod/v4';
export const EDUBASE_API_TOOLS_INTEGRATIONS = [
    // GET /integrations - List owned and managed integrations
    {
        name: 'edubase_get_integrations',
        description: "List owned and managed integrations.",
        inputSchema: z.object({
            search: z.string().optional().describe('search string to filter results'),
            limit: z.number().optional().describe('limit number of results (default: 16)'),
            page: z.number().optional().describe('page number (default: 1), not used in search mode!'),
        }),
        outputSchema: z.array(z.object({
            integration: z.string().describe('integration identification string'),
            id: z.string().optional().describe('external unique integration identifier (if set for the integration)'),
            name: z.string().describe('title of the integration'),
        })),
    },
    // GET /integration - Get/check integration
    {
        name: 'edubase_get_integration',
        description: "Get/check integration.",
        inputSchema: z.object({
            integration: z.string().describe('integration identification string'),
        }),
        outputSchema: z.object({
            integration: z.string().describe('integration identification string'),
            id: z.string().optional().describe('external unique integration identifier (if set for the integration)'),
            name: z.string().describe('title of the integration'),
            type: z.string().describe('type of the integration'),
            active: z.boolean().describe('integration is active'),
            lti: z.string().describe('LTI version, only present if the integration is an LMS').optional(),
        }),
    },
    // POST /integration - Create a new API or LMS integration
    {
        name: 'edubase_post_integration',
        description: "Create a new API or LMS integration.",
        inputSchema: z.object({
            title: z.string().describe('title of the integration'),
            description: z.string().optional().describe('optional short description'),
            type: z.string().optional().describe('type of the integration (api / moodle / canvas / d2l / schoology / lms)'),
            lti: z.string().optional().describe('LTI version (1.0/1.1 / 1.3), only necessary for LMS integrations!'),
            platform: z.string().optional().describe('LMS platform URL, only necessary for LMS integrations!'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // PATCH /integration - Update integration
    {
        name: 'edubase_patch_integration',
        description: "Update integration.",
        inputSchema: z.object({
            integration: z.string().describe('integration identification string'),
            active: z.boolean().optional().describe('enable or disable the integration'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // DELETE /integration - Remove integration
    {
        name: 'edubase_delete_integration',
        description: "Remove integration.",
        inputSchema: z.object({
            integration: z.string().describe('integration identification string'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // GET /integration:keys - Get integration keys/secrets
    {
        name: 'edubase_get_integration_keys',
        description: "Get integration keys/secrets.",
        inputSchema: z.object({
            integration: z.string().describe('integration identification string'),
        }),
        outputSchema: z.object({
            app: z.string().describe('API application identification string, only present if the integration is an API integration').optional(),
            consumer: z.string().describe('consumer key, only present if the integration is an LMS integration using LTI 1.0/1.1').optional(),
            secret: z.string().describe('secret key, only present if the integration is an API integration or an LMS integration using LTI 1.0/1.1').optional(),
            jwk: z.string().describe('URL for the JWK (JSON Web Key) set, only present if the integration is an LMS integration using LTI 1.3').optional(),
            pem: z.string().describe('PEM formatted public key, only present if the integration is an LMS integration using LTI 1.3').optional(),
        }),
    },
    // POST /integration:keys - Rotate integration keys/secrets
    {
        name: 'edubase_post_integration_keys',
        description: "Rotate integration keys/secrets.",
        inputSchema: z.object({
            integration: z.string().describe('integration identification string'),
        }),
        outputSchema: z.object({
            app: z.string().describe('API application identification string, only present if the integration is an API integration').optional(),
            consumer: z.string().describe('consumer key, only present if the integration is an LMS integration using LTI 1.0/1.1').optional(),
            secret: z.string().describe('secret key, only present if the integration is an API integration or an LMS integration using LTI 1.0/1.1').optional(),
            jwk: z.string().describe('URL for the JWK (JSON Web Key) set, only present if the integration is an LMS integration using LTI 1.3').optional(),
            pem: z.string().describe('PEM formatted public key, only present if the integration is an LMS integration using LTI 1.3').optional(),
        }),
    },
];
