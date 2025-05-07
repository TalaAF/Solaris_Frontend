import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import { Upload } from "lucide-react";
import CourseService from "../../services/CourseService";
import "./ContentDialog.css";

const ContentDialog = ({ isOpen, onClose, onSubmit, content, title }) => {
  const initialFormData = content || {
    title: "",
    type: "document",
    courseId: "",
    courseName: "",
    description: "",
    duration: 30,
    isPublished: false,
    file: null
  };

  const [formData, setFormData] = useState(initialFormData);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileError, setFileError] = useState("");
  const [formTouched, setFormTouched] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormData(content || initialFormData);
      setFileSelected(false);
      setFileError("");
      setFormTouched({});
      setFormErrors({});
      fetchCourses();
    }
  }, [isOpen, content]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Get courses from the API
      const response = await CourseService.getCourses();
      
      // Extract courses from the response based on structure
      let coursesList = [];
      if (response.data && response.data.content) {
        coursesList = response.data.content;
      } else if (Array.isArray(response.data)) {
        coursesList = response.data;
      }
      
      setCourses(coursesList);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "title":
        if (!value.trim()) error = "Title is required";
        else if (value.length < 3) error = "Title must be at least 3 characters";
        break;
      case "courseId":
        if (!value) error = "Please select a course";
        break;
      case "file":
        if (!content && !value) error = "Please select a file";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === "number" ? parseInt(value, 10) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
    
    // Mark field as touched
    setFormTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field
    const error = validateField(name, finalValue);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const selectedCourse = courses.find((course) => course.id == courseId);
    
    setFormData(prev => ({
      ...prev,
      courseId,
      courseName: selectedCourse ? selectedCourse.title : "",
    }));
    
    // Mark field as touched
    setFormTouched(prev => ({
      ...prev,
      courseId: true
    }));
    
    // Validate field
    const error = validateField("courseId", courseId);
    setFormErrors(prev => ({
      ...prev,
      courseId: error
    }));
  };

  const handleTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file (size, type, etc.)
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setFileError("File size must be less than 10MB");
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file: file,
      }));
      setFileSelected(true);
      setFileError("");
      
      // Clear file error if there was one
      setFormErrors(prev => ({
        ...prev,
        file: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate required fields
    newErrors.title = validateField("title", formData.title);
    newErrors.courseId = validateField("courseId", formData.courseId);
    
    // Validate file only for new content
    if (!content) {
      newErrors.file = validateField("file", formData.file);
    }
    
    // Check if any errors exist
    for (const error of Object.values(newErrors)) {
      if (error) {
        isValid = false;
        break;
      }
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    for (const key in formData) {
      allTouched[key] = true;
    }
    setFormTouched(allTouched);
    
    if (!validateForm()) {
      return;
    }
    
    // Ensure courseName is set
    if (!formData.courseName && formData.courseId) {
      const selectedCourse = courses.find((course) => course.id == formData.courseId);
      formData.courseName = selectedCourse ? selectedCourse.title : "Unknown Course";
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
            <label htmlFor="title">Content Title*</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${formTouched.title && formErrors.title ? 'error' : ''}`}
              placeholder="Enter content title"
            />
            {formTouched.title && formErrors.title && (
              <div className="error-message">{formErrors.title}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter content description"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Content Type</label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="document"
                  name="type"
                  value="document"
                  checked={formData.type === "document"}
                  onChange={handleTypeChange}
                  className="radio-input"
                />
                <label htmlFor="document" className="radio-label">Document</label>
              </div>
              
              <div className="radio-item">
                <input
                  type="radio"
                  id="video"
                  name="type"
                  value="video"
                  checked={formData.type === "video"}
                  onChange={handleTypeChange}
                  className="radio-input"
                />
                <label htmlFor="video" className="radio-label">Video</label>
              </div>
              
              <div className="radio-item">
                <input
                  type="radio"
                  id="presentation"
                  name="type"
                  value="presentation"
                  checked={formData.type === "presentation"}
                  onChange={handleTypeChange}
                  className="radio-input"
                />
                <label htmlFor="presentation" className="radio-label">Presentation</label>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="courseId">Course*</label>
            <div className="custom-select-wrapper">
              <select
                id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleCourseChange}
                className={`form-select ${formTouched.courseId && formErrors.courseId ? 'error' : ''}`}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            {formTouched.courseId && formErrors.courseId && (
              <div className="error-message">{formErrors.courseId}</div>
            )}
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
            />
          </div>
          
          {/* File upload section */}
          {!content && (
            <div className="form-group">
              <label htmlFor="file">Upload Content File*</label>
              <div className={`file-upload-container ${fileError || (formTouched.file && formErrors.file) ? 'error' : ''}`}>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="file-input"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.mp3,.zip"
                />
                <label htmlFor="file" className="file-upload-label">
                  <Upload size={16} />
                  <span>{fileSelected ? "File Selected" : "Choose File"}</span>
                </label>
              </div>
              {fileError && <div className="error-message">{fileError}</div>}
              {formTouched.file && formErrors.file && !fileError && (
                <div className="error-message">{formErrors.file}</div>
              )}
              <div className="form-helper-text">
                Supported formats: PDF, DOC, PPTX, MP4, ZIP (max 10MB)
              </div>
            </div>
          )}
          
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