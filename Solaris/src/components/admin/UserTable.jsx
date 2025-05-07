import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
  UserPlus,
  Users
} from "lucide-react";
import UserDialog from "./UserDialog";
import BulkUserDialog from "./BulkUserDialog";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import "./UserTable.css";

const UserTable = ({ users: initialUsers, onUserAdd, onUserUpdate, onUserDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkAddDialogOpen, setIsBulkAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter((user) => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (user) => {
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
    if (onUserAdd) onUserAdd(user);
    setIsAddDialogOpen(false);
    alert("User added successfully");
  };

  const handleBulkAddUsers = (newUsers) => {
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
    setIsBulkAddDialogOpen(false);
    alert(`${newUsers.length} users added successfully`);
  };

  const handleUpdateUser = (user) => {
    if (!selectedUser) return;

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
    if (onUserUpdate) onUserUpdate({...user, id: selectedUser.id});
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    alert("User updated successfully");
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    const filteredUsers = users.filter(u => u.id !== selectedUser.id);
    setUsers(filteredUsers);
    if (onUserDelete) onUserDelete(selectedUser.id);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    alert("User deleted successfully");
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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

        <div className="user-table-wrapper">
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
              {filteredUsers.map((user) => (
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
                    {user.roleNames.map((role) => (
                      <span key={role} className="role-badge">
                        {role.toLowerCase()}
                      </span>
                    ))}
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{formatTimeAgo(user.createdAt)}</td>
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
              ))}
            </tbody>
          </table>
        </div>
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