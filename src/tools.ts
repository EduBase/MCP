import { EDUBASE_API_TOOLS_COMMON } from "./tools/common.js";
import { EDUBASE_API_TOOLS_QUESTIONS } from "./tools/questions.js";
import { EDUBASE_API_TOOLS_EXAMS } from "./tools/exams.js";
import { EDUBASE_API_TOOLS_QUIZES } from "./tools/quizes.js";
import { EDUBASE_API_TOOLS_PLAYS } from "./tools/plays.js";
import { EDUBASE_API_TOOLS_USERS } from "./tools/users.js";
import { EDUBASE_API_TOOLS_CLASSES } from "./tools/classes.js";
import { EDUBASE_API_TOOLS_ORGANIZATIONS } from "./tools/organizations.js";
import { EDUBASE_API_TOOLS_INTEGRATIONS } from "./tools/integrations.js";
import { EDUBASE_API_TOOLS_TAGS } from "./tools/tags.js";
import { EDUBASE_API_TOOLS_PERMISSIONS } from "./tools/permissions.js";
import { EDUBASE_API_TOOLS_METRICS } from "./tools/metrics.js";

/*
# EduBase Quiz Hierarchical Structure

EduBase Quiz follows a clear three-level hierarchical structure that AI models should understand when generating content:

1. **Questions** (lowest level):
   - Basic building blocks of the Quiz system
   - Multiple question types (choice, numerical, expression, text, etc.)
   - Can be parametrized for dynamic content generation
   - Questions are stored in QuestionBase or directly in Quiz sets

2. **Quiz sets** (middle level):
   - Collections of questions and/or question groups
   - Can have various settings (time limits, scoring rules, etc.)
   - Quiz sets can be used for practice or converted to exams
   - Questions from one Quiz set can be used in multiple exams with different configurations

3. **Exams** (highest level):
   - Time-limited, secure instances of Quiz sets
   - Have specific start and end times
   - Include additional security features (cheating detection, prevention of simultaneous account access during exam)
   - Usually restrict access to hints/solutions
   - Limited to one attempt per user (typically)
   - Draw their questions from existing Quiz sets

The relationship is strictly hierarchical: Exams contain Quiz sets, which contain Questions. Questions cannot exist directly in Exams without being part of a Quiz set.

When generating content for EduBase, maintain awareness of which level you're operating at and respect the constraints of each level in the hierarchy.
*/

/* Dynamic tool annotations (based on HTTP methods) */
type EduBaseToolAnnotations = {
   title?: string;
   readOnlyHint?: boolean;
   destructiveHint?: boolean;
   idempotentHint?: boolean;
   openWorldHint?: boolean;
};
export type EduBaseApiTool = {
   name: string;
   description?: string;
   inputSchema?: unknown;
   outputSchema?: unknown;
   annotations?: EduBaseToolAnnotations;
};
function getToolMethod(name: string): string {
   return name.split('_')[1] || '';
}
function getToolTitle(tool: EduBaseApiTool): string | undefined {
   if (!tool.description || tool.description.length === 0) {
      return undefined;
   }

   const firstSentence = tool.description.split('.')[0]?.trim();
   return firstSentence && firstSentence.length > 0 ? firstSentence : undefined;
}
function inferToolAnnotations(tool: EduBaseApiTool): EduBaseToolAnnotations {
   const method = getToolMethod(tool.name);
   const readOnly = method === 'get';
   const destructive = method === 'delete';
   const idempotent = method === 'get' || method === 'patch' || method === 'put' || method === 'delete';

   return {
      title: getToolTitle(tool),
      readOnlyHint: readOnly,
      destructiveHint: readOnly ? false : destructive,
      idempotentHint: idempotent,
      openWorldHint: true,
   };
}
function withToolAnnotations(tools: EduBaseApiTool[]): EduBaseApiTool[] {
   return tools.map((tool) => ({
      ...tool,
      annotations: {
         ...inferToolAnnotations(tool),
         ...(tool.annotations || {}),
      },
   }));
}

/* Toolsets (the files toolset is always enabled, as uploads are needed by the other toolsets) */
export const EDUBASE_TOOLSETS = {
	files: EDUBASE_API_TOOLS_COMMON,
	questions: EDUBASE_API_TOOLS_QUESTIONS,
	quizzes: EDUBASE_API_TOOLS_QUIZES,
	exams: EDUBASE_API_TOOLS_EXAMS,
	results: EDUBASE_API_TOOLS_PLAYS,
	users: EDUBASE_API_TOOLS_USERS,
	classes: EDUBASE_API_TOOLS_CLASSES,
	organizations: EDUBASE_API_TOOLS_ORGANIZATIONS,
	integrations: EDUBASE_API_TOOLS_INTEGRATIONS,
	tags: EDUBASE_API_TOOLS_TAGS,
	permissions: EDUBASE_API_TOOLS_PERMISSIONS,
	metrics: EDUBASE_API_TOOLS_METRICS,
} as const;
export type EduBaseToolset = keyof typeof EDUBASE_TOOLSETS;
export const EDUBASE_TOOLSET_NAMES = Object.keys(EDUBASE_TOOLSETS) as EduBaseToolset[];
export const EDUBASE_TOOLSETS_ALWAYS_ENABLED: EduBaseToolset[] = ['files'];

/* Parse a comma-separated toolset list ("all" or empty selects every toolset) */
export function parseToolsets(value: string | null | undefined): { toolsets: EduBaseToolset[]; unknown: string[] } {
	const names = (value || '').split(',').map((name) => name.trim().toLowerCase()).filter((name) => name.length > 0);
	if (names.length == 0 || names.includes('all')) {
		return { toolsets: [...EDUBASE_TOOLSET_NAMES], unknown: names.filter((name) => name != 'all' && !EDUBASE_TOOLSET_NAMES.includes(name as EduBaseToolset)) };
	}
	return {
		toolsets: EDUBASE_TOOLSET_NAMES.filter((toolset) => names.includes(toolset) || EDUBASE_TOOLSETS_ALWAYS_ENABLED.includes(toolset)),
		unknown: names.filter((name) => !EDUBASE_TOOLSET_NAMES.includes(name as EduBaseToolset)),
	};
}

/* Tool definitions */
export type EduBaseApiToolWithToolset = EduBaseApiTool & { toolset: EduBaseToolset };
export const EDUBASE_API_TOOLS = EDUBASE_TOOLSET_NAMES.flatMap((toolset) => (EDUBASE_TOOLSETS[toolset] as EduBaseApiTool[]).map((tool) => ({ ...tool, toolset })));
export const EDUBASE_API_TOOLS_ANNOTATED = withToolAnnotations(EDUBASE_API_TOOLS) as EduBaseApiToolWithToolset[];

/* Select the tools of the enabled toolsets (only the read-only tools in read-only mode) */
export function selectTools(toolsets: EduBaseToolset[], readOnly: boolean): EduBaseApiToolWithToolset[] {
	return EDUBASE_API_TOOLS_ANNOTATED.filter((tool) => toolsets.includes(tool.toolset) && (!readOnly || tool.annotations?.readOnlyHint === true));
}
