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
    // Clean up and format data according to backend requirements
    const cleanData = {
      name: departmentData.name,
      description: departmentData.description || "",
      code: departmentData.code || "",
      specialtyArea: departmentData.specialtyArea || "",
      contactInformation: departmentData.contactInformation || "",
      // Always use isActive to match Java entity field name
      active: departmentData.isActive !== undefined ? 
        departmentData.isActive : 
        (departmentData.active !== undefined ? departmentData.active : true)
    };
    
    
    
    // Only include headId if it exists and is not empty
    if (departmentData.headId) {
      cleanData.headId = parseInt(departmentData.headId, 10);
    }
    // Also check headOfDepartmentId
    else if (departmentData.headOfDepartmentId) {
      cleanData.headId = parseInt(departmentData.headOfDepartmentId, 10);
    }

    console.log("Creating department with FINAL cleaned data:", JSON.stringify(cleanData, null, 2));
    
    return apiClient.post('/api/departments', cleanData);
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
  getPaginatedDepartments: async (params = {}) => {
  return apiClient.get('/api/departments/pageable', { params });
},
  
  searchDepartments: async (params = {}) => {
  return apiClient.get('/api/departments/search', { params });
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
  getPaginatedDepartmentsWithCounts: async (params = {}) => {
  return apiClient.get('/api/departments/pageable/with-user-counts', { params });
}
};

export default DepartmentService;