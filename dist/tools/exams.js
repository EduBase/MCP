import * as z from 'zod/v4';
/*
# Exams (Highest Level in EduBase Hierarchy)

Exams are time-limited, secure instances of Quiz sets in EduBase.
They represent the highest level in the EduBase hierarchy, above both Questions and Quiz sets.

Key characteristics:
- Exams are always created from existing Quiz sets
- They have specific start and end times
- They include additional security features (cheating detection, prevention of simultaneous account access during exam)
- Usually restrict access to hints/solutions
- Generally limited to one attempt per user
- Questions cannot exist directly in Exams without being part of a Quiz set
*/
export const EDUBASE_API_TOOLS_EXAMS = [
    // GET /exams - List owned and managed exams
    {
        name: 'edubase_get_exams',
        description: "List owned and managed exams. Exams are the highest level in the EduBase Quiz hierarchy, built from Quiz sets.",
        inputSchema: z.object({
            search: z.string().optional().describe('search string to filter results'),
            limit: z.number().optional().describe('limit number of results (default: 16)'),
            page: z.number().optional().describe('page number (default: 1), not used in search mode!'),
        }),
        outputSchema: z.array(z.object({
            exam: z.string().describe('exam identification string'),
            id: z.string().optional().describe('external unique exam identifier (if set for the exam)'),
            name: z.string().describe('title of the exam'),
            active: z.boolean().describe('exam is active'),
        })),
    },
    // GET /exam - Get/check exam
    {
        name: 'edubase_get_exam',
        description: "Get/check exam.",
        inputSchema: z.object({
            exam: z.string().describe('exam identification string'),
        }),
        outputSchema: z.object({
            exam: z.string().describe('exam identification string'),
            id: z.string().optional().describe('external unique exam identifier (if set for the exam)'),
            name: z.string().describe('title of the exam'),
            quiz: z.string().describe('Quiz identification string. The Quiz set the exam is attached to'),
            active: z.boolean().describe('exam is active'),
            status: z.string().describe('exam status (INACTIVE, ACTIVE, PAUSED, REVIEW, EXPIRED)'),
            start: z.string().describe('start date and time'),
            end: z.string().describe('end date and time'),
        }),
    },
    // POST /exam - Create a new exam from an existing Quiz set
    {
        name: 'edubase_post_exam',
        description: "Create a new exam from an existing Quiz set. Exams are at the top level of the EduBase Quiz hierarchy and MUST be created from existing Quiz sets. They are time-constrained, secured assessment instances of Quiz sets.",
        inputSchema: z.object({
            language: z.string().describe('desired exam language'),
            title: z.string().describe('title of the exam'),
            id: z.string().describe('External unique exam identifier. Should be maximum 64 characters long!'),
            type: z.string().describe('Type of the exam. (default: exam) - exam: regular exam - championship: exam with championship features enabled - homework: homework assignment, can be paused and continued during the exam period - survey: survey (optionally anonymous) with no grading'),
            quiz: z.string().describe('the Quiz set (specified using the Quiz identification string) the exam is attached to'),
            open: z.string().describe('exam start time (in YYYY-mm-dd HH:ii:ss format)'),
            close: z.string().describe('exam end time (in YYYY-mm-dd HH:ii:ss format)'),
        }).partial({ language: true, id: true, type: true }),
        outputSchema: z.object({
            exam: z.string().describe('exam identification string'),
        }),
    },
    // DELETE /exam - Remove/archive exam
    {
        name: 'edubase_delete_exam',
        description: "Remove/archive exam.",
        inputSchema: z.object({
            exam: z.string().describe('exam identification string'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // GET /exam:users - List all users on an exam
    {
        name: 'edubase_get_exam_users',
        description: "List all users on an exam.",
        inputSchema: z.object({
            exam: z.string().describe('exam identification string'),
        }),
        outputSchema: z.array(z.object({
            user: z.string().describe('user identification string'),
            name: z.string().describe('name of the examinee'),
        })),
    },
    // POST /exam:users - Assign user(s) to an exam
    {
        name: 'edubase_post_exam_users',
        description: "Assign user(s) to an exam.",
        inputSchema: z.object({
            exam: z.string().describe('exam identification string'),
            users: z.string().describe('comma-separated list of user identification strings'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // DELETE /exam:users - Remove user(s) from an exam
    {
        name: 'edubase_delete_exam_users',
        description: "Remove user(s) from an exam.",
        inputSchema: z.object({
            exam: z.string().describe('exam identification string'),
            users: z.string().describe('comma-separated list of user identification strings'),
        }),
        outputSchema: z.object({}).optional(),
    },
    // POST /exam:summary - Submit a new exam summary
    {
        name: 'edubase_post_exam_summary',
        description: "Submit a new AI exam summary.",
        inputSchema: z.object({
            exam: z.string().describe('exam identification string'),
            language: z.string().describe('summary language'),
            type: z.string().describe('Type of summary. (default: ai) - ai: AI-generated summary'),
            summary: z.string().describe('Summary text. - basic HTML formatting allowed, but avoid complex designs - keep the summary short and concise - try to avoid including personal information (such as usernames, names and contact addresses)'),
            llm: z.string().describe('Name of the Large Language Model used to generate the summary. - preferred values: openai / claude / gemini'),
            model: z.string().describe('Exact LLM model name used to generate the summary'),
        }),
        outputSchema: z.object({}).optional(),
    },
];
