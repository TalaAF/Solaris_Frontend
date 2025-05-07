import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
  UserPlus,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import UserDialog from "./UserDialog";
import BulkUserDialog from "./BulkUserDialog";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import TablePagination from '../ui/TablePagination';
import "./UserTable.css";

const UserTable = ({ 
  users: initialUsers, 
  loading = false,
  pagination = { 
    page: 0, 
    size: 10, 
    totalElements: 0, 
    totalPages: 0 
  },
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  onUserAdd, 
  onUserUpdate, 
  onUserDelete,
  onStatusChange
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkAddDialogOpen, setIsBulkAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    department: ""
  });

  // Update users when initialUsers prop changes
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Client-side filtering for search input
  const filteredUsers = users.filter((user) => 
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (user) => {
    if (onUserAdd) {
      onUserAdd(user);
    } else {
      // Fallback to client-side handling if no API integration
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        email: user.email,
        fullName: user.fullName,
        departmentId: user.departmentId,
        departmentName: user.departmentId === 5 ? "Computer Science" : 
                        user.departmentId === 3 ? "Physics" : 
                        user.departmentId === 2 ? "Mathematics" : "Administration",
        roleNames: user.roleNames,
        profilePicture: "https://github.com/shadcn.png",
        isActive: user.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUsers([...users, newUser]);
      alert("User added successfully");
    }
    setIsAddDialogOpen(false);
  };

  const handleBulkAddUsers = (newUsers) => {
    // Keep the bulk add functionality with server integration
    if (onUserAdd && Array.isArray(newUsers)) {
      // If backend supports bulk add
      Promise.all(newUsers.map(user => onUserAdd(user)))
        .then(() => {
          setIsBulkAddDialogOpen(false);
        })
        .catch(err => {
          console.error("Error adding users in bulk:", err);
        });
    } else {
      // Client-side fallback
      const createdUsers = newUsers.map((user, index) => {
        return {
          id: Math.max(...users.map(u => u.id), 0) + index + 1,
          email: user.email,
          fullName: user.fullName,
          departmentId: user.departmentId,
          departmentName: user.departmentId === 5 ? "Computer Science" : 
                          user.departmentId === 3 ? "Physics" : 
                          user.departmentId === 2 ? "Mathematics" : "Administration",
          roleNames: user.roleNames,
          profilePicture: "https://github.com/shadcn.png",
          isActive: user.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });
      
      setUsers([...users, ...createdUsers]);
      alert(`${newUsers.length} users added successfully`);
    }
    setIsBulkAddDialogOpen(false);
  };

  const handleUpdateUser = (user) => {
    if (!selectedUser) return;

    if (onUserUpdate) {
      onUserUpdate(selectedUser.id, user);
    } else {
      // Client-side fallback
      const updatedUsers = users.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            email: user.email,
            fullName: user.fullName,
            departmentId: user.departmentId,
            departmentName: user.departmentId === 5 ? "Computer Science" : 
                            user.departmentId === 3 ? "Physics" : 
                            user.departmentId === 2 ? "Mathematics" : "Administration",
            roleNames: user.roleNames,
            isActive: user.isActive,
            updatedAt: new Date().toISOString(),
          };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      alert("User updated successfully");
    }
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    if (onUserDelete) {
      onUserDelete(selectedUser.id);
    } else {
      // Client-side fallback
      const filteredUsers = users.filter(u => u.id !== selectedUser.id);
      setUsers(filteredUsers);
      alert("User deleted successfully");
    }
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleStatusChange = (user) => {
    if (onStatusChange) {
      // Just pass the user ID and current status
      onStatusChange(user.id, user.isActive);
    } else {
      // Client-side fallback
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return { ...u, isActive: !u.isActive };
        }
        return u;
      });
      setUsers(updatedUsers);
    }
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} months ago`;
  };

  // Handle search with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
    // If backend search is enabled, update filters after a delay
    if (onFilterChange) {
      const timer = setTimeout(() => {
        onFilterChange({
          ...filters,
          search: e.target.value
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  };

  // Apply filters to backend
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        search: searchQuery
      });
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      role: "",
      status: "",
      department: ""
    });
    
    if (onFilterChange) {
      onFilterChange({
        search: searchQuery
      });
    }
  };

  return (
    <>
      <div className="user-table-container">
        <div className="user-table-header">
          <h2>Users</h2>
          <div className="user-table-actions">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="search"
                placeholder="Search users..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyUp={(e) => e.key === 'Enter' && applyFilters()}
              />
              <button 
                className="filter-button"
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Toggle filters"
              >
                <Filter size={18} />
              </button>
            </div>
            <div className="action-buttons">
              <button className="add-button" onClick={() => setIsAddDialogOpen(true)}>
                <UserPlus size={18} />
                <span>Add User</span>
              </button>
              <button className="bulk-add-button" onClick={() => setIsBulkAddDialogOpen(true)}>
                <Users size={18} />
                <span>Bulk Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-group">
              <label>Department</label>
              <select 
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
              >
                <option value="">All Departments</option>
                <option value="5">Computer Science</option>
                <option value="3">Physics</option>
                <option value="2">Mathematics</option>
                <option value="1">Administration</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Role</label>
              <select 
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="filter-actions">
              <button className="apply-filters" onClick={applyFilters}>Apply Filters</button>
              <button className="reset-filters" onClick={resetFilters}>Reset</button>
            </div>
          </div>
        )}

        <div className="user-table-wrapper">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-details">
                            <div className="user-name">{user.fullName}</div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{user.departmentName}</td>
                      <td>
                        {user.roleNames && user.roleNames.map((role) => (
                          <span key={role} className="role-badge">
                            {role.toLowerCase()}
                          </span>
                        ))}
                      </td>
                      <td>
                        <span 
                          className={`status-badge ${user.isActive ? "active" : "inactive"}`}
                          onClick={() => handleStatusChange(user)}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{user.createdAt ? formatTimeAgo(user.createdAt) : 'N/A'}</td>
                      <td className="action-cell">
                        <div className="dropdown">
                          <button className="dropdown-trigger">
                            <MoreHorizontal size={16} />
                          </button>
                          <div className="dropdown-menu">
                            <div className="dropdown-header">Actions</div>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" onClick={() => openEditDialog(user)}>
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                            <Link to={`/admin/users/${user.id}`} className="dropdown-item">
                              <span>View Details</span>
                            </Link>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item delete" onClick={() => openDeleteDialog(user)}>
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination controls */}
        {!loading && (
          <TablePagination
            totalItems={pagination.totalElements}
            currentPage={pagination.page}
            pageSize={pagination.size}
            itemName="users"
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>

      {/* Add User Dialog */}
      <UserDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddUser}
        title="Add New User"
      />

      {/* Bulk Add User Dialog */}
      <BulkUserDialog
        isOpen={isBulkAddDialogOpen}
        onClose={() => setIsBulkAddDialogOpen(false)}
        onSubmit={handleBulkAddUsers}
      />

      {/* Edit User Dialog */}
      {selectedUser && (
        <UserDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUpdateUser}
          user={{
            id: selectedUser.id,
            email: selectedUser.email,
            fullName: selectedUser.fullName,
            departmentId: selectedUser.departmentId,
            roleNames: selectedUser.roleNames,
            isActive: selectedUser.isActive,
          }}
          title="Edit User"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete the user "${selectedUser?.fullName}"? This action cannot be undone.`}
      />
    </>
  );
};

export default UserTable;