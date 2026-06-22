import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { ensureUserShops, serializeShops } from "../services/shopService.js";
import { signAccessToken } from "../services/tokenService.js";

const ADMIN_USERNAME = "kkadmin";
const ADMIN_PASSWORD = "kkadmin123";
const ADMIN_EMAIL = "kkadmin@example.com";

function serializeUser(user, shops = []) {
  const serializedShops = serializeShops(shops, user._id);
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    shopName: serializedShops[0]?.name || user.shopName,
    role: user.role,
    shops: serializedShops,
    selectedShopId: serializedShops[0]?.id || null,
  };
}

async function authPayload(user) {
  const shops = await ensureUserShops(user);
  return { user: serializeUser(user, shops), token: signAccessToken(user) };
}

export const register = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) throw new ApiError(409, "Email already registered");
  const user = await User.create(req.body);
  success(res, "Registered successfully", await authPayload(user), 201);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) throw new ApiError(401, "Invalid email or password");
  success(res, "Logged in successfully", await authPayload(user));
});

export const adminLogin = asyncHandler(async (req, res) => {
  if (req.body.username !== ADMIN_USERNAME || req.body.password !== ADMIN_PASSWORD) {
    throw new ApiError(401, "Invalid username or password");
  }

  let user = await User.findOne({ email: ADMIN_EMAIL }).select("+password");
  if (!user) {
    user = await User.create({
      name: "KK Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      shopName: "KK Admin Shop",
      role: "admin",
    });
  } else if (!(await user.comparePassword(ADMIN_PASSWORD))) {
    user.password = ADMIN_PASSWORD;
    await user.save();
  }

  success(res, "Admin logged in successfully", await authPayload(user));
});

export const profile = asyncHandler(async (req, res) => {
  const shops = await ensureUserShops(req.user);
  success(res, "Profile loaded", { user: serializeUser(req.user, shops) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};
  if (typeof req.body.name !== "undefined") updates.name = req.body.name;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  const shops = await ensureUserShops(user);
  success(res, "Profile updated", { user: serializeUser(user, shops) });
});
