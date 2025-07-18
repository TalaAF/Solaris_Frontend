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
      setError(null); // Clear previous errors
      
      console.log("Fetching users with params:", {
        page: pagination.page,
        size: pagination.size,
        filters
      });
      
      const response = await AdminUserService.getUsers(
        pagination.page, 
        pagination.size, 
        filters
      );
      
      // Check if response and data exist
      if (!response || !response.data) {
        throw new Error("Invalid response format from API");
      }
      
      console.log("User data from API:", response.data);
      
      // Check if the response has the expected format
      if (Array.isArray(response.data.content)) {
        setUsers(response.data.content);
        setPagination(prev => ({
          ...prev,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        }));
      } else if (Array.isArray(response.data)) {
        // Handle case where API returns just an array instead of paginated object
        setUsers(response.data);
        setPagination(prev => ({
          ...prev,
          totalElements: response.data.length,
          totalPages: Math.ceil(response.data.length / pagination.size)
        }));
      } else {
        throw new Error("Unexpected response format from API");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
      toast.error("Failed to load users");
      // Don't clear users on error to maintain current state
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
      const response = await AdminUserService.createUser(userData);
      toast.success("User added successfully");
      fetchUsers(); // Refresh the list
      return response.data; // Return the created user data
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error(err.response?.data?.message || "Failed to add user");
      throw err; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async (userData) => {
    try {
      setLoading(true);
      console.log("Updating user with data:", userData);
      
      // Verify ID exists before calling API
      if (!userData.id) {
        throw new Error("User ID is missing");
      }
      
      const response = await AdminUserService.updateUser(userData.id, userData);
      
      // Update the local state to avoid a full refetch
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userData.id ? { ...user, ...userData } : user
        )
      );
      
      toast.success("User updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update user");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      setLoading(true);
      await AdminUserService.deleteUser(userId);
      
      // Update the local state to remove the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Update pagination if needed
      if (users.length === 1 && pagination.page > 0) {
        setPagination(prev => ({
          ...prev,
          page: prev.page - 1,
          totalElements: prev.totalElements - 1
        }));
      } else {
        setPagination(prev => ({
          ...prev,
          totalElements: prev.totalElements - 1
        }));
      }
      
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setLoading(true);
      
      if (newStatus === true) {
        await AdminUserService.activateUser(userId);
        toast.success("User activated successfully");
      } else {
        await AdminUserService.deactivateUser(userId);
        toast.success("User deactivated successfully");
      }
      
      // Update the local state to reflect the status change
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isActive: newStatus } : user
        )
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error(err.response?.data?.message || "Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  // Clear error when unmounting
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

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