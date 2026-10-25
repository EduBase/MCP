import { completable } from "@modelcontextprotocol/sdk/server/completable.js";
import * as z from 'zod/v4';
import { EduBasePrompt, EduBasePromptContext, EDUBASE_QUESTION_GUIDE_TEXT, EDUBASE_QUESTION_TYPES_HINT, contentArgument, findContentText, getContentPrefix, getLanguageText, languageArgument, parseQuestionTypes, questionCountArgument, questionTypesArgument } from "./common.js";

/* Default question types (automatically graded, need no media) */
const DEFAULT_QUESTION_TYPES = 'choice, multiple-choice, true/false';

/* Arguments shared by the exam creating prompts */
const EXAM_ARGUMENTS = {
	topic: z.string().min(1).describe('Topic of the exam. Example: "Photosynthesis" or "Python basics for beginners"'),
	questions: questionCountArgument('Number of new questions in the exam, between 1 and 30. Example: 10', 30),
	types: questionTypesArgument('Optional comma-separated list of question types, the questions are spread across them (you are asked with checkboxes if left empty and your app supports it). Types: ' + EDUBASE_QUESTION_TYPES_HINT + '. Default: ' + DEFAULT_QUESTION_TYPES),
	language: languageArgument('Optional ISO 639-1 language code of the exam. Example: en. Default: the language of the topic'),
	schedule: z.string().optional().describe('Optional time window when the exam can be taken, in your own words. Example: "next Monday 9:00-10:30". Default: from now for 7 days'),
};

/* Steps building the exam (questions, Quiz set, exam) */
function getExamSteps(args: Record<string, string | undefined>, prefix: string): string {
	const types = parseQuestionTypes(args.types || DEFAULT_QUESTION_TYPES);
	const count = parseInt(args.questions || '10');
	return `1. Plan ${count} questions ${getLanguageText(args.language)}, covering the most important parts of the topic. Spread them across these question types as evenly as the content allows: ${types.join(', ')}. Mix the difficulty: mostly 2-3 on the 1-5 scale, with a few easier and harder ones.
2. Create each question with edubase_post_question. ${EDUBASE_QUESTION_GUIDE_TEXT}, for the fields each type needs. Use the external ids ${prefix}-q01, ${prefix}-q02, and so on, put them in the "/${args.topic}" path, fill in the subject, category, difficulty and explanation fields, and set ai to your model name.
3. Create a Quiz set for the exam with edubase_post_quiz (type: exam, title: the topic, id: ${prefix}-quiz), then add every created question to it with a single edubase_post_quiz_questions call.
4. Create the exam from the Quiz set with edubase_post_exam (type: exam, id: ${prefix}-exam), with a short title based on the topic. ${args.schedule ? `It can be taken ${args.schedule}, convert this to start and end times.` : 'It can be taken from now for 7 days.'} Do not assign users to it.`;
}

/* Closing instructions of the prompts creating contents */
const ON_FAILURE_TEXT = 'If a step fails, stop and explain the error, and list what was already created.';

