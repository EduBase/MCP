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
        description: "List owned and managed Quiz questions.",
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
        description: "Publish or update a question. Questions are the atomic building blocks of the EduBase Quiz system and represent the lowest level in the hierarchy (Questions -> Quiz sets -> Exams). Always check what the fields named like the type of the question do and consider using them, for example if creating a HOTSPOT question, both hotspot_zones and hotspot_image will be required!",
        inputSchema: z.object({
            id: z.string().max(64).describe('External unique question identifier for question management.'),
            path: z.string().describe('Path where question will be stored in personal QuestionBase.'),
            type: z.enum(['generic', 'text', 'free-text', 'reading', 'choice', 'multiple-choice', 'order', 'true/false', 'grouping', 'pairing', 'numerical', 'date/time', 'expression', 'matrix:generic', 'matrix', 'matrix:expression', 'set', 'set:text', 'hotspot', 'file']).describe('Type of the question.'),
            content: z.string().describe('The main question text that will be displayed to the test taker. Supports rich formatting options, including LaTeX, parameters, quick expressions, and EduTags for styling. This is documented as `question` in the Developer Documentation, but named `content` in the API for better clarity.'),
            question_format: z.enum(['NORMAL', 'LATEX', 'LONG']).describe('Controls question text rendering.'),
            answer: z.string().describe('The correct answer(s) for the question. For multiple answers, separate with triple-and operator (\"&&&\"). The solution and the corresponding label can also be specified together using the triple arrow (\">>>\") operator'),
            language: z.string().describe('The language of the question, in Alpha-2 code format (according to ISO 639-1).'),
            image: z.string().describe('Attach an image to the question. Supported formats: PNG, JPEG, WebP. Format: filename=data, where data is either a temporary filebin storage external identifier (preferred), a base64-encoded image (whole data string) or a URL.'),
            answer_order: z.enum(['+', '-']).describe('Controls whether the sequence of multiple answers matters.'),
            answer_label: z.string().describe('Text displayed in/above the input field during the test. Separate multiple labels with triple-and operators ("&&&"). Automatically activates the answer_order function.'),
            answer_hide: z.enum(['+', '-']).describe('Controls whether correct answers are hidden on the results page.'),
            answer_indefinite: z.enum(['+', '-']).describe('Allows users to add any number of input fields using + and - buttons.'),
            answer_format: z.string().describe('Defines how to display the answer on the results page. Only applicable for FREE-TEXT questions.'),
            answer_require: z.string().describe('Number of answers required for maximum score. Only applicable for questions with multiple valid answers where only a subset needs to be provided.'),
            subject: z.string().describe('Subject classification for organizing questions.'),
            category: z.string().describe('Category, another layer of organization as seen in SUBJECT'),
            main_category: z.string().describe('The name of the category (for which CATEGORY will be a subcategory).'),
            difficulty: z.string().describe('Difficulty level of the question. Scale: 1 (very easy) - 5 (very difficult). Default: 0 (not classified).'),
            options: z.string().describe('Incorrect options or false statements for choice-based question types. Only applicable for CHOICE, MULTIPLE-CHOICE, and TRUE/FALSE questions. Separate multiple options with triple-and operators ("&&&").'),
            options_fix: z.string().describe('Controls the arrangement of answers and options.'),
            options_order: z.string().describe('Define exact presentation order of answers and options.'),
            maximum_choices: z.string().describe('Maximum number of options the test taker can select. Only applicable for MULTIPLE-CHOICE questions.'),
            points: z.string().describe('Maximum points for a fully correct answer. Default: 1 point.'),
            subscoring: z.string().describe('Method for calculating partial credit for partially correct answers. Not applicable for CHOICE, READING and FREE-TEXT questions.'),
            subpoints: z.string().describe('Define specific point values for each answer in percentages. Only used when subscoring=CUSTOM. Specify percentage values separated by triple-and operators ("&&&"). Not applicable for CHOICE, READING and FREE-TEXT questions. Values should sum to 100 (for percentage).'),
            penalty_scoring: z.enum(['DEFAULT', 'PER_ANSWER', 'PER_QUESTION']).describe('Controls how penalty points should be applied.'),
            penalty_points: z.string().describe('Points deducted for completely incorrect answers.'),
            hint_penalty: z.string().describe('Point deduction for using hints/solutions/videos during a test.'),
            solution_penalty: z.string().describe('Point deduction for viewing steps of the solution (NONE, ONCE:N%). Default: NONE.'),
            solution_image: z.string().describe('Attach an image to the solution steps. Supported formats: PNG, JPEG, WebP. Format: filename=data, where data is either a temporary filebin storage external identifier (preferred), a base64-encoded image (whole data string) or a URL.'),
            video_penalty: z.string().describe('Point deduction for video assistance used (NONE, ONCE:N%). Default: NONE.'),
            manual_scoring: z.enum(['NO', 'NOT_CORRECT', 'ALWAYS']).describe('Controls when to enable manual scoring. Not applicable for READING and FREE-TEXT questions.'),
            graph: z.string().describe('Attach a graph to the question.'),
            parameters: z.string().describe('Parameter definitions for dynamic question generation. Separate multiple parameters with triple-and operators ("&&&"). Up to 128 parameters can be defined!'),
            parameters_sync: z.enum(['+', '-']).describe('Controls synchronization of LIST parameter selections.'),
            constraints: z.string().describe('Define rules that parameter combinations must satisfy.'),
            expression_check: z.enum(['RANDOM', 'EXPLICIT', 'COMPARE']).describe('Define how expressions should be validated (RANDOM, EXPLICIT, COMPARE). Default: RANDOM.'),
            expression_variable: z.string().describe('Specifies variable names used in expressions (separate multiple variables with &&&). Default: x.'),
            expression_decimals: z.string().describe('Sets precision for decimal calculations. Default: 2.'),
            expression_functions: z.enum(['+', '-']).describe('Controls whether functions can be used in user inputs. Default: +.'),
            expression_random_type: z.string().describe('Type of generated test values (INTEGER, FLOAT). Specify per variable with triple-and operators ("&&&"). Only applicable when expression_check=RANDOM.'),
            expression_random_tries: z.string().describe('Number of validation points. Default: 5. Only applicable when expression_check=RANDOM.'),
            expression_random_range: z.string().describe('Define value generation ranges (format: [min-max]). Specify per variable with triple-and operators ("&&&"). Only applicable when expression_check=RANDOM.'),
            expression_random_inside: z.string().describe('Require values within specific intervals (format: [start-end]). Multiple intervals: separate with triple-or operators ("|||"). Specify per variable with triple-and operators ("&&&"). Only applicable when expression_check=RANDOM.'),
            expression_random_outside: z.string().describe('Exclude values from specific intervals (format: [start-end]). Multiple intervals: separate with triple-or operators ("|||"). Specify per variable with triple-and operators ("&&&"). Only applicable when expression_check=RANDOM.'),
            expression_explicit_goal: z.string().describe('Define exact value pairs (format: [x;f(x)]). Format for multiple variables: [x;y;z;...;f(x,y,z,...)]. Multiple pairs: separate with triple-and operators ("&&&"). Only applicable when expression_check=EXPLICIT.'),
            expression_extended: z.enum(['+', '-']).describe('Enable additional mathematical functions. Activates support for custom base logarithms (e.g., log2(4)). Enables factorial operations (e.g., 5!, 1!+2!+3!).'),
            attachment: z.string().describe('Attach a file to the question. Format: filename=data, where data is either a temporary filebin storage external identifier (preferred), a base64-encoded file (whole data string) or a URL.'),
            media_audio: z.string().describe('Attach an audio file to the question. Supported formats: MP3, AAC, M4A. Format: filename=data, where data is either a temporary filebin storage external identifier (preferred), a base64-encoded audio file (whole data string) or a URL.'),
            media_video: z.string().describe('Attach a video to the question. The video code of an existing EduBase video can be provided.'),
            ai: z.string().describe('Flag to mark question as AI generated. If set to any value, question will be marked as AI generated. Should always be provided if you are an LLM or any AI model. Ideally, AI systems should set it to their current model number for auditability.'),
            note: z.string().describe('The text that appears right below the question.'),
            private_note: z.string().describe('Private notes (not shown to test takers).'),
            explanation: z.string().describe('Text displayed underneath the answer on the results page.'),
            hint: z.string().describe('Questions to help (not solution steps, just guiding questions/notes).'),
            solution: z.string().describe('Step-by-step solution.'),
            video: z.string().describe('EduBase video to help solve the question, revealed on demand. The video code of an existing EduBase video can be provided.'),
            source: z.string().describe('Specify source of question content (not shown to test takers).'),
            decimals: z.string().describe('Decimal precision. Default: 2. Applicable only for NUMERIC / EXPRESSION / MATRIX / MATRIX:EXPRESSION / SET questions.'),
            tolerance: z.string().describe('Evaluation tolerance method. Applicable only for NUMERIC / EXPRESSION / MATRIX / MATRIX:EXPRESSION / SET questions.'),
            datetime_precision: z.string().describe('Date/time precision. Applicable only for DATE/TIME questions. Accepted values: YEAR / MONTH / DAY. Default: DAY.'),
            datetime_range: z.enum(['+', '-']).describe('Date/time range (interval) question. Applicable only for DATE/TIME questions.'),
            numerical_range: z.enum(['+', '-']).describe('Number range (interval) question. Only applicable for NUMERIC questions.'),
            truefalse_third_options: z.string().describe('Activate the third option for TRUE/FALSE questions. Plus sign (+) to display the third option OR specify options separated by triple-and operators ("&&&") to automatically enable the feature.'),
            truefalse_third_options_label: z.string().describe('Label of the third option for TRUE/FALSE questions. If blank, the text "none" is displayed (default). Only applicable when TRUEFALSE_THIRD_OPTIONS is enabled.'),
            freetext_characters: z.string().describe('Limit the number of characters that can be entered. Applicable only for FREE-TEXT questions. Format: minimum-maximum, but you can specify only a minimum or maximum as well. Integers between 0-4000.'),
            freetext_words: z.string().describe('Limit the number of words that can be entered. Applicable only for FREE-TEXT questions. Format: minimum-maximum, but you can specify only a minimum or maximum as well. Integers between 0-4000.'),
            freetext_rules: z.string().describe('Automatic evaluation of free text questions. Applicable only for FREE-TEXT questions.'),
            file_count: z.string().describe('Limit the number of files that can be uploaded. Applicable only for FILE questions. Integer between 1-25.'),
            file_types: z.string().describe('Limit the filetypes that can be uploaded. Applicable only for FILE questions. File extensions separated by triple-and operators ("&&&").'),
            hotspot_image: z.string().describe('The image on which the points must be marked. Applicable only for HOTSPOT questions. Supported formats: PNG, JPEG, WebP. Format: filename=data, where data is either a temporary filebin storage external identifier (preferred), a base64-encoded image (whole data string) or a URL.'),
            hotspot_zones: z.string().describe('Zones accepted as answers. Applicable only for HOTSPOT questions.'),
            tags: z.string().describe('Tag questions with custom user-defined tags. Use ID or code of pre-registered tags. Multiple tags separated by triple-and operators ("&&&").'),
            label: z.string().describe('Categorize questions with instance-level labels. Pre-defined values specific to each EduBase instance. Multiple labels separated by triple-and operators ("&&&").'),
            grouping: z.string().describe('Used with type=choice or type=multiple-choice when incorrect options should be pulled from other questions assigned to the same grouping number. Not the same as type=grouping or the group field.'),
            group: z.string().describe('Add a question to a question group in a Quiz set. If the group doesn\'t exist, it will be created automatically as a complex task with default settings. Only applicable when uploading directly to a Quiz set! Existing group settings will not be changed when adding more questions.'),
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
        description: "Permanently delete a Quiz question.",
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
