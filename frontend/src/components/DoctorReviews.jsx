import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorReviews = ({ doctorId }) => {
  const { token, userData, backendUrl, t } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewCheckLoading, setReviewCheckLoading] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch reviews for the doctor
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/reviews/doctor/${doctorId}`
      );

      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's review for this doctor
  const fetchUserReview = async () => {
    if (!token || !userData) return;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/reviews/user/${userData._id}/doctor/${doctorId}`,
        {
          headers: { token },
        }
      );

      if (data.success && data.review) {
        setUserReview(data.review);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check if user can review this doctor
  const checkCanReview = async () => {
    if (!token || !userData) return;

    try {
      setReviewCheckLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/reviews/can-review/${userData._id}/${doctorId}`,
        {
          headers: { token },
        }
      );

      if (data.success) {
        setCanReview(data.canReview);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setReviewCheckLoading(false);
    }
  };

  // Submit a new review
  const submitReview = async () => {
    if (!token || !userData) {
      toast.warning("Please login to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `${backendUrl}/api/reviews`,
        {
          userId: userData._id,
          doctorId,
          rating,
          comment: comment.trim(),
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success("Review submitted successfully!");
        setShowReviewForm(false);
        setRating(0);
        setComment("");
        fetchReviews();
        fetchUserReview();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Render star rating
  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-2xl cursor-pointer ${
              interactive ? "hover:scale-110 transition-transform" : ""
            }`}
            onClick={interactive ? () => onStarClick(star) : undefined}
          >
            {star <= rating ? "⭐" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (doctorId) {
      fetchReviews();
      fetchUserReview();
      checkCanReview();
    }
  }, [doctorId, token, userData]);

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {t("REVIEWS")}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-lg font-medium text-gray-700">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500">
              ({totalReviews} {totalReviews === 1 ? t("REVIEW") : t("REVIEWS")})
            </span>
          </div>
        </div>

        {token && userData && !userReview && canReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t("WRITE_REVIEW")}
          </button>
        )}

        {token &&
          userData &&
          !userReview &&
          !canReview &&
          !reviewCheckLoading && (
            <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
              {t("COMPLETE_APPOINTMENT_FIRST")}
            </div>
          )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl mb-6 border border-blue-200 shadow-lg">
          <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            {t("WRITE_REVIEW")}
          </h4>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t("RATING")}
              </label>
              <div className="flex gap-2">
                {renderStars(rating, true, setRating)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t("COMMENT")}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("SHARE_EXPERIENCE")}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                rows="4"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={submitReview}
                disabled={submitting}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                {submitting ? t("SUBMITTING") : t("SUBMIT_REVIEW")}
              </button>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setRating(0);
                  setComment("");
                }}
                className="bg-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-400 transition-all duration-300 font-semibold"
              >
                {t("CANCEL")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User's Review */}
      {userReview && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-200 shadow-md">
          <h4 className="font-semibold text-gray-800 mb-3 text-lg">
            {t("YOUR_REVIEW")}
          </h4>
          <div className="flex items-center gap-3 mb-3">
            {renderStars(userReview.rating)}
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
              {new Date(userReview.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{userReview.comment}</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">{t("LOADING_REVIEWS")}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl font-medium mb-2">{t("NO_REVIEWS_YET")}</p>
            <p className="text-sm">
              Reviews will appear here once patients complete their appointments
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {review.userId.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">
                      {review.userId.name}
                    </p>
                    <div className="flex items-center gap-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-base">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorReviews;
