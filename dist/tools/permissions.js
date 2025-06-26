/* Tool definitions */
export const EDUBASE_API_TOOLS_PERMISSIONS = [
    // GET /class:permission - Check if a user has permission on a class
    {
        name: 'edubase_get_class_permission',
        description: "Check if a user has permission on a class.",
        inputSchema: {
            type: 'object',
            properties: {
                class: {
                    type: 'string',
                    description: 'class identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['class', 'user', 'permission'],
        },
    },
    // POST /class:permission - Create new permission for a user
    {
        name: 'edubase_post_class_permission',
        description: "Create new permission for a user on a class.",
        inputSchema: {
            type: 'object',
            properties: {
                class: {
                    type: 'string',
                    description: 'class identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['class', 'user', 'permission'],
        },
    },
    // DELETE /class:permission - Remove a user permission
    {
        name: 'edubase_delete_class_permission',
        description: "Remove a user permission from a class.",
        inputSchema: {
            type: 'object',
            properties: {
                class: {
                    type: 'string',
                    description: 'class identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['class', 'user', 'permission'],
        },
    },
    // GET /course:permission - Check if a user has permission on a course
    {
        name: 'edubase_get_course_permission',
        description: "Check if a user has permission on a course.",
        inputSchema: {
            type: 'object',
            properties: {
                course: {
                    type: 'string',
                    description: 'course identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['course', 'user', 'permission'],
        },
    },
    // POST /course:permission - Create new permission for a user
    {
        name: 'edubase_post_course_permission',
        description: "Create new permission for a user on a course.",
        inputSchema: {
            type: 'object',
            properties: {
                course: {
                    type: 'string',
                    description: 'course identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['course', 'user', 'permission'],
        },
    },
    // DELETE /course:permission - Remove a user permission
    {
        name: 'edubase_delete_course_permission',
        description: "Remove a user permission from a course.",
        inputSchema: {
            type: 'object',
            properties: {
                course: {
                    type: 'string',
                    description: 'course identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['course', 'user', 'permission'],
        },
    },
    // GET /event:permission - Check if a user has permission on an event
    {
        name: 'edubase_get_event_permission',
        description: "Check if a user has permission on an event.",
        inputSchema: {
            type: 'object',
            properties: {
                event: {
                    type: 'string',
                    description: 'event identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / finances / grant / admin)'
                },
            },
            required: ['event', 'user', 'permission'],
        },
    },
    // POST /event:permission - Create new permission for a user
    {
        name: 'edubase_post_event_permission',
        description: "Create new permission for a user on an event.",
        inputSchema: {
            type: 'object',
            properties: {
                event: {
                    type: 'string',
                    description: 'event identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / finances / grant / admin)'
                },
            },
            required: ['event', 'user', 'permission'],
        },
    },
    // DELETE /event:permission - Remove a user permission
    {
        name: 'edubase_delete_event_permission',
        description: "Remove a user permission from an event.",
        inputSchema: {
            type: 'object',
            properties: {
                event: {
                    type: 'string',
                    description: 'event identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / finances / grant / admin)'
                },
            },
            required: ['event', 'user', 'permission'],
        },
    },
    // GET /exam:permission - Check if a user has permission on an exam
    {
        name: 'edubase_get_exam_permission',
        description: "Check if a user has permission on an exam.",
        inputSchema: {
            type: 'object',
            properties: {
                exam: {
                    type: 'string',
                    description: 'exam identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['exam', 'user', 'permission'],
        },
    },
    // POST /exam:permission - Create new permission for a user
    {
        name: 'edubase_post_exam_permission',
        description: "Create new permission for a user on an exam.",
        inputSchema: {
            type: 'object',
            properties: {
                exam: {
                    type: 'string',
                    description: 'exam identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['exam', 'user', 'permission'],
        },
    },
    // DELETE /exam:permission - Remove a user permission
    {
        name: 'edubase_delete_exam_permission',
        description: "Remove a user permission from an exam.",
        inputSchema: {
            type: 'object',
            properties: {
                exam: {
                    type: 'string',
                    description: 'exam identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['exam', 'user', 'permission'],
        },
    },
    // GET /integration:permission - Check if a user has permission on an integration
    {
        name: 'edubase_get_integration_permission',
        description: "Check if a user has permission on an integration.",
        inputSchema: {
            type: 'object',
            properties: {
                integration: {
                    type: 'string',
                    description: 'integration identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['integration', 'user', 'permission'],
        },
    },
    // POST /integration:permission - Create new permission for a user
    {
        name: 'edubase_post_integration_permission',
        description: "Create new permission for a user on an integration.",
        inputSchema: {
            type: 'object',
            properties: {
                integration: {
                    type: 'string',
                    description: 'integration identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['integration', 'user', 'permission'],
        },
    },
    // DELETE /integration:permission - Remove a user permission
    {
        name: 'edubase_delete_integration_permission',
        description: "Remove a user permission from an integration.",
        inputSchema: {
            type: 'object',
            properties: {
                integration: {
                    type: 'string',
                    description: 'integration identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['integration', 'user', 'permission'],
        },
    },
    // GET /organization:permission - Check if a user has permission on an organization
    {
        name: 'edubase_get_organization_permission',
        description: "Check if a user has permission on an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['organization', 'user', 'permission'],
        },
    },
    // POST /organization:permission - Create new permission for a user
    {
        name: 'edubase_post_organization_permission',
        description: "Create new permission for a user on an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['organization', 'user', 'permission'],
        },
    },
    // DELETE /organization:permission - Remove a user permission
    {
        name: 'edubase_delete_organization_permission',
        description: "Remove a user permission from an organization.",
        inputSchema: {
            type: 'object',
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['organization', 'user', 'permission'],
        },
    },
    // GET /quiz:permission - Check if a user has permission on a quiz
    {
        name: 'edubase_get_quiz_permission',
        description: "Check if a user has permission on a quiz.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['quiz', 'user', 'permission'],
        },
    },
    // POST /quiz:permission - Create new permission for a user
    {
        name: 'edubase_post_quiz_permission',
        description: "Create new permission for a user on a quiz.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['quiz', 'user', 'permission'],
        },
    },
    // DELETE /quiz:permission - Remove a user permission
    {
        name: 'edubase_delete_quiz_permission',
        description: "Remove a user permission from a quiz.",
        inputSchema: {
            type: 'object',
            properties: {
                quiz: {
                    type: 'string',
                    description: 'quiz identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['quiz', 'user', 'permission'],
        },
    },
    // GET /scorm:permission - Check if a user has permission on a SCORM
    {
        name: 'edubase_get_scorm_permission',
        description: "Check if a user has permission on a SCORM learning material.",
        inputSchema: {
            type: 'object',
            properties: {
                scorm: {
                    type: 'string',
                    description: 'SCORM identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['scorm', 'user', 'permission'],
        },
    },
    // POST /scorm:permission - Create new permission for a user
    {
        name: 'edubase_post_scorm_permission',
        description: "Create new permission for a user on a SCORM learning material.",
        inputSchema: {
            type: 'object',
            properties: {
                scorm: {
                    type: 'string',
                    description: 'SCORM identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['scorm', 'user', 'permission'],
        },
    },
    // DELETE /scorm:permission - Remove a user permission
    {
        name: 'edubase_delete_scorm_permission',
        description: "Remove a user permission from a SCORM learning material.",
        inputSchema: {
            type: 'object',
            properties: {
                scorm: {
                    type: 'string',
                    description: 'SCORM identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['scorm', 'user', 'permission'],
        },
    },
    // GET /tag:permission - Check if a user has permission on a tag
    {
        name: 'edubase_get_tag_permission',
        description: "Check if a user has permission on a tag.",
        inputSchema: {
            type: 'object',
            properties: {
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['tag', 'user', 'permission'],
        },
    },
    // POST /tag:permission - Create new permission for a user
    {
        name: 'edubase_post_tag_permission',
        description: "Create new permission for a user on a tag.",
        inputSchema: {
            type: 'object',
            properties: {
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['tag', 'user', 'permission'],
        },
    },
    // DELETE /tag:permission - Remove a user permission
    {
        name: 'edubase_delete_tag_permission',
        description: "Remove a user permission from a tag.",
        inputSchema: {
            type: 'object',
            properties: {
                tag: {
                    type: 'string',
                    description: 'tag identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['tag', 'user', 'permission'],
        },
    },
    // GET /video:permission - Check if a user has permission on a video
    {
        name: 'edubase_get_video_permission',
        description: "Check if a user has permission on a video.",
        inputSchema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    description: 'video identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['video', 'user', 'permission'],
        },
    },
    // POST /video:permission - Create new permission for a user
    {
        name: 'edubase_post_video_permission',
        description: "Create new permission for a user on a video.",
        inputSchema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    description: 'video identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['video', 'user', 'permission'],
        },
    },
    // DELETE /video:permission - Remove a user permission
    {
        name: 'edubase_delete_video_permission',
        description: "Remove a user permission from a video.",
        inputSchema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    description: 'video identification string'
                },
                user: {
                    type: 'string',
                    description: 'user identification string'
                },
                permission: {
                    type: 'string',
                    description: 'permission level (view / report / control / modify / grant / admin)'
                },
            },
            required: ['video', 'user', 'permission'],
        },
    },
];
/* Output schema definitions */
/* Output schema definitions */
export const EDUBASE_API_TOOLS_PERMISSIONS_OUTPUT_SCHEMA = {
    // GET /class:permission - Check if a user has permission on a class
    edubase_get_class_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
                type: 'object',
                properties: {
                    permission: {
                        type: 'boolean',
                        description: 'the user has permission on this class'
                    },
                    rule: {
                        type: 'boolean',
                        description: 'there is a permission rule with these parameters'
                    },
                },
            },
        },
    },
    // POST /class:permission - Create new permission for a user
    edubase_post_class_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
    // DELETE /class:permission - Remove a user permission
    edubase_delete_class_permission: {},
    // GET /course:permission - Check if a user has permission on a course
    edubase_get_course_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
                type: 'object',
                properties: {
                    permission: {
                        type: 'boolean',
                        description: 'the user has permission on this course'
                    },
                    rule: {
                        type: 'boolean',
                        description: 'there is a permission rule with these parameters'
                    },
                },
            },
        },
    },
    // POST /course:permission - Create new permission for a user
    edubase_post_course_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
    // DELETE /course:permission - Remove a user permission
    edubase_delete_course_permission: {},
    // GET /event:permission - Check if a user has permission on an event
    edubase_get_event_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
                type: 'object',
                properties: {
                    permission: {
                        type: 'boolean',
                        description: 'the user has permission on this event'
                    },
                    rule: {
                        type: 'boolean',
                        description: 'there is a permission rule with these parameters'
                    },
                },
            },
        },
    },
    // POST /event:permission - Create new permission for a user
    edubase_post_event_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
    // DELETE /event:permission - Remove a user permission
    edubase_delete_event_permission: {},
    // GET /exam:permission - Check if a user has permission on an exam
    edubase_get_exam_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
                type: 'object',
                properties: {
                    permission: {
                        type: 'boolean',
                        description: 'the user has permission on this exam'
                    },
                    rule: {
                        type: 'boolean',
                        description: 'there is a permission rule with these parameters'
                    },
                },
            },
        },
    },
    // POST /exam:permission - Create new permission for a user
    edubase_post_exam_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
    // DELETE /exam:permission - Remove a user permission
    edubase_delete_exam_permission: {},
    // GET /integration:permission - Check if a user has permission on an integration
    edubase_get_integration_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
                type: 'object',
                properties: {
                    permission: {
                        type: 'boolean',
                        description: 'the user has permission on this integration'
                    },
                    rule: {
                        type: 'boolean',
                        description: 'there is a permission rule with these parameters'
                    },
                },
            },
        },
    },
    // POST /integration:permission - Create new permission for a user
    edubase_post_integration_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
    // DELETE /integration:permission - Remove a user permission
    edubase_delete_integration_permission: {},
    // GET /organization:permission - Check if a user has permission on an organization
    edubase_get_organization_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
                type: 'object',
                properties: {
                    permission: {
                        type: 'boolean',
                        description: 'the user has permission on this organization'
                    },
                    rule: {
                        type: 'boolean',
                        description: 'there is a permission rule with these parameters'
                    },
                },
            },
        },
    },
    // POST /organization:permission - Create new permission for a user
    edubase_post_organization_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
    // DELETE /organization:permission - Remove a user permission
    edubase_delete_organization_permission: {},
    // GET /quiz:permission - Check if a user has permission on a quiz
    edubase_get_quiz_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
                type: 'object',
                properties: {
                    permission: {
                        type: 'boolean',
                        description: 'the user has permission on this quiz'
                    },
                    rule: {
                        type: 'boolean',
                        description: 'there is a permission rule with these parameters'
                    },
                },
            },
        },
    },
    // POST /quiz:permission - Create new permission for a user
    edubase_post_quiz_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
    // DELETE /quiz:permission - Remove a user permission
    edubase_delete_quiz_permission: {},
    // GET /scorm:permission - Check if a user has permission on a SCORM learning material
    edubase_get_scorm_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
                type: 'object',
                properties: {
                    permission: {
                        type: 'boolean',
                        description: 'the user has permission on this SCORM learning material'
                    },
                    rule: {
                        type: 'boolean',
                        description: 'there is a permission rule with these parameters'
                    },
                },
            },
        },
    },
    // POST /scorm:permission - Create new permission for a user
    edubase_post_scorm_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
    // DELETE /scorm:permission - Remove a user permission
    edubase_delete_scorm_permission: {},
    // GET /tag:permission - Check if a user has permission on a tag
    edubase_get_tag_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "tag"'
                    },
                    code: {
                        type: 'string',
                        description: 'the tag identification string'
                    },
                },
            },
            status: {
                type: 'object',
                properties: {
                    permission: {
                        type: 'boolean',
                        description: 'the user has permission on this tag'
                    },
                    rule: {
                        type: 'boolean',
                        description: 'there is a permission rule with these parameters'
                    },
                },
            },
        },
    },
    // POST /tag:permission - Create new permission for a user
    edubase_post_tag_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
            },
            content: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'will be "tag"'
                    },
                    code: {
                        type: 'string',
                        description: 'the tag identification string'
                    },
                },
            },
            success: {
                type: 'boolean',
                description: 'operation was successful'
            },
        },
    },
    // DELETE /tag:permission - Remove a user permission
    edubase_delete_tag_permission: {},
    // GET /video:permission - Check if a user has permission on a video
    edubase_get_video_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
                type: 'object',
                properties: {
                    permission: {
                        type: 'boolean',
                        description: 'the user has permission on this video'
                    },
                    rule: {
                        type: 'boolean',
                        description: 'there is a permission rule with these parameters'
                    },
                },
            },
        },
    },
    // POST /video:permission - Create new permission for a user
    edubase_post_video_permission: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                description: 'the user identification string'
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
    // DELETE /video:permission - Remove a user permission
    edubase_delete_video_permission: {},
};
