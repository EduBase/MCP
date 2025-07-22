import { Tool } from "@modelcontextprotocol/sdk/types.js";

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

import { EDUBASE_API_TOOLS_QUESTIONS, EDUBASE_API_TOOLS_QUESTIONS_OUTPUT_SCHEMA } from "./tools/questions.js";
import { EDUBASE_API_TOOLS_EXAMS, EDUBASE_API_TOOLS_EXAMS_OUTPUT_SCHEMA } from "./tools/exams.js";
import { EDUBASE_API_TOOLS_QUIZES, EDUBASE_API_TOOLS_QUIZES_OUTPUT_SCHEMA } from "./tools/quizes.js";
import { EDUBASE_API_TOOLS_PLAYS, EDUBASE_API_TOOLS_PLAYS_OUTPUT_SCHEMA } from "./tools/plays.js";
import { EDUBASE_API_TOOLS_USERS, EDUBASE_API_TOOLS_USERS_OUTPUT_SCHEMA } from "./tools/users.js";
import { EDUBASE_API_TOOLS_CLASSES, EDUBASE_API_TOOLS_CLASSES_OUTPUT_SCHEMA } from "./tools/classes.js";
import { EDUBASE_API_TOOLS_ORGANIZATIONS, EDUBASE_API_TOOLS_ORGANIZATIONS_OUTPUT_SCHEMA } from "./tools/organizations.js";
import { EDUBASE_API_TOOLS_INTEGRATIONS, EDUBASE_API_TOOLS_INTEGRATIONS_OUTPUT_SCHEMA } from "./tools/integrations.js";
import { EDUBASE_API_TOOLS_TAGS, EDUBASE_API_TOOLS_TAGS_OUTPUT_SCHEMA } from "./tools/tags.js";
import { EDUBASE_API_TOOLS_PERMISSIONS, EDUBASE_API_TOOLS_PERMISSIONS_OUTPUT_SCHEMA } from "./tools/permissions.js";
import { EDUBASE_API_TOOLS_METRICS, EDUBASE_API_TOOLS_METRICS_OUTPUT_SCHEMA } from "./tools/metrics.js";

/* Tool definitions */
export const EDUBASE_API_TOOLS: Tool[] = [
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

/* Output schema definitions */
export const EDUBASE_API_TOOLS_OUTPUT_SCHEMA: object = {
	...EDUBASE_API_TOOLS_QUESTIONS_OUTPUT_SCHEMA,
	...EDUBASE_API_TOOLS_EXAMS_OUTPUT_SCHEMA,
	...EDUBASE_API_TOOLS_QUIZES_OUTPUT_SCHEMA,
	...EDUBASE_API_TOOLS_PLAYS_OUTPUT_SCHEMA,
	...EDUBASE_API_TOOLS_USERS_OUTPUT_SCHEMA,
	...EDUBASE_API_TOOLS_CLASSES_OUTPUT_SCHEMA,
	...EDUBASE_API_TOOLS_ORGANIZATIONS_OUTPUT_SCHEMA,
	...EDUBASE_API_TOOLS_INTEGRATIONS_OUTPUT_SCHEMA,
	...EDUBASE_API_TOOLS_TAGS_OUTPUT_SCHEMA,
	...EDUBASE_API_TOOLS_PERMISSIONS_OUTPUT_SCHEMA,
	...EDUBASE_API_TOOLS_METRICS_OUTPUT_SCHEMA
};
