import apiClient from './api';

class AdminCourseService {
  // Core CRUD operations
  getCourses = async (page = 0, size = 10, filters = {}) => {
    // Extract specific filters for better readability
    const { 
      search, 
      departmentId, 
      instructorEmail, 
      isPublished,
      semester, // Add semester filter
      ...otherFilters 
    } = filters;
    
    // Prepare query parameters
    const params = { 
      page, 
      size, 
      ...otherFilters
    };
    
    // Add specific filters if provided
    if (search) params.search = search;
    if (departmentId) params.departmentId = departmentId;
    if (instructorEmail) params.instructorEmail = instructorEmail;
    
    // Handle published status with proper conversion
    if (isPublished !== undefined) {
      // Convert to boolean string for backend compatibility
      params.published = String(isPublished);
    }
    
    if (semester) params.semester = semester; // Include semester in API request
    
    console.log("Fetching courses with params:", params);
    return apiClient.get('/api/courses', { params });
  };
  
  // Get courses by semester
  getCoursesBySemester = async (semester) => {
    return apiClient.get('/api/courses', { params: { semester } });
  };
  
  getCourse = async (courseId) => {
    return apiClient.get(`/api/courses/${courseId}`);
  };
  
  // Create course method for admins
// In AdminCourseService.js - Update createCourse method

createCourse = async (courseData) => {
  try {
    // Create a clean data object with only the required fields in the correct format
    const cleanData = {
      title: courseData.title,
      description: courseData.description,
      instructorEmail: courseData.instructorEmail,
      
      // Convert numeric fields to numbers
      departmentId: courseData.departmentId ? parseInt(courseData.departmentId, 10) : null,
      maxCapacity: courseData.maxCapacity ? parseInt(courseData.maxCapacity, 10) : 30,
      credits: courseData.credits ? parseInt(courseData.credits, 10) : 3,
      
      // Handle status flags - set both fields for compatibility
      isPublished: Boolean(courseData.isPublished),
      published: Boolean(courseData.isPublished),
      
      // Handle semester fields - set both fields for compatibility
      semester: courseData.semester || courseData.semesterName || "Spring 2025",
      semesterName: courseData.semester || courseData.semesterName || "Spring 2025",
      
      // Include code if present
      ...(courseData.code && { code: courseData.code })
    };
    
    console.log("Creating course with clean data:", cleanData);
    return apiClient.post('/api/courses', cleanData);
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};
  
  // Update course method for admins
  updateCourse = async (courseId, courseData) => {
    try {
      // Create a deep copy to avoid modifying the original
      const formattedData = {
        ...JSON.parse(JSON.stringify(courseData))
      };
      
      // Ensure numeric values are properly parsed
      if (formattedData.credits !== undefined) {
        formattedData.credits = parseInt(formattedData.credits || 0, 10);
      }
      
      if (formattedData.maxCapacity !== undefined) {
        formattedData.maxCapacity = parseInt(formattedData.maxCapacity || 0, 10);
      }
      
      if (formattedData.departmentId !== undefined) {
        formattedData.departmentId = parseInt(formattedData.departmentId || 0, 10);
      }
      
      // Handle the isPublished/published mismatch - keep both for compatibility
      if (formattedData.isPublished !== undefined) {
        formattedData.published = Boolean(formattedData.isPublished);
      } else if (formattedData.published !== undefined) {
        formattedData.isPublished = Boolean(formattedData.published);
      }
      
      // Ensure consistent semester handling
      if (formattedData.semester) {
        formattedData.semesterName = formattedData.semester;
      } else if (formattedData.semesterName) {
        formattedData.semester = formattedData.semesterName;
      }
      
      console.log("Updating course with data:", formattedData);
      
      // Use the correct API endpoint - this might need to be adjusted
      const response = await apiClient.put(`/api/courses/${courseId}`, formattedData);
      
      console.log("Update response:", response);
      return response;
    } catch (error) {
      console.error(`Error updating course ${courseId}:`, error);
      throw error;
    }
  };
  
  // Helper to normalize course data consistently
  normalizeCourseData(courseData) {
    // Create a deep copy to avoid side effects
    const normalized = JSON.parse(JSON.stringify(courseData));
    
    // Handle published/isPublished properly in both directions
    if (normalized.published !== undefined && normalized.isPublished === undefined) {
      normalized.isPublished = normalized.published;
    } else if (normalized.isPublished !== undefined && normalized.published === undefined) {
      normalized.published = normalized.isPublished;
    }
    
    // Ensure numeric values are proper numbers, not strings
    if (normalized.credits !== undefined) {
      normalized.credits = parseInt(normalized.credits, 10) || 3;
    }
    
    if (normalized.departmentId !== undefined && normalized.departmentId !== null) {
      normalized.departmentId = parseInt(normalized.departmentId, 10);
    } else {
      // Backend might reject null departmentId, so remove it
      delete normalized.departmentId;
    }
    
    if (normalized.maxCapacity !== undefined) {
      normalized.maxCapacity = parseInt(normalized.maxCapacity, 10) || 30;
    }
    
    // Handle semester consistently
    if (normalized.semester && !normalized.semesterName) {
      normalized.semesterName = normalized.semester;
    } else if (normalized.semesterName && !normalized.semester) {
      normalized.semester = normalized.semesterName;
    }
    
    // Ensure required fields have values
    if (!normalized.title || normalized.title.trim() === '') {
      throw new Error('Course title is required');
    }
    
    if (!normalized.description || normalized.description.trim() === '') {
      throw new Error('Course description is required');
    }
    
    if (!normalized.instructorEmail) {
      throw new Error('Instructor email is required');
    }
    
    // Trim string values
    if (normalized.title) normalized.title = normalized.title.trim();
    if (normalized.description) normalized.description = normalized.description.trim();
    if (normalized.code) normalized.code = normalized.code.trim();
    
    console.log("Normalized course data:", normalized);
    
    return normalized;
  }
  
  deleteCourse = async (courseId) => {
    return apiClient.delete(`/api/courses/${courseId}`);
  };
  
  // Filtering operations
  getCoursesByDepartment = async (departmentId) => {
    return apiClient.get(`/api/courses/department/${departmentId}`);
  };
  
  getCoursesByInstructor = async (instructorId) => {
    return apiClient.get(`/api/courses/instructor/${instructorId}`);
  };
  
  // Enrollment operations
  enrollStudent = async (courseId, studentId) => {
    return apiClient.post(`/api/courses/${courseId}/students/${studentId}`);
  };
  
  unenrollStudent = async (courseId, studentId) => {
    return apiClient.delete(`/api/courses/${courseId}/students/${studentId}`);
  };
  
  // Analytics
  getCourseStatistics = async (courseId) => {
    return apiClient.get(`/api/courses/${courseId}/statistics`);
  };
  
  // Status management (using update instead of specific endpoints)
  publishCourse = async (courseId) => {
    try {
      // First, get the current course data
      const currentCourse = await this.getCourse(courseId);
      if (!currentCourse?.data) {
        throw new Error(`Course with id ${courseId} not found`);
      }
      
      // Update only the published status while keeping other fields intact
      const courseData = {
        ...currentCourse.data,
        isPublished: true,
        published: true // Make sure both fields are set for compatibility
      };
      
      // Send complete course data
      return this.updateCourse(courseId, courseData);
    } catch (error) {
      console.error(`Error publishing course ${courseId}:`, error);
      throw error;
    }
  };
  
  unpublishCourse = async (courseId) => {
    try {
      // First, get the current course data
      const currentCourse = await this.getCourse(courseId);
      if (!currentCourse?.data) {
        throw new Error(`Course with id ${courseId} not found`);
      }
      
      // Update only the published status while keeping other fields intact
      const courseData = {
        ...currentCourse.data,
        isPublished: false,
        published: false // Make sure both fields are set for compatibility
      };
      
      // Send complete course data
      return this.updateCourse(courseId, courseData);
    } catch (error) {
      console.error(`Error unpublishing course ${courseId}:`, error);
      throw error;
    }
  };
  
  archiveCourse = async (courseId) => {
    return apiClient.put(`/api/courses/${courseId}`, { archived: true, isArchived: true });
  };
  
  unarchiveCourse = async (courseId) => {
    return apiClient.put(`/api/courses/${courseId}`, { archived: false, isArchived: false });
  };
  
  // Get all departments
  getDepartments() {
    return apiClient.get('/api/departments');
  }
  
  // Get users with instructor role for course assignment
  getInstructors = async () => {
    try {
      console.log("Fetching instructors from API...");
      const response = await apiClient.get('/api/admin/users', { params: { role: 'INSTRUCTOR' } });
      
      // Debug response
      console.log("Raw instructor API response:", response);
      
      // Handle different possible response structures
      let instructorData;
      if (response.data?.content) {
        // Paginated response
        instructorData = response.data.content;
      } else if (Array.isArray(response.data)) {
        // Array response
        instructorData = response.data;
      } else {
        // Unknown format, create empty array
        instructorData = [];
      }
      
      console.log(`Found ${instructorData.length} instructors:`, instructorData);
      
      // If no instructors found, add a fallback for testing
      if (instructorData.length === 0) {
        console.warn("No instructors found in the system. Consider adding test data.");
      }
      
      return { data: instructorData };
    } catch (error) {
      console.error("Error fetching instructors:", error);
      // Return empty array to prevent UI errors
      return { data: [] };
    }
  };
  
  // Get all students enrolled in a course
  getCourseStudents = async (courseId) => {
    try {
      return await apiClient.get(`/api/courses/${courseId}/students`);
    } catch (error) {
      console.error(`Error fetching students for course ${courseId}:`, error);
      // Return empty array when API fails to prevent UI errors
      return { data: [] };
    }
  };
  
  // Get available semesters
  getSemesters = async () => {
    try {
      const response = await apiClient.get('/api/courses/semesters');
      return response.data;
    } catch (error) {
      // If the endpoint doesn't exist, return default semesters
      console.warn('Failed to fetch semesters from API, using defaults');
      return [
        "Fall 2024",
        "Spring 2025",
        "Summer 2025",
        "Fall 2025",
        "Spring 2026"
      ];
    }
  };
  
  // Get the current enrollment count for a course
  getEnrollmentCount = async (courseId, activeOnly = true) => {
    return apiClient.get(`/api/enrollments/courses/${courseId}/count`, {
      params: { activeOnly }
    });
  };

  // Refresh course data with current enrollment count
  refreshCourseWithEnrollment = async (courseId) => {
    try {
      // Get the course data
      const courseResponse = await this.getCourse(courseId);
      
      // Get the enrollment count
      const enrollmentResponse = await this.getEnrollmentCount(courseId);
      
      // Combine the data
      const courseData = courseResponse.data;
      courseData.enrolledStudents = enrollmentResponse.data.enrollmentCount;
      
      return { data: courseData };
    } catch (error) {
      console.error("Error refreshing course with enrollment:", error);
      throw error;
    }
  };
}

export default new AdminCourseService();