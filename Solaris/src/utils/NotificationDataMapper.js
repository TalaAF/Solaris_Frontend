/**
 * Utility functions for mapping between backend and frontend notification formats
 */

// Map backend notification types to frontend types
export const mapNotificationType = (backendType) => {
    const typeMap = {
      COURSE_CONTENT_UPLOAD: "announcement",
      ASSIGNMENT_DEADLINE_24H: "reminder",
      ASSIGNMENT_DEADLINE_12H: "reminder",
      ASSIGNMENT_DEADLINE_1H: "reminder",
      QUIZ_AVAILABLE: "academic",
      GRADE_POSTED: "academic",
      COURSE_ANNOUNCEMENT: "announcement",
      FORUM_REPLY: "announcement",
      FORUM_MENTION: "announcement"
    };
    
    return typeMap[backendType] || "announcement";
  };
  
  // Format a date string to "X time ago" format
  export const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);
  
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    return date.toLocaleDateString();
  };
  
  // Transform a backend notification to frontend format
  export const transformNotification = (notification) => {
    // Extract data from JSON if present
    let additionalData = {};
    try {
      if (notification.additionalData) {
        additionalData = JSON.parse(notification.additionalData);
      }
    } catch (e) {
      console.error("Error parsing additional data:", e);
    }
  
    // Determine course name from related entity or data
    let courseName = "";
    if (notification.relatedEntityType === "course" && additionalData.courseName) {
      courseName = additionalData.courseName;
    }
  
    // Create links based on the notification type and related entity
    const links = [];
    if (notification.relatedEntityId && notification.relatedEntityType) {
      if (notification.relatedEntityType === "course") {
        links.push({
          title: "Go to Course",
          url: `/courses/${notification.relatedEntityId}`
        });
      } else if (notification.relatedEntityType === "assignment") {
        links.push({
          title: "View Assignment",
          url: `/assignments/${notification.relatedEntityId}`
        });
      } else if (notification.relatedEntityType === "quiz") {
        links.push({
          title: "Take Quiz",
          url: `/quizzes/${notification.relatedEntityId}`
        });
      } else if (notification.relatedEntityType === "forumPost") {
        links.push({
          title: "View Discussion",
          url: `/forums/posts/${notification.relatedEntityId}`
        });
      }
    }
  
    // Create primary action button
    const actionButtons = [];
    if (links.length > 0) {
      actionButtons.push({
        label: links[0].title,
        primary: true,
        action: () => window.location.href = links[0].url
      });
    }
  
    return {
      id: notification.id,
      type: mapNotificationType(notification.type),
      title: notification.title,
      message: notification.content,
      time: formatTimeAgo(notification.createdAt),
      read: notification.read,
      course: courseName || additionalData.courseName,
      links: links,
      actionButtons: actionButtons,
      relatedEntityId: notification.relatedEntityId,
      relatedEntityType: notification.relatedEntityType
    };
  };
  
  // Map frontend category to backend category
  export const mapFrontendCategoryToBackend = (frontendType) => {
    const categoryMap = {
      "academic": "Academic",
      "reminder": "Reminders",
      "announcement": "Announcements",
      "all": "All"
    };
    
    return categoryMap[frontendType] || "All";
  };
  
  // Parse notification data from API
  export const parseNotificationData = (data) => {
    try {
      if (data.additionalData) {
        return JSON.parse(data.additionalData);
      }
    } catch (e) {
      console.error("Error parsing notification data:", e);
    }
    return {};
  };