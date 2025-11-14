import express from "express";
import { verifyToken } from "../../middleware/auth";
import { getUserProfile } from "../../controller/userController";

const app = express();

app.get("/profile", verifyToken, getUserProfile);

export default app;
