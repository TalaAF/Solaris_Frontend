import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import CourseService from "../../services/CourseService";
import { formatDateForInput } from "../../utils/dateUtils";
import "./AssessmentDialog.css";

const QuizDialog = ({ isOpen, onClose, onSubmit, quiz, title }) => {
  const initialFormData = {
    title: "",
    description: "",
    timeLimit: 30,
    startDate: formatDateForInput(new Date()),
    endDate: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days later
    passingScore: 70,
    randomizeQuestions: false,
    published: false,
    courseId: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load courses and set initial form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCourses();
      
      if (quiz) {
        // Format dates for input fields
        const formattedQuiz = {
          ...quiz,
          startDate: quiz.startDate ? formatDateForInput(quiz.startDate) : "",
          endDate: quiz.endDate ? formatDateForInput(quiz.endDate) : ""
        };
        setFormData(formattedQuiz);
      } else {
        setFormData(initialFormData);
      }
      
      setErrors({});
    }
  }, [isOpen, quiz]);

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
    const quizData = {
      ...formData,
      timeLimit: parseInt(formData.timeLimit, 10),
      passingScore: parseFloat(formData.passingScore)
    };
    
    onSubmit(quizData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <form onSubmit={handleSubmit} className="assessment-form">
        <div className="form-group">
          <label htmlFor="title">Quiz Title*</label>
          <input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            className={`form-input ${errors.title ? "error" : ""}`}
            placeholder="Enter quiz title"
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
            placeholder="Enter quiz description"
            rows="3"
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
            {quiz ? 'Update Quiz' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default QuizDialog;