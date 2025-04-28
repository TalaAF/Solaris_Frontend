import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const NotificationContext = createContext();

// Sample notifications data
const initialNotifications = [
  {
    id: 1,
    type: 'academic',
    title: 'New Grade Posted',
    message: 'Your Clinical Pathology Lab Report has been graded.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Upcoming Deadline',
    message: 'Cardiovascular System Quiz is due tomorrow at 14:30.',
    time: '3 hours ago',
    read: false
  },
  {
    id: 3,
    type: 'announcement',
    title: 'Campus Announcement',
    message: 'The Medical Library will be closed for maintenance this weekend.',
    time: '5 hours ago',
    read: false
  },
  {
    id: 4,
    type: 'academic',
    title: 'Assignment Feedback',
    message: 'Dr. Johnson has provided feedback on your Ethics Case Study.',
    time: '1 day ago',
    read: true
  },
  {
    id: 5,
    type: 'reminder',
    title: 'Study Group Reminder',
    message: 'Your Pharmacology study group meets tomorrow at 14:30.',
    time: '1 day ago',
    read: true
  },
  {
    id: 6,
    type: 'announcement',
    title: 'Curriculum Update',
    message: 'The syllabus for Anatomical Pathology has been updated. Please review the changes.',
    time: '2 days ago',
    read: true
  }
];

// Create the provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notif => !notif.read).length;
    setUnreadCount(count);
  }, [notifications]);
  
  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  // Add a new notification
  const addNotification = (notification) => {
    setNotifications([
      {
        id: Date.now(), // Generate a unique ID
        read: false,
        time: 'Just now',
        ...notification
      },
      ...notifications
    ]);
  };
  
  // Get notifications filtered by type
  const getFilteredNotifications = (type) => {
    if (!type || type === 'all') {
      return notifications;
    }
    return notifications.filter(notif => notif.type === type);
  };
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        getFilteredNotifications
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
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Export the context itself instead of as default
export { NotificationContext };