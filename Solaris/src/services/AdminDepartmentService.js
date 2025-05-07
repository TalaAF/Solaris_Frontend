import apiClient from './api';

const AdminDepartmentService = {
  // Get all departments (with optional active filter)
  getDepartments: async (activeOnly = false) => {
    return apiClient.get('/api/departments', { params: { activeOnly } });
  },
  
  // Get department by ID
  getDepartment: async (id) => {
    return apiClient.get(`/api/departments/${id}`);
  },
  
  // Create new department
  createDepartment: async (departmentData) => {
    return apiClient.post('/api/departments', departmentData);
  },
  
  // Update existing department
  updateDepartment: async (id, departmentData) => {
    return apiClient.put(`/api/departments/${id}`, departmentData);
  },
  
  // Delete department
  deleteDepartment: async (id) => {
    return apiClient.delete(`/api/departments/${id}`);
  },
  
  // Test API connection
  testConnection: async () => {
    try {
      console.log('Testing departments API connection...');
      const response = await apiClient.get('/api/departments');
      console.log('Departments API connection successful:', response.status);
      return {
        success: true,
        status: response.status,
        message: 'Connection successful',
        data: response.data
      };
    } catch (error) {
      console.error('Departments API connection failed:', error);
      return {
        success: false,
        status: error.response?.status,
        message: error.message || 'Unknown error',
        error: error.response?.data || 'No response data'
      };
    }
  },
  
  // Enhanced methods for pagination and search
  getPaginatedDepartments: async (activeOnly = false, page = 0, size = 10) => {
    return apiClient.get('/api/departments/pageable', { 
      params: { activeOnly, page, size } 
    });
  },
  
  searchDepartments: async (keyword, activeOnly = false, page = 0, size = 10) => {
    return apiClient.get('/api/departments/search', { 
      params: { keyword, activeOnly, page, size } 
    });
  },
  
  // Direct status toggle (more efficient than full update)
  toggleDepartmentStatus: async (id, active) => {
    return apiClient.patch(`/api/departments/${id}/status`, null, {
      params: { active }
    });
  },
  
  // Department statistics
  getDepartmentStats: async () => {
    return apiClient.get('/api/departments/counts');
  },
  
  // Batch creation for importing multiple departments
  batchCreateDepartments: async (departmentsData) => {
    return apiClient.post('/api/departments/batch', departmentsData);
  }
};

export default AdminDepartmentService;