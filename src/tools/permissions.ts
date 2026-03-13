import * as z from 'zod/v4';

type PermissionEntityConfig = {
	key: string;
	permissionValues: [string, ...string[]];
	permissionLevels: string;
	contentType: string;
	inputIdDescription: string;
	contentCodeDescription: string;
	contentIdDescription: string;
	checkDescription: string;
	postDescription: string;
	deleteDescription: string;
	transferDescription: string;
	transferToolName?: string;
};
const PERMISSION_ENTITIES: PermissionEntityConfig[] = [
	{
		key: 'class',
		permissionValues: ['view', 'report', 'control', 'modify', 'grant', 'admin'],
		permissionLevels: 'view / report / control / modify / grant / admin',
		contentType: 'class',
		inputIdDescription: 'class identification string',
		contentCodeDescription: 'the class identification string',
		contentIdDescription: 'external unique class identifier (if set for the class)',
		checkDescription: 'Check if a user has permission on a class.',
		postDescription: 'Create new permission for a user on a class.',
		deleteDescription: 'Remove a user permission from a class.',
		transferDescription: 'Transfer class to user.',
	},
	{
		key: 'course',
		permissionValues: ['view', 'report', 'control', 'modify', 'grant', 'admin'],
		permissionLevels: 'view / report / control / modify / grant / admin',
		contentType: 'course',
		inputIdDescription: 'course identification string',
		contentCodeDescription: 'the course identification string',
		contentIdDescription: 'external unique course identifier (if set for the course)',
		checkDescription: 'Check if a user has permission on a course.',
		postDescription: 'Create new permission for a user on a course.',
		deleteDescription: 'Remove a user permission from a course.',
		transferDescription: 'Transfer course to user.',
		transferToolName: 'edubase_post_course_transfer',
	},
	{
		key: 'event',
		permissionValues: ['view', 'report', 'control', 'modify', 'finances', 'grant', 'admin'],
		permissionLevels: 'view / report / control / modify / finances / grant / admin',
		contentType: 'event',
		inputIdDescription: 'event identification string',
		contentCodeDescription: 'the event identification string',
		contentIdDescription: 'external unique event identifier (if set for the event)',
		checkDescription: 'Check if a user has permission on an event.',
		postDescription: 'Create new permission for a user on an event.',
		deleteDescription: 'Remove a user permission from an event.',
		transferDescription: 'Transfer event to user.',
	},
	{
		key: 'exam',
		permissionValues: ['view', 'report', 'control', 'modify', 'grant', 'admin'],
		permissionLevels: 'view / report / control / modify / grant / admin',
		contentType: 'exam',
		inputIdDescription: 'exam identification string',
		contentCodeDescription: 'the exam identification string',
		contentIdDescription: 'external unique exam identifier (if set for the exam)',
		checkDescription: 'Check if a user has permission on an exam.',
		postDescription: 'Create new permission for a user on an exam.',
		deleteDescription: 'Remove a user permission from an exam.',
		transferDescription: 'Transfer exam to user.',
	},
	{
		key: 'integration',
		permissionValues: ['view', 'report', 'control', 'modify', 'grant', 'admin'],
		permissionLevels: 'view / report / control / modify / grant / admin',
		contentType: 'integration',
		inputIdDescription: 'integration identification string',
		contentCodeDescription: 'the integration identification string',
		contentIdDescription: 'external unique integration identifier (if set for the integration)',
		checkDescription: 'Check if a user has permission on an integration.',
		postDescription: 'Create new permission for a user on an integration.',
		deleteDescription: 'Remove a user permission from an integration.',
		transferDescription: 'Transfer integration to user.',
	},
	{
		key: 'organization',
		permissionValues: ['view', 'report', 'control', 'modify', 'grant', 'admin'],
		permissionLevels: 'view / report / control / modify / grant / admin',
		contentType: 'organization',
		inputIdDescription: 'organization identification string',
		contentCodeDescription: 'the organization identification string',
		contentIdDescription: 'external unique organization identifier (if set for the organization)',
		checkDescription: 'Check if a user has permission on an organization.',
		postDescription: 'Create new permission for a user on an organization.',
		deleteDescription: 'Remove a user permission from an organization.',
		transferDescription: 'Transfer organization to user.',
	},
	{
		key: 'quiz',
		permissionValues: ['view', 'report', 'control', 'modify', 'grant', 'admin'],
		permissionLevels: 'view / report / control / modify / grant / admin',
		contentType: 'quiz',
		inputIdDescription: 'Quiz identification string',
		contentCodeDescription: 'the Quiz identification string',
		contentIdDescription: 'external unique Quiz identifier (if set for the Quiz)',
		checkDescription: 'Check if a user has permission on a quiz.',
		postDescription: 'Create new permission for a user on a quiz.',
		deleteDescription: 'Remove a user permission from a quiz.',
		transferDescription: 'Transfer Quiz to user.',
	},
	{
		key: 'scorm',
		permissionValues: ['view', 'report', 'control', 'modify', 'grant', 'admin'],
		permissionLevels: 'view / report / control / modify / grant / admin',
		contentType: 'scorm',
		inputIdDescription: 'SCORM identification string',
		contentCodeDescription: 'the SCORM identification string',
		contentIdDescription: 'external unique SCORM identifier (if set for the SCORM)',
		checkDescription: 'Check if a user has permission on a SCORM learning material.',
		postDescription: 'Create new permission for a user on a SCORM learning material.',
		deleteDescription: 'Remove a user permission from a SCORM learning material.',
		transferDescription: 'Transfer SCORM to user.',
	},
	{
		key: 'tag',
		permissionValues: ['view', 'report', 'control', 'modify', 'grant', 'admin'],
		permissionLevels: 'view / report / control / modify / grant / admin',
		contentType: 'tag',
		inputIdDescription: 'tag identification string',
		contentCodeDescription: 'the tag identification string',
		contentIdDescription: 'external unique tag identifier (if set for the tag)',
		checkDescription: 'Check if a user has permission on a tag.',
		postDescription: 'Create new permission for a user on a tag.',
		deleteDescription: 'Remove a user permission from a tag.',
		transferDescription: 'Transfer tag to user.',
	},
	{
		key: 'video',
		permissionValues: ['view', 'report', 'control', 'modify', 'grant', 'admin'],
		permissionLevels: 'view / report / control / modify / grant / admin',
		contentType: 'video',
		inputIdDescription: 'video identification string',
		contentCodeDescription: 'the video identification string',
		contentIdDescription: 'external unique video identifier (if set for the video)',
		checkDescription: 'Check if a user has permission on a video.',
		postDescription: 'Create new permission for a user on a video.',
		deleteDescription: 'Remove a user permission from a video.',
		transferDescription: 'Transfer video to user.',
	},
];
const createPermissionContentSchema = (entity: PermissionEntityConfig) => z.object({
	type: z.literal(entity.contentType).describe(`will be "${entity.contentType}"`),
	code: z.string().describe(entity.contentCodeDescription),
	id: z.string().nullable().optional().describe(entity.contentIdDescription),
});
const createPermissionTools = (entity: PermissionEntityConfig) => {
	const permissionDescription = `permission level (${entity.permissionLevels})`;
	const checkOutputSchema = z.object({
		user: z.string().describe('the user identification string'),
		content: createPermissionContentSchema(entity),
		status: z.object({
			permission: z.boolean().describe(`the user has permission on this ${entity.contentType}`),
			rule: z.boolean().describe('there is a permission rule with these parameters'),
		}),
	});
	const actionOutputSchema = z.object({
		user: z.string().describe('the user identification string'),
		content: createPermissionContentSchema(entity),
		success: z.boolean().describe('operation was successful'),
	});

	return [
		{
			name: `edubase_get_${entity.key}_permission`,
			description: entity.checkDescription,
			inputSchema: z.object({
				[entity.key]: z.string().describe(entity.inputIdDescription),
				user: z.string().describe('user identification string'),
				permission: z.enum(entity.permissionValues).describe(permissionDescription),
			}),
			outputSchema: checkOutputSchema,
		},
		{
			name: `edubase_post_${entity.key}_permission`,
			description: entity.postDescription,
			inputSchema: z.object({
				[entity.key]: z.string().describe(entity.inputIdDescription),
				user: z.string().describe('user identification string'),
				permission: z.enum(entity.permissionValues).describe(permissionDescription),
			}),
			outputSchema: actionOutputSchema,
		},
		{
			name: `edubase_delete_${entity.key}_permission`,
			description: entity.deleteDescription,
			inputSchema: z.object({
				[entity.key]: z.string().describe(entity.inputIdDescription),
				user: z.string().describe('user identification string'),
				permission: z.enum(entity.permissionValues).describe(permissionDescription),
			}),
			outputSchema: actionOutputSchema,
		},
		{
			name: entity.transferToolName ?? `edubase_post_${entity.key}_transfer`,
			description: entity.transferDescription,
			inputSchema: z.object({
				[entity.key]: z.string().describe(entity.inputIdDescription),
				user: z.string().describe('user identification string'),
			}),
			outputSchema: actionOutputSchema,
		},
	];
};

/* Tool definitions */
export const EDUBASE_API_TOOLS_PERMISSIONS = PERMISSION_ENTITIES.flatMap(createPermissionTools);
