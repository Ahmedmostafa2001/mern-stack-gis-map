// routes/authRoutes.ts
import { Router } from "express";
import { register, login } from "../../controller/authController";
const app = Router();

app.post("/register", register);
app.post("/login", login);

export default app;
