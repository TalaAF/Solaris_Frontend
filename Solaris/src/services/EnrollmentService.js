// src/services/EnrollmentService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const EnrollmentService = {
  // Get student enrollment data
  getStudentEnrollment: async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/api/enrollment/student/${studentId}`);
      return response;
    } catch (error) {
      console.error('Error fetching enrollment data:', error);
      throw error;
    }
  },

  // Get available courses for registration
  getAvailableCourses: async (term) => {
    try {
      const response = await axios.get(`${API_URL}/api/courses/available?term=${term}`);
      return response;
    } catch (error) {
      console.error('Error fetching available courses:', error);
      throw error;
    }
  },

  // Get registration status (open/closed)
  getRegistrationStatus: async (term) => {
    try {
      const response = await axios.get(`${API_URL}/api/enrollment/registration-status?term=${term}`);
      return response;
    } catch (error) {
      console.error('Error fetching registration status:', error);
      throw error;
    }
  },

  // Register for courses
  registerCourses: async (studentId, courseIds, term) => {
    try {
      const response = await axios.post(`${API_URL}/api/enrollment/register`, {
        studentId,
        courseIds,
        term
      });
      return response;
    } catch (error) {
      console.error('Error registering for courses:', error);
      throw error;
    }
  },

  // Drop a course
  dropCourse: async (studentId, courseId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/enrollment/drop`, {
        data: {
          studentId,
          courseId
        }
      });
      return response;
    } catch (error) {
      console.error('Error dropping course:', error);
      throw error;
    }
  },

  // Get student progress (completed courses, GPA, etc.)
  getStudentProgress: async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/api/students/${studentId}/progress`);
      return response;
    } catch (error) {
      console.error('Error fetching student progress:', error);
      throw error;
    }
  }
};

export default EnrollmentService;