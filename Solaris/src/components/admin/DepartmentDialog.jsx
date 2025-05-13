import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import AdminUserService from "../../services/AdminUserService";


const DepartmentDialog = ({ isOpen, onClose, onSubmit, department, title }) => {
  // Update the initialFormData to have all required properties
  const initialFormData = {
    name: "",
    description: "",
    code: "",
    specialtyArea: "",
    headId: "", // Add this for backward compatibility
    contactInformation: "",
    active: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [instructors, setInstructors] = useState([]); 
  const [errors, setErrors] = useState({}); // For form validation errors
  const [loading, setLoading] = useState(false);
  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      if (department) {
        // For editing, preserve the ID and use existing data
         const mappedData = {
          id: department.id,
          name: department.name || "",
          description: department.description || "",
          code: department.code || "",
          specialtyArea: department.specialtyArea || "",
          contactInformation: department.contactInformation || "",
          active: department.active || department.isActive || true,
          // Handle head data
          headId: department.head?.id || department.headId || "", 
        };

        setFormData(mappedData);
        console.log("Form initialized with:", mappedData);
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
      const loadInstructors = async () => {
        try {
          setLoading(true);
          // Only get active instructors
          const response = await AdminUserService.getUsers({
            role: "INSTRUCTOR",
            active: true
          });
          
          const instructorsList = response.data.content || response.data || [];
          setInstructors(instructorsList);
          console.log("Loaded instructors for department head:", instructorsList);
        } catch (error) {
          console.error("Failed to load instructors:", error);
        } finally {
          setLoading(false);
        }
      };
      
      loadInstructors();
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
      code: formData.code.toUpperCase(), // Ensure code is uppercase
      specialtyArea: formData.specialtyArea || "",
      contactInformation: formData.contactInformation || "",
      active: formData.active // Use active to be consistent with frontend components
    };
    
    // Handle head of department properly using headId
    if (formData.headId && formData.headId !== "") {
      departmentDTO.headId = parseInt(formData.headId, 10);
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
          <label htmlFor="headId">Head of Department</label>
          <select
            id="headId"
            name="headId"
            value={formData.headId || ""}
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            <option value="">Select Head of Department</option>
            {instructors.map(instructor => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.fullName} ({instructor.email})
              </option>
            ))}
          </select>
          {loading && <div className="helper-text">Loading instructors...</div>}
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