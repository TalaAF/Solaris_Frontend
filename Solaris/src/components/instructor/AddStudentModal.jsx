import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import './AddStudentModal.css';

const AddStudentModal = ({ isOpen, onClose, onAddStudent, courses }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'Active',
    selectedCourses: []
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle course selection
  const handleCourseToggle = (course) => {
    const updatedCourses = formData.selectedCourses.includes(course)
      ? formData.selectedCourses.filter(c => c !== course)
      : [...formData.selectedCourses, course];
    
    setFormData({
      ...formData,
      selectedCourses: updatedCourses
    });

    // Clear course error if any courses are selected
    if (errors.selectedCourses && updatedCourses.length > 0) {
      setErrors({
        ...errors,
        selectedCourses: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.selectedCourses.length === 0) {
      newErrors.selectedCourses = 'At least one course must be selected';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Create new student object
    const newStudent = {
      id: Date.now(), // Temporary ID (would be replaced by server-generated ID)
      name: formData.name,
      email: formData.email,
      initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      courses: formData.selectedCourses,
      status: formData.status,
      progress: 0, // Default progress for new student
      enrolledDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    // Pass the new student to parent component
    onAddStudent(newStudent);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      status: 'Active',
      selectedCourses: []
    });
    setErrors({});
    
    // Close modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="add-student-modal">
        <div className="modal-header">
          <h2>Add New Student</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form className="add-student-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student's full name"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter student's email address"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div className="form-group courses-group">
            <label>Assign Courses</label>
            <div className="courses-options">
              {courses.filter(course => course !== 'All Courses').map((course) => (
                <div key={course} className="course-option">
                  <input
                    type="checkbox"
                    id={`course-${course}`}
                    checked={formData.selectedCourses.includes(course)}
                    onChange={() => handleCourseToggle(course)}
                  />
                  <label htmlFor={`course-${course}`}>{course}</label>
                </div>
              ))}
            </div>
            {errors.selectedCourses && <span className="error-message">{errors.selectedCourses}</span>}
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddStudentModal;