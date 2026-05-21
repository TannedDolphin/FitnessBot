import dns from "dns";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dns.setDefaultResultOrder("ipv4first");
dotenv.config({ quiet: true });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await connectDB();

  if (dbConnected) {
    console.log("MongoDB connected");
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection:", err);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    process.exit(1);
  });
};

startServer();
