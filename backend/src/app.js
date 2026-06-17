import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { mongoSanitize } from "./middleware/mongoSanitize.js";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import ledgerRoutes from "./routes/ledgerRoutes.js";
import { errorHandler, notFound } from "./middleware/error.js";

export const app = express();
app.use(helmet());
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server and health-check requests without an Origin.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Ensure preflight requests are answered
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));
app.get("/health", (_req, res) => res.json({ success: true, message: "Personal Ledger API running" }));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use(notFound);
app.use(errorHandler);
