import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import { courses } from "../../mocks/mockDataCourses";
import "./ContentDialog.css";

const ContentDialog = ({ isOpen, onClose, onSubmit, content, title }) => {
  const initialFormData = content || {
    title: "",
    type: "lesson",
    courseId: 1,
    courseName: "",
    duration: 30,
    isPublished: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormData(content || initialFormData);
    }
  }, [isOpen, content]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value, 10) : value,
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure courseName is set
    if (!formData.courseName) {
      const selectedCourse = courses.find((course) => course.id === formData.courseId);
      formData.courseName = selectedCourse ? selectedCourse.title : "Unknown Course";
    }
    
    // Add current user as creator if it's a new content
    if (!formData.createdBy) {
      formData.createdBy = "Current User"; // In a real app, use the actual logged-in user
    }
    
    onSubmit(formData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="content-form-container">
        <form onSubmit={handleSubmit} className="content-form">
          <div className="form-group">
            <label htmlFor="title">Content Title</label>
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
            <label>Content Type</label>
            <div className="radio-group">
              <div className="radio-item">
              <label htmlFor="lesson" className="radio-label">Lesson</label>
                <input
                  type="radio"
                  id="lesson"
                  name="type"
                  value="lesson"
                  checked={formData.type === "lesson"}
                  onChange={handleTypeChange}
                  className="radio-input"
                />
               
              </div>
              
              <div className="radio-item">
              <label htmlFor="video" className="radio-label">Video</label>
                <input
                  type="radio"
                  id="video"
                  name="type"
                  value="video"
                  checked={formData.type === "video"}
                  onChange={handleTypeChange}
                  className="radio-input"
                />
                
              </div>
              
              <div className="radio-item">
              <label htmlFor="document" className="radio-label">Document</label>
                <input
                  type="radio"
                  id="document"
                  name="type"
                  value="document"
                  checked={formData.type === "document"}
                  onChange={handleTypeChange}
                  className="radio-input"
                />
                
              </div>
              
              <div className="radio-item">
              <label htmlFor="presentation" className="radio-label">Presentation</label>
                <input
                  type="radio"
                  id="presentation"
                  name="type"
                  value="presentation"
                  checked={formData.type === "presentation"}
                  onChange={handleTypeChange}
                  className="radio-input"
                />
               
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
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
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
              className="form-input"
              required
            />
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
              {content ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default ContentDialog;