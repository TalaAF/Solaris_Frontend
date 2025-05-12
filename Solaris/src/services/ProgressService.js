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

// Group all functions into a service object and export as default
const ProgressService = {
  markContentAsViewed,
  getProgressDashboard,
  getCourseProgress,
  getDetailedCourseProgress
};

// Add default export
export default ProgressService;