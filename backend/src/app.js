import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.routes.js";
import planRoutes from "./routes/plan.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config({ quiet: true });

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/chat", chatRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

export default app;
