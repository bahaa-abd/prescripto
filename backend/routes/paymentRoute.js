import express from "express";
import {
  getPayments,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";
import authUser from "../middleware/authUser.js";
const paymentRouter = express.Router();

paymentRouter.get("/get", authUser, getPayments);
paymentRouter.patch("/update", authUser, updatePayment);
paymentRouter.delete("/delete", authUser, deletePayment);

export default paymentRouter;
