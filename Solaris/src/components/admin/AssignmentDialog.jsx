import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import CourseService from "../../services/CourseService";
import { formatDateForInput } from "../../utils/dateUtils";
import "./AssessmentDialog.css";

const AssignmentDialog = ({ isOpen, onClose, onSubmit, assignment, title }) => {
  const initialFormData = {
    title: "",
    description: "",
    courseId: "",
    dueDate: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days later
    maxScore: 100
  };

  const [formData, setFormData] = useState(initialFormData);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load courses and set initial form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCourses();
      
      if (assignment) {
        // Format date for input field
        const formattedAssignment = {
          ...assignment,
          dueDate: assignment.dueDate ? formatDateForInput(assignment.dueDate) : ""
        };
        setFormData(formattedAssignment);
      } else {
        setFormData(initialFormData);
      }
      
      setErrors({});
    }
  }, [isOpen, assignment]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await CourseService.getCourses();
      
      // Extract courses depending on the response structure
      let courseList = [];
      if (response.data && response.data.content) {
        courseList = response.data.content;
      } else if (Array.isArray(response.data)) {
        courseList = response.data;
      }
      
      setCourses(courseList);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.courseId) {
      newErrors.courseId = "Course is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const dueDate = new Date(formData.dueDate);
      const now = new Date();
      if (dueDate < now) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }
    
    if (!formData.maxScore || formData.maxScore <= 0) {
      newErrors.maxScore = "Max score must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : Number(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert form data to match API expectations
    const assignmentData = {
      ...formData,
      maxScore: parseInt(formData.maxScore, 10)
    };
    
    onSubmit(assignmentData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <form onSubmit={handleSubmit} className="assessment-form">
        <div className="form-group">
          <label htmlFor="title">Assignment Title*</label>
          <input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            className={`form-input ${errors.title ? "error" : ""}`}
            placeholder="Enter assignment title"
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Enter assignment instructions"
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="courseId">Course*</label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId || ""}
            onChange={handleChange}
            className={`form-select ${errors.courseId ? "error" : ""}`}
            disabled={loading}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          {errors.courseId && <div className="error-message">{errors.courseId}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date*</label>
            <input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate || ""}
              onChange={handleChange}
              className={`form-input ${errors.dueDate ? "error" : ""}`}
            />
            {errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="maxScore">Max Score*</label>
            <input
              id="maxScore"
              name="maxScore"
              type="number"
              min="1"
              value={formData.maxScore || ""}
              onChange={handleNumberChange}
              className={`form-input ${errors.maxScore ? "error" : ""}`}
            />
            {errors.maxScore && <div className="error-message">{errors.maxScore}</div>}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {assignment ? 'Update Assignment' : 'Create Assignment'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default AssignmentDialog;