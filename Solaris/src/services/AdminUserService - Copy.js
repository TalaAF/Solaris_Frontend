import api from "./api";

class AdminUserService {
  // Get users with optional filters (like role)
  getUsers = async (filters = {}) => {
    return api.get('/api/admin/users', { params: filters });
  };
  
  // Get a specific user by ID
  getUser = async (userId) => {
    return api.get(`/api/admin/users/${userId}`);
  };
  
  // Create new user
  createUser = async (userData) => {
    // Normalize data before sending to API
    const normalizedData = this.normalizeUserData(userData);
    console.log('Creating user with normalized data:', normalizedData);
    return api.post('/api/admin/users', normalizedData);
  };
  
  // Update existing user
  updateUser = async (userId, userData) => {
    // Normalize data before sending to API
    const normalizedData = this.normalizeUserData(userData);
    console.log('Updating user with normalized data:', normalizedData);
    return api.put(`/api/admin/users/${userId}`, normalizedData);
  };
  
  // Delete user
  deleteUser = async (userId) => {
    return api.delete(`/api/admin/users/${userId}`);
  };
  
  // Activate user
  activateUser = async (userId) => {
    return api.patch(`/api/admin/users/${userId}/activate`);
  };
  
  // Deactivate user
  deactivateUser = async (userId) => {
    return api.patch(`/api/admin/users/${userId}/deactivate`);
  };
  
  // Get all students not enrolled in a specific course using client-side filtering
  getAvailableStudentsForCourse = async (courseId) => {
    try {
      // Step 1: Get all students (users with STUDENT role)
      const studentsResponse = await this.getUsers({ role: "STUDENT" });
      const allStudents = studentsResponse.data.content || studentsResponse.data || [];
      
      // Step 2: Get current enrollments for the course
      const enrollmentsResponse = await api.get(`/api/enrollments/course/${courseId}`);
      const enrollments = enrollmentsResponse.data || [];
      
      // Step 3: Create a set of enrolled student IDs for quick lookups
      const enrolledStudentIds = new Set();
      
      // Handle different possible data structures for enrollments
      enrollments.forEach(enrollment => {
        // Try to extract the student ID from different possible properties
        const studentId = enrollment.studentId || 
                          (enrollment.user && enrollment.user.id) ||
                          (enrollment.student && enrollment.student.id);
        
        if (studentId) {
          enrolledStudentIds.add(studentId);
        }
      });
      
      console.log(`Found ${enrolledStudentIds.size} students already enrolled in course ${courseId}`);
      
      // Step 4: Filter out students who are already enrolled
      const availableStudents = allStudents.filter(student => !enrolledStudentIds.has(student.id));
      
      console.log(`Found ${availableStudents.length} available students for course ${courseId}`);
      
      // Step 5: Return in the same format as your API would
      return {
        data: {
          content: availableStudents,
          totalElements: availableStudents.length,
          totalPages: 1,
          size: availableStudents.length,
          number: 0
        }
      };
    } catch (error) {
      console.error(`Error fetching available students for course ${courseId}:`, error);
      throw error;
    }
  };
  
  // Helper function to normalize user data before sending to API
  normalizeUserData(userData) {
    const normalizedData = { ...userData };
    
    // Handle active status field naming - backend expects "isActive" not "active"
    if (normalizedData.active !== undefined) {
      normalizedData.isActive = normalizedData.active;
      delete normalizedData.active;
    }
    
    // Ensure departmentId is a number
    if (normalizedData.departmentId) {
      normalizedData.departmentId = parseInt(normalizedData.departmentId, 10);
    }
    
    // Ensure roleNames is an array
    if (normalizedData.roleNames && !Array.isArray(normalizedData.roleNames)) {
      normalizedData.roleNames = [normalizedData.roleNames];
    }
    
    return normalizedData;
  }
}

export default new AdminUserService();