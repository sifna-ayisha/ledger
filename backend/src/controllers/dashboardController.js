import { LedgerEntry } from "../models/LedgerEntry.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { dayBounds } from "../utils/date.js";

async function sum(shopId, type, start, end) {
  const result = await LedgerEntry.aggregate([
    { $match: { shopId, type, deletedAt: null, date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return result[0]?.total || 0;
}

async function total(shopId, type) {
  const result = await LedgerEntry.aggregate([
    { $match: { shopId, type, deletedAt: null } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return result[0]?.total || 0;
}

export const dashboardSummary = asyncHandler(async (req, res) => {
  const shopId = req.shop._id;
  const today = dayBounds();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const [todayCredit, todayExpenses, monthCredit, monthExpenses, totalCredit, totalExpenses, recentTransactions] = await Promise.all([
    sum(shopId, "credit", today.start, today.end),
    sum(shopId, "expense", today.start, today.end),
    sum(shopId, "credit", monthStart, new Date()),
    sum(shopId, "expense", monthStart, new Date()),
    total(shopId, "credit"),
    total(shopId, "expense"),
    LedgerEntry.find({ shopId, deletedAt: null }).sort({ date: -1, createdAt: -1 }).limit(10),
  ]);

  success(res, "Dashboard summary loaded", {
    shop: req.shop,
    currentBalance: totalCredit - totalExpenses,
    todayCredit,
    todayExpenses,
    monthCredit,
    monthExpenses,
    recentTransactions,
  });
});
