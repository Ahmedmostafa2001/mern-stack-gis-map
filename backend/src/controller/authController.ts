import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/* ----------------------------- REGISTER ----------------------------- */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check if already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const name = `${firstName || ""} ${lastName || ""}`.trim() || "Anonymous";

        // Create user
        const user = await prisma.user.create({
            data: { email, hashedPassword, name },
        });

        // Return clean user
        const { hashedPassword: _, ...cleanUser } = user;
        res.status(201).json(cleanUser);
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ----------------------------- LOGIN ----------------------------- */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, hashedPassword: true },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare password
        const valid = await bcrypt.compare(password, user.hashedPassword || "");
        if (!valid) return res.status(401).json({ message: "Invalid password" });

        // Generate JWT
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        );

        const { hashedPassword, ...safeUser } = user;
        res.json({ token, user: safeUser });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ----------------------------- GOOGLE AUTH ----------------------------- */
export const handleGoogleAuth = async (req: Request, res: Response) => {
    try {
        const { email, name, image } = req.body;

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({ data: { email, name, image } });
        }

        // Issue your backend JWT
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        );

        res.json({ user, token });
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
