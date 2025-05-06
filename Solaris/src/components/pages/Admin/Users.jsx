import React, { useState } from "react";
import Layout from "../../layout/Layout";
import UserTable from "../../admin/UserTable";
import { users as initialUsers } from "../../../mocks/mockDataAdmin";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState(initialUsers || []);

  const handleUserAdd = (userData) => {
    // In a real application, this would make an API call
    console.log("Adding user:", userData);
    // The actual user addition is handled in the UserTable component
    alert("User added successfully");
  };

  const handleUserUpdate = (userData) => {
    // In a real application, this would make an API call
    console.log("Updating user:", userData);
    alert("User updated successfully");
  };

  const handleUserDelete = (userId) => {
    // In a real application, this would make an API call
    console.log("Deleting user with ID:", userId);
    alert("User deleted successfully");
  };

  return (
    <>
      <div className="admin-users-page">
        <div className="admin-users-header">
          <h1 className="admin-title">User Management</h1>
          <p className="admin-subtitle">Manage all users in the system</p>
        </div>

        <UserTable 
          users={users} 
          onUserAdd={handleUserAdd} 
          onUserUpdate={handleUserUpdate} 
          onUserDelete={handleUserDelete}
        />
      </div>
    </>
  );
};

export default Users;