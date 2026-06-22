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

export async function getShopLedgerStats(shopId) {
  const [totals, totalEntries, recentTransactions] = await Promise.all([
    LedgerEntry.aggregate([
      { $match: { shopId, deletedAt: null } },
      { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    LedgerEntry.countDocuments({ shopId, deletedAt: null }),
    LedgerEntry.find({ shopId, deletedAt: null }).sort({ date: -1, createdAt: -1 }).limit(10),
  ]);

  const credit = totals.find((row) => row._id === "credit") || { total: 0, count: 0 };
  const expense = totals.find((row) => row._id === "expense") || { total: 0, count: 0 };

  return {
    totalCredit: credit.total,
    totalExpenses: expense.total,
    currentBalance: credit.total - expense.total,
    creditCount: credit.count,
    expenseCount: expense.count,
    totalEntries,
    recentTransactions,
  };
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
