import * as z from 'zod/v4';
import { EduBasePrompt, EduBasePromptContext, EDUBASE_QUESTION_GUIDE_TEXT, EDUBASE_QUESTION_TYPES_HINT, contentArgument, difficultyArgument, findContentText, getContentPrefix, getLanguageText, languageArgument, normalizeQuestionType, parseQuestionTypes, questionTypeArgument, questionTypesArgument } from "./common.js";

/* Prompts definitions */
export function getQuestionPrompts(context: EduBasePromptContext): EduBasePrompt[] {
	return [
		// Create a new question
		{
			name: 'edubase_prompt_create_question',
			title: 'Create a question',
			description: 'Write a single new question of the chosen type about a subject and publish it to your EduBase QuestionBase, ready to be added to Quiz sets.',
			toolsets: ['questions'],
			argsSchema: {
				type: questionTypeArgument('Question type: ' + EDUBASE_QUESTION_TYPES_HINT + '. Example: choice'),
				subject: z.string().min(1).describe('Subject or topic of the question. Example: "Photosynthesis" or "World War I causes"'),
				difficulty: difficultyArgument('Optional difficulty from 1 (very easy) to 5 (very difficult). Default: 3'),
				language: languageArgument('Optional ISO 639-1 language code of the question. Example: en. Default: the language of the subject'),
			},
			text: (args) => {
				const type = normalizeQuestionType(args.type || '');
				const prefix = getContentPrefix(args.subject || '');
				return `Create a new ${type} question about "${args.subject}" in my EduBase account.

1. Write one clear, unambiguous question ${getLanguageText(args.language)}, suitable for educational purposes, with difficulty ${args.difficulty || '3'} on the 1-5 scale. ${EDUBASE_QUESTION_GUIDE_TEXT}, for the fields the ${type} type needs. If the type has incorrect options, make them plausible. Add a short explanation of the correct answer.
2. Publish it with edubase_post_question, using the external id ${prefix}-q01, the path "/${args.subject}", and filling in the subject, category, difficulty and explanation fields. Set ai to your model name.
3. Show me the question as students will see it, the correct answer, and its identification string returned by EduBase.`;
			},
		},

		// Create questions from a document
		{
			name: 'edubase_prompt_questions_from_document',
			title: 'Create questions from a document',
			description: 'Turn a document (lecture notes, slides, a textbook chapter, a policy, etc.) into new EduBase questions, optionally collected into a Quiz set. Attach the document to the conversation or give its location.',
			toolsets: ['questions', 'quizzes'],
			argsSchema: {
				document: z.string().min(1).describe('The document to use: "attached" if you attached it to the conversation, or a file path or URL. Example: attached'),
				questions: z.string().regex(/^\s*\d*\s*$/, { message: 'Give the number of questions as a whole number' }).optional().describe('Optional number of questions, between 1 and 50. Default: about one question per key idea of the document'),
				types: questionTypesArgument('Optional comma-separated list of question types. Types: ' + EDUBASE_QUESTION_TYPES_HINT + '. Default: the types fitting the content best'),
				quiz: contentArgument(context, 'quiz', 'Optional Quiz set to add the questions to: a title of a new Quiz set, or an existing one (suggested as you type). Default: the questions are not added to a Quiz set', true),
				language: languageArgument('Optional ISO 639-1 language code of the questions. Example: en. Default: the language of the document'),
			},
			text: (args) => {
				const prefix = getContentPrefix(args.quiz || 'document');
				const count = parseInt(args.questions || '');
				const types = args.types ? parseQuestionTypes(args.types) : [];
				return `Create EduBase questions from ${args.document == 'attached' ? 'the attached document' : `the document at ${args.document}`}.

1. Read the document and pick its key ideas, facts and skills worth testing. Only use what the document states, do not add outside facts.
2. Plan ${Number.isInteger(count) && count > 0 ? count : 'about one question per key idea (at most 20)'} questions ${args.language ? getLanguageText(args.language) : 'in the language of the document'}, ${types.length > 0 ? `using these question types: ${types.join(', ')}` : 'choosing the question types that fit each idea best'}. Mix the difficulty, and show me the plan as a short list (type, difficulty, what it tests) before creating anything.
3. Once I agree, create each question with edubase_post_question. ${EDUBASE_QUESTION_GUIDE_TEXT}. Use the external ids ${prefix}-q01, ${prefix}-q02, and so on, put them in one path named after the document, fill in the subject, category, difficulty and explanation fields, mention the document in source, and set ai to your model name.
${args.quiz ? `4. Add every created question to ${findContentText('quiz', args.quiz)} with a single edubase_post_quiz_questions call. If no such Quiz set exists, create it first with edubase_post_quiz (type: set).
5.` : '4.'} Summarize what was created, with the identification strings returned by EduBase.`;
			},
		},
	];
}
