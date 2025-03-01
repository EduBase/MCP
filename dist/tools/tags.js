/* Tool definitions */
export const EDUBASE_API_TOOLS_TAGS = [
    // GET /tags - List owned and managed tags
    {
        name: 'edubase_get_tags',
        description: "List owned and managed tags.",
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    // GET /tag - Get/check tag
    {
        name: 'edubase_get_tag',
        description: "Get/check tag.",
        inputSchema: {
            type: 'object',
            properties: {
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['tag'],
        },
    },
    // GET /class:tags - List all attached tags of a class
    {
        name: 'edubase_get_class_tags',
        description: "List all attached tags of a class.",
        inputSchema: {
            type: 'object',
            properties: {
                class: {
                    type: 'string',
                    description: 'class identification string'
                },
            },
            required: ['class'],
        },
    },
    // GET /class:tag - Check if tag is attached to a class
    {
        name: 'edubase_get_class_tag',
        description: "Check if tag is attached to a class.",
        inputSchema: {
            type: 'object',
            properties: {
                class: {
                    type: 'string',
                    description: 'class identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['class', 'tag'],
        },
    },
    // POST /class:tag - Attach tag to class
    {
        name: 'edubase_post_class_tag',
        description: "Attach tag to a class.",
        inputSchema: {
            type: 'object',
            properties: {
                class: {
                    type: 'string',
                    description: 'class identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['class', 'tag'],
        },
    },
    // DELETE /class:tag - Remove a tag attachment from class
    {
        name: 'edubase_delete_class_tag',
        description: "Remove a tag attachment from a class.",
        inputSchema: {
            type: 'object',
            properties: {
                class: {
                    type: 'string',
                    description: 'class identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['class', 'tag'],
        },
    },
    // GET /course:tags - List all attached tags of a course
    {
        name: 'edubase_get_course_tags',
        description: "List all attached tags of a course.",
        inputSchema: {
            type: 'object',
            properties: {
                course: {
                    type: 'string',
                    description: 'course identification string'
                },
            },
            required: ['course'],
        },
    },
    // GET /course:tag - Check if tag is attached to a course
    {
        name: 'edubase_get_course_tag',
        description: "Check if tag is attached to a course.",
        inputSchema: {
            type: 'object',
            properties: {
                course: {
                    type: 'string',
                    description: 'course identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['course', 'tag'],
        },
    },
    // POST /course:tag - Attach tag to course
    {
        name: 'edubase_post_course_tag',
        description: "Attach tag to a course.",
        inputSchema: {
            type: 'object',
            properties: {
                course: {
                    type: 'string',
                    description: 'course identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['course', 'tag'],
        },
    },
    // DELETE /course:tag - Remove a tag attachment from course
    {
        name: 'edubase_delete_course_tag',
        description: "Remove a tag attachment from a course.",
        inputSchema: {
            type: 'object',
            properties: {
                course: {
                    type: 'string',
                    description: 'course identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['course', 'tag'],
        },
    },
    // GET /event:tags - List all attached tags of an event
    {
        name: 'edubase_get_event_tags',
        description: "List all attached tags of an event.",
        inputSchema: {
            type: 'object',
            properties: {
                event: {
                    type: 'string',
                    description: 'event identification string'
                },
            },
            required: ['event'],
        },
    },
    // GET /event:tag - Check if tag is attached to an event
    {
        name: 'edubase_get_event_tag',
        description: "Check if tag is attached to an event.",
        inputSchema: {
            type: 'object',
            properties: {
                event: {
                    type: 'string',
                    description: 'event identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['event', 'tag'],
        },
    },
    // POST /event:tag - Attach tag to event
    {
        name: 'edubase_post_event_tag',
        description: "Attach tag to an event.",
        inputSchema: {
            type: 'object',
            properties: {
                event: {
                    type: 'string',
                    description: 'event identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['event', 'tag'],
        },
    },
    // DELETE /event:tag - Remove a tag attachment from event
    {
        name: 'edubase_delete_event_tag',
        description: "Remove a tag attachment from an event.",
        inputSchema: {
            type: 'object',
            properties: {
                event: {
                    type: 'string',
                    description: 'event identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['event', 'tag'],
        },
    },
    // GET /exam:tags - List all attached tags of an exam
    {
        name: 'edubase_get_exam_tags',
        description: "List all attached tags of an exam.",
        inputSchema: {
            type: 'object',
            properties: {
                exam: {
                    type: 'string',
                    description: 'exam identification string'
                },
            },
            required: ['exam'],
        },
    },
    // GET /exam:tag - Check if tag is attached to an exam
    {
        name: 'edubase_get_exam_tag',
        description: "Check if tag is attached to an exam.",
        inputSchema: {
            type: 'object',
            properties: {
                exam: {
                    type: 'string',
                    description: 'exam identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['exam', 'tag'],
        },
    },
    // POST /exam:tag - Attach tag to exam
    {
        name: 'edubase_post_exam_tag',
        description: "Attach tag to an exam.",
        inputSchema: {
            type: 'object',
            properties: {
                exam: {
                    type: 'string',
                    description: 'exam identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['exam', 'tag'],
        },
    },
    // DELETE /exam:tag - Remove a tag attachment from exam
    {
        name: 'edubase_delete_exam_tag',
        description: "Remove a tag attachment from an exam.",
        inputSchema: {
            type: 'object',
            properties: {
                exam: {
                    type: 'string',
                    description: 'exam identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['exam', 'tag'],
        },
    },
    // GET /integration:tags - List all attached tags of an integration
    {
        name: 'edubase_get_integration_tags',
        description: "List all attached tags of an integration.",
        inputSchema: {
            type: 'object',
            properties: {
                integration: {
                    type: 'string',
                    description: 'integration identification string'
                },
            },
            required: ['integration'],
        },
    },
    // GET /integration:tag - Check if tag is attached to an integration
    {
        name: 'edubase_get_integration_tag',
        description: "Check if tag is attached to an integration.",
        inputSchema: {
            type: 'object',
            properties: {
                integration: {
                    type: 'string',
                    description: 'integration identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['integration', 'tag'],
        },
    },
    // POST /integration:tag - Attach tag to integration
    {
        name: 'edubase_post_integration_tag',
        description: "Attach tag to an integration.",
        inputSchema: {
            type: 'object',
            properties: {
                integration: {
                    type: 'string',
                    description: 'integration identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['integration', 'tag'],
        },
    },
    // DELETE /integration:tag - Remove a tag attachment from integration
    {
        name: 'edubase_delete_integration_tag',
        description: "Remove a tag attachment from an integration.",
        inputSchema: {
            type: 'object',
            properties: {
                integration: {
                    type: 'string',
                    description: 'integration identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['integration', 'tag'],
        },
    },
    // GET /organization:tags - List all attached tags of an organization
    {
        name: 'edubase_get_organization_tags',
        description: "List all attached tags of an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string'
                },
            },
            required: ['organization'],
        },
    },
    // GET /organization:tag - Check if tag is attached to an organization
    {
        name: 'edubase_get_organization_tag',
        description: "Check if tag is attached to an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['organization', 'tag'],
        },
    },
    // POST /organization:tag - Attach tag to organization
    {
        name: 'edubase_post_organization_tag',
        description: "Attach tag to an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['organization', 'tag'],
        },
    },
    // DELETE /organization:tag - Remove a tag attachment from organization
    {
        name: 'edubase_delete_organization_tag',
        description: "Remove a tag attachment from an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['organization', 'tag'],
        },
    },
    // GET /quiz:tags - List all attached tags of a Quiz
    {
        name: 'edubase_get_quiz_tags',
        description: "List all attached tags of a Quiz.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string'
                },
            },
            required: ['quiz'],
        },
    },
    // GET /quiz:tag - Check if tag is attached to a Quiz
    {
        name: 'edubase_get_quiz_tag',
        description: "Check if tag is attached to a Quiz.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['quiz', 'tag'],
        },
    },
    // POST /quiz:tag - Attach tag to Quiz
    {
        name: 'edubase_post_quiz_tag',
        description: "Attach tag to a Quiz.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['quiz', 'tag'],
        },
    },
    // DELETE /quiz:tag - Remove a tag attachment from Quiz
    {
        name: 'edubase_delete_quiz_tag',
        description: "Remove a tag attachment from a Quiz.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['quiz', 'tag'],
        },
    },
    // GET /scorm:tags - List all attached tags of a SCORM
    {
        name: 'edubase_get_scorm_tags',
        description: "List all attached tags of a SCORM learning material.",
        inputSchema: {
            type: 'object',
            properties: {
                scorm: {
                    type: 'string',
                    description: 'SCORM identification string'
                },
            },
            required: ['scorm'],
        },
    },
    // GET /scorm:tag - Check if tag is attached to a SCORM
    {
        name: 'edubase_get_scorm_tag',
        description: "Check if tag is attached to a SCORM learning material.",
        inputSchema: {
            type: 'object',
            properties: {
                scorm: {
                    type: 'string',
                    description: 'SCORM identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['scorm', 'tag'],
        },
    },
    // POST /scorm:tag - Attach tag to SCORM
    {
        name: 'edubase_post_scorm_tag',
        description: "Attach tag to a SCORM learning material.",
        inputSchema: {
            type: 'object',
            properties: {
                scorm: {
                    type: 'string',
                    description: 'SCORM identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['scorm', 'tag'],
        },
    },
    // DELETE /scorm:tag - Remove a tag attachment from SCORM
    {
        name: 'edubase_delete_scorm_tag',
        description: "Remove a tag attachment from a SCORM learning material.",
        inputSchema: {
            type: 'object',
            properties: {
                scorm: {
                    type: 'string',
                    description: 'SCORM identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['scorm', 'tag'],
        },
    },
    // GET /video:tags - List all attached tags of a video
    {
        name: 'edubase_get_video_tags',
        description: "List all attached tags of a video.",
        inputSchema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    description: 'video identification string'
                },
            },
            required: ['video'],
        },
    },
    // GET /video:tag - Check if tag is attached to a video
    {
        name: 'edubase_get_video_tag',
        description: "Check if tag is attached to a video.",
        inputSchema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    description: 'video identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['video', 'tag'],
        },
    },
    // POST /video:tag - Attach tag to video
    {
        name: 'edubase_post_video_tag',
        description: "Attach tag to a video.",
        inputSchema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    description: 'video identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['video', 'tag'],
        },
    },
    // DELETE /video:tag - Remove a tag attachment from video
    {
        name: 'edubase_delete_video_tag',
        description: "Remove a tag attachment from a video.",
        inputSchema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    description: 'video identification string'
                },
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
            },
            required: ['video', 'tag'],
        },
    },
];
/* Output schema definitions */
/* Output schema definitions */
export const EDUBASE_API_TOOLS_TAGS_OUTPUT_SCHEMA = {
    // GET /tags - List owned and managed tags
    edubase_get_tags: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'tag identification string'
                },
                name: {
                    type: 'string',
                    description: 'title of the tag'
                },
            },
        },
    },
    // GET /tag - Get/check tag
    edubase_get_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'tag identification string'
            },
            name: {
                type: 'string',
                description: 'title of the tag'
            },
            color: {
                type: 'string',
                description: 'color in HEX format'
            },
            icon: {
                type: 'string',
                description: 'Font Awesome icon class name'
            },
        },
    },
    // GET /class:tags - List all attached tags of a class
    edubase_get_class_tags: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'tag identification string'
                },
                name: {
                    type: 'string',
                    description: 'title of the tag'
                },
            },
        },
    },
    // GET /class:tag - Check if tag is attached to a class
    edubase_get_class_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "class"'
                    },
                    code: {
                        type: 'string',
                        description: 'the class identification string'
                    },
                },
            },
            status: {
                type: 'boolean',
                description: 'tag is attached to this class'
            },
        },
    },
    // POST /class:tag - Attach tag to class
    edubase_post_class_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "class"'
                    },
                    code: {
                        type: 'string',
                        description: 'the class identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // DELETE /class:tag - Remove a tag attachment from class
    edubase_delete_class_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "class"'
                    },
                    code: {
                        type: 'string',
                        description: 'the class identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // GET /course:tags - List all attached tags of a course
    edubase_get_course_tags: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'tag identification string'
                },
                name: {
                    type: 'string',
                    description: 'title of the tag'
                },
            },
        },
    },
    // GET /course:tag - Check if tag is attached to a course
    edubase_get_course_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "course"'
                    },
                    code: {
                        type: 'string',
                        description: 'the course identification string'
                    },
                },
            },
            status: {
                type: 'boolean',
                description: 'tag is attached to this course'
            },
        },
    },
    // POST /course:tag - Attach tag to course
    edubase_post_course_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "course"'
                    },
                    code: {
                        type: 'string',
                        description: 'the course identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // DELETE /course:tag - Remove a tag attachment from course
    edubase_delete_course_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "course"'
                    },
                    code: {
                        type: 'string',
                        description: 'the course identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // GET /event:tags - List all attached tags of an event
    edubase_get_event_tags: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'tag identification string'
                },
                name: {
                    type: 'string',
                    description: 'title of the tag'
                },
            },
        },
    },
    // GET /event:tag - Check if tag is attached to an event
    edubase_get_event_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "event"'
                    },
                    code: {
                        type: 'string',
                        description: 'the event identification string'
                    },
                },
            },
            status: {
                type: 'boolean',
                description: 'tag is attached to this event'
            },
        },
    },
    // POST /event:tag - Attach tag to event
    edubase_post_event_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "event"'
                    },
                    code: {
                        type: 'string',
                        description: 'the event identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // DELETE /event:tag - Remove a tag attachment from event
    edubase_delete_event_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "event"'
                    },
                    code: {
                        type: 'string',
                        description: 'the event identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // GET /exam:tags - List all attached tags of an exam
    edubase_get_exam_tags: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'tag identification string'
                },
                name: {
                    type: 'string',
                    description: 'title of the tag'
                },
            },
        },
    },
    // GET /exam:tag - Check if tag is attached to an exam
    edubase_get_exam_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "exam"'
                    },
                    code: {
                        type: 'string',
                        description: 'the exam identification string'
                    },
                },
            },
            status: {
                type: 'boolean',
                description: 'tag is attached to this exam'
            },
        },
    },
    // POST /exam:tag - Attach tag to exam
    edubase_post_exam_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "exam"'
                    },
                    code: {
                        type: 'string',
                        description: 'the exam identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // DELETE /exam:tag - Remove a tag attachment from exam
    edubase_delete_exam_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "exam"'
                    },
                    code: {
                        type: 'string',
                        description: 'the exam identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // GET /integration:tags - List all attached tags of an integration
    edubase_get_integration_tags: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'tag identification string'
                },
                name: {
                    type: 'string',
                    description: 'title of the tag'
                },
            },
        },
    },
    // GET /integration:tag - Check if tag is attached to an integration
    edubase_get_integration_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "integration"'
                    },
                    code: {
                        type: 'string',
                        description: 'the integration identification string'
                    },
                },
            },
            status: {
                type: 'boolean',
                description: 'tag is attached to this integration'
            },
        },
    },
    // POST /integration:tag - Attach tag to integration
    edubase_post_integration_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "integration"'
                    },
                    code: {
                        type: 'string',
                        description: 'the integration identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // DELETE /integration:tag - Remove a tag attachment from integration
    edubase_delete_integration_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "integration"'
                    },
                    code: {
                        type: 'string',
                        description: 'the integration identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // GET /organization:tags - List all attached tags of an organization
    edubase_get_organization_tags: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'tag identification string'
                },
                name: {
                    type: 'string',
                    description: 'title of the tag'
                },
            },
        },
    },
    // GET /organization:tag - Check if tag is attached to an organization
    edubase_get_organization_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "organization"'
                    },
                    code: {
                        type: 'string',
                        description: 'the organization identification string'
                    },
                },
            },
            status: {
                type: 'boolean',
                description: 'tag is attached to this organization'
            },
        },
    },
    // POST /organization:tag - Attach tag to organization
    edubase_post_organization_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "organization"'
                    },
                    code: {
                        type: 'string',
                        description: 'the organization identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // DELETE /organization:tag - Remove a tag attachment from organization
    edubase_delete_organization_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "organization"'
                    },
                    code: {
                        type: 'string',
                        description: 'the organization identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // GET /quiz:tags - List all attached tags of a Quiz
    edubase_get_quiz_tags: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'tag identification string'
                },
                name: {
                    type: 'string',
                    description: 'title of the tag'
                },
            },
        },
    },
    // GET /quiz:tag - Check if tag is attached to a Quiz
    edubase_get_quiz_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "quiz"'
                    },
                    code: {
                        type: 'string',
                        description: 'the quiz identification string'
                    },
                },
            },
            status: {
                type: 'boolean',
                description: 'tag is attached to this quiz'
            },
        },
    },
    // POST /quiz:tag - Attach tag to Quiz
    edubase_post_quiz_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "quiz"'
                    },
                    code: {
                        type: 'string',
                        description: 'the quiz identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // DELETE /quiz:tag - Remove a tag attachment from Quiz
    edubase_delete_quiz_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "quiz"'
                    },
                    code: {
                        type: 'string',
                        description: 'the quiz identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // GET /scorm:tags - List all attached tags of a SCORM learning material
    edubase_get_scorm_tags: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'tag identification string'
                },
                name: {
                    type: 'string',
                    description: 'title of the tag'
                },
            },
        },
    },
    // GET /scorm:tag - Check if tag is attached to a SCORM learning material
    edubase_get_scorm_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "scorm"'
                    },
                    code: {
                        type: 'string',
                        description: 'the SCORM identification string'
                    },
                },
            },
            status: {
                type: 'boolean',
                description: 'tag is attached to this SCORM learning material'
            },
        },
    },
    // POST /scorm:tag - Attach tag to SCORM learning material
    edubase_post_scorm_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "scorm"'
                    },
                    code: {
                        type: 'string',
                        description: 'the SCORM identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // DELETE /scorm:tag - Remove a tag attachment from SCORM learning material
    edubase_delete_scorm_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "scorm"'
                    },
                    code: {
                        type: 'string',
                        description: 'the SCORM identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // GET /video:tags - List all attached tags of a video
    edubase_get_video_tags: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'tag identification string'
                },
                name: {
                    type: 'string',
                    description: 'title of the tag'
                },
            },
        },
    },
    // GET /video:tag - Check if tag is attached to a video
    edubase_get_video_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "video"'
                    },
                    code: {
                        type: 'string',
                        description: 'the video identification string'
                    },
                },
            },
            status: {
                type: 'boolean',
                description: 'tag is attached to this video'
            },
        },
    },
    // POST /video:tag - Attach tag to video
    edubase_post_video_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "video"'
                    },
                    code: {
                        type: 'string',
                        description: 'the video identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // DELETE /video:tag - Remove a tag attachment from video
    edubase_delete_video_tag: {
        type: 'object',
        properties: {
            tag: {
                type: 'string',
                description: 'the tag identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "video"'
                    },
                    code: {
                        type: 'string',
                        description: 'the video identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
};
