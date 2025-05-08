import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import DepartmentService from "../../services/DepartmentService";
import RoleService from "../../services/RoleService";
import "./UserDialog.css";

const UserDialog = ({ isOpen, onClose, onSubmit, user, title }) => {
  const initialFormData = user || {
    email: "",
    password: "",
    fullName: "",
    departmentId: null,
    roleNames: ["STUDENT"],
    isActive: true,
    profilePicture: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch departments and roles from API
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      Promise.all([
        DepartmentService.getDepartments(),
        RoleService.getRoles()
      ])
        .then(([deptResponse, rolesResponse]) => {
          setDepartments(deptResponse.data);
          setRoles(rolesResponse.data);
          
          // Set default department if none selected and departments exist
          if (!formData.departmentId && deptResponse.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              departmentId: deptResponse.data[0].id
            }));
          }
        })
        .catch(error => {
          console.error("Error loading form data:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
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
    
    // Validate form data
    const newErrors = {};
    
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.departmentId) newErrors.departmentId = "Department is required";
    
    // Only validate password for new users
    if (!user && !formData.password) {
      newErrors.password = "Password is required for new users";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // For existing users, remove the password field if it's empty
    const submitData = {...formData};
    if (user && !submitData.password) {
      delete submitData.password;
    }
    
    // Make sure departmentId is sent as a number, not a string
    if (submitData.departmentId) {
      submitData.departmentId = Number(submitData.departmentId);
    }
    
    // If profile picture is empty, omit it
    if (!submitData.profilePicture) {
      delete submitData.profilePicture;
    }
    
    console.log("Submitting user data:", submitData); // For debugging
    
    // Submit the validated data
    onSubmit(submitData);
  };

  if (isLoading) {
    return (
      <Dialog isOpen={isOpen} onClose={onClose} title={title}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading form data...</p>
        </div>
      </Dialog>
    );
  }

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
            className={`form-input ${errors.fullName ? 'error' : ''}`}
          />
          {errors.fullName && <div className="error-message">{errors.fullName}</div>}
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
            className={`form-input ${errors.email ? 'error' : ''}`}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        {/* Only show password field for new users */}
        {!user && (
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`form-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            value={formData.departmentId || ""}
            onChange={handleDepartmentChange}
            className={`form-select ${errors.departmentId ? 'error' : ''}`}
          >
            <option value="" disabled>Select a department</option>
            {departments && departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {errors.departmentId && <div className="error-message">{errors.departmentId}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={formData.roleNames[0] || ""}
            onChange={handleRoleChange}
            className="form-select"
          >
            {roles && roles.map((role) => (
              <option key={role.name} value={role.name}>
                {role.displayName || role.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture URL (Optional)</label>
          <input
            id="profilePicture"
            name="profilePicture"
            type="text"
            value={formData.profilePicture}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/profile.jpg"
          />
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