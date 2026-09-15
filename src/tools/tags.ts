import * as z from 'zod/v4';
import { contentRequest } from './content.js';

/* Content types supporting tags (the tag and permission endpoints of every content type work the same way, so they are exposed as a single tool per method) */
const TAG_CONTENT_TYPES = ['class', 'course', 'event', 'exam', 'integration', 'organization', 'quiz', 'scorm', 'video'] as const;
const tagContentInputSchema = {
	type: z.enum(TAG_CONTENT_TYPES).describe('type of the content (scorm: SCORM learning material, quiz: Quiz set)'),
	content: z.string().describe('identification string of the content (e.g. the exam identification string if type is exam)'),
};
const tagContentOutputSchema = z.object({
	type: z.enum(TAG_CONTENT_TYPES).describe('type of the content'),
	code: z.string().describe('the content identification string'),
	id: z.string().nullable().describe('external unique content identifier (if set for the content)'),
});

/* Tool definitions */
export const EDUBASE_API_TOOLS_TAGS = [
	// GET /tags - List owned and managed tags
	{
		name: 'edubase_get_tags',
		description: "List owned and managed tags. Returns tag identification strings, external identifiers and titles. Attach tags to contents with edubase_post_content_tag.",
		inputSchema: z.object({
			search: z.string().describe('search string to filter results').optional(),
			limit: z.number().int().describe('limit number of results (default: 16)').optional(),
			page: z.number().int().describe('page number (default: 1), not used in search mode!').optional(),
		}),
		outputSchema: z.object({
			tags: z.array(z.object({
				tag: z.string().describe('tag identification string'),
				id: z.string().nullable().optional().describe('external unique tag identifier (if set for the tag)'),
				title: z.string().describe('title of the tag'),
			})),
		}),
	},

	// GET /tag - Get/check tag
	{
		name: 'edubase_get_tag',
		description: "Get the details of a tag: title, external identifier, color and icon.",
		inputSchema: z.object({
			tag: z.string().describe('tag identification string'),
		}),
		outputSchema: z.object({
			tag: z.string().describe('tag identification string'),
			id: z.string().nullable().optional().describe('external unique tag identifier (if set for the tag)'),
			title: z.string().describe('title of the tag'),
			color: z.string().describe('color in HEX format'),
			icon: z.string().describe('Font Awesome icon class name'),
		}),
	},

	// GET /{type}:tags - List all attached tags of a content
	{
		name: 'edubase_get_content_tags',
		description: "List the tags attached to a content (class, course, event, exam, integration, organization, Quiz set, SCORM learning material or video).",
		inputSchema: z.object({
			...tagContentInputSchema,
		}),
		outputSchema: z.object({
			tags: z.array(z.object({
				tag: z.string().describe('tag identification string'),
				title: z.string().describe('title of the tag'),
			})),
		}),
		request: contentRequest('tags'),
	},

	// GET /{type}:tag - Check if tag is attached to a content
	{
		name: 'edubase_get_content_tag',
		description: "Check if a tag is attached to a content (class, course, event, exam, integration, organization, Quiz set, SCORM learning material or video).",
		inputSchema: z.object({
			...tagContentInputSchema,
			tag: z.string().describe('tag identification string'),
		}),
		outputSchema: z.object({
			tag: z.string().describe('the tag identification string'),
			content: tagContentOutputSchema,
			status: z.boolean().describe('tag is attached to the content'),
		}),
		request: contentRequest('tag'),
	},

	// POST /{type}:tag - Attach tag to a content
	{
		name: 'edubase_post_content_tag',
		description: "Attach a tag to a content (class, course, event, exam, integration, organization, Quiz set, SCORM learning material or video). List the available tags with edubase_get_tags.",
		inputSchema: z.object({
			...tagContentInputSchema,
			tag: z.string().describe('tag identification string'),
		}),
		outputSchema: z.object({
			tag: z.string().describe('the tag identification string'),
			content: tagContentOutputSchema,
			success: z.boolean().describe('operation was successful'),
		}),
		request: contentRequest('tag'),
	},

	// DELETE /{type}:tag - Remove a tag attachment from a content
	{
		name: 'edubase_delete_content_tag',
		description: "Remove a tag from a content (class, course, event, exam, integration, organization, Quiz set, SCORM learning material or video). The tag itself is kept.",
		inputSchema: z.object({
			...tagContentInputSchema,
			tag: z.string().describe('tag identification string'),
		}),
		outputSchema: z.object({
			tag: z.string().describe('the tag identification string'),
			content: tagContentOutputSchema,
			success: z.boolean().describe('operation was successful'),
		}),
		request: contentRequest('tag'),
	},
];
