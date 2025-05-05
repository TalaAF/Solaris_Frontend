import React from "react";
import "./NotificationBadge.css";

const NotificationBadge = ({ count }) => {
  // Only show the badge if there are notifications
  if (!count || count === 0) return null;

  return <div className="notification-badge">{count > 9 ? "9+" : count}</div>;
};

export default NotificationBadge;