/* Prompts definitions */
export function getExamPrompts(context: EduBasePromptContext): EduBasePrompt[] {
	const examArgument = (description: string) => contentArgument(context, 'exam', description + ' Your exams are suggested as you type.');
	return [
		// Create an exam with a new Quiz set
		{
			name: 'edubase_prompt_create_exam',
			title: 'Create an exam',
			description: 'Generate new questions about a topic, collect them into a new Quiz set and create an exam from it in your EduBase account. Choose how many questions, which question types, and optionally the language and the time window. No users are assigned to the exam.',
			toolsets: ['questions', 'quizzes', 'exams'],
			askQuestionTypes: true,
			argsSchema: EXAM_ARGUMENTS,
			text: (args) => {
				const prefix = getContentPrefix(args.topic || '');
				return `Create an exam about "${args.topic}" with ${parseInt(args.questions || '10')} new questions in my EduBase account.

${getExamSteps(args, prefix)}

${ON_FAILURE_TEXT} Finally, summarize the exam (title, identification string, start and end), the Quiz set, and a short table of the questions (type, difficulty, one-line summary).`;
			},
		},

		// Create an exam with a new Quiz set and a journey around it
		{
			name: 'edubase_prompt_create_exam_journey',
			title: 'Create an exam with a journey',
			description: 'Create a new exam about a topic (like "Create an exam"), then build a small exam journey starting from it: users who pass continue to a related exam, the others practice and retake a follow-up exam. Related exams from your EduBase account are reused, a practice Quiz set and a follow-up exam are only created if missing. The journey flags the track of each user and marks the users who need help.',
			toolsets: ['questions', 'quizzes', 'exams'],
			askQuestionTypes: true,
			argsSchema: EXAM_ARGUMENTS,
			text: (args) => {
				const prefix = getContentPrefix(args.topic || '');
				return `Create an exam about "${args.topic}" with ${parseInt(args.questions || '10')} new questions in my EduBase account, and build a small exam journey starting from it. This is a demo, so keep the journey simple and easy to follow.

## The starting exam

${getExamSteps(args, prefix)}

## Related contents

5. Look for related contents in my account: search edubase_get_exams and edubase_get_quizes with a few keywords of the topic. Only use contents that are clearly related to the topic, never the exam created above.
6. Create only what is missing, at most a practice Quiz set and a follow-up exam, each with 3-5 new questions created the same way as above (continuing the external ids):
   - practice Quiz set: easier questions to practice the basics (edubase_post_quiz with type: set, id: ${prefix}-practice),
   - follow-up exam: a related exam to continue with or to retest, if none was found (a new Quiz set and an exam, with ids ${prefix}-followup-quiz and ${prefix}-followup). It has to stay open at least as long as the starting exam.

## The journey

7. Design the journey with about this shape (adapt it to the contents found, and use the same follow-up exam on both tracks if there is only one):
   - start: the starting exam (complete_on: finish), then a condition on the result (step.result gte 80)
   - passed: a flag action (track = advanced), the related or follow-up exam, then the end (outcome: completed)
   - otherwise: a flag action (track = practice), the practice Quiz set (min_result: 70), the follow-up exam as a retest, then a condition on its result (step.result gte 60)
   - passed the retest: the end (outcome: completed)
   - failed the retest: a mark action (mode: mark) so educators can spot the user on the users page of the exam, then the end (outcome: needs-support)
   Give the nodes short, readable labels (e.g. "Passed?", "Practice"), and set a journey title and description in the settings.
8. Save the draft with edubase_put_exam_journey_graph on the starting exam. Use the edubase-exam-journeys skill if available, otherwise read the exam journey format with edubase_mcp_reference first. Check the returned issues, fix the errors and save again.
9. Publish it with edubase_post_exam_journey_publish. If the journeys are not available for my account, keep the draft and tell me.

${ON_FAILURE_TEXT} Finally, summarize the starting exam, the reused and the newly created contents, and the journey as a table of its steps by their marker letters (from edubase_get_exam_journey_graph) with what happens at each, explaining the flags and the marks.`;
			},
		},

		// Copy an exam for a new time window
		{
			name: 'edubase_prompt_copy_exam',
			title: 'Copy an exam',
			description: 'Create a new exam from the same Quiz set and with the same settings as an existing exam, for a new time window (e.g. a retake or the next semester). No users are assigned to the copy.',
			toolsets: ['exams'],
			argsSchema: {
				exam: examArgument('The exam to copy.'),
				schedule: z.string().min(1).describe('When the new exam can be taken, in your own words. Example: "June 10 9:00-11:00" or "next week"'),
				title: z.string().optional().describe('Optional title of the new exam. Default: the title of the original exam with the new date'),
			},
			text: (args) => `Copy ${findContentText('exam', args.exam)} in my EduBase account for a new time window.

1. Get the original exam with edubase_get_exam (its Quiz set, type and language).
2. Create the new exam with edubase_post_exam from the same Quiz set, copying the settings of the original (copy_settings: the original exam, keep_certificate_settings: true), with the same type and language. It can be taken ${args.schedule}, convert this to start and end times. Title: ${args.title ? `"${args.title}"` : 'the title of the original exam with the new date'}.
3. Do not assign users to it unless I ask.

${ON_FAILURE_TEXT} Finally, show the original and the new exam side by side (title, identification string, start and end).`,
		},

		// Assign the members of a class to an exam
		{
			name: 'edubase_prompt_assign_class_to_exam',
			title: 'Assign a class to an exam',
			description: 'Assign the active members of a class to an exam, so they can take it. Members already assigned are skipped.',
			toolsets: ['exams', 'classes'],
			argsSchema: {
				exam: examArgument('The exam to assign the users to.'),
				class: contentArgument(context, 'class', 'The class whose members are assigned. Your classes are suggested as you type.'),
			},
			text: (args) => `Assign the members of ${findContentText('class', args.class)} to ${findContentText('exam', args.exam)} in my EduBase account.

1. List the members of the class with edubase_get_class_members, and keep only the active memberships.
2. List the users already assigned to the exam with edubase_get_exam_users, and skip them.
3. Assign the remaining members with edubase_post_exam_users (comma-separated user identification strings, at most 100 per call).
4. Check the exam with edubase_get_exam, and warn me if it has already ended or is not active.

${ON_FAILURE_TEXT} Finally, tell me how many members were assigned, skipped as already assigned, and skipped as inactive.`,
		},

		// Summarize the results of an exam
		{
			name: 'edubase_prompt_summarize_exam_results',
			title: 'Summarize exam results',
			description: 'Analyze the results of an exam: participation, scores, pass rate, the hardest questions and skills, with suggestions for the next steps. The summary can be saved to the exam in EduBase.',
			toolsets: ['exams', 'results'],
			readOnly: true,
			argsSchema: {
				exam: examArgument('The exam to analyze.'),
				focus: z.string().optional().describe('Optional focus of the analysis, in your own words. Example: "which topics to revisit" or "compare the groups"'),
				save: completable(z.string().optional().describe('Optional: save the summary to the exam in EduBase? yes, no or ask. Default: ask'), (value) => ['ask', 'yes', 'no'].filter((option) => option.startsWith((value || '').trim().toLowerCase()))),
			},
			text: (args, options) => {
				const save = (args.save || 'ask').trim().toLowerCase();
				return `Analyze the results of ${findContentText('exam', args.exam)} in my EduBase account.

1. Get the exam with edubase_get_exam (status, start and end) and its skills with edubase_get_exam_skills.
2. List the examinees with edubase_get_exam_users, and get their results with edubase_get_exam_results_user. If there are more than 50 examinees, use a random sample of 50 and say so.
3. For the hardest questions, get the per-question details of up to 20 attempts with edubase_get_quiz_results_play.
4. Summarize: participation (assigned, started, finished), the average and the distribution of the results, the pass rate, the hardest and easiest questions, and the weakest skills, then suggest 2-3 next steps for the educator.${args.focus ? ` Focus especially on: ${args.focus}.` : ''} Do not name individual examinees, refer to them by counts or percentages.
${(options.readOnly || save == 'no') ? '' : `5. ${save == 'yes' ? 'Save' : 'Ask me whether to save'} a concise version of the summary to the exam with edubase_post_exam_summary (basic HTML, no personal information, set llm and model to your own).
`}
If the exam has no results yet, tell me instead of summarizing.`;
			},
		},

		// Check the progress of an exam journey
		{
			name: 'edubase_prompt_exam_journey_status',
			title: 'Check an exam journey',
			description: 'Show how the users progress on the exam journey started by an exam: how many are at each step, who is stuck or waiting, and the outcomes of the finished journeys.',
			toolsets: ['exams'],
			readOnly: true,
			argsSchema: {
				exam: examArgument('The starting exam of the journey.'),
			},
			text: (args) => `Show the progress of the exam journey started by ${findContentText('exam', args.exam)} in my EduBase account.

1. Get the overview with edubase_get_exam_journey: the users by status, the users at each step, and the outcomes.
2. If any users are stuck (error status) or waiting, find them: list the examinees with edubase_get_exam_users and check them with edubase_get_exam_journey_user (at most 30 users, say so if there are more).
3. Show the steps as a table by their marker letters (step, users active, waiting and in error), then the outcomes, then the users needing attention with their current step and what blocks them (users waiting at a gate step wait for an educator to approve or decline them on the interface).
4. Suggest what to do about the stuck users, but do not change anything.

If the exam has no journey, tell me and offer to build one.`,
		},
	];
}
