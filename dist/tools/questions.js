import * as z from 'zod/v4';
/*
# Questions (Lowest Level in EduBase Hierarchy)

Questions are the atomic building blocks of the EduBase Quiz system.
They represent the lowest level in the EduBase hierarchy, below both Quiz sets and Exams.

Key characteristics:
- Questions have various types (choice, numerical, expression, text, etc.)
- They can be parametrized for dynamic content generation
- Questions are stored in QuestionBase or directly in Quiz sets
- Questions cannot exist directly in Exams without being part of a Quiz set
- Questions can use LaTeX for displaying mathematical notation (NEVER use single dollar signs $...$)
*/
/* Tool definitions */
export const EDUBASE_API_TOOLS_QUESTIONS = [
    // GET /questions - List owned and managed Quiz questions
    {
        name: 'edubase_get_questions',
        description: "List owned and managed Quiz questions. Returns the question identification strings and external identifiers. Use edubase_post_question_export to read the content of a question.",
        inputSchema: z.object({
            search: z.string().describe('search string to filter results'),
            limit: z.number().int().describe('limit number of results (default: 16)'),
            page: z.number().int().describe('page number (default: 1), not used in search mode!'),
        }).partial(),
        outputSchema: z.object({
            questions: z.array(z.object({
                question: z.string().describe('question identification string'),
                id: z.string().nullable().optional().describe('external unique question identifier (if set for the question)'),
            })),
        }),
    },
    // GET /question - Check existing question
    {
        name: 'edubase_get_question',
        description: "Check existing question. Questions are the lowest level in the EduBase hierarchy, serving as the building blocks for Quiz sets. To get question details, use the question export function!",
        inputSchema: z.object({
            id: z.string().describe('external unique question identifier'),
        }),
        outputSchema: z.object({
            question: z.string().describe('question identification string'),
            id: z.string().nullable().optional().describe('external unique question identifier (if set for the question)'),
            active: z.boolean().describe('question is active'),
        }),
    },
    // POST /question - Publish or update a question
    {
        name: 'edubase_post_question',
        description: "Publish or update a question, re-posting the same id updates it. Use the edubase-question-creator skill (if available) to choose the type and fill in the fields: the fields named after a question type are needed for that type (e.g. hotspot_image and hotspot_zones for HOTSPOT). Separate multiple values with &&&. File fields take filename=data, where data is a filebin identifier (preferred, see edubase_post_filebin_upload), base64 data or a URL.",
        inputSchema: z.object({
            id: z.string().max(64).describe('external unique question identifier'),
            path: z.string().describe('folder in the personal QuestionBase'),
            type: z.enum(['generic', 'text', 'free-text', 'reading', 'choice', 'multiple-choice', 'order', 'true/false', 'grouping', 'pairing', 'numerical', 'date/time', 'expression', 'matrix:generic', 'matrix', 'matrix:expression', 'set', 'set:text', 'hotspot', 'file']),
            content: z.string().describe('question text (QUESTION in the documentation), LaTeX only with $$...$$ delimiters'),
            question_format: z.enum(['NORMAL', 'LATEX', 'LONG']),
            answer: z.string().describe('correct answer(s)'),
            language: z.string().describe('ISO 639-1 code'),
            image: z.string(),
            answer_order: z.enum(['+', '-']),
            answer_label: z.string(),
            answer_hide: z.enum(['+', '-']),
            answer_indefinite: z.enum(['+', '-']),
            answer_format: z.string(),
            answer_require: z.string(),
            subject: z.string(),
            category: z.string(),
            main_category: z.string(),
            difficulty: z.string().describe('1 (very easy) to 5 (very difficult), 0: not classified'),
            organization: z.string().describe('organization identification string, "none" to remove'),
            options: z.string().describe('incorrect options or false statements'),
            options_fix: z.string(),
            options_order: z.string(),
            maximum_choices: z.string(),
            points: z.string(),
            subscoring: z.string(),
            subpoints: z.string(),
            penalty_scoring: z.enum(['DEFAULT', 'PER_ANSWER', 'PER_QUESTION']),
            penalty_points: z.string(),
            hint_penalty: z.string(),
            solution_penalty: z.string(),
            solution_image: z.string(),
            video_penalty: z.string(),
            manual_scoring: z.enum(['NO', 'NOT_CORRECT', 'ALWAYS']),
            rubric_criteria: z.string(),
            skills: z.string(),
            graph: z.string(),
            parameters: z.string(),
            parameters_sync: z.enum(['+', '-']),
            constraints: z.string(),
            expression_check: z.enum(['RANDOM', 'EXPLICIT', 'COMPARE']),
            expression_variable: z.string(),
            expression_decimals: z.string(),
            expression_functions: z.enum(['+', '-']),
            expression_random_type: z.string(),
            expression_random_tries: z.string(),
            expression_random_range: z.string(),
            expression_random_inside: z.string(),
            expression_random_outside: z.string(),
            expression_explicit_goal: z.string(),
            expression_extended: z.enum(['+', '-']),
            attachment: z.string(),
            media_audio: z.string(),
            media_video: z.string().describe('EduBase video code'),
            ai: z.string().describe('marks the question as AI generated, set it to your model name'),
            note: z.string(),
            private_note: z.string(),
            explanation: z.string(),
            hint: z.string(),
            solution: z.string(),
            video: z.string().describe('EduBase video code'),
            source: z.string(),
            decimals: z.string(),
            tolerance: z.string(),
            datetime_precision: z.string(),
            datetime_range: z.enum(['+', '-']),
            numerical_range: z.enum(['+', '-']),
            truefalse_third_options: z.string(),
            truefalse_third_options_label: z.string(),
            freetext_characters: z.string(),
            freetext_words: z.string(),
            freetext_rules: z.string(),
            file_count: z.string(),
            file_types: z.string().describe('allowed file extensions, separated by commas (not &&&)'),
            hotspot_image: z.string(),
            hotspot_zones: z.string(),
            tags: z.string(),
            label: z.string(),
            grouping: z.string().describe('number shared by choice questions pooling their incorrect options (not type=grouping or group)'),
            group: z.string().describe('question group in a Quiz set, only when uploading directly to a Quiz set'),
        }).partial().required({
            id: true,
            type: true,
            content: true,
            answer: true,
            ai: true,
        }),
        outputSchema: z.object({
            question: z.string().describe('question identification string'),
        }),
    },
    // DELETE /question - Permanently delete a question
    {
        name: 'edubase_delete_question',
        description: "Permanently delete a Quiz question, identified by its external unique question identifier. This cannot be undone, confirm with the user first.",
        inputSchema: z.object({
            id: z.string().describe('external unique question identifier'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // POST /question:export - Generate download link for exporting the question (in JSON format)
    {
        name: 'edubase_post_question_export',
        description: "Generate download link for exporting the question (in JSON format). If a previous valid link exists, it will be returned instead.",
        inputSchema: z.object({
            id: z.string().describe('external unique question identifier'),
        }),
        outputSchema: z.object({
            id: z.string().nullable().optional().describe('external unique question identifier (if set for the question)'),
            question: z.string().describe('question identification string'),
            url: z.url().describe('download link for the question'),
            valid: z.string().describe('date of link expiration'),
        }),
        /* Only generates a download link, no data is changed */
        annotations: {
            readOnlyHint: true,
        },
    },
    // GET /question:id - Get external unique question identifier by question identification string
    {
        name: 'edubase_get_question_id',
        description: "Get external unique question identifier by question identification string.",
        inputSchema: z.object({
            question: z.string().describe('question identification string'),
        }),
        outputSchema: z.object({
            question: z.string().describe('question identification string'),
            id: z.string().nullable().optional().describe('external unique question identifier (if set for the question)'),
        }),
    },
    // POST /question:id - Set external unique question identifier for question identified by a question identification string
    {
        name: 'edubase_post_question_id',
        description: "Set external unique question identifier for question identified by a question identification string.",
        inputSchema: z.object({
            question: z.string().describe('question identification string'),
            id: z.string().describe('external unique question identifier'),
        }),
        outputSchema: z.object({}).optional(),
    },
];
