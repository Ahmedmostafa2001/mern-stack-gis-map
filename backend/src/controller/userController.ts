import { Request, Response } from "express";
import prisma from "../config/db";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // comes from JWT middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
