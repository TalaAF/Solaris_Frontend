import apiClient from './api';

const AdminCourseService = {
  // Core CRUD operations
  getCourses: async (page = 0, size = 10, filters = {}) => {
    const params = { page, size, ...filters };
    return apiClient.get('/api/courses', { params });
  },
  
  getCourse: async (courseId) => {
    return apiClient.get(`/api/courses/${courseId}`);
  },
  
  createCourse: async (courseData) => {
    return apiClient.post('/api/courses', courseData);
  },
  
  updateCourse: async (courseId, courseData) => {
    return apiClient.put(`/api/courses/${courseId}`, courseData);
  },
  
  deleteCourse: async (courseId) => {
    return apiClient.delete(`/api/courses/${courseId}`);
  },
  
  // Filtering operations
  getCoursesByDepartment: async (departmentId) => {
    return apiClient.get(`/api/courses/department/${departmentId}`);
  },
  
  getCoursesByInstructor: async (instructorId) => {
    return apiClient.get(`/api/courses/instructor/${instructorId}`);
  },
  
  // Enrollment operations
  enrollStudent: async (courseId, studentId) => {
    return apiClient.post(`/api/courses/${courseId}/students/${studentId}`);
  },
  
  unenrollStudent: async (courseId, studentId) => {
    return apiClient.delete(`/api/courses/${courseId}/students/${studentId}`);
  },
  
  // Analytics
  getCourseStatistics: async (courseId) => {
    return apiClient.get(`/api/courses/${courseId}/statistics`);
  },
  
  // Status management (using update instead of specific endpoints)
  publishCourse: async (courseId) => {
    return apiClient.put(`/api/courses/${courseId}`, { published: true });
  },
  
  unpublishCourse: async (courseId) => {
    return apiClient.put(`/api/courses/${courseId}`, { published: false });
  },
  
  archiveCourse: async (courseId) => {
    return apiClient.put(`/api/courses/${courseId}`, { archived: true });
  },
  
  unarchiveCourse: async (courseId) => {
    return apiClient.put(`/api/courses/${courseId}`, { archived: false });
  }
};

export default AdminCourseService;