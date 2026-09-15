/* Route a content-generic tool call to the endpoint of the content type, sending the content identification string in the argument named after the content type (e.g. { type: 'exam', content: 'X' } is sent to /exam:tag as { exam: 'X' }) */
export function contentRequest(endpoint: string) {
	return ({ type, content, ...args }: Record<string, any>) => ({
		endpoint: `${type}:${endpoint}`,
		args: { ...args, [type]: content },
	});
}
