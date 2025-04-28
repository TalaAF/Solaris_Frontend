import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const NotificationContext = createContext();

// Sample notifications data with more detailed info and appropriate action buttons
const initialNotifications = [
  {
    id: 1,
    type: 'academic',
    title: 'New Grade Posted',
    message: 'Your Clinical Pathology Lab Report has been graded. You received a score of 92/100. The instructor provided detailed feedback that you can view by clicking on this notification.',
    time: '2 hours ago',
    read: false,
    course: 'Clinical Pathology',
    links: [
      { title: 'View Grade', url: '/grades/clinical-pathology' },
      { title: 'Download Feedback', url: '/feedback/download/123' }
    ],
    actionButtons: [
      { label: 'Go to Lab Report', primary: true, action: () => window.location.href = '/grades/clinical-pathology' }
    ]
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Upcoming Deadline',
    message: 'Cardiovascular System Quiz is due tomorrow at 14:30. Make sure to review all required materials before attempting the quiz.',
    time: '3 hours ago',
    read: false,
    course: 'Anatomy and Physiology',
    links: [
      { title: 'View Quiz Details', url: '/quizzes/cardiovascular-system' },
      { title: 'Study Materials', url: '/materials/cardiovascular-system' }
    ],
    actionButtons: [
      { label: 'Go to Quiz', primary: true, action: () => window.location.href = '/quizzes/cardiovascular-system' }
    ]
  },
  {
    id: 3,
    type: 'announcement',
    title: 'SWER354 - ADVANCED WEB TECHNOLOGIES content change',
    message: 'The Midterm Exam Cheat Sheet has been changed in SWER354 - ADVANCED WEB TECHNOLOGIES. Please review the updates before your exam.',
    time: '5 hours ago',
    read: false,
    course: 'SWER354 - ADVANCED WEB TECHNOLOGIES',
    links: [
      { title: 'View Cheat Sheet', url: '/courses/swer354/resources/cheat-sheet' }
    ],
    actionButtons: [
      { label: 'Go to Content', primary: true, action: () => window.location.href = '/courses/swer354/resources/cheat-sheet' }
    ]
  },
  {
    id: 4,
    type: 'academic',
    title: 'Assignment Feedback',
    message: 'Dr. Johnson has provided feedback on your Ethics Case Study. Your response demonstrated a strong understanding of the ethical principles discussed in class.',
    time: '1 day ago',
    read: true,
    course: 'Medical Ethics',
    links: [
      { title: 'View Feedback', url: '/assignments/ethics-case-study' }
    ],
    actionButtons: [
      { label: 'Go to Assignment', primary: true, action: () => window.location.href = '/assignments/ethics-case-study' }
    ]
  },
  {
    id: 5,
    type: 'reminder',
    title: 'Overdue: Docker Project Report',
    message: 'Your Docker Project Report for SWER354 is overdue. Please submit as soon as possible to minimize late penalties.',
    time: '4 days ago',
    read: true,
    course: 'SWER354 - ADVANCED WEB TECHNOLOGIES',
    links: [
      { title: 'Submit Report', url: '/courses/swer354/assignments/docker-project' }
    ],
    actionButtons: [
      { label: 'Go to Project', primary: true, action: () => window.location.href = '/courses/swer354/assignments/docker-project' }
    ]
  },
  {
    id: 6,
    type: 'announcement',
    title: 'SWER354 - ADVANCED WEB TECHNOLOGIES new content',
    message: 'New content has been added to SWER354 - ADVANCED WEB TECHNOLOGIES. Please review the new materials that will be covered in upcoming lectures.',
    time: '2 days ago',
    read: true,
    course: 'SWER354 - ADVANCED WEB TECHNOLOGIES',
    links: [
      { title: 'View New Content', url: '/courses/swer354/content' }
    ],
    actionButtons: [
      { label: 'Go to Course Content', primary: true, action: () => window.location.href = '/courses/swer354/content' }
    ]
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

// Export the context itself
export { NotificationContext };