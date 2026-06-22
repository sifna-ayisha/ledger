import { LedgerEntry } from "../models/LedgerEntry.js";
import { Shop } from "../models/Shop.js";

function normalizeShopName(name, fallback = "Main Shop") {
  const value = typeof name === "string" ? name.trim() : "";
  return value || fallback;
}

export async function ensureUserShops(user) {
  let shops = await Shop.find({
    $or: [{ ownerId: user._id }, { "members.userId": user._id }],
  }).sort({ createdAt: 1, _id: 1 });

  if (!shops.length) {
    const shop = await Shop.create({
      ownerId: user._id,
      name: normalizeShopName(user.shopName, "Main Shop"),
    });
    shops = [shop];
  }

  const primaryShopId = shops[0]._id;
  await LedgerEntry.updateMany(
    { userId: user._id, $or: [{ shopId: { $exists: false } }, { shopId: null }] },
    { $set: { shopId: primaryShopId } }
  );

  return shops;
}

export async function resolveUserShop(user, requestedShopId) {
  const shops = await ensureUserShops(user);
  const selected =
    shops.find((shop) => String(shop._id) === String(requestedShopId || "")) || shops[0] || null;

  return { shops, selected };
}

export function serializeShops(shops, userId = null) {
  return shops.map((shop) => ({
    id: shop._id,
    name: shop.name,
    ownerId: shop.ownerId,
    accessRole: String(shop.ownerId) === String(userId)
      ? "owner"
      : shop.members?.find((member) => String(member.userId) === String(userId))?.role || "member",
    createdAt: shop.createdAt,
    updatedAt: shop.updatedAt,
  }));
}
