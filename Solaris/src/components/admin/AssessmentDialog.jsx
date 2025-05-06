import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import { courses } from "../../mocks/mockDataCourses";
import "./AssessmentDialog.css";

const AssessmentDialog = ({ isOpen, onClose, onSave, assessment, title }) => {
  const initialFormData = assessment || {
    title: "",
    description: "",
    type: "quiz",
    courseId: courses[0]?.id || 1,
    courseName: "",
    dueDate: new Date().toISOString().split("T")[0],
    totalPoints: 100,
    passingPoints: 60,
    duration: 60,
    isPublished: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormData(assessment || initialFormData);
      setErrors({});
    }
  }, [isOpen, assessment]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value, 10) : value,
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

  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      type: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (!formData.totalPoints || formData.totalPoints < 1) {
      newErrors.totalPoints = "Total points must be at least 1";
    }

    if (formData.passingPoints < 0 || formData.passingPoints > formData.totalPoints) {
      newErrors.passingPoints = "Passing points must be between 0 and total points";
    }

    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = "Duration must be at least 1 minute";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Ensure courseName is set
    if (!formData.courseName) {
      const selectedCourse = courses.find((course) => course.id === formData.courseId);
      formData.courseName = selectedCourse ? selectedCourse.title : "Unknown Course";
    }
    
    onSave(formData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <form onSubmit={handleSubmit} className="assessment-form">
        <div className="form-group">
          <label htmlFor="title">Assessment Title</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? "error" : ""}`}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-textarea ${errors.description ? "error" : ""}`}
            rows="4"
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-group">
          <label>Assessment Type</label>
          <div className="radio-group">
            <div className="radio-item">
              <input
                type="radio"
                id="quiz"
                name="type"
                value="quiz"
                checked={formData.type === "quiz"}
                onChange={handleTypeChange}
                className="radio-input"
              />
              <label htmlFor="quiz" className="radio-label">Quiz</label>
            </div>
            
            <div className="radio-item">
              <input
                type="radio"
                id="exam"
                name="type"
                value="exam"
                checked={formData.type === "exam"}
                onChange={handleTypeChange}
                className="radio-input"
              />
              <label htmlFor="exam" className="radio-label">Exam</label>
            </div>
            
            <div className="radio-item">
              <input
                type="radio"
                id="assignment"
                name="type"
                value="assignment"
                checked={formData.type === "assignment"}
                onChange={handleTypeChange}
                className="radio-input"
              />
              <label htmlFor="assignment" className="radio-label">Assignment</label>
            </div>
          </div>
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
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className={`form-input ${errors.dueDate ? "error" : ""}`}
            />
            {errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              className={`form-input ${errors.duration ? "error" : ""}`}
            />
            {errors.duration && <div className="error-message">{errors.duration}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="totalPoints">Total Points</label>
            <input
              id="totalPoints"
              name="totalPoints"
              type="number"
              min="1"
              value={formData.totalPoints}
              onChange={handleChange}
              className={`form-input ${errors.totalPoints ? "error" : ""}`}
            />
            {errors.totalPoints && <div className="error-message">{errors.totalPoints}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="passingPoints">Passing Points</label>
            <input
              id="passingPoints"
              name="passingPoints"
              type="number"
              min="0"
              value={formData.passingPoints}
              onChange={handleChange}
              className={`form-input ${errors.passingPoints ? "error" : ""}`}
            />
            {errors.passingPoints && <div className="error-message">{errors.passingPoints}</div>}
          </div>
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
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {assessment ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default AssessmentDialog;