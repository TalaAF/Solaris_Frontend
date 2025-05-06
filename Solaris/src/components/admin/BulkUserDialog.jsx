import React, { useState } from "react";
import Dialog from "../common/Dialog";
import { departments, roles } from "../../mocks/mockDataAdmin";
import "./BulkUserDialog.css";

const BulkUserDialog = ({ isOpen, onClose, onSubmit }) => {
  const [userEmails, setUserEmails] = useState("");
  const [departmentId, setDepartmentId] = useState(1);
  const [roleName, setRoleName] = useState("STUDENT");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Split the textarea content by newline
    const emails = userEmails.split('\n').filter(email => email.trim() !== '');
    
    if (emails.length === 0) {
      setErrorMessage("Please enter at least one email address");
      return;
    }
    
    // Validate emails
    const invalidEmails = emails.filter(email => !validateEmail(email.trim()));
    if (invalidEmails.length > 0) {
      setErrorMessage(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }

    // Create user objects for each email
    const users = emails.map(email => ({
      email: email.trim(),
      fullName: email.trim().split('@')[0], // Use part before @ as default name
      departmentId,
      roleNames: [roleName],
      isActive: true,
    }));

    onSubmit(users);
    
    // Reset form
    setUserEmails("");
    setDepartmentId(1);
    setRoleName("STUDENT");
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk User Registration"
    >
      <form onSubmit={handleSubmit} className="bulk-user-form">
        <p className="form-description">
          Enter one email address per line to register multiple users at once.
        </p>
        
        {errorMessage && (
          <div className="error-alert">
            <span className="error-icon">!</span>
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="userEmails">Email Addresses (one per line)</label>
          <textarea
            id="userEmails"
            placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
            rows={6}
            value={userEmails}
            onChange={(e) => setUserEmails(e.target.value)}
            className="form-textarea"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={departmentId}
              onChange={(e) => setDepartmentId(parseInt(e.target.value))}
              className="form-select"
            >
              {departments && departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="form-select"
            >
              {roles && roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name.toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Register Users
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default BulkUserDialog;