import * as z from 'zod/v4';

type TagEntityConfig = {
	key: string;
	paramDescription: string;
	listDescription: string;
	checkDescription: string;
	attachDescription: string;
	removeDescription: string;
	contentType: string;
	contentCodeDescription: string;
	contentIdDescription: string;
	statusDescription: string;
};
const tagRelationContentSchema = (entity: TagEntityConfig) => z.object({
	type: z.string().describe(`will be "${entity.contentType}"`),
	code: z.string().describe(entity.contentCodeDescription),
	id: z.string().describe(entity.contentIdDescription),
});
const createEntityTagTools = (entity: TagEntityConfig) => [
	{
		name: `edubase_get_${entity.key}_tags`,
		description: entity.listDescription,
		inputSchema: z.object({
			[entity.key]: z.string().describe(entity.paramDescription),
		}),
		outputSchema: z.array(z.object({
			tag: z.string().describe('tag identification string'),
			id: z.string().describe('external unique tag identifier (if set for the tag)'),
			name: z.string().describe('title of the tag'),
		})),
	},
	{
		name: `edubase_get_${entity.key}_tag`,
		description: entity.checkDescription,
		inputSchema: z.object({
			[entity.key]: z.string().describe(entity.paramDescription),
			tag: z.string().describe('tag identification string'),
		}),
		outputSchema: z.object({
			tag: z.string().describe('the tag identification string'),
			content: tagRelationContentSchema(entity),
			status: z.boolean().describe(entity.statusDescription),
		}),
	},
	{
		name: `edubase_post_${entity.key}_tag`,
		description: entity.attachDescription,
		inputSchema: z.object({
			[entity.key]: z.string().describe(entity.paramDescription),
			tag: z.string().describe('tag identification string'),
		}),
		outputSchema: z.object({
			tag: z.string().describe('the tag identification string'),
			content: tagRelationContentSchema(entity),
			success: z.boolean().describe('operation was successful'),
		}),
	},
	{
		name: `edubase_delete_${entity.key}_tag`,
		description: entity.removeDescription,
		inputSchema: z.object({
			[entity.key]: z.string().describe(entity.paramDescription),
			tag: z.string().describe('tag identification string'),
		}),
		outputSchema: z.object({}).optional(),
	},
];
const TAG_ENTITIES: TagEntityConfig[] = [
	{
		key: 'class',
		paramDescription: 'class identification string',
		listDescription: 'List all attached tags of a class.',
		checkDescription: 'Check if tag is attached to a class.',
		attachDescription: 'Attach tag to a class.',
		removeDescription: 'Remove a tag attachment from a class.',
		contentType: 'class',
		contentCodeDescription: 'the class identification string',
		contentIdDescription: 'external unique class identifier (if set for the class)',
		statusDescription: 'tag is attached to this class',
	},
	{
		key: 'course',
		paramDescription: 'course identification string',
		listDescription: 'List all attached tags of a course.',
		checkDescription: 'Check if tag is attached to a course.',
		attachDescription: 'Attach tag to a course.',
		removeDescription: 'Remove a tag attachment from a course.',
		contentType: 'course',
		contentCodeDescription: 'the course identification string',
		contentIdDescription: 'external unique course identifier (if set for the course)',
		statusDescription: 'tag is attached to this course',
	},
	{
		key: 'event',
		paramDescription: 'event identification string',
		listDescription: 'List all attached tags of an event.',
		checkDescription: 'Check if tag is attached to an event.',
		attachDescription: 'Attach tag to an event.',
		removeDescription: 'Remove a tag attachment from an event.',
		contentType: 'event',
		contentCodeDescription: 'the event identification string',
		contentIdDescription: 'external unique event identifier (if set for the event)',
		statusDescription: 'tag is attached to this event',
	},
	{
		key: 'exam',
		paramDescription: 'exam identification string',
		listDescription: 'List all attached tags of an exam.',
		checkDescription: 'Check if tag is attached to an exam.',
		attachDescription: 'Attach tag to an exam.',
		removeDescription: 'Remove a tag attachment from an exam.',
		contentType: 'exam',
		contentCodeDescription: 'the exam identification string',
		contentIdDescription: 'external unique exam identifier (if set for the exam)',
		statusDescription: 'tag is attached to this exam',
	},
	{
		key: 'integration',
		paramDescription: 'integration identification string',
		listDescription: 'List all attached tags of an integration.',
		checkDescription: 'Check if tag is attached to an integration.',
		attachDescription: 'Attach tag to an integration.',
		removeDescription: 'Remove a tag attachment from an integration.',
		contentType: 'integration',
		contentCodeDescription: 'the integration identification string',
		contentIdDescription: 'external unique integration identifier (if set for the integration)',
		statusDescription: 'tag is attached to this integration',
	},
	{
		key: 'organization',
		paramDescription: 'organization identification string',
		listDescription: 'List all attached tags of an organization.',
		checkDescription: 'Check if tag is attached to an organization.',
		attachDescription: 'Attach tag to an organization.',
		removeDescription: 'Remove a tag attachment from an organization.',
		contentType: 'organization',
		contentCodeDescription: 'the organization identification string',
		contentIdDescription: 'external unique organization identifier (if set for the organization)',
		statusDescription: 'tag is attached to this organization',
	},
	{
		key: 'quiz',
		paramDescription: 'Quiz identification string',
		listDescription: 'List all attached tags of a Quiz.',
		checkDescription: 'Check if tag is attached to a Quiz.',
		attachDescription: 'Attach tag to a Quiz.',
		removeDescription: 'Remove a tag attachment from a Quiz.',
		contentType: 'quiz',
		contentCodeDescription: 'the Quiz identification string',
		contentIdDescription: 'external unique Quiz identifier (if set for the Quiz)',
		statusDescription: 'tag is attached to this quiz',
	},
	{
		key: 'scorm',
		paramDescription: 'SCORM identification string',
		listDescription: 'List all attached tags of a SCORM learning material.',
		checkDescription: 'Check if tag is attached to a SCORM learning material.',
		attachDescription: 'Attach tag to a SCORM learning material.',
		removeDescription: 'Remove a tag attachment from a SCORM learning material.',
		contentType: 'scorm',
		contentCodeDescription: 'the SCORM identification string',
		contentIdDescription: 'external unique SCORM identifier (if set for the SCORM)',
		statusDescription: 'tag is attached to this SCORM learning material',
	},
	{
		key: 'video',
		paramDescription: 'video identification string',
		listDescription: 'List all attached tags of a video.',
		checkDescription: 'Check if tag is attached to a video.',
		attachDescription: 'Attach tag to a video.',
		removeDescription: 'Remove a tag attachment from a video.',
		contentType: 'video',
		contentCodeDescription: 'the video identification string',
		contentIdDescription: 'external unique video identifier (if set for the video)',
		statusDescription: 'tag is attached to this video',
	},
];

/* Tool definitions */
export const EDUBASE_API_TOOLS_TAGS = [
	// GET /tags - List owned and managed tags
	{
		name: 'edubase_get_tags',
		description: 'List owned and managed tags.',
		inputSchema: z.object({
			search: z.string().describe('search string to filter results').optional(),
			limit: z.number().describe('limit number of results (default: 16)').optional(),
			page: z.number().describe('page number (default: 1), not used in search mode!').optional(),
		}),
		outputSchema: z.array(z.object({
			code: z.string().describe('tag identification string'),
			id: z.string().describe('external unique tag identifier (if set for the tag)'),
			name: z.string().describe('title of the tag'),
		})),
	},

	// GET /tag - Get/check tag
	{
		name: 'edubase_get_tag',
		description: 'Get/check tag.',
		inputSchema: z.object({
			tag: z.string().describe('tag identification string'),
		}),
		outputSchema: z.object({
			tag: z.string().describe('tag identification string'),
			id: z.string().describe('external unique tag identifier (if set for the tag)'),
			name: z.string().describe('title of the tag'),
			color: z.string().describe('color in HEX format'),
			icon: z.string().describe('Font Awesome icon class name'),
		}),
	},
	...TAG_ENTITIES.flatMap(createEntityTagTools),
];
