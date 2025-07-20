import paymentModel from "../models/paymentModel.js";
import userModel from "../models/userModel.js";

// Create a payment (deposit or receipt)
const createPayment = async (req, res) => {
  try {
    const { userId, amount, type, description } = req.body;
    // Validation: check all required fields
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return res.json({ success: false, message: "Missing or invalid userId" });
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.json({ success: false, message: "Missing or invalid amount" });
    }
    if (!type || !["deposit", "withdraw"].includes(type)) {
      return res.json({
        success: false,
        message: "Missing or invalid payment type",
      });
    }
    // Update user balance
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    let newBalance = user.balance;
    if (type === "deposit") newBalance += Number(amount);
    else if (type === "withdraw") newBalance -= Number(amount);
    if (newBalance < 0)
      return res.json({ success: false, message: "Insufficient balance" });
    user.balance = newBalance;
    await user.save();
    // Create payment record
    console.log(description);
    const payment = new paymentModel({
      userId,
      amount: Number(amount),
      type,
      description:
        typeof description === "string" && description.length
          ? description
          : `${
              String(type).slice(0, 1).toUpperCase() + String(type).slice(1)
            } operation with amount ${amount} for user ${user.email} by admin`,
    });
    await payment.save();
    res.json({
      success: true,
      payment,
      balance: user.balance,
      message: "Payment has been created successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all payments for a user
const getPayments = async (req, res) => {
  try {
    // userId should come from req.user (set by authUser middleware)
    const userId = req.body.userId;
    if (!userId) return res.json({ success: false, message: "Missing userId" });
    const payments = await paymentModel.find({ userId });
    res.json({ success: true, payments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all payments (admin only)
const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel
      .find({})
      .populate("userId", "name email");
    res.json({ success: true, payments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update a payment (amount, description)
const updatePayment = async (req, res) => {
  try {
    const { paymentId, amount, description } = req.body;
    const payment = await paymentModel.findById(paymentId);
    if (!payment)
      return res.json({ success: false, message: "Payment not found" });
    // Only allow updating amount/description for deposits
    if (amount !== undefined) payment.amount = amount;
    if (description !== undefined) payment.description = description;
    await payment.save();
    res.json({ success: true, payment });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete a payment (and update user balance accordingly)
const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await paymentModel.findById(paymentId);
    if (!payment)
      return res.json({ success: false, message: "Payment not found" });
    const user = await userModel.findById(payment.userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    // Reverse the payment effect
    if (payment.type === "deposit") user.balance -= payment.amount;
    else if (payment.type === "withdraw") user.balance += payment.amount;
    await user.save();
    await paymentModel.findByIdAndDelete(paymentId);
    res.json({
      success: true,
      message: "Payment deleted",
      balance: user.balance,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { createPayment, getPayments, updatePayment, deletePayment };
