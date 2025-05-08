// src/services/EnrollmentService.js
import api from './api';

const EnrollmentService = {
  /**
   * Get all enrollments for a student
   * @param {number} studentId - Student ID
   * @returns {Promise} Promise with student enrollment data
   */
  getEnrollmentsForStudent: async (studentId) => {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const response = await api.get(`/enrollments/student/${studentId}`);
      
      if (!response || !response.data) {
        throw new Error('No data received from server');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollments for student ${studentId}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch enrollments');
    }
  },

  /**
   * Get all enrollments for a course
   * @param {number} courseId - Course ID
   * @returns {Promise} Promise with course enrollment data
   */
  getEnrollmentsForCourse: async (courseId) => {
    try {
      const response = await api.get(`/enrollments/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollments for course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Get a specific enrollment by student and course
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @returns {Promise} Promise with enrollment data
   */
  getEnrollment: async (studentId, courseId) => {
    try {
      const response = await api.get(`/enrollments/${studentId}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollment for student ${studentId} in course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Enroll a student in a course
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @returns {Promise} Promise with enrollment data
   */
  enrollStudent: async (studentId, courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error enrolling student ${studentId} in course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Unenroll a student from a course
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @returns {Promise} Promise with response
   */
  unenrollStudent: async (studentId, courseId) => {
    try {
      const response = await api.delete(`/courses/${courseId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error unenrolling student ${studentId} from course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Update enrollment progress
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @param {number} progress - Progress percentage (0-100)
   * @returns {Promise} Promise with updated enrollment data
   */
  updateProgress: async (studentId, courseId, progress) => {
    try {
      const response = await api.patch(`/enrollments/${studentId}/${courseId}/progress?progress=${progress}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating progress for student ${studentId} in course ${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Complete a course enrollment
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @returns {Promise} Promise with completed enrollment data
   */
  completeCourse: async (studentId, courseId) => {
    try {
      const response = await api.post(`/enrollments/${studentId}/${courseId}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error completing course ${courseId} for student ${studentId}:`, error);
      throw error;
    }
  },

  /**
   * Get student enrollment data including registered, completed and available courses
   * @returns {Promise} Promise with all enrollment data
   */
  getStudentEnrollment: async () => {
    try {
      const [enrollmentsResponse] = await Promise.all([
        api.get('/enrollments/student/7')
      ]);

      // Return the raw enrollments array
      return enrollmentsResponse.data;
      
    } catch (error) {
      console.error('Error fetching enrollment data:', error);
      throw new Error('Failed to fetch enrollment data');
    }
  },

  /**
   * Get available courses for registration (not currently enrolled)
   * @returns {Promise} Promise with available courses data
   */
  getAvailableCourses: async () => {
    try {
      const response = await api.get('/courses');
      if (!response || !response.data) {
        throw new Error('No courses data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching available courses:', error);
      throw error;
    }
  },

  /**
   * Register for multiple courses
   * @param {number} studentId - Student ID
   * @param {Array} courseIds - Array of course IDs
   * @returns {Promise} Promise with responses
   */
  registerCourses: async (studentId, courseIds) => {
    try {
      // Register for each course one by one
      const registrationPromises = courseIds.map(courseId => 
        api.post(`/courses/${courseId}/students/${studentId}`)
      );
      
      const responses = await Promise.all(registrationPromises);
      return responses;
    } catch (error) {
      console.error(`Error registering courses for student ${studentId}:`, error);
      throw error;
    }
  },

  /**
   * Get student progress across all courses
   * @param {number} studentId - Student ID
   * @returns {Promise} Promise with progress data
   */
  getStudentProgress: async (studentId) => {
    try {
      // Get all enrolled courses with progress
      const response = await api.get(`/courses/user/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for student ${studentId}:`, error);
      throw error;
    }
  },

  /**
   * Check API connectivity
   * @returns {Promise} Promise with connectivity status
   */
  checkConnection: async () => {
    try {
      const response = await api.get('/student-dashboard/current-term/1');
      return !!response.data;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  },

  /**
   * Get current term student dashboard data
   * @param {number} studentId - Student ID
   * @returns {Promise} Promise with student dashboard data
   */
  getStudentDashboard: async (studentId) => {
    try {
      const response = await api.get(`/student-dashboard/current-term/${studentId}`);
      if (!response || !response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching student dashboard:`, error);
      throw new Error('Failed to fetch dashboard data');
    }
  }
};

export default EnrollmentService;