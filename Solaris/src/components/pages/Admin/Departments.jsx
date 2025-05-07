import React, { useState, useEffect } from "react";
import DepartmentTable from "../../admin/DepartmentTable";
import AdminDepartmentService from "../../../services/AdminDepartmentService";
import { toast } from "../../../components/ui/toaster";
import "./Departments.css";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOnly, setActiveOnly] = useState(false);
  // Add pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchDepartments(pagination.page, pagination.size);
  }, []);

  const fetchDepartments = async (page = pagination.page, size = pagination.size) => {
    try {
      setLoading(true);
      
      // Use paginated API endpoint
      const response = await AdminDepartmentService.getPaginatedDepartments(
        activeOnly,
        page,
        size
      );
      
      // Handle response based on its format
      if (response.data && response.data.content) {
        // Spring Data JPA format
        setDepartments(response.data.content);
        setPagination(prev => ({
          ...prev,
          page: response.data.number || 0,
          size: response.data.size || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 1
        }));
      } else if (Array.isArray(response.data)) {
        // Simple array format
        setDepartments(response.data);
        setPagination(prev => ({
          ...prev,
          page,
          size,
          // If we don't have pagination info, estimate based on array length
          totalElements: response.data.length,
          totalPages: Math.ceil(response.data.length / size) || 1
        }));
      } else {
        // Fallback
        setDepartments([]);
        setPagination(prev => ({
          ...prev,
          page,
          size,
          totalElements: 0,
          totalPages: 0
        }));
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError("Failed to load departments. Please try again.");
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentAdd = async (departmentData) => {
    try {
      setLoading(true);
      const response = await AdminDepartmentService.createDepartment(departmentData);
      
      // Refresh departments list after adding
      fetchDepartments(pagination.page, pagination.size);
      
      toast.success("Department added successfully");
    } catch (err) {
      console.error("Error adding department:", err);
      toast.error(err.response?.data?.message || "Failed to add department");
      setLoading(false);
    }
  };

  const handleDepartmentUpdate = async (departmentData) => {
    try {
      setLoading(true);
      const response = await AdminDepartmentService.updateDepartment(departmentData.id, departmentData);
      
      // Update the local state
      setDepartments(prevDepartments => 
        prevDepartments.map(dept => 
          dept.id === departmentData.id ? response.data : dept
        )
      );
      
      toast.success("Department updated successfully");
    } catch (err) {
      console.error("Error updating department:", err);
      toast.error(err.response?.data?.message || "Failed to update department");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentToggleStatus = async (departmentId, newStatus) => {
    try {
      setLoading(true);
      
      // Use the dedicated toggle status endpoint if available
      const response = await AdminDepartmentService.toggleDepartmentStatus(
        departmentId,
        newStatus
      );
      
      // Update the local state
      setDepartments(prevDepartments => 
        prevDepartments.map(dept => 
          dept.id === departmentId ? {...dept, isActive: newStatus} : dept
        )
      );
      
      toast.success(`Department ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (err) {
      console.error("Error toggling department status:", err);
      toast.error(err.response?.data?.message || "Failed to update department status");
    } finally {
      setLoading(false);
    }
  };

  // Updated pagination handlers
  const handlePageChange = (newPage) => {
    fetchDepartments(newPage, pagination.size);
  };

  const handlePageSizeChange = (newSize) => {
    fetchDepartments(0, newSize); // Reset to first page when size changes
  };

  const handleFilterChange = (newFilters) => {
    setActiveOnly(newFilters.activeOnly === true);
    fetchDepartments(0, pagination.size); // Reset to first page when filters change
  };

  return (
    <>
      <div className="admin-departments-page">
        <div className="admin-departments-header">
          <h1 className="admin-title">Department Management</h1>
          <p className="admin-subtitle">Manage all departments in the system</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <DepartmentTable 
          departments={departments} 
          loading={loading}
          onDepartmentAdd={handleDepartmentAdd} 
          onDepartmentUpdate={handleDepartmentUpdate}
          onDepartmentToggleStatus={handleDepartmentToggleStatus}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterChange={handleFilterChange}
        />
      </div>
    </>
  );
};

export default Departments;