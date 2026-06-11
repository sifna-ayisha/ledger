import { LedgerEntry } from "../models/LedgerEntry.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { rangeFromQuery } from "../utils/date.js";

const formats = {
  daily: "%Y-%m-%d",
  monthly: "%Y-%m",
  yearly: "%Y",
};

async function ledgerReport(req, period = "daily") {
  const { start, end } = rangeFromQuery(req.query);
  const groupFormat = formats[period] || formats.daily;
  const rows = await LedgerEntry.aggregate([
    { $match: { userId: req.user._id, deletedAt: null, date: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: { $dateToString: { format: groupFormat, date: "$date" } },
        credit: { $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] } },
        expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
        transactions: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return {
    rows: rows.map((row) => ({ period: row._id, credit: row.credit, expense: row.expense, balance: row.credit - row.expense, transactions: row.transactions })),
    range: { start, end },
  };
}

export const dailyReport = asyncHandler(async (req, res) => {
  success(res, "Daily ledger report loaded", await ledgerReport(req, "daily"));
});

export const monthlyReport = asyncHandler(async (req, res) => {
  success(res, "Monthly ledger report loaded", await ledgerReport(req, "monthly"));
});

export const yearlyReport = asyncHandler(async (req, res) => {
  success(res, "Yearly ledger report loaded", await ledgerReport(req, "yearly"));
});

export const backupReport = asyncHandler(async (_req, res) => {
  success(res, "Backup metadata loaded", { items: [], valuation: 0 });
});
