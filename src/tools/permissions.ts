import * as z from 'zod/v4';
import { contentRequest } from './content.js';

/* Content types supporting permissions (the permission and transfer endpoints of every content type work the same way, so they are exposed as a single tool per method) */
const PERMISSION_CONTENT_TYPES = ['class', 'course', 'event', 'exam', 'integration', 'organization', 'quiz', 'scorm', 'tag', 'video'] as const;
const PERMISSION_LEVELS = ['view', 'report', 'control', 'modify', 'finances', 'grant', 'admin'] as const;
const permissionContentInputSchema = {
	type: z.enum(PERMISSION_CONTENT_TYPES).describe('type of the content (scorm: SCORM learning material, quiz: Quiz set)'),
	content: z.string().describe('identification string of the content (e.g. the exam identification string if type is exam)'),
	user: z.string().describe('user identification string'),
};
const permissionLevelSchema = z.enum(PERMISSION_LEVELS).describe('permission level (view / report / control / modify / grant / admin), finances is only available for events');
const permissionContentOutputSchema = z.object({
	type: z.enum(PERMISSION_CONTENT_TYPES).describe('type of the content'),
	code: z.string().describe('the content identification string'),
	id: z.string().nullable().optional().describe('external unique content identifier (if set for the content)'),
});
const permissionActionOutputSchema = z.object({
	user: z.string().describe('the user identification string'),
	content: permissionContentOutputSchema,
	success: z.boolean().describe('operation was successful'),
});

/* Tool definitions */
export const EDUBASE_API_TOOLS_PERMISSIONS = [
	// GET /{type}:permission - Check if a user has permission on a content
	{
		name: 'edubase_get_content_permission',
		description: "Check if a user has a permission level on a content (class, course, event, exam, integration, organization, Quiz set, SCORM learning material, tag or video). Returns whether the user has the permission, and whether there is a permission rule with exactly these parameters.",
		inputSchema: z.object({
			...permissionContentInputSchema,
			permission: permissionLevelSchema,
		}),
		outputSchema: z.object({
			user: z.string().describe('the user identification string'),
			content: permissionContentOutputSchema,
			status: z.object({
				permission: z.boolean().describe('the user has permission on the content'),
				rule: z.boolean().describe('there is a permission rule with these parameters'),
			}),
		}),
		request: contentRequest('permission'),
	},

	// POST /{type}:permission - Create new permission for a user on a content
	{
		name: 'edubase_post_content_permission',
		description: "Give a user a permission level on a content (class, course, event, exam, integration, organization, Quiz set, SCORM learning material, tag or video).",
		inputSchema: z.object({
			...permissionContentInputSchema,
			permission: permissionLevelSchema,
		}),
		outputSchema: permissionActionOutputSchema,
		request: contentRequest('permission'),
	},

	// DELETE /{type}:permission - Remove a user permission from a content
	{
		name: 'edubase_delete_content_permission',
		description: "Remove a permission level of a user from a content (class, course, event, exam, integration, organization, Quiz set, SCORM learning material, tag or video).",
		inputSchema: z.object({
			...permissionContentInputSchema,
			permission: permissionLevelSchema,
		}),
		outputSchema: permissionActionOutputSchema,
		request: contentRequest('permission'),
	},

	// POST /{type}:transfer - Transfer content to user
	{
		name: 'edubase_post_content_transfer',
		description: "Transfer the ownership of a content (class, course, event, exam, integration, organization, Quiz set, SCORM learning material, tag or video) to another user. Confirm with the user first.",
		inputSchema: z.object({
			...permissionContentInputSchema,
		}),
		outputSchema: permissionActionOutputSchema,
		request: contentRequest('transfer'),
	},
];
