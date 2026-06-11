import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { signAccessToken } from "../services/tokenService.js";

function serializeUser(user) {
  return { id: user._id, name: user.name, email: user.email, shopName: user.shopName, role: user.role };
}

export const register = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) throw new ApiError(409, "Email already registered");
  const user = await User.create(req.body);
  success(res, "Registered successfully", { user: serializeUser(user), token: signAccessToken(user) }, 201);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) throw new ApiError(401, "Invalid email or password");
  success(res, "Logged in successfully", { user: serializeUser(user), token: signAccessToken(user) });
});

export const profile = asyncHandler(async (req, res) => {
  success(res, "Profile loaded", { user: serializeUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};
  if (typeof req.body.shopName !== "undefined") updates.shopName = req.body.shopName;
  if (typeof req.body.name !== "undefined") updates.name = req.body.name;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  success(res, "Profile updated", { user: serializeUser(user) });
});
