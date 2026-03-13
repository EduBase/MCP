/* Get request client IP address */
export function getClientIp(req) {
    return (req.get('x-forwarded-for')?.split(',')[0] || req.get('x-real-ip') || req.ip || req.socket.remoteAddress || null);
}
/* Get header value */
export function getHeaderValue(req, name) {
    const raw = req.headers?.[name.toLowerCase()];
    if (typeof raw === "string" && raw.length > 0)
        return raw;
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string")
        return raw[0];
    return null;
}
