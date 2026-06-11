import { ApiError } from "../utils/apiError.js";

export const validate = (schema) => (req, _res, next) => {
  const errors = [];
  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];
    if (rules.required && (value === undefined || value === null || value === "")) errors.push(`${field} is required`);
    if (value !== undefined && rules.type === "number" && Number.isNaN(Number(value))) errors.push(`${field} must be a number`);
    if (value !== undefined && rules.min !== undefined && Number(value) < rules.min) errors.push(`${field} must be at least ${rules.min}`);
    if (value && rules.enum && !rules.enum.includes(value)) errors.push(`${field} must be one of ${rules.enum.join(", ")}`);
  }
  if (errors.length) throw new ApiError(400, "Validation failed", errors);
  next();
};
