import { LedgerEntry } from "../models/LedgerEntry.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { dayBounds } from "../utils/date.js";

async function sum(userId, type, start, end) {
  const result = await LedgerEntry.aggregate([
    { $match: { userId, type, deletedAt: null, date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return result[0]?.total || 0;
}

async function total(userId, type) {
  const result = await LedgerEntry.aggregate([
    { $match: { userId, type, deletedAt: null } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return result[0]?.total || 0;
}

export const dashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = dayBounds();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const [todayCredit, todayExpenses, monthCredit, monthExpenses, totalCredit, totalExpenses, recentTransactions] = await Promise.all([
    sum(userId, "credit", today.start, today.end),
    sum(userId, "expense", today.start, today.end),
    sum(userId, "credit", monthStart, new Date()),
    sum(userId, "expense", monthStart, new Date()),
    total(userId, "credit"),
    total(userId, "expense"),
    LedgerEntry.find({ userId, deletedAt: null }).sort({ date: -1, createdAt: -1 }).limit(10),
  ]);

  success(res, "Dashboard summary loaded", {
    currentBalance: totalCredit - totalExpenses,
    todayCredit,
    todayExpenses,
    monthCredit,
    monthExpenses,
    recentTransactions,
  });
});
