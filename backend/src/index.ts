import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { sttRouter } from "./routes/stt.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/stt", sttRouter);

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));