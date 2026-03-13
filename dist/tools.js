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
    const idempotent = method === 'get' || method === 'delete';
    return {
        title: getToolTitle(tool),
        readOnlyHint: readOnly,
        destructiveHint: readOnly ? false : destructive,
        idempotentHint: idempotent,
        openWorldHint: false,
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
/* Tool definitions */
export const EDUBASE_API_TOOLS = [
    ...EDUBASE_API_TOOLS_QUESTIONS,
    ...EDUBASE_API_TOOLS_EXAMS,
    ...EDUBASE_API_TOOLS_PLAYS,
    ...EDUBASE_API_TOOLS_QUIZES,
    ...EDUBASE_API_TOOLS_USERS,
    ...EDUBASE_API_TOOLS_CLASSES,
    ...EDUBASE_API_TOOLS_ORGANIZATIONS,
    ...EDUBASE_API_TOOLS_INTEGRATIONS,
    ...EDUBASE_API_TOOLS_TAGS,
    ...EDUBASE_API_TOOLS_PERMISSIONS,
    ...EDUBASE_API_TOOLS_METRICS
];
export const EDUBASE_API_TOOLS_ANNOTATED = withToolAnnotations(EDUBASE_API_TOOLS);
