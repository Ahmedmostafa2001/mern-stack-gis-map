import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./api/authRoutes";
import dashboardRoutes from "./api/dashboardRoutes";
import userRoutes from "./api/userRoutes";
import translateRoutes from "./api/translateRoutes";

dotenv.config();

const endPointRoutes = express();
endPointRoutes.use(cors());
endPointRoutes.use(express.json());

endPointRoutes.use("/auth", authRoutes);
endPointRoutes.use("/dashboard", dashboardRoutes);
endPointRoutes.use("/user", userRoutes);

endPointRoutes.use("/translate", translateRoutes);
export default endPointRoutes;
