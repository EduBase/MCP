import * as z from 'zod/v4';
export const EDUBASE_API_TOOLS_METRICS = [
    // POST /metrics:custom - Update a custom metric
    {
        name: 'edubase_post_metrics_custom',
        description: "Set a custom metric to a value, or increment it with a + prefixed value (e.g. +1). Returns the saved value.",
        inputSchema: z.object({
            metric: z.string().describe('metric name'),
            value: z.union([
                z.number().finite(),
                z.string().regex(/^\+\d+(\.\d+)?$/),
            ]).describe('target value (also accepts increments with a + prefix)'),
        }),
        outputSchema: z.object({
            metric: z.string().describe('metric name'),
            value: z.string().describe('saved value'),
        }),
    },
];
