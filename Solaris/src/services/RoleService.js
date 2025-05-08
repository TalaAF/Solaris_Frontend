import apiClient from './api';

const RoleService = {
  // Get all roles (for admin purposes)
  getRoles: async () => {
    return apiClient.get('/api/admin/roles');
  },
  
  // Get only roles available for user assignment
  getAvailableRoles: async () => {
    return apiClient.get('/api/admin/roles/available');
  }
};

export default RoleService;