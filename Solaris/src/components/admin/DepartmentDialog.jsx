import React, { useState } from "react";
import Dialog from "../common/Dialog";
import "./DepartmentDialog.css";

const DepartmentDialog = ({ isOpen, onClose, onSubmit, department, title }) => {
  const initialFormData = department || {
    name: "",
    description: "",
    code: "",
    specialtyArea: "",
    headOfDepartment: "",
    contactInformation: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  // Reset form when dialog opens with new data
  React.useEffect(() => {
    if (isOpen) {
      setFormData(department || initialFormData);
    }
  }, [isOpen, department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
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
          <input
            id="headOfDepartment"
            name="headOfDepartment"
            value={formData.headOfDepartment}
            onChange={handleChange}
            className="form-input"
          />
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
        
        <div className="form-check">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleCheckboxChange}
            className="form-checkbox"
          />
          <label htmlFor="isActive">Active Department</label>
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