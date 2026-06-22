import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["manager", "staff"], default: "manager" },
      },
    ],
  },
  { timestamps: true }
);

shopSchema.index({ ownerId: 1, name: 1 }, { unique: true });
shopSchema.index({ "members.userId": 1 });

export const Shop = mongoose.model("Shop", shopSchema);
