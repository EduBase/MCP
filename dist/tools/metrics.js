/* Tool definitions */
export const EDUBASE_API_TOOLS_METRICS = [
    // POST /metrics:custom - Update a custom metric
    {
        name: 'edubase_post_custom_metric',
        description: "Update a custom metric.",
        inputSchema: {
            type: 'object',
            properties: {
                metric: {
                    type: 'string',
                    description: 'metric name',
                },
                value: {
                    type: 'number',
                    description: 'target value (also accepts increments with a + prefix)',
                },
            },
            required: ['metric', 'value'],
        },
    },
];
/* Output schema definitions */
export const EDUBASE_API_TOOLS_METRICS_OUTPUT_SCHEMA = {
    // POST /metrics:custom - Update a custom metric
    edubase_post_custom_metric: {
        type: 'object',
        properties: {
            metric: {
                type: 'string',
                description: 'metric name',
            },
            value: {
                type: 'string',
                description: 'saved value',
            },
        },
    },
};
