import express from "express";
import { verifyToken } from "../../middleware/auth";
import { addPlace, getDistance, getDashboardStats,getBuildings } from "../../controller/dashboardController";

const app = express();

app.get("/buildings", getBuildings);
app.post("/add", verifyToken, addPlace);
app.post("/distance", verifyToken, getDistance);
app.get("/stats", verifyToken, getDashboardStats);

export default app;
