import React, { useState, useEffect } from "react";
import Layout from "../../layout/Layout";
import UserTable from "../../admin/UserTable";
import AdminUserService from "../../../services/AdminUserService";
import { toast } from "../../ui/toaster";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ 
    page: 0, 
    size: 10, 
    totalElements: 0, 
    totalPages: 0 
  });
  const [filters, setFilters] = useState({});

  // Load users when component mounts or when pagination/filters change
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.size, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await AdminUserService.getUsers(
        pagination.page, 
        pagination.size, 
        filters
      );
      
      console.log("User data from API:", response.data.content[0]); // Log first user to see structure
      
      // Assuming the API returns { content: [...users], totalElements, totalPages }
      setUsers(response.data.content);
      setPagination(prev => ({
        ...prev,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages
      }));
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: newSize, page: 0 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page when filters change
  };

  const handleUserAdd = async (userData) => {
    try {
      setLoading(true);
      await AdminUserService.createUser(userData);
      toast.success("User added successfully");
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async (userData) => {
    setLoading(true);
    try {
      console.log("Updating user with data:", userData);
      // Verify ID exists before calling API
      if (!userData.id) {
        throw new Error("User ID is missing");
      }
      await AdminUserService.updateUser(userData.id, userData);
      
      // Refresh the user list to get updated data
      fetchUsers(pagination.page, pagination.size, filters);
      
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      setLoading(true);
      await AdminUserService.deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      setLoading(true);
      if (currentStatus === true || currentStatus === "ACTIVE") {
        // If currently active, deactivate
        await AdminUserService.deactivateUser(userId);
        toast.success("User deactivated successfully");
      } else {
        // If currently inactive, activate
        await AdminUserService.activateUser(userId);
        toast.success("User activated successfully");
      }
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error(err.response?.data?.message || "Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-users-page">
      <div className="admin-users-header">
        <h1 className="admin-title">User Management</h1>
        <p className="admin-subtitle">Manage all users in the system</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <UserTable 
        users={users} 
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
        onUserAdd={handleUserAdd}
        onUserUpdate={handleUserUpdate} 
        onUserDelete={handleUserDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Users;