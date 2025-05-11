import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, ChevronLeft, Settings, UserRound } from "lucide-react";
import AdminCourseService from "../../../services/AdminCourseService";
import "./CourseDetails.css";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // First check if we have course data from navigation state
    if (location.state?.courseData) {
      console.log("Using course data from navigation state");
      setCourse(location.state.courseData);
      setLoading(false);
      return;
    }
    
    // If no state data, fetch course from API
    fetchCourseFromAPI();
  }, [id, location.state]);

  const fetchCourseFromAPI = async () => {
    setLoading(true);
    try {
      const courseId = parseInt(id);
      const response = await AdminCourseService.getCourse(courseId);
      
      if (response && response.data) {
        console.log("Course fetched from API:", response.data);
        setCourse(response.data);
      } else {
        setError("Failed to load course data");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      setError("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="course-details-loading">
        <div className="spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="course-not-found">
        <div className="not-found-container">
          <h2>{error || "Course Not Found"}</h2>
          <p>The course you're looking for doesn't exist or has been removed.</p>
          <button className="back-button" onClick={() => navigate('/admin/courses')}>
            Return to Course List
          </button>
          {error && (
            <button className="retry-button" onClick={fetchCourseFromAPI}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="course-details-container">
      <div className="course-details-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/admin/courses')}>
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>
          
          <h1 className="course-title">
            {course.title}
            <span className={`status-badge ${(course.isActive || course.published) ? "active" : "inactive"}`}>
              {(course.isActive || course.published) ? "Active" : "Inactive"}
            </span>
          </h1>
        </div>

        <div className="action-buttons">
          <button 
            className="action-button primary"
            onClick={() => navigate(`/admin/courses/${course.id}/students`, {
              state: { courseData: course, returnPath: "/admin/courses" }
            })}
          >
            <UserRound size={18} />
            <span>Manage Students</span>
          </button>
          <button 
            className="action-button"
            onClick={() => navigate(`/admin/courses/${course.id}/settings`, {
              state: { courseData: course }
            })}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </div>
      
      <div className="course-details-card">
        <div className="card-header">
          <BookOpen size={20} className="card-icon" />
          <h2 className="card-title">Course Details</h2>
        </div>
        <div className="card-content">
          <div className="details-grid">
            <div className="details-column">
              <div className="detail-item">
                <h3 className="detail-label">Department</h3>
                <p className="detail-value">{course.departmentName || 'Not specified'}</p>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Instructor</h3>
                <p className="detail-value">{course.instructorName || 'Not assigned'}</p>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Duration</h3>
                <p className="detail-value">
                  {formatDate(course.startDate)} - {formatDate(course.endDate)}
                </p>
              </div>
            </div>
            <div className="details-column">
              <div className="detail-item">
                <h3 className="detail-label">Enrollment</h3>
                <p className="detail-value">
                  {course.enrolledStudents || course.currentEnrollment || 0}/
                  {course.maxCapacity || 0} students
                </p>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Prerequisites</h3>
                <p className="detail-value">
                  {course.prerequisiteCourseIds && course.prerequisiteCourseIds.length > 0
                    ? course.prerequisiteCourseIds.join(", ")
                    : "None"
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="course-description">
            <h3 className="description-label">Description</h3>
            <p className="description-content">{course.description || "No description provided."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;