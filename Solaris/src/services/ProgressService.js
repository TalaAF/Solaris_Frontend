import api from "./api";

class ProgressService {
  // Get overall progress for a student
  async getOverallProgress(studentId) {
    try {
      console.log(`Requesting overall progress for student ${studentId}`);
      const response = await api.get(`/progress-visualization/overall/${studentId}`);
      console.log("Overall progress response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching overall progress:", error);
      throw error;
    }
  }

  // Get course progress visualization data for a student
  async getCourseProgressVisualization(studentId) {
    try {
      console.log(`Requesting course visualization for student ${studentId}`);
      const response = await api.get(`/progress-visualization/courses/${studentId}`);
      console.log("Course progress visualization response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching course progress visualization:", error);
      throw error;
    }
  }

  // Get progress for a specific course
  async getCourseProgress(studentId, courseId) {
    try {
      const response = await api.get(`/progress/${studentId}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for course ${courseId}:`, error);
      throw error;
    }
  }

  // Get all content progress for a student
  async getContentProgress(studentId) {
    try {
      const response = await api.get(`/content-progress/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching content progress:", error);
      throw error;
    }
  }
  
  // Update progress for a student on specific content
  async updateContentProgress(studentId, contentId, progress) {
    try {
      const response = await api.put(`/content-progress/update/${studentId}/${contentId}?progress=${progress}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating content progress for student ${studentId}:`, error);
      throw error;
    }
  }
  
  // Update progress for a student in a course
  async updateCourseProgress(studentId, courseId, progress) {
    try {
      const response = await api.put(`/progress/update/${studentId}/${courseId}?progress=${progress}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating course progress for student ${studentId}:`, error);
      throw error;
    }
  }
  
  // Get progress by category for a student
  async getProgressByCategory(studentId) {
    try {
      const response = await api.get(`/progress-visualization/by-category/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching progress by category:", error);
      throw error;
    }
  }
  
  // Get progress trend for a student
  async getProgressTrend(studentId, days = 30) {
    try {
      const response = await api.get(`/progress-visualization/trend/${studentId}?days=${days}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching progress trend:", error);
      throw error;
    }
  }
}

export default new ProgressService();