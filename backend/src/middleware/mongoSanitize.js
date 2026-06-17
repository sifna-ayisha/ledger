import mongoSanitizePkg from "express-mongo-sanitize";

const sanitize = mongoSanitizePkg.sanitize;

/** Express 5 makes req.query read-only; sanitize in place instead of reassigning. */
export function mongoSanitize() {
  return (req, _res, next) => {
    for (const key of ["body", "params", "query"]) {
      if (req[key]) sanitize(req[key]);
    }
    next();
  };
}
