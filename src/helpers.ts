import { Request } from "express";

/* Get request client IP address */
export function getClientIp(req: Request): string | null {
	return (req.get('x-forwarded-for')?.split(',')[0] || req.get('x-real-ip') || req.ip || req.socket.remoteAddress || null);
}
