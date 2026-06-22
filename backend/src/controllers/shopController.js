import { Shop } from "../models/Shop.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { ensureUserShops, serializeShops } from "../services/shopService.js";

function normalizeName(name) {
  return typeof name === "string" ? name.trim() : "";
}

export const listShops = asyncHandler(async (req, res) => {
  const shops = await ensureUserShops(req.user);
  success(res, "Shops loaded", { items: serializeShops(shops, req.user._id) });
});

export const createShop = asyncHandler(async (req, res) => {
  const name = normalizeName(req.body.name);
  if (!name) throw new ApiError(400, "Shop name is required");

  const item = await Shop.create({
    ownerId: req.user._id,
    name,
  });

  success(res, "Shop created", { item: serializeShops([item], req.user._id)[0] }, 201);
});

export const updateShop = asyncHandler(async (req, res) => {
  const name = normalizeName(req.body.name);
  if (!name) throw new ApiError(400, "Shop name is required");

  const item = await Shop.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user._id },
    { name },
    { new: true, runValidators: true }
  );

  if (!item) throw new ApiError(404, "Shop not found");
  success(res, "Shop updated", { item: serializeShops([item], req.user._id)[0] });
});

export const listShopUsers = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({
    _id: req.params.id,
    $or: [{ ownerId: req.user._id }, { "members.userId": req.user._id }],
  }).populate("ownerId", "name email role").populate("members.userId", "name email role");

  if (!shop) throw new ApiError(404, "Shop not found");

  const items = [
    {
      id: shop.ownerId._id,
      name: shop.ownerId.name,
      email: shop.ownerId.email,
      role: "owner",
    },
    ...shop.members.map((member) => ({
      id: member.userId._id,
      name: member.userId.name,
      email: member.userId.email,
      role: member.role,
    })),
  ];

  success(res, "Shop users loaded", { items });
});

export const addShopUser = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!shop) throw new ApiError(404, "Shop not found or you cannot manage users for it");

  const role = ["manager", "staff"].includes(req.body.role) ? req.body.role : "manager";
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    if (!req.body.name || !req.body.password) {
      throw new ApiError(400, "Name and password are required for a new user");
    }
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role,
      shopName: shop.name,
    });
  }

  if (String(user._id) === String(shop.ownerId)) {
    throw new ApiError(400, "This user already owns the shop");
  }

  const existing = shop.members.find((member) => String(member.userId) === String(user._id));
  if (existing) {
    existing.role = role;
  } else {
    shop.members.push({ userId: user._id, role });
  }

  await shop.save();
  success(res, "Shop user saved", {
    item: { id: user._id, name: user.name, email: user.email, role },
  }, 201);
});
