import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, ChevronLeft, Settings, UserRound } from "lucide-react";
import "./CourseDetails.css";
import api from "../../../services/api";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  console.log("CourseDetails - Location State:", location.state);
  console.log("CourseDetails - ID Param:", id);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Check if we already have the course data from router state
        if (location.state?.courseData) {
          console.log("Using course data from router state:", location.state.courseData);
          setCourse(location.state.courseData);
          setLoading(false);
          return;
        }
        
        console.log("No router state available, fetching course data from API");
        const courseId = parseInt(id);
        
        try {
          // Make sure your API endpoint is correct
          const response = await api.get(`/courses/${courseId}`);
          console.log("API response:", response);
          if (response.data) {
            setCourse(response.data);
          } else {
            console.error("API returned no data for course:", courseId);
            // Maybe set an error state here
          }
        } catch (error) {
          console.error("Error fetching course from API:", error);
          // Consider a more user-friendly error handling approach
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchCourse:", error);
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, location.state]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleManageStudents = () => {
    // Pass the current course data to the students page
    navigate(`/admin/courses/${course.id}/students`, {
      state: { 
        courseData: course,
        returnPath: location.pathname // Store the current path to return to
      }
    });
  };
  
  if (loading) {
    return (
      <div className="course-details-loading">
        <div className="spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="course-not-found">
        <div className="not-found-container">
          <h2>Course Not Found</h2>
          <p>The course you're looking for doesn't exist or has been removed.</p>
          <button className="back-button" onClick={() => navigate('/admin/courses')}>
            Return to Course List
          </button>
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
            <span className={`status-badge ${course.isActive ? "active" : "inactive"}`}>
              {course.isActive ? "Active" : "Inactive"}
            </span>
          </h1>
        </div>

        <div className="action-buttons">
          <button 
            className="action-button primary"
            onClick={handleManageStudents}
          >
            <UserRound size={18} />
            <span>Manage Students</span>
          </button>
          <button 
            className="action-button"
            onClick={() => navigate(`/admin/courses/${course.id}/settings`)}
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
                <p className="detail-value">{course.departmentName}</p>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Instructor</h3>
                <p className="detail-value">{course.instructorName}</p>
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
                <p className="detail-value">{course.enrolledStudents}/{course.maxCapacity} students</p>
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