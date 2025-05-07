import React, { createContext, useState, useContext, useEffect } from "react";
import NotificationService from "../services/NotificationService";
import { transformNotification, mapFrontendCategoryToBackend } from "../utils/NotificationDataMapper";

// Create the context
const NotificationContext = createContext();

// Create the provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Set up polling for new notifications (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await NotificationService.getNotifications();
      
      // Transform backend data to match frontend format
      const transformedData = data.content ? data.content.map(transformNotification) : [];
      setNotifications(transformedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  // Use the utility function from NotificationDataMapper
  // The transform function is now imported from NotificationDataMapper

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      
      // Update local state
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      
      // Update unread count
      fetchUnreadCount();
    } catch (err) {
      console.error(`Error marking notification ${id} as read:`, err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      
      // Update local state
      setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Get notifications filtered by type
  const getFilteredNotifications = async (type) => {
    if (!type || type === "all") {
      return notifications;
    }
    
    try {
      const category = mapFrontendCategoryToBackend(type);
      if (category && category !== "All") {
        const data = await NotificationService.getNotificationsByCategory(category);
        return data.map(transformNotification);
      }
      return notifications.filter((notif) => notif.type === type);
    } catch (err) {
      console.error(`Error fetching notifications for type ${type}:`, err);
      return notifications.filter((notif) => notif.type === type);
    }
  };

  // Add a new notification (used for testing)
  const addNotification = () => {
    // For testing only - refresh all notifications instead in production
    fetchNotifications();
    fetchUnreadCount();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        getFilteredNotifications,
        loading,
        error,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

// Export the context itself
export { NotificationContext };