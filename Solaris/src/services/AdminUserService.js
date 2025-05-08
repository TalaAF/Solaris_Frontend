import apiClient from './api';

const AdminUserService = {
  // Get all users with pagination and filtering
  getUsers: async (page = 0, size = 10, filters = {}) => {
    const params = { page, size, ...filters };
    return apiClient.get('/api/admin/users', { params });
  },
  
  // Get user by ID
  getUser: async (userId) => {
    return apiClient.get(`/api/admin/users/${userId}`);
  },
  
  // Create new user
  createUser: async (userData) => {
    return apiClient.post('/api/admin/users', userData);
  },
  
  // Update existing user
  updateUser: async (userId, userData) => {
    return apiClient.put(`/api/admin/users/${userId}`, userData);
  },
  
  // Delete user
  deleteUser: async (userId) => {
    return apiClient.delete(`/api/admin/users/${userId}`);
  },
  
  // Activate user
  activateUser: async (userId) => {
    return apiClient.patch(`/api/admin/users/${userId}/activate`);
  },
  
  // Deactivate user
  deactivateUser: async (userId) => {
    return apiClient.patch(`/api/admin/users/${userId}/deactivate`);
  }
};

export default AdminUserService;