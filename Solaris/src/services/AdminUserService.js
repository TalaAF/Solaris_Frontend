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