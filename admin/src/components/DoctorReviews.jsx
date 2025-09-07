import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { translate } from "../i18n/index";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorReviews = ({ doctorId }) => {
  const { backendUrl, dToken, language } = useContext(AppContext);
  const t = (key) => translate(language, key);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);

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

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-lg">
            {star <= rating ? "⭐" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (doctorId) {
      fetchReviews();
    }
  }, [doctorId]);

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {t("PATIENT_REVIEWS")}
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-2xl font-bold text-gray-700">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-gray-500 text-lg">
            ({totalReviews} {totalReviews === 1 ? t("REVIEW") : t("REVIEWS")})
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">{t("LOADING_REVIEWS")}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-lg font-medium">{t("NO_REVIEWS_YET")}</p>
            <p className="text-sm">{t("REVIEWS_WILL_APPEAR")}</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.userId.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">
                      {review.userId.name}
                    </p>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
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
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorReviews;
