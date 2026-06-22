import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { resolveUserShop, serializeShops } from "../services/shopService.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new ApiError(401, "Authentication token missing");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) throw new ApiError(401, "User no longer exists");
  req.user = user;
  next();
});

export const adminOnly = asyncHandler(async (req, _res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
});

export const resolveShop = asyncHandler(async (req, _res, next) => {
  const requestedShopId = req.headers["x-shop-id"] || req.query.shopId || req.body.shopId;
  const { shops, selected } = await resolveUserShop(req.user, requestedShopId);

  if (!selected) throw new ApiError(403, "No shops available for this admin");

  req.shop = selected;
  req.shops = serializeShops(shops);
  next();
});
