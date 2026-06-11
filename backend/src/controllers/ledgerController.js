import { LedgerEntry } from "../models/LedgerEntry.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { dateFilter, pagination } from "../services/queryService.js";

const active = { deletedAt: null };
const signedAmount = (entry) => (entry.type === "credit" ? entry.amount : -entry.amount);

function searchFilter(query) {
  const filter = {};
  if (query.search) {
    const search = new RegExp(query.search, "i");
    filter.$or = [{ description: search }, { category: search }, { type: search }];
  }
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  return filter;
}

function normalizePayload(body) {
  return {
    date: body.date,
    type: body.type,
    category: body.type === "expense" ? body.category || "Other" : null,
    paymentMethod: body.type === "credit" ? body.paymentMethod || null : null,
    amount: Number(body.amount),
    description: body.description,
  };
}

export const listLedgerEntries = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pagination(req.query);
  const filter = { userId: req.user._id, ...active, ...dateFilter(req.query), ...searchFilter(req.query) };
  const allFilter = { userId: req.user._id, ...active };

  const [allEntries, total, totals] = await Promise.all([
    LedgerEntry.find(filter).sort({ date: 1, createdAt: 1 }),
    LedgerEntry.countDocuments(filter),
    LedgerEntry.aggregate([{ $match: filter }, { $group: { _id: "$type", total: { $sum: "$amount" } } }]),
  ]);

  let runningBalance = 0;
  const entriesWithBalance = allEntries.map((entry) => {
    runningBalance += signedAmount(entry);
    return { ...entry.toObject(), runningBalance };
  }).reverse();

  const totalCredit = totals.find((item) => item._id === "credit")?.total || 0;
  const totalExpense = totals.find((item) => item._id === "expense")?.total || 0;
  const overallTotals = await LedgerEntry.aggregate([
    { $match: allFilter },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);
  const overallCredit = overallTotals.find((item) => item._id === "credit")?.total || 0;
  const overallExpense = overallTotals.find((item) => item._id === "expense")?.total || 0;

  success(res, "Ledger loaded", {
    items: entriesWithBalance.slice(skip, skip + limit),
    summary: {
      totalCredit,
      totalExpense,
      balance: totalCredit - totalExpense,
      currentBalance: overallCredit - overallExpense,
    },
  }, 200, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const createLedgerEntry = asyncHandler(async (req, res) => {
  const item = await LedgerEntry.create({ ...normalizePayload(req.body), userId: req.user._id });
  success(res, "Transaction created", { item }, 201);
});

export const updateLedgerEntry = asyncHandler(async (req, res) => {
  const item = await LedgerEntry.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id, ...active },
    normalizePayload(req.body),
    { new: true, runValidators: true },
  );
  if (!item) throw new ApiError(404, "Transaction not found");
  success(res, "Transaction updated", { item });
});

export const deleteLedgerEntry = asyncHandler(async (req, res) => {
  const item = await LedgerEntry.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id, ...active },
    { deletedAt: new Date() },
    { new: true },
  );
  if (!item) throw new ApiError(404, "Transaction not found");
  success(res, "Transaction deleted");
});

export const groupedLedgerEntries = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id, ...active, ...dateFilter(req.query), ...searchFilter(req.query) };
  const entries = await LedgerEntry.find(filter).sort({ date: -1, createdAt: -1 });
  const groups = entries.reduce((acc, item) => {
    const date = item.date.toISOString().slice(0, 10);
    if (!acc[date]) acc[date] = { date, credits: [], expenses: [], totalCredit: 0, totalExpense: 0, balance: 0 };
    const row = item.toObject();
    if (item.type === "credit") {
      acc[date].credits.push(row);
      acc[date].totalCredit += item.amount;
    } else {
      acc[date].expenses.push(row);
      acc[date].totalExpense += item.amount;
    }
    acc[date].balance = acc[date].totalCredit - acc[date].totalExpense;
    return acc;
  }, {});
  success(res, "Date-wise ledger loaded", { groups: Object.values(groups) });
});

export const backupLedgerEntries = asyncHandler(async (req, res) => {
  const items = await LedgerEntry.find({ userId: req.user._id, ...active }).sort({ date: 1, createdAt: 1 });
  success(res, "Ledger backup ready", { items });
});

export const restoreLedgerEntries = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const docs = items.map((item) => ({ ...normalizePayload(item), userId: req.user._id }));
  if (docs.length) await LedgerEntry.insertMany(docs, { ordered: false });
  success(res, "Ledger restored", { count: docs.length });
});
