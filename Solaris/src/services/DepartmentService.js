import apiClient from './api';

const DepartmentService = {
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
    console.log(`Sending update for department ID ${id}:`, departmentData);
    
    // Remove any potential duplicate ID fields to avoid conflicts
    const cleanData = { ...departmentData };
    if (cleanData.id === id) {
      delete cleanData.id; // Some APIs don't want the ID in the body when it's in the URL
    }
    
    return apiClient.put(`/api/departments/${id}`, cleanData);
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
  },
  
  // NEW METHODS for department head management
  
  // Assign a head to a department
  assignDepartmentHead: async (departmentId, userId) => {
    return apiClient.patch(`/api/departments/${departmentId}/head`, { userId });
  },
  
  // Remove head from department
  removeDepartmentHead: async (departmentId) => {
    return apiClient.delete(`/api/departments/${departmentId}/head`);
  },
  
  // Get departments with user counts for admin dashboard
  getDepartmentsWithUserCounts: async () => {
    return apiClient.get('/api/departments/with-user-counts');
  },
  
  // Get departments with user counts (paginated)
  getPaginatedDepartmentsWithCounts: async (activeOnly = false, page = 0, size = 10) => {
    return apiClient.get('/api/departments/pageable/with-user-counts', {
      params: { activeOnly, page, size }
    });
  }
};

export default DepartmentService;