import { LedgerEntry } from "../models/LedgerEntry.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

export const analytics = asyncHandler(async (req, res) => {
  const shopId = req.shop._id;
  const [creditTrend, expenseTrend, expenseCategories] = await Promise.all([
    LedgerEntry.aggregate([
      { $match: { shopId, deletedAt: null, type: "credit" } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, credit: { $sum: "$amount" } } },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]),
    LedgerEntry.aggregate([
      { $match: { shopId, deletedAt: null, type: "expense" } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, expense: { $sum: "$amount" } } },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]),
    LedgerEntry.aggregate([
      { $match: { shopId, deletedAt: null, type: "expense" } },
      { $group: { _id: "$category", value: { $sum: "$amount" } } },
      { $sort: { value: -1 } },
    ]),
  ]);
  const months = [...new Set([...creditTrend.map((x) => x._id), ...expenseTrend.map((x) => x._id)])];
  const monthly = months.map((month) => {
    const credit = creditTrend.find((x) => x._id === month)?.credit || 0;
    const expense = expenseTrend.find((x) => x._id === month)?.expense || 0;
    return { month, credit, expense, balance: credit - expense };
  });
  success(res, "Analytics loaded", { shop: req.shop, monthly, expenseCategories });
});
