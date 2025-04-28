import React from 'react';
import './NotificationDetail.css';

const NotificationDetail = ({ notification, onClose }) => {
  if (!notification) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'academic':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        );
      case 'reminder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        );
      case 'announcement':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5h2m-1-4v4M3 8a9 9 0 1 1 18 0 9 9 0 1 1-18 0m9 4v6m0 3v.01"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'academic':
        return 'Academic Notification';
      case 'reminder':
        return 'Reminder';
      case 'announcement':
        return 'Announcement';
      default:
        return 'Notification';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'academic':
        return '#fdba74'; // Lighter orange
      case 'reminder':
        return '#fdba74'; // Lighter orange
      case 'announcement':
        return '#fdba74'; // Lighter orange
      default:
        return '#fdba74'; // Lighter orange
    }
  };

  // Generate context-appropriate action button text
  const getActionButtonText = (notification) => {
    if (notification.title.toLowerCase().includes('lab')) {
      return 'Go to Lab';
    } else if (notification.title.toLowerCase().includes('assignment') || 
               notification.message.toLowerCase().includes('assignment')) {
      return 'Go to Assignment';
    } else if (notification.title.toLowerCase().includes('quiz') || 
               notification.message.toLowerCase().includes('quiz')) {
      return 'Go to Quiz';
    } else if (notification.title.toLowerCase().includes('exam') || 
               notification.message.toLowerCase().includes('exam')) {
      return 'Go to Exam';
    } else if (notification.title.toLowerCase().includes('project') || 
               notification.message.toLowerCase().includes('project')) {
      return 'Go to Project';
    } else if (notification.course) {
      return 'Go to Course';
    } else {
      return 'View Details';
    }
  };

  return (
    <div className="notification-detail-container">
      <div className="notification-detail-header" style={{ backgroundColor: getTypeColor(notification.type) }}>
        <div className="notification-detail-title">
          <div className="notification-detail-icon">
            {getTypeIcon(notification.type)}
          </div>
          <div>
            <h2>{notification.title}</h2>
            <p className="notification-subtitle">{getTypeLabel(notification.type)}</p>
          </div>
        </div>
        <button className="close-detail-button" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="notification-detail-content">
        <div className="notification-detail-time">
          <span className="time-icon">⏱</span>
          <span>{notification.time}</span>
        </div>
        
        <div className="notification-detail-message">
          <p>{notification.message}</p>
          
          {notification.course && (
            <div className="notification-course">
              <strong>Course:</strong> {notification.course}
            </div>
          )}
          
          {notification.links && notification.links.length > 0 && (
            <div className="notification-links">
              <strong>Related Links:</strong>
              <ul>
                {notification.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.url}>{link.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="notification-actions">
            <button 
              className="action-button primary"
              onClick={() => {
                // If there's a specific action URL in notification, use it
                // Otherwise construct a reasonable path
                const url = (notification.links && notification.links[0]) 
                  ? notification.links[0].url 
                  : `/courses/${notification.course?.toLowerCase().replace(/\s+/g, '-')}`;
                window.location.href = url;
              }}
            >
              {getActionButtonText(notification)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;