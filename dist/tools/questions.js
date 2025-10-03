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
    // GET /question - Check existing question
    {
        name: 'edubase_get_question',
        description: "Check existing question. Questions are the lowest level in the EduBase hierarchy, serving as the building blocks for Quiz sets. To get question details, use the question export function!",
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'external unique question identifier',
                },
            },
            required: ['id'],
        },
    },
    // POST /question - Publish or update a question
    {
        name: 'edubase_post_question',
        description: "Publish or update a question. Questions are the atomic building blocks of the EduBase Quiz system and represent the lowest level in the hierarchy (Questions -> Quiz sets -> Exams).",
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: "External unique question identifier for question management.\n" +
                        "Should be maximum 64 characters long!\n" +
                        "On repeated uploads, the questions are updated (rather then added) based on this value, which can be an arbitrary text.\n" +
                        "If the question already exists at upload time with the same external identifier (in the given folder or Quiz set), the existing question will be updated instead of being added as a new one.\n" +
                        "- Use cases:\n" +
                        " - Integration with external systems\n" +
                        " - Version control\n" +
                        " - Batch updates\n" +
                        " - Content synchronization\n" +
                        "- Best practices:\n" +
                        " - Use consistent naming conventions\n" +
                        " - Include version, source or date information\n" +
                        " - Consider hierarchical IDs for related content\n" +
                        "Example:\n" +
                        "- id=MATHEMATICS_ARITHMETIC_BASIC_ADDITION_STATIC_001\n" +
                        "- type=numerical\n" +
                        "- content=What is 2+2?\n" +
                        "- answer=4"
                },
                type: {
                    type: 'string',
                    description: "Type of the question.\n" +
                        "EduBase supports various question types to accommodate different assessment needs:\n" +
                        "- Basic Types:\n" +
                        " - GENERIC: Strict matching including spaces and punctuation\n" +
                        " - TEXT: Basic text input with flexible matching (ignores spaces and punctuation)\n" +
                        " - FREE-TEXT: Extended text response with semi-automatic grading\n" +
                        " - READING: Non-assessed text display for complex question groups\n" +
                        "- Choice-Based Types:\n" +
                        " - CHOICE: Single correct answer selection\n" +
                        " - MULTIPLE-CHOICE: Multiple correct answers\n" +
                        " - ORDER: Sequence arrangement (arrange items in correct order)\n" +
                        " - TRUE/FALSE: Statement evaluation (true statements in ANSWER, false in OPTIONS)\n" +
                        "- Numerical Types:\n" +
                        " - NUMERIC: Numerical value validation with fractions, constants, intervals\n" +
                        " - DATE/TIME: Calendar date validation with adjustable precision\n" +
                        " - EXPRESSION: Mathematical expression evaluation\n" +
                        "- Advanced Types:\n" +
                        " - MATRIX/MATRIX:EXPRESSION: Matrix evaluation (format: [a;b|c;d] for 2x2)\n" +
                        " - SET/SET:TEXT: Unordered collection validation\n" +
                        " - FILE: File submission evaluation\n" +
                        "Example:\n" +
                        "type=numerical"
                },
                content: {
                    type: 'string',
                    description: "The main question text that will be displayed to the test taker.\n" +
                        "Supports rich formatting options:\n" +
                        "- LaTeX Support (requires QUESTION_FORMAT=LATEX):\n" +
                        " - Inline: $$...$$\n" +
                        " - Block: $$$$...$$$$\n" +
                        " - IMPORTANT: When using LaTeX in questions, you MUST use double dollar signs ($$...$$) for inline math or quadruple dollar signs ($$$$...$$$$) for block math.\n" +
                        " - Single dollar signs ($...$) are NOT supported and will not render correctly. The inline or block method must be used, as $...$ won't work!\n" +
                        "- Parameters: Use curly braces {parameter_name} (defined in PARAMETERS field)\n" +
                        "- Quick expressions: Use ~~~expression~~~ for simple parameter calculations, e.g., area of a circle is ~~~{r}*{r}*pi~~~\n" +
                        "- Style formatting with EduTags:\n" +
                        " - Bold: [[B]]...[[/B]]\n" +
                        " - Italic: [[I]]...[[/I]]\n" +
                        " - Underline: [[U]]...[[/U]]\n" +
                        " - Subscript: [[SUB]]...[[/SUB]], Superscript: [[SUP]]...[[/SUP]]\n" +
                        " - Code: [[CODE]]...[[/CODE]], [[CODEBLOCK]]...[[/CODEBLOCK]]\n" +
                        " - Colors: [[COLOR:{color}]]...[[/COLOR]], [[BACKGROUND:{color}]]...[[/BACKGROUND]]\n" +
                        "- Tables: Use [[..]] format with semicolons for columns, vertical bars for rows, e.g., [[Header 1; Header 2 | Data 1; Data 2]]\n" +
                        "- Answer placeholders: [[___]] (3 underscores), for fill-in-the-gaps\n" +
                        "Example:\n" +
                        "content=Calculate the area of a circle with radius {r} using $$A = \\pi r^2$$"
                },
                question_format: {
                    type: 'string',
                    description: "Controls question text rendering.\n" +
                        "- NORMAL: Default text formatting with standard font size, recommended for most tasks\n" +
                        "- LATEX: Enables LaTeX for mathematical, scientific notations (using KaTeX)\n" +
                        "- LONG: Smaller font with automatic paragraph breaks (ideal for lengthy text)\n" +
                        "Example:\n" +
                        "question_format=LATEX"
                },
                answer: {
                    type: 'string',
                    description: "The correct answer(s) for the question.\n" +
                        "- For multiple answers, separate with triple-and operator (\"&&&\")\n" +
                        "- Parameters can be used in curly braces {param_name}\n" +
                        "- LaTeX Support (requires QUESTION_FORMAT=LATEX):\n" +
                        " - Inline: $$...$$\n" +
                        " - Block: $$$$...$$$$\n" +
                        " - IMPORTANT: When using LaTeX in answer, you MUST use double dollar signs ($$...$$) for inline math or quadruple dollar signs ($$$$...$$$$) for block math.\n" +
                        " - Single dollar signs ($...$) are NOT supported and will not render correctly. The inline or block method must be used, as $...$ won't work!\n" +
                        "- Usage by question type:\n" +
                        " - CHOICE: The correct option\n" +
                        " - MULTIPLE-CHOICE: All correct options\n" +
                        " - TEXT/NUMERICAL/EXPRESSION: Expected response(s)\n" +
                        " - ORDER: Items in correct sequence\n" +
                        " - TRUE/FALSE: True statements (false statements go in OPTIONS)\n" +
                        " - MATRIX types: Use format [a;b|c;d] for matrices\n" +
                        " - SET types: Unordered collection of elements\n" +
                        "Example:\n" +
                        "answer=Paris\n" +
                        "answer=sin(x)^2+cos(x)^2 # with type = EXPRESSION\n" +
                        "answer=$$sin^2(x)+cos^2(x)$$ # with type = CHOICE so it renders correctly"
                },
                language: {
                    type: 'string',
                    description: "The language of the question.\n" +
                        "- Alpha-2 code according to ISO 639-1\n" +
                        "Example:\n" +
                        "language=hu  # Hungarian"
                },
                image: {
                    type: 'string',
                    description: "Attach an image to the question.\n" +
                        "Supported formats: PNG, JPEG, WebP\n" +
                        "Format: filename=data, where data is either a base64-encoded image or a URL"
                },
                answer_order: {
                    type: 'string',
                    description: "Controls whether the sequence of multiple answers matters.\n" +
                        "- Plus sign (+) to indicate YES\n" +
                        "- Blank field or minus sign (-) indicates NO (default)\n" +
                        "- When using answer_label, this is automatically activated\n" +
                        "- Essential for questions where sequence is important (e.g., steps in a process)\n" +
                        "Example:\n" +
                        "answer_order=+\n" +
                        "Example API call:\n" +
                        "id=europe_cities_population\n" +
                        "type=text\n" +
                        "content=List the following European cities in descending order by population (largest first)\n" +
                        "answer=London &&& Madrid &&& Paris\n" +
                        "answer_order=+"
                },
                answer_label: {
                    type: 'string',
                    description: "Text displayed in/above the input field during the test.\n" +
                        "- Separate multiple labels with triple-and operators (\"&&&\")\n" +
                        "- Automatically activates the answer_order function\n" +
                        "- Perfect for multi-part questions where each part needs clear labeling\n" +
                        "- Useful for creating pairing/matching questions\n" +
                        "Example:\n" +
                        "answer_label=a) Distance (km) &&& b) Time (hours) &&& c) Speed (km/h)\n" +
                        "Example API call:\n" +
                        "id=basic_math\n" +
                        "type=numerical\n" +
                        "content=Given the number 16:\\n\\na) What is double this number?\\n\\nb) What is half of this number?\\n\\nc) What is this number plus 10?\n" +
                        "answer=32 &&& 8 &&& 26\n" +
                        "answer_label=a) Double &&& b) Half &&& c) Plus 10\n" +
                        "points=3"
                },
                answer_hide: {
                    type: 'string',
                    description: "Controls whether correct answers are hidden on the results page.\n" +
                        "- Plus sign (+) to indicate YES\n" +
                        "- Blank field or minus sign (-) indicates NO (default)\n" +
                        "- Useful for test security and preventing answer sharing\n" +
                        "- Critical for reusable questions and practice tests\n" +
                        "Example:\n" +
                        "answer_hide=+\n" +
                        "Example API call:\n" +
                        "id=uk_countries\n" +
                        "type=text\n" +
                        "content=Name any of the countries within the United Kingdom!\n" +
                        "answer=England &&& Northern Ireland &&& Scotland &&& Wales\n" +
                        "answer_require=1\n" +
                        "answer_hide=+"
                },
                answer_indefinite: {
                    type: 'string',
                    description: "Allows users to add any number of input fields using + and - buttons.\n" +
                        "- Plus sign (+) to indicate YES\n" +
                        "- Blank field or minus sign (-) indicates NO (default)\n" +
                        "- Answer labels will not appear when this is enabled\n" +
                        "- Ideal for brainstorming exercises or questions with variable number of answers\n" +
                        "Example:\n" +
                        "answer_indefinite=+\n" +
                        "Example API call:\n" +
                        "id=name_countries\n" +
                        "type=text\n" +
                        "content=Name as many European countries as you can think of.\n" +
                        "answer=France &&& Germany &&& Italy &&& Spain &&& United Kingdom &&& ...\n" +
                        "answer_indefinite=+"
                },
                answer_format: {
                    type: 'string',
                    description: "Defines how to display the answer on the results page.\n" +
                        "- Only applicable for FREE-TEXT questions\n" +
                        "- Format: type or type:value\n" +
                        "- Available types:\n" +
                        " - normal: standard text (default)\n" +
                        " - code: with syntax highlighting (specify language after colon)\n" +
                        "Example:\n" +
                        "answer_format=code:python\n" +
                        "answer_format=code:sql\n" +
                        "Example API call:\n" +
                        "id=sql_basics\n" +
                        "type=free-text\n" +
                        "content=Write a SQL query to select all columns from the \"users\" table where the age is greater than 18.\n" +
                        "answer=SELECT * FROM users WHERE age > 18\n" +
                        "answer_format=code:sql"
                },
                answer_require: {
                    type: 'string',
                    description: "Number of answers required for maximum score.\n" +
                        "- Not applicable for CHOICE and FREE-TEXT questions\n" +
                        "- Perfect for questions with multiple valid answers where only a subset needs to be provided\n" +
                        "- Useful when asking students to provide any X examples from a larger set\n" +
                        "Example:\n" +
                        "answer_require=3\n" +
                        "Example API call:\n" +
                        "id=uk_countries\n" +
                        "type=text\n" +
                        "content=Name any one of the countries within the United Kingdom!\n" +
                        "answer=England &&& Northern Ireland &&& Scotland &&& Wales\n" +
                        "answer_require=1"
                },
                subject: {
                    type: 'string',
                    description: "Subject classification for organizing questions.\n" +
                        "- Provides primary categorization for content organization\n" +
                        "- Use the question editor in the EduBase UI for an up-to-date list of possible values\n" +
                        "Example:\n" +
                        "subject=Mathematics\n" +
                        "category=Algebra"
                },
                category: {
                    type: 'string',
                    description: 'Category, another layer of organization as seen in SUBJECT',
                },
                path: {
                    type: 'string',
                    description: "Path where question will be stored in personal QuestionBase.\n" +
                        "- Default: /API\n" +
                        "- Supports hierarchical structure with forward slashes\n" +
                        "- Always start with a forward slash!\n" +
                        "Example:\n" +
                        "path=/Mathematics/Calculus/Derivatives"
                },
                options: {
                    type: 'string',
                    description: "Incorrect options or false statements for choice-based question types.\n" +
                        "- Required for CHOICE, MULTIPLE-CHOICE question types\n" +
                        "- For TRUE/FALSE, these are the false statements (ANSWER contains true statements)\n" +
                        "- Separate multiple options with triple-and operators (\"&&&\")\n" +
                        "- Parameters can be used in curly braces {param_name}\n" +
                        "- LaTeX Support (requires QUESTION_FORMAT=LATEX):\n" +
                        " - Inline: $$...$$\n" +
                        " - Block: $$$$...$$$$\n" +
                        " - IMPORTANT: When using LaTeX in questions, you MUST use double dollar signs ($$...$$) for inline math or quadruple dollar signs ($$$$...$$$$) for block math.\n" +
                        " - Single dollar signs ($...$) are NOT supported and will not render correctly. The inline or block method must be used, as $...$ won't work!\n" +
                        "Example:\n" +
                        "options=London &&& Berlin &&& Madrid\n" +
                        "Example API call:\n" +
                        "id=capital_france\n" +
                        "type=choice\n" +
                        "content=What is the capital of France?\n" +
                        "answer=Paris\n" +
                        "options=London &&& Berlin &&& Madrid"
                },
                options_fix: {
                    type: 'string',
                    description: "Controls the arrangement of answers and options.\n" +
                        "- Available values:\n" +
                        " - all: Answers appear first, followed by options\n" +
                        " - abc: Sort all items (answers and options) alphabetically\n" +
                        " - first:N: Place first N options at the end\n" +
                        " - last:N: Place last N options at the end\n" +
                        " - answers: Place all answers at the end\n" +
                        "- Useful for maintaining consistent presentation or for specific pedagogical purposes\n" +
                        "For alphabetical ordering:\n" +
                        "- When migrating content from textbooks or past exams, can maintain original lettering system (a, b, c...) for:\n" +
                        " - Reference consistency with printed materials\n" +
                        " - Alignment with answer keys\n" +
                        " - Compatibility with existing grading systems\n" +
                        " - Cross-referencing with study guides\n" +
                        "- Particularly valuable when:\n" +
                        " - Test takers need to refer to both digital and printed materials\n" +
                        " - Questions are part of a larger standardized test system\n" +
                        " - Maintaining consistency with existing worksheets or textbooks\n" +
                        " - Digitizing legacy assessment materials\n" +
                        "Example:\n" +
                        "options_fix=abc\n" +
                        "Example API call:\n" +
                        "id=fruit_types\n" +
                        "type=multiple-choice\n" +
                        "content=Which of these are citrus fruits?\n" +
                        "answer=Lemon &&& Orange\n" +
                        "options=Apple &&& Banana &&& Grape\n" +
                        "options_fix=abc\n" +
                        "Example API call:\n" +
                        "id=vocab_synonyms\n" +
                        "type=multiple-choice\n" +
                        "content=Select all words that mean \"happy\":\n" +
                        "answer=b) Joyful &&& d) Merry\n" +
                        "options=a) Angry &&& c) Sleepy &&& e) Tired\n" +
                        "options_fix=abc"
                },
                options_order: {
                    type: 'string',
                    description: "Define exact presentation order of answers and options.\n" +
                        "- Format: ANSWER:N or OPTION:N items separated by \"&&&\"\n" +
                        "- ANSWER:N references the Nth provided answer\n" +
                        "- OPTION:N references the Nth provided option\n" +
                        "- OPTION_NONE:N references the Nth third option (for TRUE/FALSE questions)\n" +
                        "- All answers and options must be specified exactly once\n" +
                        "Example:\n" +
                        "options_order=OPTION:0 &&& ANSWER:0 &&& OPTION:1 &&& ANSWER:1\n" +
                        "Example API call to create a chronologically ordered timeline\n" +
                        "id=historical_chronology\n" +
                        "type=multiple-choice\n" +
                        "content=Which of these events occurred during the Industrial Revolution (1760-1840)?\n" +
                        "answer=Invention of the Steam Engine &&& First Steam Locomotive &&& First Commercial Railway\n" +
                        "options=Printing Press Invented &&& First Electric Light Bulb &&& First Powered Flight\n" +
                        "options_order=OPTION:0 &&& ANSWER:0 &&& ANSWER:1 &&& ANSWER:2 &&& OPTION:1 &&& OPTION:2"
                },
                points: {
                    type: 'string',
                    description: "Maximum points for a fully correct answer.\n" +
                        "- Default: 1 point\n" +
                        "- For questions with multiple answers, partial credit is possible based on SUBSCORING method\n" +
                        "Example:\n" +
                        "points=10"
                },
                subscoring: {
                    type: 'string',
                    description: "Method for calculating partial credit for partially correct answers.\n" +
                        "- Not applicable for CHOICE, READING and FREE-TEXT questions\n" +
                        "- Available values:\n" +
                        " - PROPORTIONAL: Points awarded proportionally to correct answers (default)\n" +
                        " - LINEAR_SUBSTRACTED:N: Linear scoring with N points subtracted for each error\n" +
                        " - CUSTOM: Use custom point distribution defined in SUBPOINTS field\n" +
                        " - NONE: No partial credit, all-or-nothing scoring\n" +
                        "Example:\n" +
                        "subscoring=LINEAR_SUBSTRACTED:2\n" +
                        "Example API call:\n" +
                        "id=math_problem\n" +
                        "type=numerical\n" +
                        "content=What is the sum and product of {a} and {b}?\n" +
                        "answer={a}+{b} &&& {a}*{b}\n" +
                        "parameters={a; INTEGER; 1; 100} &&& {b; INTEGER; 1; 100}\n" +
                        "points=4\n" +
                        "subscoring=CUSTOM\n" +
                        "subpoints=25 &&& 75"
                },
                subpoints: {
                    type: 'string',
                    description: "Define specific point values for each answer in percentages.\n" +
                        "- Only used when subscoring=CUSTOM\n" +
                        "- Specify percentage values separated by triple-and operators (\"&&&\")\n" +
                        "- Not applicable for CHOICE, READING and FREE-TEXT questions\n" +
                        "- Values should sum to 100 (for percentage)\n" +
                        "Example:\n" +
                        "subpoints=50 &&& 25 &&& 25\n" +
                        "Example meaning: For a 10-point question with three answers:\n" +
                        "- First answer: 5 points (50%)\n" +
                        "- Second answer: 2.5 points (25%)\n" +
                        "- Third answer: 2.5 points (25%)"
                },
                penalty_scoring: {
                    type: 'string',
                    description: "Controls how penalty points should be applied.\n" +
                        "- Available values:\n" +
                        " - DEFAULT: Standard penalty application, which might vary by question type (default)\n" +
                        " - PER_ANSWER: Apply penalties for each incorrect answer\n" +
                        " - PER_QUESTION: Apply penalties once per question\n" +
                        "Example:\n" +
                        "penalty_scoring=PER_ANSWER"
                },
                penalty_points: {
                    type: 'string',
                    description: "Points deducted for completely incorrect answers.\n" +
                        "- No penalty applied if answer is partially correct\n" +
                        "- No penalty for empty/unanswered questions\n" +
                        "- Use positive values (recommended)\n" +
                        "Example:\n" +
                        "penalty_points=2\n" +
                        "Example API call with penalties:\n" +
                        "id=physics_multiple_choice\n" +
                        "type=multiple-choice\n" +
                        "content=Which of the following are forms of energy? Select all that apply.\n" +
                        "answer=Kinetic &&& Potential &&& Thermal\n" +
                        "options=Velocity &&& Acceleration\n" +
                        "points=3\n" +
                        "penalty_scoring=PER_QUESTION\n" +
                        "penalty_points=1"
                },
                hint_penalty: {
                    type: 'string',
                    description: "Point deduction for using hints/solutions/videos during a test.\n" +
                        "- Format: type or type:value\n" +
                        "- Types:\n" +
                        " - NONE: No penalty (default)\n" +
                        " - ONCE:N%: Single deduction regardless of number used\n" +
                        " - PER-HELP:N%: Deduction for each hint (only for HINT_PENALTY)\n" +
                        "Examples:\n" +
                        "hint_penalty=ONCE:20% or hint_penalty=ONCE:0.2\n" +
                        "hint_penalty=PER-HELP:10%\n" +
                        "solution_penalty=ONCE:50%\n" +
                        "video_penalty=ONCE:15%\n" +
                        "Example API call with comprehensive penalty system:\n" +
                        "id=area_circle_parametric\n" +
                        "type=expression\n" +
                        "content=Find an expression for the area of a circle with radius {r}.\n" +
                        "answer=pi*{r}^2\n" +
                        "parameters={r; INTEGER; 2; 10}\n" +
                        "points=10\n" +
                        "subject=Mathematics\n" +
                        "category=Geometry\n" +
                        "hint=Think about the formula for circle area &&& Remember that area involves squaring the radius\n" +
                        "solution=The formula for circle area is $$\\pi r^2$$\n" +
                        "penalty_scoring=PER_ANSWER\n" +
                        "penalty_points=3\n" +
                        "hint_penalty=PER-HELP:10%\n" +
                        "solution_penalty=ONCE:50%\n" +
                        "# Each hint used reduces score by 10%, viewing solution reduces score by 50%"
                },
                solution_penalty: {
                    type: 'string',
                    description: "Similar to HINT_PENALTY\n" +
                        "Point deduction for viewing steps of the solution (NONE, ONCE:N%) (default: NONE)"
                },
                solution_image: {
                    type: 'string',
                    description: "Attach an image to the solution steps.\n" +
                        "Supported formats: PNG, JPEG, WebP\n" +
                        "Format: filename=data, where data is either a base64-encoded image or a URL"
                },
                video_penalty: {
                    type: 'string',
                    description: "Similar to HINT_PENALTY\n" +
                        "Point deduction for video assistance used (NONE, ONCE:N%) (default: NONE)"
                },
                manual_scoring: {
                    type: 'string',
                    description: "Controls when to enable manual scoring.\n" +
                        "- Not applicable for READING and FREE-TEXT questions\n" +
                        "- Available values:\n" +
                        " - NO: Never use manual scoring (default)\n" +
                        " - NOT_CORRECT: Only manually score incorrect answers\n" +
                        " - ALWAYS: Always require manual scoring\n" +
                        "Example:\n" +
                        "manual_scoring=NOT_CORRECT"
                },
                parameters: {
                    type: 'string',
                    description: "Parameter definitions for dynamic question generation.\n" +
                        "One of EduBase's most powerful features, allowing creation of dynamic questions where each user gets a unique variant of the same question.\n" +
                        "- Separate multiple parameters with triple-and operators (\"&&&\")\n" +
                        "- Up to 128 parameters can be defined\n" +
                        "Parameter Types:\n" +
                        "1. FIX (Fixed Value):\n" +
                        " - Format: {name; FIX; value}\n" +
                        " - Sets a predefined constant value (integer or fraction)\n" +
                        " - Example: {pi; FIX; 3.1415}\n" +
                        "2. INTEGER (Whole Numbers):\n" +
                        " - Simple: {name; INTEGER}\n" +
                        " - Extended: {name; INTEGER; min; max}\n" +
                        " - Full: {name; INTEGER; min; max; inside; outside}\n" +
                        " - Generate random integers within specified ranges\n" +
                        " - Use '-' for omitting min/max values\n" +
                        " - Examples:\n" +
                        "  * {p; INTEGER} - any integer\n" +
                        "  * {p; INTEGER; 10; 20} - integer between 10 and 20 (inclusive)\n" +
                        "  * {p; INTEGER; -; -; [10-20]; [12-14] ||| [16-18]} - integer between 10-20, excluding 12-14 and 16-18\n" +
                        "3. FLOAT (Decimal Numbers):\n" +
                        " - Simple: {name; FLOAT; precision}\n" +
                        " - Extended: {name; FLOAT; precision; min; max}\n" +
                        " - Full: {name; FLOAT; precision; min; max; inside; outside}\n" +
                        " - Generate random decimal numbers\n" +
                        " - Specify precision (decimal places)\n" +
                        " - Examples:\n" +
                        "  * {p; FLOAT; 2} - float with 2 decimal places\n" +
                        "  * {p; FLOAT; 5; 0; 1} - float between 0 and 1 with 5 decimals\n" +
                        "  * {p; FLOAT; 1; 0; 10; -; [0-1]} - float between 0-10 excluding 0-1, with 1 decimal\n" +
                        "4. FORMULA (Expressions):\n" +
                        " - Simple: {name; FORMULA; formula}\n" +
                        " - Full: {name; FORMULA; formula; precision}\n" +
                        " - Define parameters based on other parameters\n" +
                        " - Examples:\n" +
                        "  * {d; FORMULA; {b}^2-4*{a}*{c}} - quadratic formula discriminant\n" +
                        "  * {p; FORMULA; 2*{q}+1} - linear expression\n" +
                        "5. LIST (Random Selection):\n" +
                        " - Format: {name; LIST; value1; value2; value3; ...}\n" +
                        " - Randomly select from predefined values\n" +
                        " - Up to 64 elements\n" +
                        " - Examples:\n" +
                        "  * {primes; LIST; 2; 3; 5; 7; 11}\n" +
                        "  * {animals; LIST; dog; cat; snake; camel}\n" +
                        "6. PERMUTATION:\n" +
                        " - Format: {name; PERMUTATION; value1; value2; value3; ...}\n" +
                        " - Creates permutated parameters accessible as {name_1}, {name_2}, etc.\n" +
                        " - Example: {p; PERMUTATION; A; B; C; D}\n" +
                        "  * So {p_1} will be a different letter than {p_2}\n" +
                        " - Example: {primes; PERMUTATION; 2; 3; 5; 7}\n" +
                        "  * So both {primes_1} and {primes_2} will be different single digit primes\n" +
                        "7. FORMAT:\n" +
                        " - Format: {name; FORMAT; parameter; type; ...}\n" +
                        " - Format parameters based on other parameters\n" +
                        " - Supported types: NUMBER, NUMERTEXT, ROMAN\n" +
                        " - Optional extra parameters based on type\n" +
                        "  * NUMBER\n" +
                        "   * precision: number of decimal places\n" +
                        " - Examples:\n" +
                        "  * {pp; FORMAT; p; NUMBER; 1} - format as number rounded to 1 decimal\n" +
                        "  * {pp; FORMAT; p; NUMBERTEXT} - format number as text\n" +
                        "  * {pp; FORMAT; p; ROMAN} - format number as Roman numeral\n" +
                        "Best Practices:\n" +
                        " - Order parameters so dependent ones come later\n" +
                        " - Use simple notation when possible\n" +
                        " - Avoid unnecessary parameters\n" +
                        " - Use CONSTRAINTS field to ensure valid combinations\n" +
                        "Examples:\n" +
                        "parameters={pi; FIX; 3.14159} &&& {r; INTEGER; 1; 10}\n" +
                        "parameters={a; INTEGER; 1; 5} &&& {b; INTEGER; -10; 10} &&& {c; INTEGER; -10; 10} &&& {d; FORMULA; {b}^2-4*{a}*{c}}\n" +
                        "parameters={country; LIST; France; Germany; Italy} &&& {capital; LIST; Paris; Berlin; Rome}\n" +
                        "parameters_sync=+  # Ensures each country is paired with its correct capital"
                },
                parameters_sync: {
                    type: 'string',
                    description: "Controls synchronization of LIST parameter selections.\n" +
                        "- Plus sign (+) to indicate YES\n" +
                        "- Blank field or minus sign (-) indicates NO (default)\n" +
                        "- When enabled, the Nth value from each LIST is selected together\n" +
                        "- Critical for paired data like countries and capitals\n" +
                        "Example:\n" +
                        "parameters_sync=+\n" +
                        "Example API call:\n" +
                        "id=capital_city\n" +
                        "type=text\n" +
                        "content=What is the capital city of {country}?\n" +
                        "answer={capital}\n" +
                        "parameters={country; LIST; France; Germany; Italy} &&& {capital; LIST; Paris; Berlin; Rome}\n" +
                        "parameters_sync=+"
                },
                constraints: {
                    type: 'string',
                    description: "Define rules that parameter combinations must satisfy.\n" +
                        "- Mathematical expressions that must evaluate to true\n" +
                        "- Parameters must be in curly braces {param}\n" +
                        "- Allowed relations: <, <=, =, >=, >, <>\n" +
                        "- Multiple constraints separated by triple-and operators (\"&&&\")\n" +
                        "Examples:\n" +
                        "constraints={b}^2-4*{a}*{c}>0\n" +
                        "constraints={a}+{b}>{c} &&& {b}+{c}>{a} &&& {c}+{a}>{b}\n" +
                        "constraints={x}+{y}<10 &&& {x}<4"
                },
                expression_check: {
                    type: 'string',
                    description: "Define how expressions should be validated (RANDOM, EXPLICIT, COMPARE) (default: RANDOM).\n" +
                        "- RANDOM: Evaluates expressions at randomly generated points\n" +
                        "- EXPLICIT: Checks expressions at predefined values against target values\n" +
                        "- COMPARE: Direct comparison of expressions without variables\n" +
                        "Example:\n" +
                        "expression_check=RANDOM"
                },
                expression_variable: {
                    type: 'string',
                    description: "Specifies variable names used in expressions (separate multiple variables with &&&) (default: x).\n" +
                        "- Multiple variables can be used for multivariable expressions\n" +
                        "- Variable names must be used consistently in answer and validation\n" +
                        "Examples:\n" +
                        "expression_variable=t &&& v  # For distance formula using time and velocity"
                },
                expression_decimals: {
                    type: 'string',
                    description: "Sets precision for decimal calculations (default: 2).\n" +
                        "- Inherited from decimals field if not specified\n" +
                        "- Critical for controlling accurate validation of expressions\n" +
                        "Example:\n" +
                        "expression_decimals=4  # For high-precision calculations"
                },
                expression_functions: {
                    type: 'string',
                    description: "Controls whether functions can be used in user inputs (+ for yes, - for no) (default: +).\n" +
                        "- Enabled by default with + sign\n" +
                        "- Disable with - sign when students should use alternative forms\n" +
                        "- Affects available input options for test takers\n" +
                        "- Supported functions include:\n" +
                        "  * Basic: sqrt, abs, round, floor, ceil\n" +
                        "  * Logarithmic: ln, log, log10\n" +
                        "  * Trigonometric: sin, cos, tan, csc, sec, arcsin/asin, arccos/acos, arctan/atan\n" +
                        "  * Hyperbolic: sinh, cosh, tanh, arcsinh/asinh, arccosh/acosh, arctanh/atanh\n" +
                        "  * Conversions: degree2radian, radian2degree, number2binary, number2hexadecimal, roman2number, etc.\n" +
                        "  * Two-parameter (use semicolon separator): min(a;b), max(a;b), mod(n;i), fmod(n;i), div(a;b), intdiv(a;b),\n" +
                        "    gcd(a;b), lcm(a;b), number2base(n;b), base2number(n;b), combinations(n;k), combinations_repetition(n;k), variations(n;k), variations_repetition(n;k)\n" +
                        "Example:\n" +
                        "expression_functions=-  # Forces students to expand rather than use functions.\n" +
                        "# When asked for the value of sin(pi), the user can't input sin(pi) because functions cannot be used."
                },
                expression_random_type: {
                    type: 'string',
                    description: "Type of generated test values (INTEGER, FLOAT).\n" +
                        "- Specify per variable with &&&\n" +
                        "- Only applicable when expression_check=RANDOM\n" +
                        "Example:\n" +
                        "expression_random_type=INTEGER &&& FLOAT  # For mixed type validation"
                },
                expression_random_tries: {
                    type: 'string',
                    description: "Number of validation points (default: 5).\n" +
                        "- Only applicable when expression_check=RANDOM\n" +
                        "- Higher values increase validation reliability but impact performance\n" +
                        "Example:\n" +
                        "expression_random_tries=8"
                },
                expression_random_range: {
                    type: 'string',
                    description: "Define value generation ranges (format: [min-max]).\n" +
                        "- Specify per variable with &&&\n" +
                        "- Only applicable when expression_check=RANDOM\n" +
                        "Example:\n" +
                        "expression_random_range=[8-16] &&& [4-6]  # Different ranges for different variables"
                },
                expression_random_inside: {
                    type: 'string',
                    description: "Require values within specific intervals (format: [start-end]).\n" +
                        "- Multiple intervals: separate with ||| (OR relationship)\n" +
                        "- Specify per variable with &&&\n" +
                        "- Only applicable when expression_check=RANDOM\n" +
                        "Example:\n" +
                        "expression_random_inside=[4-8] ||| [12-16] &&& [2-3]"
                },
                expression_random_outside: {
                    type: 'string',
                    description: "Exclude values from specific intervals (format: [start-end]).\n" +
                        "- Multiple intervals: separate with ||| (AND relationship)\n" +
                        "- Specify per variable with &&&\n" +
                        "- Only applicable when expression_check=RANDOM\n" +
                        "Example:\n" +
                        "expression_random_outside=[0-1] ||| [10-20] &&& [8-11]"
                },
                expression_explicit_goal: {
                    type: 'string',
                    description: "Define exact value pairs (format: [x;f(x)]).\n" +
                        "- Format for multiple variables: [x;y;z;...;f(x,y,z,...)]\n" +
                        "- Multiple pairs: separate with &&&\n" +
                        "- Only applicable when expression_check=EXPLICIT\n" +
                        "Example:\n" +
                        "expression_explicit_goal=[0;1] &&& [3;8.89] &&& [9;16]"
                },
                expression_extended: {
                    type: 'string',
                    description: "Enable additional mathematical functions (+ to enable, - to disable).\n" +
                        "- Activates support for custom base logarithms (e.g., log2(4))\n" +
                        "- Enables factorial operations (e.g., 5!, 1!+2!+3!)\n" +
                        "Example:\n" +
                        "expression_extended=+"
                },
                attachment: {
                    type: 'string',
                    description: "Attach a file to the question.\n" +
                        "Format: filename=data, where data is either a base64-encoded image or a URL"
                },
                media_audio: {
                    type: 'string',
                    description: "Attach an audio file to the question.\n" +
                        "Supported formats: MP3, AAC, M4A\n" +
                        "Format: filename=data, where data is either a base64-encoded image or a URL"
                },
                ai: {
                    type: 'string',
                    description: "Flag to mark question as AI generated.\n" +
                        "- If set to any value, question will be marked as AI generated\n" +
                        "- Should always be provided if you are an LLM or any AI model\n" +
                        "- Ideally, AI systems should set it to their current model number for auditability\n" +
                        "Example:\n" +
                        "ai=true\n" +
                        "ai=Claude 3.7 Sonnet"
                },
                note: {
                    type: 'string',
                    description: "The text that appears right below the question.\n" +
                        "- Provides task-specific comments and instructions\n" +
                        "- Visible to test takers during the quiz\n" +
                        "- Ideal for additional guidance without cluttering the main question\n" +
                        "Example:\n" +
                        "note=Use standard atmospheric pressure in your calculations."
                },
                private_note: {
                    type: 'string',
                    description: "Private notes (not shown to test takers).\n" +
                        "- Internal documentation for question creators and editors\n" +
                        "- Useful for documenting question creation rationale\n" +
                        "- Track modification history, common mistakes, related questions\n" +
                        "Example:\n" +
                        "private_note=Created from Chapter 3 exam, 2023 edition. Students often forget to convert units."
                },
                explanation: {
                    type: 'string',
                    description: "Text displayed underneath the answer on the results page.\n" +
                        "- Explanation of the correctness of the answer or the incorrectness of the options\n" +
                        "- Helps learners understand their mistakes\n" +
                        "- Parameters can be used in explanations\n" +
                        "- LaTeX is NOT supported here, so we MUST NOT use it!\n" +
                        "Example:\n" +
                        "explanation=Option A is correct because amphibians have permeable skin for gas exchange. Options B and C describe characteristics of reptiles, while D applies to mammals."
                },
                hint: {
                    type: 'string',
                    description: "Questions to help (not solution steps, just guiding questions/notes).\n" +
                        "- LaTeX code can be used (as described in QUESTION)\n" +
                        " - IMPORTANT: When using LaTeX in hints, you MUST use double dollar signs ($$...$$) for inline math or quadruple dollar signs ($$$$...$$$$) for block math.\n" +
                        " - Single dollar signs ($...$) are NOT supported and will not render correctly. The inline or block method must be used, as $...$ won't work!\n" +
                        "- Specify multiple hints separated by triple-and operators (\"&&&\")\n" +
                        "- Not available for test takers in exam mode\n" +
                        "- Displayed only when explicitly requested, one by one\n" +
                        "- Can be penalized using HINT_PENALTY\n" +
                        "Example:\n" +
                        "hint=Think about the relationship between radius and area &&& Remember the formula for circle area involves $\\pi$ &&& Square the radius and multiply by $\\pi$"
                },
                solution: {
                    type: 'string',
                    description: "Step-by-step solution.\n" +
                        "- LaTeX code can be used (as described in QUESTION)\n" +
                        " - IMPORTANT: When using LaTeX in solution, you MUST use double dollar signs ($$...$$) for inline math or quadruple dollar signs ($$$$...$$$$) for block math.\n" +
                        " - Single dollar signs ($...$) are NOT supported and will not render correctly. The inline or block method must be used, as $...$ won't work!\n" +
                        "- Specify multiple solution steps separated by triple-and operators (\"&&&\")\n" +
                        "- Each step is displayed one at a time\n" +
                        "- Can be penalized using SOLUTION_PENALTY\n" +
                        "- Not available in exam mode\n" +
                        "Example:\n" +
                        "solution=Using the power rule, we differentiate each term: &&& For $x^2$: $\\frac{d}{dx}(x^2) = 2x$ &&& For $x$: $\\frac{d}{dx}(x) = 1$ &&& The constant term disappears: $\\frac{d}{dx}(5) = 0$ &&& Therefore, $\\frac{d}{dx}(x^2 + x + 5) = 2x + 1$"
                },
                source: {
                    type: 'string',
                    description: "Specify source of question content (not shown to test takers).\n" +
                        "- Use cases include training material sources, documentation references, content attribution\n" +
                        "- Important for tracking question origins and copyright compliance\n" +
                        "Example:\n" +
                        "source=Mathematics Textbook Chapter 5, Page 123\n" +
                        "source=Company Safety Manual 2023, Section 3.4.2"
                },
                decimals: {
                    type: 'string',
                    description: "Decimal precision (default: 2).\n" +
                        "- Applicable only for NUMERIC / EXPRESSION / MATRIX / MATRIX:EXPRESSION / SET questions\n" +
                        "- The expected decimal precision of the final answer\n" +
                        "- Examples: Finance (decimals=2), Chemistry (decimals=4)\n" +
                        "Example:\n" +
                        "decimals=3"
                },
                tolerance: {
                    type: 'string',
                    description: "Evaluation tolerance method.\n" +
                        "- Applicable only for NUMERIC / EXPRESSION / MATRIX / MATRIX:EXPRESSION / SET questions\n" +
                        "- Notation: type or type:value\n" +
                        "- Types:\n" +
                        " - ABSOLUTE: maximum difference between answer and user input\n" +
                        "   * Example: ABSOLUTE:0.1\n" +
                        " - RELATIVE: maximum difference in percentage (symmetric mean absolute percentage error, SMAP value is used)\n" +
                        "   * Example: RELATIVE:5% or RELATIVE:0.05\n" +
                        " - QUOTIENT: integer multiple / QUOTIENT2: scalar multiple\n" +
                        "   * Example: QUOTIENT or QUOTIENT2:SYNCED\n" +
                        "Example:\n" +
                        "tolerance=ABSOLUTE:0.01"
                },
                datetime_precision: {
                    type: 'string',
                    description: "Date/time precision.\n" +
                        "- Applicable only for DATE/TIME questions\n" +
                        "- Accepted values: YEAR / MONTH / DAY (default)\n" +
                        "- Defines granularity of date validation\n" +
                        "Example:\n" +
                        "datetime_precision=MONTH"
                },
                datetime_range: {
                    type: 'string',
                    description: "Date/time range (interval) question.\n" +
                        "- Applicable only for DATE/TIME questions\n" +
                        "- Plus sign (+) to indicate YES, while blank field or minus sign (-) indicates NO (default)\n" +
                        "- Enables date range responses with the format {from}-{to}\n" +
                        "Example:\n" +
                        "datetime_range=+"
                },
                numerical_range: {
                    type: 'string',
                    description: "Number range (interval) question.\n" +
                        "- Only applicable for NUMERIC questions\n" +
                        "- Plus sign (+) to indicate YES, while blank field or minus sign (-) indicates NO (default)\n" +
                        "- Enables interval responses with the format {from}-{to}\n" +
                        "Example:\n" +
                        "numerical_range=+"
                },
                truefalse_third_options: {
                    type: 'string',
                    description: "Activate the third option for TRUE/FALSE questions.\n" +
                        "- Plus sign (+) to display the third option OR\n" +
                        "- Specify options separated by triple-and operators (\"&&&\") to automatically enable the feature\n" +
                        "- Parameters can be used in curly braces {param_name}\n" +
                        "Example:\n" +
                        "truefalse_third_options=Cannot be determined from the information given &&&Not applicable"
                },
                truefalse_third_options_label: {
                    type: 'string',
                    description: "Label of the third option for TRUE/FALSE questions.\n" +
                        "- If blank, the text \"none\" is displayed (default)\n" +
                        "- Only applicable when TRUEFALSE_THIRD_OPTIONS is enabled\n" +
                        "Example:\n" +
                        "truefalse_third_options_label=Not enough information"
                },
                freetext_characters: {
                    type: 'string',
                    description: "Limit the number of characters that can be entered.\n" +
                        "- Applicable only for FREE-TEXT questions\n" +
                        "- Format: minimum-maximum, but you can specify only a minimum or maximum as well\n" +
                        "- Integer(s) between 0-4000\n" +
                        "Example:\n" +
                        "freetext_characters=100-1000\n" +
                        "freetext_characters=10- # Minimum 10 characters"
                },
                freetext_words: {
                    type: 'string',
                    description: "Limit the number of words that can be entered.\n" +
                        "- Applicable only for FREE-TEXT questions\n" +
                        "- Format: minimum-maximum, but you can specify only a minimum or maximum as well\n" +
                        "- Integer(s) between 0-4000\n" +
                        "Example:\n" +
                        "freetext_words=-50 # Max. 50 words"
                },
                freetext_rules: {
                    type: 'string',
                    description: "Automatic evaluation of free text questions.\n" +
                        "- Applicable only for FREE-TEXT questions\n" +
                        "- Notation: {type; keywords}\n" +
                        "- Type:\n" +
                        " - 1: if keywords are included within input, answer is correct (maximum points)\n" +
                        " - 2: if keywords are included within input, answer is wrong (0 points)\n" +
                        " - 3: if no keywords are included within input, answer is good (maximum points)\n" +
                        " - 4: if keywords are not included within input, answer is wrong (0 points)\n" +
                        "- Keywords: comma-separated list (must not contain semicolons!)\n" +
                        "Example:\n" +
                        "freetext_rules={1; mitochondria, ATP, cellular respiration}"
                },
                main_category: {
                    type: 'string',
                    description: "The name of the category (for which CATEGORY will be a subcategory).\n" +
                        "- Empty by default, e.g. CATEGORY will be treated as the main category\n" +
                        "- Specify multiple levels (up to 2!) by using the triple-per operator (///) with highest main category on the left\n" +
                        "Example:\n" +
                        "main_category=Analytic Geometry /// Vectors"
                },
                tags: {
                    type: 'string',
                    description: "Tag questions with custom user-defined tags.\n" +
                        "- Use ID or code of pre-registered tags\n" +
                        "- Only previously registered tags can be used (must be pre-registered in EduBase UI)\n" +
                        "- Specify multiple tags separated by triple-and operators (\"&&&\")\n" +
                        "- User-controlled categorization that can be created at user or organization level\n" +
                        "- Use cases include:\n" +
                        " - Personal content organization (e.g., \"My Calculus Questions\", \"Spring 2024\")\n" +
                        " - Department-level categorization (e.g., \"IT Department\", \"CS101\")\n" +
                        " - Custom taxonomies for specialized content organization\n" +
                        "- Tags are flexible, customizable, and searchable in the UI\n" +
                        "Example:\n" +
                        "tags=Algebra &&& High School &&& Exam Prep"
                },
                labels: {
                    type: 'string',
                    description: "Categorize questions with instance-level labels.\n" +
                        "- Pre-defined values specific to each EduBase instance\n" +
                        "- Values controlled by instance administrators (cannot be created by users)\n" +
                        "- Consistent across all users in an instance\n" +
                        "- Specify multiple labels separated by triple-and operators (\"&&&\")\n" +
                        "- Use cases include:\n" +
                        " - System-wide flags (e.g., \"needs_review\", \"featured\")\n" +
                        " - Quality indicators (e.g., \"verified\", \"deprecated\")\n" +
                        " - Processing status (e.g., \"ai_generated\", \"manually_checked\")\n" +
                        "Example:\n" +
                        "label=verified &&& featured"
                },
                group: {
                    type: 'string',
                    description: "Add a question to a question group in a Quiz set.\n" +
                        "- If the group doesn't exist, it will be created automatically as a complex task with default settings\n" +
                        "- Only applicable when uploading DIRECTLY to a Quiz set\n" +
                        "- Existing group settings will not be changed when adding more questions\n" +
                        "Example:\n" +
                        "group=Basic_Arithmetic"
                },
            },
            required: ['id', 'type', 'question', 'answer', 'ai', 'language'],
        },
    },
    // DELETE /question - Permanently delete a question
    {
        name: 'edubase_delete_question',
        description: "Permanently delete a Quiz question.",
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'external unique question identifier',
                },
            },
            required: ['id'],
        },
    },
    // POST /question:export - Generate download link for exporting the question (in JSON format)
    {
        name: 'edubase_post_question_export',
        description: "Generate download link for exporting the question (in JSON format). If a previous valid link exists, it will be returned instead.",
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'external unique question identifier',
                },
            },
            required: ['id'],
        },
    },
    // GET /question:id - Get external unique question identifier by question identification string
    {
        name: 'edubase_get_question_id',
        description: "Get external unique question identifier by question identification string.",
        inputSchema: {
            type: 'object',
            properties: {
                question: {
                    type: 'string',
                    description: 'question identification string',
                },
            },
            required: ['question'],
        },
    },
    // POST /question:id - Set external unique question identifier for question identified by a question identification string
    {
        name: 'edubase_post_question_id',
        description: "Set external unique question identifier for question identified by a question identification string.",
        inputSchema: {
            type: 'object',
            properties: {
                question: {
                    type: 'string',
                    description: 'question identification string',
                },
                id: {
                    type: 'string',
                    description: 'external unique question identifier',
                },
            },
            required: ['question', 'id'],
        },
    },
];
/* Output schema definitions */
export const EDUBASE_API_TOOLS_QUESTIONS_OUTPUT_SCHEMA = {
    // GET /questions - List owned and managed Quiz questions
    edubase_get_questions: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                question: {
                    type: 'string',
                    description: 'question identification string',
                },
                id: {
                    type: 'string',
                    description: 'external unique question identifier (if set for the question)',
                },
            },
        },
    },
    // GET /question - Check existing question
    edubase_get_question: {
        type: 'object',
        properties: {
            question: {
                type: 'string',
                description: 'question identification string',
            },
            id: {
                type: 'string',
                description: 'external unique question identifier (if set for the question)',
            },
            active: {
                type: 'boolean',
                description: 'question is active',
            },
        },
    },
    // POST /question - Publish or update a question
    edubase_post_question: {
        type: 'object',
        properties: {
            question: {
                type: 'string',
                description: 'question identification string',
            },
        },
    },
    // DELETE /question - Permanently delete a question
    edubase_delete_question: {},
    // POST /question:export - Generate download link for exporting the question (in JSON format)
    edubase_post_question_export: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'external unique question identifier',
            },
            question: {
                type: 'string',
                description: 'question identification string',
            },
            url: {
                type: 'string',
                description: 'download link for the question',
            },
            valid: {
                type: 'string',
                description: 'date of link expiration',
            },
        },
    },
    // GET /question:id - Get external unique question identifier by question identification string
    edubase_get_question_id: {
        type: 'object',
        properties: {
            question: {
                type: 'string',
                description: 'question identification string',
            },
            id: {
                type: 'string',
                description: 'external unique question identifier (if set for the question)',
            },
        },
    },
    // POST /question:id - Set external unique question identifier for question identified by a question identification string
    edubase_post_question_id: {},
};
