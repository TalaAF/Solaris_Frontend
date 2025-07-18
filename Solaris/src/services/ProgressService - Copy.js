// src/services/ProgressService.js
import api from './api';

// Mark content as viewed
export const markContentAsViewed = async (contentId) => {
  try {
    const response = await api.post(`/api/progress/content/${contentId}/viewed`);
    return response.data;
  } catch (error) {
    console.error(`Error marking content ${contentId} as viewed:`, error);
    // Return error object instead of throwing
    return { success: false, error: error.message };
  }
};

// Get student progress dashboard
export const getProgressDashboard = async () => {
  try {
    const response = await api.get('/api/progress/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching progress dashboard:', error);
    // Return null instead of throwing
    return null;
  }
};

// Get course progress
export const getCourseProgress = async (courseId) => {
  try {
    const response = await api.get(`/api/progress/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching progress for course ${courseId}:`, error);
    // Return fallback data instead of throwing
    return {
      courseId: courseId,
      progress: 0,
      lastUpdated: new Date().toISOString(),
      completedItems: []
    };
  }
};

// Get detailed course progress
export const getDetailedCourseProgress = async (courseId) => {
  try {
    const response = await api.get(`/api/progress/course/${courseId}/detailed`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detailed progress for course ${courseId}:`, error);
    // Return fallback to simple course progress
    return getCourseProgress(courseId);
  }
};

/**
 * Track progress locally when server APIs fail
 * This is a fallback mechanism using localStorage
 */
export const trackProgressLocally = (contentId) => {
  try {
    // Get currently viewed content IDs
    const viewedStr = localStorage.getItem('viewed_content') || '[]';
    const viewed = JSON.parse(viewedStr);
    
    // Add this content if not already there
    if (!viewed.includes(contentId)) {
      viewed.push(contentId);
      localStorage.setItem('viewed_content', JSON.stringify(viewed));
      console.log(`Locally tracked content ${contentId} as viewed`);
    }
    
    return {
      success: true,
      local: true,
      contentId: contentId
    };
  } catch (e) {
    console.error('Error storing local progress:', e);
    return { success: false, local: true, error: e.message };
  }
};

/**
 * Get locally tracked content progress
 * @returns {array} Array of content IDs that have been viewed locally
 */
export const getLocalProgress = () => {
  try {
    const viewedStr = localStorage.getItem('viewed_content') || '[]';
    return JSON.parse(viewedStr);
  } catch (e) {
    console.error('Error getting local progress:', e);
    return [];
  }
};

// Group all functions into a service object and export as default
const ProgressService = {
  markContentAsViewed,
  getProgressDashboard,
  getCourseProgress,
  getDetailedCourseProgress,
  trackProgressLocally,
  getLocalProgress
};

// Add default export
export default ProgressService;