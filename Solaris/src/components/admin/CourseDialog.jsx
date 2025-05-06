import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import { departments, users } from "../../mocks/mockDataAdmin";
import "./CourseDialog.css";

const CourseDialog = ({ isOpen, onClose, onSubmit, course, title }) => {
  // Filter only instructors
  const instructors = users.filter(user => 
    user.roleNames && user.roleNames.includes("INSTRUCTOR")
  );

  const initialFormData = course || {
    title: "",
    description: "",
    instructorEmail: "",
    instructorName: "",
    departmentId: 1,
    departmentName: "",
    maxCapacity: 50,
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState(initialFormData);

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormData(course || initialFormData);
    }
  }, [isOpen, course]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value, 10) : value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleDepartmentChange = (e) => {
    const departmentId = parseInt(e.target.value, 10);
    const selectedDepartment = departments.find(d => d.id === departmentId);
    
    setFormData({
      ...formData,
      departmentId,
      departmentName: selectedDepartment ? selectedDepartment.name : "",
    });
  };

  const handleInstructorChange = (e) => {
    const instructorEmail = e.target.value;
    const selectedInstructor = instructors.find(i => i.email === instructorEmail);
    
    setFormData({
      ...formData,
      instructorEmail,
      instructorName: selectedInstructor ? selectedInstructor.fullName : "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Make sure departmentName is set
    if (!formData.departmentName && formData.departmentId) {
      const selectedDepartment = departments.find(d => d.id === formData.departmentId);
      formData.departmentName = selectedDepartment ? selectedDepartment.name : "Unknown Department";
    }
    
    // Make sure instructorName is set
    if (!formData.instructorName && formData.instructorEmail) {
      const selectedInstructor = instructors.find(i => i.email === formData.instructorEmail);
      formData.instructorName = selectedInstructor ? selectedInstructor.fullName : "Unknown Instructor";
    }
    
    onSubmit(formData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="title">Course Title</label>
          <input
            id="title"
            name="title"
            value={formData.title}
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
          <label htmlFor="instructorEmail">Instructor</label>
          <select
            id="instructorEmail"
            name="instructorEmail"
            value={formData.instructorEmail}
            onChange={handleInstructorChange}
            className="form-select"
          >
            <option value="">Select an instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.email}>
                {instructor.fullName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="departmentId">Department</label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleDepartmentChange}
            className="form-select"
            required
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="maxCapacity">Maximum Capacity</label>
          <input
            id="maxCapacity"
            name="maxCapacity"
            type="number"
            min="1"
            value={formData.maxCapacity}
            onChange={handleChange}
            className="form-input"
            required
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
          <label htmlFor="isActive">Active Course</label>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {course ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CourseDialog;