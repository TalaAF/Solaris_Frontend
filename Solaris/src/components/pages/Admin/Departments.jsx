import React, { useState, useEffect } from "react";
import DepartmentTable from "../../admin/DepartmentTable";
import AdminDepartmentService from "../../../services/DepartmentService";
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

  const fetchDepartments = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      // FIX: Use the method that returns user counts
      const response = await AdminDepartmentService.getPaginatedDepartmentsWithCounts(activeOnly, page, size);
      
      // Debug the response structure
      console.log("Department API response with counts:", response.data);
      console.log("First department with user count:", response.data.content?.[0]);
      
      // Make sure we're updating with the data that includes counts
      setDepartments(response.data.content || []);
      
      setPagination({
        page: response.data.number,
        size: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages
      });
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentAdd = async (departmentData) => {
    try {
      setLoading(true);
      const response = await AdminDepartmentService.createDepartment(departmentData);
      
      // Refresh the whole department list to ensure consistency
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
      console.log("Updating department with data:", departmentData);
      
      // Make sure the ID is included when calling the API
      if (!departmentData.id) {
        throw new Error("Department ID is missing");
      }
      
      await AdminDepartmentService.updateDepartment(departmentData.id, departmentData);
      
      // Refresh the whole list instead of trying to update a specific item
      fetchDepartments(pagination.page, pagination.size);
      
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
      
      // Use the dedicated toggle status endpoint
      await AdminDepartmentService.toggleDepartmentStatus(
        departmentId,
        newStatus
      );
      
      // FIX: Refresh data from server instead of updating local state
      // This ensures we get the correct status from the backend
      fetchDepartments(pagination.page, pagination.size);
      
      toast.success(`Department ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (err) {
      console.error("Error toggling department status:", err);
      toast.error(err.response?.data?.message || "Failed to update department status");
      setLoading(false); // Only set loading false on error
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