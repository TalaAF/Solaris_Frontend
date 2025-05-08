import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import CourseService from "../../services/CourseService";
import { formatDateForInput } from "../../utils/dateUtils";
import "./AssessmentDialog.css";

const AssessmentDialog = ({ isOpen, onClose, onSubmit, assessment, title, assessmentType = "quiz" }) => {
  // Initialize form data based on assessment type
  const getInitialFormData = () => {
    const baseFormData = {
      title: "",
      description: "",
      courseId: "",
      published: false
    };

    // Add fields specific to each assessment type
    if (assessmentType === "quiz") {
      return {
        ...baseFormData,
        type: "quiz",
        timeLimit: 30,
        startDate: formatDateForInput(new Date()),
        endDate: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        passingScore: 70,
        randomizeQuestions: false
      };
    } else {
      return {
        ...baseFormData,
        type: "assignment",
        dueDate: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        maxScore: 100
      };
    }
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load courses and set initial form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCourses();
      
      if (assessment) {
        // Format dates for input fields based on assessment type
        let formattedAssessment = { ...assessment };
        
        if (assessmentType === "quiz") {
          formattedAssessment = {
            ...formattedAssessment,
            type: "quiz",
            startDate: assessment.startDate ? formatDateForInput(assessment.startDate) : "",
            endDate: assessment.endDate ? formatDateForInput(assessment.endDate) : ""
          };
        } else {
          formattedAssessment = {
            ...formattedAssessment,
            type: "assignment",
            dueDate: assessment.dueDate ? formatDateForInput(assessment.dueDate) : ""
          };
        }
        
        setFormData(formattedAssessment);
      } else {
        // Reset form for new assessment
        setFormData(getInitialFormData());
      }
      
      setErrors({});
    }
  }, [isOpen, assessment, assessmentType]);

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
    
    // Common validations for both quiz and assignment
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.courseId) {
      newErrors.courseId = "Course is required";
    }
    
    // Quiz-specific validations
    if (assessmentType === "quiz") {
      if (formData.timeLimit <= 0) {
        newErrors.timeLimit = "Time limit must be greater than 0";
      }
      
      if (formData.passingScore < 0 || formData.passingScore > 100) {
        newErrors.passingScore = "Passing score must be between 0 and 100";
      }
      
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        
        if (end <= start) {
          newErrors.endDate = "End date must be after start date";
        }
      }
    } 
    // Assignment-specific validations
    else {
      if (!formData.dueDate) {
        newErrors.dueDate = "Due date is required";
      }
      
      if (!formData.maxScore || formData.maxScore <= 0) {
        newErrors.maxScore = "Max score must be greater than 0";
      }
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
    let submissionData = { ...formData };
    
    if (assessmentType === "quiz") {
      submissionData = {
        ...submissionData,
        timeLimit: parseInt(formData.timeLimit, 10),
        passingScore: parseFloat(formData.passingScore)
      };
    } else {
      submissionData = {
        ...submissionData,
        maxScore: parseInt(formData.maxScore, 10)
      };
    }
    
    onSubmit(submissionData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <form onSubmit={handleSubmit} className="assessment-form">
        <div className="form-group">
          <label htmlFor="title">{assessmentType === "quiz" ? "Quiz" : "Assignment"} Title*</label>
          <input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            className={`form-input ${errors.title ? "error" : ""}`}
            placeholder={`Enter ${assessmentType.toLowerCase()} title`}
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
            placeholder={`Enter ${assessmentType === "quiz" ? "quiz description" : "assignment instructions"}`}
            rows={3}
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
        
        {/* Quiz-specific fields */}
        {assessmentType === "quiz" && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate || ""}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate || ""}
                  onChange={handleChange}
                  className={`form-input ${errors.endDate ? "error" : ""}`}
                />
                {errors.endDate && <div className="error-message">{errors.endDate}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="timeLimit">Time Limit (minutes)*</label>
                <input
                  id="timeLimit"
                  name="timeLimit"
                  type="number"
                  min="1"
                  value={formData.timeLimit || ""}
                  onChange={handleNumberChange}
                  className={`form-input ${errors.timeLimit ? "error" : ""}`}
                />
                {errors.timeLimit && <div className="error-message">{errors.timeLimit}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="passingScore">Passing Score (%)*</label>
                <input
                  id="passingScore"
                  name="passingScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore || ""}
                  onChange={handleNumberChange}
                  className={`form-input ${errors.passingScore ? "error" : ""}`}
                />
                {errors.passingScore && <div className="error-message">{errors.passingScore}</div>}
              </div>
            </div>
            
            <div className="form-check-group">
              <div className="form-check">
                <input
                  id="randomizeQuestions"
                  name="randomizeQuestions"
                  type="checkbox"
                  checked={formData.randomizeQuestions || false}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="randomizeQuestions">Randomize Questions</label>
              </div>
            </div>
          </>
        )}
        
        {/* Assignment-specific fields */}
        {assessmentType === "assignment" && (
          <>
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
          </>
        )}
        
        {/* Common publish checkbox */}
        <div className="form-check-group">
          <div className="form-check">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={formData.published || false}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="published">Published</label>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {assessment ? `Update ${assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)}` : `Create ${assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)}`}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default AssessmentDialog;