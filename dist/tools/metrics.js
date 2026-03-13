import * as z from 'zod/v4';
export const EDUBASE_API_TOOLS_METRICS = [
    // POST /metrics:custom - Update a custom metric
    {
        name: 'edubase_post_custom_metric',
        description: "Update a custom metric.",
        inputSchema: z.object({
            metric: z.string().describe('metric name'),
            value: z.union([
                z.number(),
                z.string().regex(/^\+\d+(\.\d+)?$/),
            ]).describe('target value (also accepts increments with a + prefix)'),
        }),
        outputSchema: z.object({
            metric: z.string().describe('metric name'),
            value: z.string().describe('saved value'),
        }),
    },
];
