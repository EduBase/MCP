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
function getToolMethod(name) {
    return name.split('_')[1] || '';
}
function getToolTitle(tool) {
    if (!tool.description || tool.description.length === 0) {
        return undefined;
    }
    const firstSentence = tool.description.split('.')[0]?.trim();
    return firstSentence && firstSentence.length > 0 ? firstSentence : undefined;
}
function inferToolAnnotations(tool) {
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
function withToolAnnotations(tools) {
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
};
export const EDUBASE_TOOLSET_NAMES = Object.keys(EDUBASE_TOOLSETS);
export const EDUBASE_TOOLSETS_ALWAYS_ENABLED = ['files'];
/* Parse a comma-separated toolset list ("all" or empty selects every toolset) */
export function parseToolsets(value) {
    const names = (value || '').split(',').map((name) => name.trim().toLowerCase()).filter((name) => name.length > 0);
    if (names.length == 0 || names.includes('all')) {
        return { toolsets: [...EDUBASE_TOOLSET_NAMES], unknown: names.filter((name) => name != 'all' && !EDUBASE_TOOLSET_NAMES.includes(name)) };
    }
    return {
        toolsets: EDUBASE_TOOLSET_NAMES.filter((toolset) => names.includes(toolset) || EDUBASE_TOOLSETS_ALWAYS_ENABLED.includes(toolset)),
        unknown: names.filter((name) => !EDUBASE_TOOLSET_NAMES.includes(name)),
    };
}
export const EDUBASE_API_TOOLS = EDUBASE_TOOLSET_NAMES.flatMap((toolset) => EDUBASE_TOOLSETS[toolset].map((tool) => ({ ...tool, toolset })));
export const EDUBASE_API_TOOLS_ANNOTATED = withToolAnnotations(EDUBASE_API_TOOLS);
/* Select the tools of the enabled toolsets (only the read-only tools in read-only mode) */
export function selectTools(toolsets, readOnly) {
    return EDUBASE_API_TOOLS_ANNOTATED.filter((tool) => toolsets.includes(tool.toolset) && (!readOnly || tool.annotations?.readOnlyHint === true));
}
