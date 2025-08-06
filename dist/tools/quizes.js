/*
# Quiz Sets (Middle Level in EduBase Hierarchy)

Quiz sets are collections of questions and/or question groups in EduBase.
They sit between Questions (lowest level) and Exams (highest level) in the hierarchy.

Key characteristics:
- Quiz sets contain a set of questions or question groups
- They can be used for practice or to power Exams
- Questions in a Quiz set can be random or fixed
- One Quiz set can be used to create multiple Exams
*/
/* Tool definitions */
export const EDUBASE_API_TOOLS_QUIZES = [
    // GET /quizes - List owned and managed Quiz sets
    {
        name: 'edubase_get_quizes',
        description: "List owned and managed Quiz sets. Quiz sets are named collections of questions that sit at the middle level of the EduBase Quiz hierarchy.",
        inputSchema: {
            type: 'object',
            properties: {
                search: {
                    type: 'string',
                    description: 'search string to filter results',
                },
                limit: {
                    type: 'number',
                    description: 'limit number of results (default: 16)',
                },
                page: {
                    type: 'number',
                    description: 'page number (default: 1), not used in search mode!',
                },
            },
            required: [],
        },
    },
    // GET /quiz - Get/check Quiz set
    {
        name: 'edubase_get_quiz',
        description: "Get/check Quiz set. Containing questions and powering Exams.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string',
                },
            },
            required: ['quiz'],
        },
    },
    // POST /quiz - Create a new Quiz set
    {
        name: 'edubase_post_quiz',
        description: "Create a new Quiz set. Quiz sets are collections of questions that can be used for practice or to power multiple Exams.",
        inputSchema: {
            type: 'object',
            properties: {
                language: {
                    type: 'string',
                    description: 'desired Quiz set language',
                },
                title: {
                    type: 'string',
                    description: 'title of the Quiz set',
                },
                description: {
                    type: 'string',
                    description: 'short description',
                },
                mode: {
                    type: 'string',
                    description: "Sets how questions are displayed during the Quiz. (default: TEST)\n" +
                        "- TEST: all questions are displayed at once, user can answer them in any order and switch between them\n" +
                        "- TURNS: questions are displayed one by one, only one question is visible at a time and the user must answer it before moving to the next question\n"
                },
                type: {
                    type: 'string',
                    description: "Type of the Quiz set. (default: set)\n" +
                        "- set: for practice purposes\n" +
                        "- exam: for exam purposes\n" +
                        "- private: for private purposes (e.g testing)\n"
                },
            },
            required: ['title'],
        },
    },
    // DELETE /quiz - Remove/archive Quiz set
    {
        name: 'edubase_delete_quiz',
        description: "Remove/archive Quiz set.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string',
                },
            },
            required: ['quiz'],
        },
    },
    // GET /quiz:questions - List all questions and question groups in a Quiz set
    {
        name: 'edubase_get_quiz_questions',
        description: "List all questions and question groups in a Quiz set. Quiz sets contain questions (lowest level) and can be used by exams (highest level).",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string',
                },
            },
            required: ['quiz'],
        },
    },
    // POST /quiz:questions - Assign question(s) to a Quiz set, or one of its question group
    {
        name: 'edubase_post_quiz_questions',
        description: "Assign question(s) to a Quiz set, or one of its question group. Questions can exist independently from Quiz sets.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string',
                },
                group: {
                    type: 'string',
                    description: 'question group title',
                },
                questions: {
                    type: 'string',
                    description: 'comma-separated list of question identification strings',
                },
            },
            required: ['quiz', 'questions'],
        },
    },
    // DELETE /quiz:questions - Remove question(s) from a Quiz set, or one of its question group
    {
        name: 'edubase_delete_quiz_questions',
        description: "Remove question(s) from a Quiz set, or one of its question group.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string',
                },
                group: {
                    type: 'string',
                    description: 'question group title',
                },
                questions: {
                    type: 'string',
                    description: 'comma-separated list of question identification strings',
                },
            },
            required: ['quiz', 'questions'],
        },
    },
];
/* Output schema definitions */
export const EDUBASE_API_TOOLS_QUIZES_OUTPUT_SCHEMA = {
    // GET /quizes - List owned and managed Quiz sets
    edubase_get_quizes: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'quiz identification string',
                },
                name: {
                    type: 'string',
                    description: 'title of the Quiz set',
                },
            },
        },
    },
    // GET /quiz - Get/check Quiz set
    edubase_get_quiz: {
        type: 'object',
        properties: {
            quiz: {
                type: 'string',
                description: 'quiz identification string',
            },
            name: {
                type: 'string',
                description: 'title of the Quiz set',
            },
        },
    },
    // GET /quiz - Create a new Quiz set
    edubase_post_quiz: {
        type: 'object',
        properties: {
            quiz: {
                type: 'string',
                description: 'quiz identification string',
            },
        },
    },
    // DELETE /quiz - Remove/archive Quiz set
    edubase_delete_quiz: {},
    // GET /quiz:questions - List all questions and question groups in a Quiz set
    edubase_get_quiz_questions: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'external unique question identifier (if present)',
                },
                question: {
                    type: 'string',
                    description: 'question identification string (if question)',
                },
                group: {
                    type: 'string',
                    description: 'question group title (if group)',
                },
                active: {
                    type: 'boolean',
                    description: 'active item',
                },
            },
        },
    },
    // POST /quiz:questions - Assign question(s) to a Quiz set, or one of its question group
    edubase_post_quiz_questions: {},
    // DELETE /quiz:questions - Remove question(s) from a Quiz set, or one of its question group
    edubase_delete_quiz_questions: {},
};
