import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import AdminUserService from "../../services/AdminUserService";
import "./DepartmentDialog.css";

const DepartmentDialog = ({ isOpen, onClose, onSubmit, department, title }) => {
  // Update the initialFormData to have all required properties
  const initialFormData = {
    name: "",
    description: "",
    code: "",
    specialtyArea: "",
    headOfDepartmentId: "",
    headOfDepartment: "",  // Add this for backward compatibility
    contactInformation: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({}); // For form validation errors

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      if (department) {
        // For editing, preserve the ID and use existing data
        setFormData({
          ...initialFormData,
          ...department,
          // Make sure to maintain both properties
          headOfDepartmentId: department.headOfDepartmentId || "",
          headOfDepartment: department.headOfDepartment || ""
        });
      } else {
        // For new department, use clean initial data
        setFormData(initialFormData);
      }
      
      console.log("Form initialized with:", department || initialFormData);
    }
  }, [isOpen, department]);

  // Load users when the dialog opens
  useEffect(() => {
    if (isOpen) {
      const loadUsers = async () => {
        try {
          // Add role filter to only get instructors
          const response = await AdminUserService.getUsers(0, 100, { 
            active: true,
            role: "INSTRUCTOR"  // Add this filter for instructor role
          });
          setUsers(response.data.content || []);
          console.log("Loaded instructors for department head:", response.data.content);
        } catch (error) {
          console.error("Failed to load instructors:", error);
        }
      };
      
      loadUsers();
    }
  }, [isOpen]);

  // In the DepartmentDialog component, add validation function
  const validateCode = (code) => {
    // Code must be 2-10 uppercase letters or numbers
    const regex = /^[A-Z0-9]{2,10}$/;
    return regex.test(code) || !code; // Empty is also valid (validation happens on submit)
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear previous error when field is changed
    setErrors(prev => ({ ...prev, [name]: null }));
    
    // Validate code field as user types
    if (name === 'code' && value) {
      if (!validateCode(value)) {
        setErrors(prev => ({ 
          ...prev, 
          code: "Code must be 2-10 uppercase letters or numbers" 
        }));
      }
    }
  };

  // Update the handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Department name is required";
    }
    
    if (!formData.code?.trim()) {
      newErrors.code = "Department code is required";
    } else if (!validateCode(formData.code)) {
      newErrors.code = "Department code must be 2-10 uppercase letters or numbers";
    }
    
    // If there are validation errors, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create a department object that matches your backend entity structure
    const departmentDTO = {
      ...(formData.id && { id: formData.id }),
      name: formData.name.trim(),
      description: formData.description || "",
      code: formData.code || formData.name.substring(0, 3).toUpperCase(),
      specialtyArea: formData.specialtyArea || "",
      contactInformation: formData.contactInformation || "",
      // Use isActive not active
      isActive: true
    };
    
    // Handle head of department properly
    if (formData.headOfDepartmentId && formData.headOfDepartmentId !== "") {
      departmentDTO.headId = parseInt(formData.headOfDepartmentId, 10);
    }
    
    console.log('Submitting department with data:', departmentDTO);
    onSubmit(departmentDTO);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Department"}
    >
      <form onSubmit={handleSubmit} className="department-form">
        <div className="form-group">
          <label htmlFor="name">Department Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="code">
            Department Code <span className="required">*</span>
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className={`form-input ${errors.code ? 'input-error' : ''}`}
            placeholder="Department code"
          />
          {errors.code ? (
            <div className="error-message">{errors.code}</div>
          ) : (
            <div className="helper-text">Code must be 2-10 uppercase letters or numbers</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="form-textarea"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="specialtyArea">Specialty Area</label>
          <input
            id="specialtyArea"
            name="specialtyArea"
            value={formData.specialtyArea}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="headOfDepartment">Head of Department</label>
          <select
            id="headOfDepartment"
            name="headOfDepartmentId"
            value={formData.headOfDepartmentId || ""}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Head of Department</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.email})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="contactInformation">Contact Information</label>
          <input
            id="contactInformation"
            name="contactInformation"
            value={formData.contactInformation}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {department ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default DepartmentDialog;