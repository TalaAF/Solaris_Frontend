// CourseService.js
// Service to handle API calls to the course backend

import api from "./api";
import ContentService from "./ContentService"; // Import ContentService

class CourseService {
  // Get all courses (paginated with filters)
  async getCourses(page = 0, size = 10, sortBy = "id", sortDirection = "asc", filters = {}) {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("size", size);
      params.append("sortBy", sortBy);
      params.append("sortDirection", sortDirection);
      
      // Add any filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });
      
      return await api.get(`/api/courses?${params.toString()}`);
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  }

  // Get all courses (without pagination)
  async getAllCourses() {
    try {
      return await api.get('/api/courses/all');
    } catch (error) {
      console.error("Error fetching all courses:", error);
      throw error;
    }
  }

  // Get course by ID
  async getCourseById(id) {
    try {
      if (!id) {
        throw new Error("Course ID is required");
      }
      
      // Ensure ID is a number if needed by your API
      const numericId = isNaN(parseInt(id, 10)) ? id : parseInt(id, 10);
      
      const response = await api.get(`/api/courses/${numericId}`);
      
      // Check if the response actually has data
      if (!response.data) {
        throw new Error("Course not found");
      }
      
      return response;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      
      if (error.response?.status === 404) {
        throw new Error("Course not found");
      }
      
      throw error.message || "Failed to load course details";
    }
  }

  // Get courses by department
  async getCoursesByDepartment(departmentId) {
    try {
      return await api.get(`/api/courses/department/${departmentId}`);
    } catch (error) {
      console.error(`Error fetching courses for department ${departmentId}:`, error);
      throw error;
    }
  }

  // Get courses by instructor
  async getCoursesByInstructor(instructorId) {
    try {
      return await api.get(`/api/courses/instructor/${instructorId}`);
    } catch (error) {
      console.error(`Error fetching courses for instructor ${instructorId}:`, error);
      throw error;
    }
  }

  // Get courses with user progress
  async getCoursesWithProgress(userId) {
    try {
      return await api.get(`/api/courses/user/${userId}`);
    } catch (error) {
      console.error(`Error fetching courses with progress for user ${userId}:`, error);
      throw error;
    }
  }

  // Get course with user progress
  async getCourseWithProgress(courseId, userId) {
    try {
      return await api.get(`/api/courses/${courseId}/user/${userId}`);
    } catch (error) {
      console.error(`Error fetching course with progress for user ${userId}:`, error);
      throw error;
    }
  }

  // Create a new course
  async createCourse(courseData) {
    try {
      return await api.post('/api/courses', courseData);
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  }

  // Update a course
  async updateCourse(id, courseData) {
    try {
      return await api.put(`/api/courses/${id}`, courseData);
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw error;
    }
  }

  // Delete a course
  async deleteCourse(id) {
    try {
      return await api.delete(`/api/courses/${id}`);
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw error;
    }
  }

  // Enroll student in a course
  async enrollStudent(courseId, studentId) {
    try {
      return await api.post(`/api/courses/${courseId}/students/${studentId}`);
    } catch (error) {
      console.error(`Error enrolling student ${studentId} in course ${courseId}:`, error);
      throw error;
    }
  }

  // Unenroll student from a course
  async unenrollStudent(courseId, studentId) {
    try {
      return await api.delete(`/api/courses/${courseId}/students/${studentId}`);
    } catch (error) {
      console.error(`Error unenrolling student ${studentId} from course ${courseId}:`, error);
      throw error;
    }
  }

  // Get course statistics
  async getCourseStatistics(courseId) {
    try {
      return await api.get(`/api/courses/${courseId}/statistics`);
    } catch (error) {
      console.error(`Error fetching statistics for course ${courseId}:`, error);
      throw error;
    }
  }
  
  // Get course modules
   async enrollStudent(courseId, studentId) {
    try {
      return await api.post(`/api/courses/${courseId}/students/${studentId}`);
    } catch (error) {
      console.error(`Error enrolling student ${studentId} in course ${courseId}:`, error);
      throw error;
    }
  }

  // Unenroll student from a course
  async unenrollStudent(courseId, studentId) {
    try {
      return await api.delete(`/api/courses/${courseId}/students/${studentId}`);
    } catch (error) {
      console.error(`Error unenrolling student ${studentId} from course ${courseId}:`, error);
      throw error;
    }
  }

  // Get course statistics
  async getCourseStatistics(courseId) {
    try {
      return await api.get(`/api/courses/${courseId}/statistics`);
    } catch (error) {
      console.error(`Error fetching statistics for course ${courseId}:`, error);
      throw error;
    }
  }
  
  // ===== MODULE RELATED FUNCTIONS =====
  
  // Get course modules - UPDATED to match backend endpoint
  async getCourseModules(courseId) {
    try {
      // Get basic modules using the correct endpoint
      const response = await api.get(`/api/modules/course/${courseId}`);
      
      if (!response || !response.data) {
        return { data: [] };
      }
      
      const modules = response.data;
      
      // Use ContentService to get content for each module
      const modulesWithContent = await Promise.all(modules.map(async module => {
        try {
          // Use the ContentService method that matches your backend
          const contentsResponse = await ContentService.getContentsByModule(module.id);
          return {
            ...module,
            items: contentsResponse.data || []
          };
        } catch (contentErr) {
          console.error(`Error fetching content for module ${module.id}:`, contentErr);
          return {
            ...module,
            items: []
          };
        }
      }));
      
      return { data: modulesWithContent };
    } catch (error) {
      console.error(`Error in getCourseModules for course ${courseId}:`, error);
      return { data: [] };
    }
  }
  
  // Create module
  async createModule(moduleData) {
    try {
      return await api.post('/api/modules', moduleData);
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  }
  
  // Update module
  async updateModule(moduleId, moduleData) {
    try {
      return await api.put(`/api/modules/${moduleId}`, moduleData);
    } catch (error) {
      console.error(`Error updating module ${moduleId}:`, error);
      throw error;
    }
  }
  
  // Get module by ID
  async getModuleById(moduleId) {
    try {
      return await api.get(`/api/modules/${moduleId}`);
    } catch (error) {
      console.error(`Error fetching module ${moduleId}:`, error);
      throw error;
    }
  }

  // Reorder modules
  async reorderModules(moduleOrderRequests) {
    try {
      return await api.post('/api/modules/reorder', moduleOrderRequests);
    } catch (error) {
      console.error('Error reordering modules:', error);
      throw error;
    }
  }
  
  // Get module contents order - NEW to match backend endpoint
  async getModuleContentsOrder(moduleId) {
    try {
      return await api.get(`/api/modules/${moduleId}/contents-order`);
    } catch (error) {
      console.error(`Error fetching contents order for module ${moduleId}:`, error);
      throw error;
    }
  }
  
  // Note: Delete module is not present in the backend controller
  // If you need this functionality, backend changes would be required
}

export default new CourseService();