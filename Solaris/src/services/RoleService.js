import apiClient from './api';

const RoleService = {
  // Get all roles (for admin purposes)
  getRoles: async () => {
    return apiClient.get('/api/admin/roles');
  },
  
  // Get only roles available for user assignment
  // Now using the standard roles endpoint since /available is causing 500 error
  getAvailableRoles: async () => {
    return apiClient.get('/api/admin/roles');
  }
};

export default RoleService;