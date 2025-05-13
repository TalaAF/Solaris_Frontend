import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";

// Semesters - in a real app these could come from an API or be a free-form text field
const semesters = [
  { name: "Fall 2024" },
  { name: "Spring 2025" },
  { name: "Summer 2025" },
  { name: "Fall 2025" }
];

const CertificateDialog = ({ 
  isOpen, 
  onClose, 
  onSave, 
  certificate, 
  title
}) => {
  // Define initialFormData outside of the component state
  const defaultFormData = {
    name: "",
    description: "",
    semesterName: "",
    isActive: true,
  };

  // Initialize state with a function to prevent re-evaluation on every render
  const [formData, setFormData] = useState(() => ({
    ...defaultFormData,
    ...(certificate || {})
  }));
  
  const [errors, setErrors] = useState({});
  const [customSemester, setCustomSemester] = useState(() => 
    certificate && certificate.semesterName ? 
    !semesters.some(s => s.name === certificate.semesterName) : 
    false
  );

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      // Only update when dialog opens
      const updatedData = certificate ? {
        ...defaultFormData,
        ...certificate
      } : defaultFormData;
      
      setFormData(updatedData);
      setCustomSemester(
        updatedData.semesterName ? 
        !semesters.some(s => s.name === updatedData.semesterName) : 
        false
      );
      setErrors({});
    }
  }, [isOpen, certificate]); // Remove initialFormData from dependencies

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const handleSemesterChange = (e) => {
    const value = e.target.value;
    
    // If "Custom" is selected, don't update the semesterName yet
    if (value === "custom") {
      setCustomSemester(true);
      return;
    }
    
    // Otherwise, update the semester name
    setCustomSemester(false);
    setFormData(prevData => ({
      ...prevData,
      semesterName: value,
    }));
  };

  const handleCustomSemesterChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      semesterName: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Certificate name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for backend
    const submissionData = {
      ...formData,
      // Include a placeholder if semesterName is empty
      semesterName: formData.semesterName || "General"
    };
    
    onSave(submissionData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <form onSubmit={handleSubmit} className="certificate-form">
        <div className="form-group">
          <label htmlFor="name">Certificate Name</label>
          <input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className={`form-input ${errors.name ? "error" : ""}`}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="semesterName">Semester</label>
          <select
            id="semesterSelect"
            name="semesterSelect"
            value={customSemester ? "custom" : formData.semesterName || ""}
            onChange={handleSemesterChange}
            className="form-select"
          >
            <option value="">General (No specific semester)</option>
            {semesters.map((semester, index) => (
              <option key={index} value={semester.name}>
                {semester.name}
              </option>
            ))}
            <option value="custom">Custom Semester...</option>
          </select>
        </div>
        
        {customSemester && (
          <div className="form-group">
            <label htmlFor="customSemester">Custom Semester Name</label>
            <input
              id="customSemester"
              name="customSemester"
              value={formData.semesterName || ""}
              onChange={handleCustomSemesterChange}
              className="form-input"
              placeholder="Enter semester name"
            />
          </div>
        )}
        
        <div className="form-check">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive !== undefined ? formData.isActive : true}
            onChange={handleChange}
            className="form-checkbox"
          />
          <label htmlFor="isActive">Active Certificate</label>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {certificate ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CertificateDialog;