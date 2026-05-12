import packageJson from '../package.json' with { type: "json" };
/* URLs */
const EDUBASE_URL = (process.env.EDUBASE_API_URL || packageJson.homepage || 'https://www.edubase.net').replace(/\/api\/?$/, '');
const EDUBASE_STATIC = (process.env.EDUBASE_STATIC_URL || EDUBASE_URL).replace(/\/$/, '');
export const MANIFEST = {
    /* Identity */
    name: '@edubase/mcp',
    title: 'EduBase MCP server',
    version: packageJson.version,
    description: 'Bring EduBase to your AI assistant: author parametric questions, schedule exams, auto-grade attempts, issue audit-ready certificates with expiration tracking, track results in real time, and get notified on every completion — all on your own EduBase account.',
    /* URLs */
    websiteUrl: EDUBASE_URL,
    docsUrl: 'https://developer.edubase.net',
    supportUrl: 'https://www.edubase.net/page/contact',
    statusUrl: 'https://status.edubase.net',
    repositoryUrl: 'https://github.com/EduBase/MCP',
    privacyUrl: `${EDUBASE_URL}/page/privacy-policy`,
    termsUrl: `${EDUBASE_URL}/page/terms-of-use`,
    legalUrl: `${EDUBASE_URL}/page/legal`,
    /* Contact / legal entity */
    contactEmail: 'info@edubase.net',
    legalName: 'EduBase Kft.',
    /* Icons (multi-resolution, theme-aware where available) */
    icons: (() => {
        return [
            { src: `${EDUBASE_STATIC}/media/brand/favicon/favicon.svg`, sizes: ['any'], mimeType: 'image/svg+xml' },
            { src: `${EDUBASE_STATIC}/media/brand/favicon/web-app-manifest-512x512.png`, sizes: ['512x512'], mimeType: 'image/png' },
            { src: `${EDUBASE_STATIC}/media/brand/icons/favicon256.png`, sizes: ['256x256'], mimeType: 'image/png' },
            { src: `${EDUBASE_STATIC}/media/brand/favicon/web-app-manifest-192x192.png`, sizes: ['192x192'], mimeType: 'image/png' },
            { src: `${EDUBASE_STATIC}/media/brand/icons/favicon128.png`, sizes: ['128x128'], mimeType: 'image/png' },
            { src: `${EDUBASE_STATIC}/media/brand/favicon/favicon-96x96.png`, sizes: ['96x96'], mimeType: 'image/png' },
            { src: `${EDUBASE_STATIC}/media/brand/icons/favicon64.png`, sizes: ['64x64'], mimeType: 'image/png' },
            { src: `${EDUBASE_STATIC}/media/brand/favicon/favicon-32x32.png`, sizes: ['32x32'], mimeType: 'image/png' },
        ];
    })(),
    /* Categories — surfaced by Claude / OpenAI marketplaces */
    categories: ['education', 'productivity', 'learning', 'business', 'content-management'],
    /* Tags / keywords for search */
    keywords: [
        'edubase', 'lms', 'learning', 'education', 'e-learning', 'business',
        'quiz', 'exam', 'assessment', 'evaluation', 'auto-grading', 'parametric-questions', 'question-bank', 'scorm',
        'course', 'training', 'corporate-training', 'digital-classroom',
        'certificate', 'audit-trail', 'compliance', 'webhook'
    ],
    /* Default OAuth scopes to request */
    oauthScopes: ['mcp'],
};
