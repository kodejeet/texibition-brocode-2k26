import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sub-manager-secret-key-dev";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "No token provided" });
        return;
    }

    const token = header.split(" ")[1];
    if (!token) {
        res.status(401).json({ success: false, error: "Invalid token format" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        res.locals.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ success: false, error: "Invalid or expired token" });
    }
}

export { JWT_SECRET };
