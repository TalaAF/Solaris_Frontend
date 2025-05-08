// src/services/CourseService.js
import api from './api';

const CourseService = {
  /**
   * Get all courses
   * @returns {Promise} Promise with courses data
   */
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },
  
  /**
   * Get course by ID
   * @param {number} id - Course ID
   * @returns {Promise} Promise with course data
   */
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get courses by department
   * @param {number} departmentId - Department ID
   * @returns {Promise} Promise with courses data
   */
  getCoursesByDepartment: async (departmentId) => {
    try {
      const response = await api.get(`/courses/department/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses for department ${departmentId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get courses by instructor
   * @param {number} instructorId - Instructor ID
   * @returns {Promise} Promise with courses data
   */
  getCoursesByInstructor: async (instructorId) => {
    try {
      const response = await api.get(`/courses/instructor/${instructorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses for instructor ${instructorId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get courses with user progress
   * @param {number} userId - User ID
   * @returns {Promise} Promise with courses data including progress
   */
  getCoursesWithProgress: async (userId) => {
    try {
      const response = await api.get(`/courses/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses with progress for user ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get course with user progress
   * @param {number} courseId - Course ID
   * @param {number} userId - User ID
   * @returns {Promise} Promise with course data including progress
   */
  getCourseWithProgress: async (courseId, userId) => {
    try {
      const response = await api.get(`/courses/${courseId}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${courseId} with progress for user ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new course
   * @param {Object} courseData - Course data
   * @returns {Promise} Promise with created course data
   */
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },
  
  /**
   * Update a course
   * @param {number} id - Course ID
   * @param {Object} courseData - Updated course data
   * @returns {Promise} Promise with updated course data
   */
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a course
   * @param {number} id - Course ID
   * @returns {Promise} Promise with response
   */
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Add a student to a course
   * @param {number} courseId - Course ID
   * @param {number} studentId - Student ID
   * @returns {Promise} Promise with updated course data
   */
  addStudentToCourse: async (courseId, studentId) => {
    try {
      const response = await api.post(`/courses/${courseId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error adding student ${studentId} to course ${courseId}:`, error);
      throw error;
    }
  },
  
  /**
   * Remove a student from a course
   * @param {number} courseId - Course ID
   * @param {number} studentId - Student ID
   * @returns {Promise} Promise with updated course data
   */
  removeStudentFromCourse: async (courseId, studentId) => {
    try {
      const response = await api.delete(`/courses/${courseId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing student ${studentId} from course ${courseId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get course statistics
   * @param {number} id - Course ID
   * @returns {Promise} Promise with course statistics
   */
  getCourseStatistics: async (id) => {
    try {
      const response = await api.get(`/courses/${id}/statistics`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching statistics for course ${id}:`, error);
      throw error;
    }
  }
};

export default CourseService;