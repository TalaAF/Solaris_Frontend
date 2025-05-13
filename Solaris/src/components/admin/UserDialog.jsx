import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import DepartmentService from "../../services/DepartmentService";
import RoleService from "../../services/RoleService";


const UserDialog = ({ isOpen, onClose, onSubmit, user, title }) => {
  // Separate state for API data
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form state that tracks the user prop
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    departmentId: null,
    roleNames: ["STUDENT"],
    active: true,  // Use 'active' to match backend expectation
    password: ""   // Only used for new users
  });
  
  // Load departments and roles when dialog opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([
        DepartmentService.getDepartments(true),
        RoleService.getAvailableRoles()
      ])
        .then(([deptResponse, roleResponse]) => {
          setDepartments(deptResponse.data || []);
          setRoles(roleResponse.data || []);
          
          // Set default department if available
          if (deptResponse.data?.length > 0 && !formData.departmentId) {
            setFormData(prev => ({
              ...prev,
              departmentId: deptResponse.data[0].id
            }));
          }
        })
        .catch(error => {
          console.error("Failed to load form data:", error);
          setErrors({ api: "Failed to load departments or roles" });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);
  
  // Reset form when user prop changes
  useEffect(() => {
    if (user) {
      // For editing existing user
      setFormData({
        id: user.id,
        email: user.email || "",
        fullName: user.fullName || "",
        departmentId: user.departmentId || null,
        roleNames: user.roleNames || ["STUDENT"],
        active: user.active === undefined ? (user.isActive || false) : user.active
      });
    } else {
      // For creating new user
      setFormData({
        email: "",
        fullName: "",
        departmentId: departments.length > 0 ? departments[0].id : null,
        roleNames: ["STUDENT"],
        active: true,
        password: ""
      });
    }
  }, [user, departments]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear any error for this field
    if (errors[name]) {
      setErrors({...errors, [name]: null});
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      departmentId
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      roleNames: [e.target.value],
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!user && !formData.password) {
      newErrors.password = "Password is required for new users";
    }
    
    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create a clean copy of the data to send to the backend
    const submitData = {
      ...(user && { id: user.id }),
      email: formData.email,
      fullName: formData.fullName,
      departmentId: formData.departmentId ? parseInt(formData.departmentId, 10) : null,
      roleNames: formData.roleNames,
      active: formData.active
    };
    
    // Only include password for new users and if it's not empty
    if (!user && formData.password) {
      submitData.password = formData.password;
    }
    
    console.log("Submitting to backend:", submitData);
    onSubmit(submitData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="user-form">
          {errors.api && (
            <div className="error-message api-error">{errors.api}</div>
          )}
          
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
              <option value="">Select a department</option>
              {departments.map((department) => (
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
              {roles.map((role) => (
                <option key={role.name} value={role.name}>
                  {role.displayName || role.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-check">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="active">Active User</label>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
};

export default UserDialog;