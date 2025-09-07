import { useState, useEffect, useContext, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const NotificationDropdown = () => {
  const { token, userData, backendUrl, t } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Detect if current language is RTL
  const isRTL =
    document.documentElement.dir === "rtl" ||
    document.documentElement.lang === "ar" ||
    document.body.classList.contains("rtl");

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!token || !userData) return;

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/notifications/${userData._id}`,
        {
          headers: { token },
        }
      );

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [token, userData, backendUrl]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { token },
        }
      );

      if (data.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to mark notification as read");
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/notifications/mark-all-read`,
        { userId: userData._id },
        {
          headers: { token },
        }
      );

      if (data.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token, userData, fetchNotifications]);

  if (!token || !userData) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <div
        className="relative cursor-pointer p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-full transition-all duration-300 hover:scale-110"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse ${
              isRTL ? "-left-1" : "-right-1"
            }`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
          style={{
            ...(isRTL ? { left: "0" } : { right: "0" }),
            maxWidth: "calc(100vw - 1rem)",
            width: "min(320px, calc(100vw - 1rem))",
            transform: isRTL ? "translateX(0)" : "translateX(0)",
            position: "absolute",
          }}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <h3
              className={`font-bold text-gray-800 text-base flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="text-lg">🔔</span>
              {t("NOTIFICATIONS")}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold bg-white px-2 py-1 rounded-full hover:bg-blue-50 transition-colors"
              >
                {t("MARK_ALL_READ")}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-3"></div>
                <p className="text-sm">{t("LOADING_NOTIFICATIONS")}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm font-medium">{t("NO_NOTIFICATIONS")}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-2 border-b border-gray-100 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                    !notification.read
                      ? `bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 ${
                          isRTL
                            ? "border-r-4 border-r-blue-500 border-l-0"
                            : "border-l-blue-500"
                        }`
                      : ""
                  }`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div
                    className={`flex items-start gap-3 ${
                      isRTL ? "flex-row-reverse text-right" : ""
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                        !notification.read
                          ? "bg-blue-500 shadow-lg"
                          : "bg-gray-300"
                      }`}
                    />
                    <div className="flex-1">
                      <h4
                        className={`font-semibold text-gray-800 text-sm mb-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <p
                        className={`text-gray-600 text-sm leading-relaxed ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p
                        className={`text-xs text-gray-400 mt-2 bg-gray-100 px-2 py-1 rounded-full inline-block ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2 border-t border-gray-200 text-center bg-gray-50">
              <button
                onClick={() => setShowDropdown(false)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium bg-white px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {t("CLOSE")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationDropdown;
