import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
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
  if (!name) return "??";
  
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
    case 'USER_REGISTERED':
      return 'activity-user-created';
    case 'COURSE_PUBLISHED':
    case 'COURSE_CREATED':
      return 'activity-course-published';
    case 'USER_ENROLLED':
    case 'ENROLLMENT_CREATED':
      return 'activity-user-enrolled';
    case 'CERTIFICATE_ISSUED':
      return 'activity-certificate-issued';
    case 'CONTENT_UPLOADED':
    case 'MATERIAL_UPLOADED':
      return 'activity-content-uploaded';
    default:
      return 'activity-default';
  }
};

const ActivityFeed = ({ activities = [], fetchActivities = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activityData, setActivityData] = useState(activities);
  
  useEffect(() => {
    const loadActivities = async () => {
      // If activities are provided as prop or no fetch function, use those
      if (activities.length > 0 || !fetchActivities) {
        setActivityData(activities);
        return;
      }
      
      // Otherwise fetch from backend
      try {
        setLoading(true);
        setError(null);
        const data = await fetchActivities();
        setActivityData(data);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Could not load recent activities");
      } finally {
        setLoading(false);
      }
    };
    
    loadActivities();
  }, [activities, fetchActivities]);

  if (loading) {
    return (
      <div className="activity-feed">
        <div className="activity-feed-header">
          <h2>Recent Activity</h2>
        </div>
        <div className="activity-list loading">
          <div className="spinner"></div>
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-feed">
        <div className="activity-feed-header">
          <h2>Recent Activity</h2>
        </div>
        <div className="activity-list error">
          <AlertTriangle size={24} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!activityData || activityData.length === 0) {
    return (
      <div className="activity-feed">
        <div className="activity-feed-header">
          <h2>Recent Activity</h2>
        </div>
        <div className="activity-list empty">
          <p>No recent activity to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="activity-feed-header">
        <h2>Recent Activity</h2>
      </div>
      <div className="activity-list">
        {activityData.map((activity) => (
          <div key={activity.id} className={`activity-item ${getActivityTypeClass(activity.activityType)}`}>
            <div className="activity-avatar">
              <div className="avatar-image">
                {getInitials(activity.user || activity.userName)}
              </div>
            </div>
            <div className="activity-content">
              <p className="activity-user">{activity.user || activity.userName || "Unknown User"}</p>
              <p className="activity-description">{activity.description}</p>
              <p className="activity-time">
                {formatTimeAgo(activity.timestamp || activity.createdAt || activity.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;