import mongoose from "mongoose";

const ledgerEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now, index: true },
  type: { type: String, enum: ["credit", "expense"], required: true, index: true },
  category: {
    type: String,
    enum: [ "Rent", "Travel", "Electricity", "Purchase", "Maintenance", "Salary", "Miscellaneous", "Other"],
    default: null,
  },
  paymentMethod: { type: String, enum: ["Cash", "UPI"], default: null },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true, required: false, default: "" },
  deletedAt: { type: Date, default: null, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
}, { timestamps: true });

ledgerEntrySchema.pre("validate", function normalizeCategory(next) {
  if (this.type === "credit") this.category = null;
  next();
});

ledgerEntrySchema.index({ userId: 1, date: -1, type: 1, deletedAt: 1 });
export const LedgerEntry = mongoose.model("LedgerEntry", ledgerEntrySchema);
