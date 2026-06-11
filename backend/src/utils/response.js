export function success(res, message, data = {}, statusCode = 200, meta = undefined) {
  return res.status(statusCode).json({ success: true, message, data, ...(meta ? { meta } : {}) });
}
