import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { LedgerEntry } from "../models/LedgerEntry.js";

dotenv.config();
await connectDB();
await Promise.all([User.deleteMany({}), LedgerEntry.deleteMany({})]);
const user = await User.create({ name: "Demo User", email: "demo@ledger.app", password: "password123", shopName: "Personal Ledger", role: "owner" });
await LedgerEntry.insertMany([
  { date: new Date("2026-06-03"), type: "credit", category: null, amount: 5000, description: "Salary", userId: user._id },
  { date: new Date("2026-06-03"), type: "expense", category: "Food", amount: 300, description: "Lunch", userId: user._id },
  { date: new Date("2026-06-03"), type: "expense", category: "Travel", amount: 150, description: "Cab", userId: user._id },
  { date: new Date("2026-06-02"), type: "expense", category: "Bills", amount: 900, description: "Internet bill", userId: user._id },
]);
console.log("Seed complete: demo@ledger.app / password123");
process.exit(0);
