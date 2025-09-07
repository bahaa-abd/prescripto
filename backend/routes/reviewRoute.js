import express from "express";
import {
  addReview,
  getDoctorReviews,
  getUserReviewForDoctor,
  canUserReviewDoctor,
} from "../controllers/reviewController.js";
import authUser from "../middleware/authUser.js";

const reviewRouter = express.Router();

// Add a review for a doctor
reviewRouter.post("/", authUser, addReview);

// Get all reviews for a doctor with average rating
reviewRouter.get("/doctor/:doctorId", getDoctorReviews);

// Get a specific review by user and doctor
reviewRouter.get(
  "/user/:userId/doctor/:doctorId",
  authUser,
  getUserReviewForDoctor
);

// Check if user can review a doctor
reviewRouter.get(
  "/can-review/:userId/:doctorId",
  authUser,
  canUserReviewDoctor
);

export default reviewRouter;
