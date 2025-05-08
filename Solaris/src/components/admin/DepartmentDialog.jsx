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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Update the handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Log for debugging
    console.log("Form data before submit:", formData);
    
    const departmentDTO = {
      ...(formData.id && { id: formData.id }),
      name: formData.name,
      description: formData.description,
      code: formData.code,
      specialtyArea: formData.specialtyArea,
      // Fix how we handle the headOfDepartmentId
      headOfDepartmentId: formData.headOfDepartmentId ? parseInt(formData.headOfDepartmentId, 10) : null,
      // Also keep headOfDepartment as string name for backward compatibility
      headOfDepartment: formData.headOfDepartment || "",
      contactInformation: formData.contactInformation,
      isActive: department ? (department.isActive !== undefined ? department.isActive : department.active) : true
    };
    
    // Log what we're submitting to API
    console.log('Submitting department:', departmentDTO);
    onSubmit(departmentDTO);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
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
        </div>
        
        <div className="form-group">
          <label htmlFor="code">Department Code</label>
          <input
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="form-input"
          />
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