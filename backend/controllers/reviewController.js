import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import notificationModel from "../models/notificationModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API to add a review for a doctor
const addReview = async (req, res) => {
  try {
    const { userId, doctorId, rating, comment } = req.body;

    if (!userId || !doctorId || !rating || !comment) {
      return res.json({
        success: false,
        message: "Missing required fields: userId, doctorId, rating, comment",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if doctor exists
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if user has already reviewed this doctor
    const existingReview = await reviewModel.findOne({ userId, doctorId });
    if (existingReview) {
      return res.json({
        success: false,
        message: "You have already reviewed this doctor",
      });
    }

    // Check if user has completed an appointment with this doctor
    const completedAppointment = await appointmentModel.findOne({
      userId,
      docId: doctorId,
      isCompleted: true,
      payment: true,
    });

    if (!completedAppointment) {
      return res.json({
        success: false,
        message:
          "You must complete an appointment with this doctor before writing a review",
      });
    }

    const reviewData = {
      userId,
      doctorId,
      rating,
      comment,
    };

    const newReview = new reviewModel(reviewData);
    await newReview.save();

    // Populate user data for response
    await newReview.populate("userId", "name");

    // Create notification for review submission
    const notificationData = {
      userId,
      title: "Review Submitted",
      message: `Thank you for reviewing Dr. ${doctor.name}. Your feedback helps other patients make informed decisions.`,
    };
    const newNotification = new notificationModel(notificationData);
    await newNotification.save();

    res.json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.json({
        success: false,
        message: "You have already reviewed this doctor",
      });
    }
    res.json({ success: false, message: error.message });
  }
};

// API to get all reviews for a doctor with average rating
const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    // Check if doctor exists
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Get all reviews for the doctor with user information
    const reviews = await reviewModel
      .find({ doctorId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Round to 1 decimal place
    const roundedAverageRating = Math.round(averageRating * 10) / 10;

    res.json({
      success: true,
      reviews,
      averageRating: roundedAverageRating,
      totalReviews,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get a specific review by user and doctor
const getUserReviewForDoctor = async (req, res) => {
  try {
    const { userId, doctorId } = req.params;

    if (!userId || !doctorId) {
      return res.json({
        success: false,
        message: "User ID and Doctor ID are required",
      });
    }

    const review = await reviewModel
      .findOne({ userId, doctorId })
      .populate("userId", "name");

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to check if user can review a doctor
const canUserReviewDoctor = async (req, res) => {
  try {
    const { userId, doctorId } = req.params;

    if (!userId || !doctorId) {
      return res.json({
        success: false,
        message: "User ID and Doctor ID are required",
      });
    }

    // Check if user has already reviewed this doctor
    const existingReview = await reviewModel.findOne({ userId, doctorId });
    if (existingReview) {
      return res.json({
        success: true,
        canReview: false,
        reason: "already_reviewed",
        message: "You have already reviewed this doctor",
      });
    }

    // Check if user has completed an appointment with this doctor
    const completedAppointment = await appointmentModel.findOne({
      userId,
      docId: doctorId,
      isCompleted: true,
      payment: true,
    });

    if (!completedAppointment) {
      return res.json({
        success: true,
        canReview: false,
        reason: "no_completed_appointment",
        message:
          "You must complete an appointment with this doctor before writing a review",
      });
    }

    res.json({
      success: true,
      canReview: true,
      message: "You can review this doctor",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addReview,
  getDoctorReviews,
  getUserReviewForDoctor,
  canUserReviewDoctor,
};
