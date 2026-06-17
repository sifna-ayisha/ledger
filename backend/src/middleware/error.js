import { logger } from "../utils/logger.js";

export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(err, _req, res, _next) {
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: "CORS blocked this origin" });
  }
  const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  const errors = err.errors
    ? Object.values(err.errors).map((item) => item.message || item)
    : err.errorsList || err.errors || [];
  if (statusCode >= 500) logger.error(err.stack || err.message);
  res.status(statusCode).json({ success: false, message: err.message || "Server error", errors });
}
