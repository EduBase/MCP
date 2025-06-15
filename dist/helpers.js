/* Get request client IP address */
export function getClientIp(req) {
    return (req.get('x-forwarded-for')?.split(',')[0] || req.get('x-real-ip') || req.ip || req.socket.remoteAddress || null);
}
