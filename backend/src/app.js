import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { mongoSanitize } from "./middleware/mongoSanitize.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import ledgerRoutes from "./routes/ledgerRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import { errorHandler, notFound } from "./middleware/error.js";

export const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://ledger-frontend-yz72.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-shop-id"],
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Personal Ledger API running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/shops", shopRoutes);

app.use(notFound);
app.use(errorHandler);
