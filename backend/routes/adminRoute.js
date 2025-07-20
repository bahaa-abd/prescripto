import express from "express";
import {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
  allUsers,
} from "../controllers/adminController.js";
import { changeAvailablity } from "../controllers/doctorController.js";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";
import { createPayment } from "../controllers/paymentController.js";
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);
adminRouter.post("/create", authAdmin, createPayment);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.get("/all-users", authAdmin, allUsers);

export default adminRouter;
