import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    } catch {
        res.status(403).json({ message: "Invalid token" });
    }
};
