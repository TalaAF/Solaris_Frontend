import React, { useState, useEffect } from "react";
import "./NotificationsPanel.css";
import { useNotifications } from "./NotificationContext";
import NotificationDetail from "./NotificationDetail";
import NotificationService from "../services/NotificationService";
import { mapFrontendCategoryToBackend } from "../utils/NotificationDataMapper";

const NotificationsPanel = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    unreadCount,
    fetchNotifications
  } = useNotifications();

  // Load notifications based on the filter
  useEffect(() => {
    if (isOpen) {
      fetchFilteredNotifications();
    }
  }, [activeFilter, isOpen, notifications]);

  const fetchFilteredNotifications = async () => {
    try {
      setIsLoading(true);
      
      if (activeFilter === "all") {
        setFilteredNotifications(notifications);
      } else {
        const category = mapFrontendCategoryToBackend(activeFilter);
        if (category && category !== "All") {
          await NotificationService.getNotificationsByCategory(category);
          // Use your context's transform function or implement transformation here
          // For now, we'll just use what comes from the context
          const filtered = notifications.filter(
            (notification) => notification.type === activeFilter
          );
          setFilteredNotifications(filtered);
        } else {
          setFilteredNotifications(
            notifications.filter(
              (notification) => notification.type === activeFilter
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching filtered notifications:", error);
      // Fallback to frontend filtering in case of API error
      if (activeFilter === "all") {
        setFilteredNotifications(notifications);
      } else {
        setFilteredNotifications(
          notifications.filter(
            (notification) => notification.type === activeFilter
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotifications = (type) => {
    setActiveFilter(type);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  const handleMarkAllAsRead = async () => {
    if (activeFilter === "all") {
      await markAllAsRead();
    } else {
      const category = mapFrontendCategoryToBackend(activeFilter);
      if (category && category !== "All") {
        await NotificationService.markAllAsReadInCategory(category);
        // Refresh notifications
        fetchNotifications();
      }
    }
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

  return (
    <>
      <div className={`notifications-panel ${panelOpenClass}`}>
        <div className="notifications-header">
          <h2>Notifications {unreadCount > 0 && `(${unreadCount})`}</h2>
          <button className="close-button" onClick={onClose}>
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="notifications-filter">
          <button
            className={`filter-button ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => filterNotifications("all")}
          >
            All
          </button>
          <button
            className={`filter-button ${activeFilter === "academic" ? "active" : ""}`}
            onClick={() => filterNotifications("academic")}
          >
            Academic
          </button>
          <button
            className={`filter-button ${activeFilter === "reminder" ? "active" : ""}`}
            onClick={() => filterNotifications("reminder")}
          >
            Reminders
          </button>
          <button
            className={`filter-button ${activeFilter === "announcement" ? "active" : ""}`}
            onClick={() => filterNotifications("announcement")}
          >
            Announcements
          </button>
        </div>

        <div className="notifications-actions">
          <button className="mark-all-read" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        </div>

        <div className="notifications-list">
          {isLoading ? (
            <div className="notification-loading">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notification-empty">No notifications</div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? "unread" : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                {!notification.read && <div className="unread-indicator"></div>}
              </div>
            ))
          )}
        </div>
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