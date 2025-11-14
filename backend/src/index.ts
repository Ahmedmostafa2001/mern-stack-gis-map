import express, { Application } from "express";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import endPointRoutes from "./routes";

const PORT = process.env.PORT || 5501;
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
}));

app.use("/api", endPointRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
