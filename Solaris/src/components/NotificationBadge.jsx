import React, { useEffect, useState } from "react";
import "./NotificationBadge.css";
import NotificationService from "../services/NotificationService";

const NotificationBadge = ({ count: propCount }) => {
  const [count, setCount] = useState(propCount || 0);

  // If count is passed directly, use it, otherwise fetch from API
  useEffect(() => {
    if (propCount !== undefined) {
      setCount(propCount);
    } else {
      // Fetch the unread count from the API
      const fetchUnreadCount = async () => {
        try {
          const unreadCount = await NotificationService.getUnreadCount();
          setCount(unreadCount);
        } catch (error) {
          console.error("Error fetching unread count:", error);
        }
      };

      fetchUnreadCount();

      // Set up polling to update the badge every 30 seconds
      const intervalId = setInterval(fetchUnreadCount, 30000);

      // Clean up
      return () => clearInterval(intervalId);
    }
  }, [propCount]);

  // Only show the badge if there are notifications
  if (!count || count === 0) return null;

  return <div className="notification-badge">{count > 9 ? "9+" : count}</div>;
};

export default NotificationBadge;