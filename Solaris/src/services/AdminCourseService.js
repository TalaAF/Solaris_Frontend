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
    if (isPublished !== undefined) params.isPublished = isPublished;
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
  createCourse = async (courseData) => {
    try {
      const formattedData = {
        ...courseData,
        credits: parseInt(courseData.credits || 0, 10),
        maxCapacity: parseInt(courseData.maxCapacity || 0, 10),
        
        // Use published instead of isPublished
        published: Boolean(courseData.isPublished),
        
        // Make sure semester is passed correctly
        semester: courseData.semester
      };
      
      // Remove isPublished to prevent sending both fields
      if (formattedData.hasOwnProperty('isPublished')) {
        delete formattedData.isPublished;
      }
      
      console.log("Creating course with data:", formattedData);
      const response = await apiClient.post('/api/admin/courses', formattedData);
      console.log("API response from create:", response);
      return response;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  };
  
  // Update course method for admins
  updateCourse = async (courseId, courseData) => {
    try {
      // Transform frontend model to match backend DTO expectations
      const formattedData = {
        ...courseData,
        credits: parseInt(courseData.credits || 0, 10),
        maxCapacity: parseInt(courseData.maxCapacity || 0, 10),
        
        // IMPORTANT: Use published instead of isPublished
        published: Boolean(courseData.isPublished || courseData.published),
        
        // Ensure semester is properly set
        semester: courseData.semester
      };
      
      // Remove isPublished to prevent sending both fields
      if (formattedData.hasOwnProperty('isPublished')) {
        delete formattedData.isPublished;
      }
      
      console.log("Updating course with data:", formattedData);
      const response = await apiClient.put(`/api/admin/courses/${courseId}`, formattedData);
      console.log("Update response:", response);
      return response;
    } catch (error) {
      console.error(`Error updating course ${courseId}:`, error);
      throw error;
    }
  };
  
  // Helper to normalize course data consistently
  normalizeCourseData(courseData) {
    const normalized = { ...courseData };
    
    // The backend expects isPublished, not published
    if (normalized.published !== undefined) {
      normalized.isPublished = normalized.published;
      delete normalized.published;
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
        isPublished: true // Use isPublished to match backend expectation
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
        isPublished: false // Use isPublished to match backend expectation
      };
      
      // Send complete course data
      return this.updateCourse(courseId, courseData);
    } catch (error) {
      console.error(`Error unpublishing course ${courseId}:`, error);
      throw error;
    }
  };
  
  archiveCourse = async (courseId) => {
    return apiClient.put(`/api/courses/${courseId}`, { archived: true });
  };
  
  unarchiveCourse = async (courseId) => {
    return apiClient.put(`/api/courses/${courseId}`, { archived: false });
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
}

export default new AdminCourseService();