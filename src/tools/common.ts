import * as z from 'zod/v4';

export const EDUBASE_API_TOOLS_COMMON = [
	// POST /filebin:upload - Generate upload link for a temporary file storage
	{
		name: 'edubase_post_filebin_upload',
		description: 'Generate upload link for a temporary file storage.',
		inputSchema: z.object({
			type: z.enum(['IMAGE', 'AUDIO', 'SCORM', 'FILE']).describe('type of file to be uploaded (IMAGE/AUDIO/SCORM/FILE)'),
			force: z.boolean().optional().describe('force new link for another file even if a previous valid link exists'),
		}),
		outputSchema: z.object({
			id: z.string().describe('external unique filebin identifier for the uploaded file'),
			url: z.url().describe('upload link for the file'),
			valid: z.string().describe('date of link expiration'),
			limit: z.number().int().describe('maximum file size in bytes'),
		}),
	},

	// DELETE /filebin:upload - Delete an uploaded file and/or temporary file upload link
	{
		name: 'edubase_delete_filebin_upload',
		description: 'Delete an uploaded file and/or temporary file upload link.',
		inputSchema: z.object({
			id: z.string().describe('external unique filebin identifier of the uploaded file or temporary file upload link'),
		}),
		outputSchema: z.object({}).optional(),
	},
];
