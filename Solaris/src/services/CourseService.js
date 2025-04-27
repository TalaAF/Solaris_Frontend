// CourseService.js
// Service to handle API calls to the course backend

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class CourseService {
  // Get all courses
  getAllCourses() {
    return axios.get(`${API_URL}/courses`);
  }

  // Get course by ID
  getCourseById(id) {
    return axios.get(`${API_URL}/courses/${id}`);
  }

  // Get courses by department
  getCoursesByDepartment(departmentId) {
    return axios.get(`${API_URL}/courses/department/${departmentId}`);
  }

  // Get courses by instructor
  getCoursesByInstructor(instructorId) {
    return axios.get(`${API_URL}/courses/instructor/${instructorId}`);
  }

  // Create a new course
  createCourse(courseData) {
    return axios.post(`${API_URL}/courses`, courseData);
  }

  // Update a course
  updateCourse(id, courseData) {
    return axios.put(`${API_URL}/courses/${id}`, courseData);
  }

  // Delete a course
  deleteCourse(id) {
    return axios.delete(`${API_URL}/courses/${id}`);
  }

  // Enroll student in a course
  enrollStudent(courseId, studentId) {
    return axios.post(`${API_URL}/courses/${courseId}/students/${studentId}`);
  }

  // Unenroll student from a course
  unenrollStudent(courseId, studentId) {
    return axios.delete(`${API_URL}/courses/${courseId}/students/${studentId}`);
  }

  // Get course statistics
  getCourseStatistics(courseId) {
    return axios.get(`${API_URL}/courses/${courseId}/statistics`);
  }

  // Get completion requirements for a course
  getCompletionRequirements(courseId) {
    return axios.get(`${API_URL}/completion-requirements/course/${courseId}`);
  }

  // Create completion requirement
  createCompletionRequirement(courseId, requirementData) {
    return axios.post(`${API_URL}/completion-requirements/course/${courseId}`, requirementData);
  }

  // Verify course completion for a student
  verifyCompletion(studentId, courseId) {
    return axios.get(`${API_URL}/completion-requirements/verify/${studentId}/${courseId}`);
  }
}

export default new CourseService();