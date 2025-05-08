import React from "react";
import "./ActivityFeed.css";

// Helper function to format dates
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} days ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} months ago`;
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

// Map activity types to icons or colors
const getActivityTypeClass = (type) => {
  switch (type) {
    case 'USER_CREATED':
      return 'activity-user-created';
    case 'COURSE_PUBLISHED':
      return 'activity-course-published';
    case 'USER_ENROLLED':
      return 'activity-user-enrolled';
    case 'CERTIFICATE_ISSUED':
      return 'activity-certificate-issued';
    case 'CONTENT_UPLOADED':
      return 'activity-content-uploaded';
    default:
      return 'activity-default';
  }
};

const ActivityFeed = ({ activities }) => {
  return (
    <div className="activity-feed">
      <div className="activity-feed-header">
        <h2>Recent Activity</h2>
      </div>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className={`activity-item ${getActivityTypeClass(activity.activityType)}`}>
            <div className="activity-avatar">
              <div className="avatar-image">
                {getInitials(activity.user)}
              </div>
            </div>
            <div className="activity-content">
              <p className="activity-user">{activity.user}</p>
              <p className="activity-description">{activity.description}</p>
              <p className="activity-time">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;