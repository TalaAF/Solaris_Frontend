import React, { useState } from "react";
import { Clock, FileText, Bell, CheckCheck, X } from "lucide-react";
import "./NotificationsPanel.css";
import NotificationDetail from "./NotificationDetail";

const NotificationsPanel = ({ isOpen, onClose, notifications = [] }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);

  const filterNotifications = (type) => {
    setActiveFilter(type);
  };

  // Local filtering function based on the activeFilter state
  const getFilteredNotifications = () => {
    if (activeFilter === "all") {
      return notifications;
    }
    return notifications.filter(
      (notification) => notification.type === activeFilter
    );
  };

  const filteredNotifications = getFilteredNotifications();

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const closeNotificationDetail = () => {
    setSelectedNotification(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "academic":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        );
      case "reminder":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        );
      case "announcement":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5h2m-1-4v4M3 8a9 9 0 1 1 18 0 9 9 0 1 1-18 0m9 4v6m0 3v.01"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  // If notification detail is open, close notification panel
  const panelOpenClass = isOpen && !selectedNotification ? "open" : "";

  const hasUnread = notifications.some((notif) => !notif.read);

  return (
    <>
      <div className={`notifications-panel ${panelOpenClass}`}>
        <div className="notifications-header">
          <h2 className="notifications-title">Notifications</h2>
          <button className="close-notifications" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="notifications-tabs">
          <button
            className={`notification-tab ${
              activeFilter === "all" ? "active" : ""
            }`}
            onClick={() => filterNotifications("all")}
          >
            All
          </button>
          <button
            className={`notification-tab ${
              activeFilter === "academic" ? "active" : ""
            }`}
            onClick={() => filterNotifications("academic")}
          >
            Academic
          </button>
          <button
            className={`notification-tab ${
              activeFilter === "reminder" ? "active" : ""
            }`}
            onClick={() => filterNotifications("reminder")}
          >
            Reminders
          </button>
          <button
            className={`notification-tab ${
              activeFilter === "announcement" ? "active" : ""
            }`}
            onClick={() => filterNotifications("announcement")}
          >
            Announcements
          </button>
        </div>

        {hasUnread && (
          <div className="notifications-actions">
            <button className="mark-read-button">Mark all as read</button>
          </div>
        )}

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="notifications-empty">
              <div className="empty-icon">
                <Bell />
              </div>
              <p className="empty-text">No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  !notification.read ? "unread" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className={`notification-icon ${notification.type}`}>
                  {getTypeIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  <div className="notification-time">{notification.time}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div className="notifications-footer">
            <button className="view-all-button">View all notifications</button>
          </div>
        )}
      </div>

      {/* Backdrop for notification detail */}
      {selectedNotification && (
        <div
          className="notification-detail-backdrop"
          onClick={closeNotificationDetail}
        ></div>
      )}

      {/* Render the notification detail if a notification is selected */}
      {selectedNotification && (
        <NotificationDetail
          notification={selectedNotification}
          onClose={closeNotificationDetail}
        />
      )}
    </>
  );
};

export default NotificationsPanel;
