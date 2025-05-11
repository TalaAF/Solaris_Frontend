import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import AdminCourseService from "../../services/AdminCourseService";
import "./CourseDialog.css";

const CourseDialog = ({ isOpen, onClose, onSubmit, course, title }) => {
  // Initial form state aligned with backend requirements
  const initialFormData = {
    title: "",
    code: "",
    description: "",
    departmentId: null,
    instructorEmail: "",
    maxCapacity: 30,
    isPublished: true, // Using isPublished for consistency
    credits: 3,
    semester: "Spring 2025",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [departments, setDepartments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch departments and instructors when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchDepartmentsAndInstructors();
    }
  }, [isOpen]);

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      if (course) {
        // Create a normalized course object to handle both field naming conventions
        const normalizedCourse = { ...course };
        
        // Handle published/isPublished field
        if (normalizedCourse.published !== undefined && normalizedCourse.isPublished === undefined) {
          normalizedCourse.isPublished = normalizedCourse.published;
        } else if (normalizedCourse.isPublished === undefined) {
          // Default to false if neither field is present
          normalizedCourse.isPublished = false;
        }
        
        // Handle semester/semesterName field
        const semesterValue = normalizedCourse.semester || normalizedCourse.semesterName || '';
        
        // Map normalized data to form fields
        setFormData({
          title: normalizedCourse.title || '',
          description: normalizedCourse.description || '',
          instructorEmail: normalizedCourse.instructorEmail || '',
          departmentId: normalizedCourse.departmentId || '',
          maxCapacity: normalizedCourse.maxCapacity || 30,
          credits: normalizedCourse.credits || 0,
          semester: semesterValue,
          isPublished: normalizedCourse.isPublished,
          code: normalizedCourse.code || '',
        });
      } else {
        // Reset form data for new course
        setFormData({
          title: '',
          description: '',
          instructorEmail: '',
          departmentId: '',
          maxCapacity: 30,
          credits: 3,
          semester: 'Spring 2025', // Set default semester
          isPublished: true, // Default to published
          code: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, course]);

  const fetchDepartmentsAndInstructors = async () => {
    setLoading(true);
    try {
      console.log("Fetching instructors and departments...");
      
      const [deptResponse, instructorResponse] = await Promise.all([
        AdminCourseService.getDepartments(),
        AdminCourseService.getInstructors()
      ]);
      
      // Log the raw response to see what's coming back
      console.log("Raw instructor response:", instructorResponse);
      
      // Check for different data structures from your API
      const instructorData = instructorResponse?.data?.content || 
                            instructorResponse?.data || [];
      
      // Log the extracted data
      console.log("Extracted instructor data:", instructorData);
      console.log(`Found ${Array.isArray(instructorData) ? instructorData.length : 0} instructors`);
      
      setDepartments(deptResponse?.data || []);
      setInstructors(Array.isArray(instructorData) ? instructorData : []);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
    
    // Clear error for the field when it's changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    console.log("Published checkbox changed to:", checked);
    setFormData(prev => ({
      ...prev,
      isPublished: checked
    }));
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value ? parseInt(e.target.value, 10) : null;
    setFormData(prev => ({
      ...prev,
      departmentId
    }));
  };

  const handleInstructorChange = (e) => {
    const instructorId = e.target.value;
    
    // Add safety check for instructors array
    const selectedInstructor = Array.isArray(instructors) 
      ? instructors.find(i => i.id === parseInt(instructorId, 10))
      : null;
    
    setFormData(prev => ({
      ...prev,
      instructorEmail: selectedInstructor ? selectedInstructor.email : ""
    }));
    
    // Clear error if present
    if (errors.instructorEmail) {
      setErrors(prev => ({ ...prev, instructorEmail: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    const descriptionLength = formData.description.trim().length;
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (descriptionLength < 10 || descriptionLength > 2000) {
      newErrors.description = "Description must be between 10 and 2000 characters";
    }
    
    if (!formData.instructorEmail) {
      newErrors.instructorEmail = "Instructor is required";
    }
    
    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    }
    
    if (formData.credits <= 0) {
      newErrors.credits = "Credits must be greater than 0";
    }
    
    if (formData.maxCapacity <= 0) {
      newErrors.maxCapacity = "Maximum capacity must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
   // Create a clean submission object with the exact fields the API expects
  const submissionData = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    instructorEmail: formData.instructorEmail,
    departmentId: formData.departmentId ? parseInt(formData.departmentId, 10) : null,
    maxCapacity: parseInt(formData.maxCapacity, 10) || 30,
    credits: parseInt(formData.credits, 10) || 3,
    
    // Set both published field variations
    isPublished: formData.isPublished,
    published: formData.isPublished,
    
    // Set both semester field variations
    semester: formData.semester,
    semesterName: formData.semester,
    
    // Include code only if it exists
    ...(formData.code && { code: formData.code.trim() })
  };
  
  console.log("Submitting course data:", submissionData);
  onSubmit(submissionData);
};

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Course Details"}
    >
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Course Title *</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`form-input ${errors.title ? 'input-error' : ''}`}
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="code">Course Code</label>
              <input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. CS101"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="semester">Semester *</label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={`form-select ${errors.semester ? 'input-error' : ''}`}
                required
              >
                <option value="">Select a semester</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Summer 2025">Summer 2025</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Spring 2026">Spring 2026</option>
              </select>
              {errors.semester && <div className="error-message">{errors.semester}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="credits">Credits *</label>
              <input
                id="credits"
                name="credits"
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={handleChange}
                className={`form-input ${errors.credits ? 'input-error' : ''}`}
                required
              />
              {errors.credits && <div className="error-message">{errors.credits}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              required
            />
            <div className="form-input-meta">
              <span className={formData.description.length < 10 ? "text-warning" : ""}>
                {formData.description.length}/2000 characters
              </span>
            </div>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="instructor">Instructor *</label>
              <select
                id="instructor"
                name="instructor"
                value={
                  Array.isArray(instructors) && formData.instructorEmail
                    ? (instructors.find(i => i.email === formData.instructorEmail)?.id || "")
                    : ""
                }
                onChange={handleInstructorChange}
                className={`form-select ${errors.instructorEmail ? 'input-error' : ''}`}
                required
              >
                <option value="">Select an instructor</option>
                {Array.isArray(instructors) && instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.firstName} {instructor.lastName} ({instructor.email})
                  </option>
                ))}
              </select>
              {errors.instructorEmail && <div className="error-message">{errors.instructorEmail}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.departmentId || ""}
                onChange={handleDepartmentChange}
                className="form-select"
              >
                <option value="">Select a department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
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
              className={`form-input ${errors.maxCapacity ? 'input-error' : ''}`}
              required
            />
            {errors.maxCapacity && <div className="error-message">{errors.maxCapacity}</div>}
          </div>
          
          <div className="form-check">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleCheckboxChange}
              className="form-checkbox"
            />
            <label htmlFor="isPublished">Published</label>
            <span className="form-check-description">
              When published, students can view and enroll in this course.
            </span>
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
      )}
    </Dialog>
  );
};

export default CourseDialog;