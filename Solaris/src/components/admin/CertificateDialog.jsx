import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import { courses ,departments} from "../../mocks/mockDataAdmin";
import "./CertificateDialog.css";

const CertificateDialog = ({ isOpen, onClose, onSave, certificate, title }) => {
  const initialFormData = certificate || {
    name: "",
    description: "",
    courseId: courses[0]?.id || 1,
    courseName: "",
    departmentId: departments[0]?.id || 1,
    departmentName: "",
    template: "Standard Certificate",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormData(certificate || initialFormData);
      setErrors({});
    }
  }, [isOpen, certificate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleCourseChange = (e) => {
    const courseId = parseInt(e.target.value, 10);
    const selectedCourse = courses.find((course) => course.id === courseId);
    
    setFormData({
      ...formData,
      courseId,
      courseName: selectedCourse ? selectedCourse.title : "",
    });
  };

  const handleDepartmentChange = (e) => {
    const departmentId = parseInt(e.target.value, 10);
    const selectedDepartment = departments.find((dept) => dept.id === departmentId);
    
    setFormData({
      ...formData,
      departmentId,
      departmentName: selectedDepartment ? selectedDepartment.name : "",
    });
  };

  const handleTemplateChange = (e) => {
    setFormData({
      ...formData,
      template: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
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
    
    // Ensure courseName and departmentName are set
    if (!formData.courseName) {
      const selectedCourse = courses.find((course) => course.id === formData.courseId);
      formData.courseName = selectedCourse ? selectedCourse.title : "Unknown Course";
    }
    
    if (!formData.departmentName) {
      const selectedDepartment = departments.find((dept) => dept.id === formData.departmentId);
      formData.departmentName = selectedDepartment ? selectedDepartment.name : "Unknown Department";
    }
    
    onSave(formData);
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
            value={formData.name}
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
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="courseId">Course</label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleCourseChange}
            className="form-select"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
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
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="template">Certificate Template</label>
          <select
            id="template"
            name="template"
            value={formData.template}
            onChange={handleTemplateChange}
            className="form-select"
          >
            <option value="Standard Certificate">Standard Certificate</option>
            <option value="Honors Certificate">Honors Certificate</option>
            <option value="Completion Certificate">Completion Certificate</option>
            <option value="Achievement Certificate">Achievement Certificate</option>
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