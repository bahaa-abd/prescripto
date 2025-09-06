import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["deposit", "withdraw"], required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  method: { type: String, enum: ["cash", "bank"] },
});

const paymentModel =
  mongoose.models.payment || mongoose.model("payment", paymentSchema);
export default paymentModel;
