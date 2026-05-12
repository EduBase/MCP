import * as z from 'zod/v4';
/* Prompts definitions */
export const EDUBASE_API_PROMPTS_QUESTIONS = [
    // Create a new question
    {
        name: 'edubase_prompt_create_question',
        description: 'Create a new question with the given subject and content.',
        argsSchema: {
            type: z.enum(['GENERIC', 'TEXT', 'FREE-TEXT', 'READING', 'CHOICE', 'MULTIPLE-CHOICE', 'ORDER', 'TRUE/FALSE', 'GROUPING', 'PAIRING', 'NUMERIC', 'DATE/TIME', 'EXPRESSION', 'MATRIX', 'MATRIX:EXPRESSION', 'SET', 'SET:TEXT', 'HOTSPOT', 'FILE']).describe('The type of the question, use the EduBase question types!'),
            subject: z.string().describe('The subject of the question, e.g. "Mathematics", "History", etc.')
        },
        handler: async (args) => {
            return {
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `Create a new question of type ${args.type} about ${args.subject}. Please provide the question in a clear and concise manner, suitable for educational purposes.`
                        }
                    }]
            };
        }
    }
];
