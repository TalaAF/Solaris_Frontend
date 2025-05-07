import apiClient from './api';

const AdminUserService = {
  // Get all users with pagination and filtering
  getUsers: async (page = 0, size = 10, filters = {}) => {
    const params = { page, size, ...filters };
    return apiClient.get('/admin/users', { params });
  },
  
  // Get user by ID
  getUser: async (userId) => {
    return apiClient.get(`/admin/users/${userId}`);
  },
  
  // Create new user
  createUser: async (userData) => {
    return apiClient.post('/admin/users', userData);
  },
  
  // Update existing user
  updateUser: async (userId, userData) => {
    return apiClient.put(`/admin/users/${userId}`, userData);
  },
  
  // Delete user
  deleteUser: async (userId) => {
    return apiClient.delete(`/admin/users/${userId}`);
  },
  
  // Activate user
  activateUser: async (userId) => {
    return apiClient.patch(`/admin/users/${userId}/activate`);
  },
  
  // Deactivate user
  deactivateUser: async (userId) => {
    return apiClient.patch(`/admin/users/${userId}/deactivate`);
  }
};

export default AdminUserService;