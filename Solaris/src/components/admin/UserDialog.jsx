import React, { useState } from "react";
import Dialog from "../common/Dialog";
import { departments, roles } from "../../mocks/mockDataAdmin";
import "./UserDialog.css";

const UserDialog = ({ isOpen, onClose, onSubmit, user, title }) => {
  const initialFormData = user || {
    email: "",
    fullName: "",
    departmentId: 1,
    roleNames: ["STUDENT"],
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDepartmentChange = (e) => {
    setFormData({
      ...formData,
      departmentId: parseInt(e.target.value),
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      roleNames: [e.target.value],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            value={formData.departmentId}
            onChange={handleDepartmentChange}
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
            value={formData.roleNames[0]}
            onChange={handleRoleChange}
            className="form-select"
          >
            {roles && roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name.toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-check">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="form-checkbox"
          />
          <label htmlFor="isActive">Active User</label>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {user ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default UserDialog;