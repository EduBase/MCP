/* Web address of the EduBase site of an API URL (null if it cannot be derived, or it is not reachable for the users) */
export function getSiteUrl(apiUrl) {
    const match = apiUrl.match(/^(https?:\/\/[^\/]+(?:\/.*?)?)\/api\/?$/);
    return (match && !match[1].match(/dockerhost/)) ? match[1] : null;
}
/* Links are added to the results of the tools changing contents, and of these tools reading them */
const EDUBASE_LINKED_GET_TOOLS = ['edubase_get_exam', 'edubase_get_quiz', 'edubase_get_exam_journey'];
/* Links to the pages of the contents a tool worked with (by the identification strings in the response, or in the arguments of the tools that do not return them) */
export function getContentLinks(tool, args, response, siteUrl) {
    if (!siteUrl || tool.startsWith('edubase_delete_') || (tool.startsWith('edubase_get_') && !EDUBASE_LINKED_GET_TOOLS.includes(tool))) {
        return [];
    }
    const value = (key) => {
        const found = (response && typeof response == 'object' && !Array.isArray(response)) ? response[key] : undefined;
        const given = found ?? args[key];
        return (typeof given == 'string' && /^[A-Za-z0-9_-]+$/.test(given)) ? given : null;
    };
    const links = [];
    const exam = value('exam');
    if (exam) {
        if (tool.includes('_exam_journey')) {
            links.push({ path: `/exam/journey/${exam}`, title: 'Exam journey in EduBase' });
        }
        else if (tool.includes('_exam_users')) {
            links.push({ path: `/exam/users/${exam}`, title: 'Users of the exam in EduBase' });
        }
        else {
            links.push({ path: `/exam/manager/${exam}`, title: 'Exam in EduBase' });
        }
    }
    const quiz = value('quiz');
    if (quiz) {
        links.push({ path: `/quiz/manager/${quiz}`, title: 'Quiz set in EduBase' });
    }
    if (links.length == 0) {
        return [];
    }
    /* Resource links for the clients displaying them, and the addresses as text for the model to share */
    return [
        ...links.map(({ path, title }) => ({ type: 'resource_link', uri: siteUrl + path, name: title, title: title, mimeType: 'text/html' })),
        { type: 'text', text: 'Open in EduBase: ' + links.map(({ path, title }) => `${title}: ${siteUrl}${path}`).join(', ') },
    ];
}
