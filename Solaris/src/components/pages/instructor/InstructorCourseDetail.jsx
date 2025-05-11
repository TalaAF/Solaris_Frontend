import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CourseService from '../../../services/CourseService';
import { useCourseContext } from '../../../context/CourseContext';
import LoadingSpinner from '../../common/LoadingSpinner';
import { ChevronLeft, Settings, Users, BookOpen, Edit } from 'lucide-react';
import './InstructorCourseDetail.css';

const InstructorCourseDetail = () => {
  const { id } = useParams(); // Get ID from URL params
  const navigate = useNavigate();
  const { courseData, setCurrentCourse } = useCourseContext();
  const [course, setCourse] = useState(courseData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        
        // Check if we have a valid ID
        if (!id) {
          throw new Error("Course ID is required");
        }

        console.log(`Fetching course with ID: ${id}`);
        
        // Use course from context if available and matching current ID
        if (courseData && courseData.id === parseInt(id, 10)) {
          console.log("Using course data from context");
          setCourse(courseData);
        } else {
          // Otherwise fetch from API
          const response = await CourseService.getCourseById(id);
          
          if (!response || !response.data) {
            throw new Error("Failed to load course details");
          }
          
          // Update both local state and context
          setCourse(response.data);
          setCurrentCourse(response.data);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching course details:", err.message);
        setError(err.message || "Failed to load course details");
        toast.error(err.message || "Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, courseData, setCurrentCourse]);

  const handleEditCourse = () => {
    navigate(`/instructor/courses/${id}/edit`);
  };

  const handleManageStudents = () => {
    navigate(`/instructor/courses/${id}/students`);
  };

  const handleManageContent = () => {
    navigate(`/instructor/courses/${id}/content`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className="solaris-button primary-button"
          onClick={() => navigate("/instructor/courses")}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="error-container">
        <h2>Course Not Found</h2>
        <p>The requested course could not be found.</p>
        <button 
          className="solaris-button primary-button"
          onClick={() => navigate("/instructor/courses")}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="instructor-course-detail">
      {/* Course header */}
      <div className="course-detail-header">
        <button 
          className="back-button" 
          onClick={() => navigate('/instructor/courses')}
        >
          <ChevronLeft size={16} />
          Back to Courses
        </button>
        
        <div className="course-title-container">
          <h1 className="course-title">{course.title}</h1>
          <div className={`course-status ${course.status}`}>
            {course?.status ? (course.status.charAt(0).toUpperCase() + course.status.slice(1)) : 'Unknown'}
          </div>
        </div>
        
        <div className="course-actions">
          <button 
            className="action-button"
            onClick={handleEditCourse}
          >
            <Edit size={16} />
            Edit Course
          </button>
          <button 
            className="action-button"
            onClick={handleManageStudents}
          >
            <Users size={16} />
            Manage Students
          </button>
          <button 
            className="action-button"
            onClick={handleManageContent}
          >
            <BookOpen size={16} />
            Content & Materials
          </button>
        </div>
      </div>

      {/* Course overview */}
      <div className="course-detail-overview">
        <div className="course-card">
          <div className="card-header">
            <h2>Course Overview</h2>
          </div>
          <div className="card-content">
            <div className="course-image-container">
              <img 
                src={course.coverImage || `https://source.unsplash.com/random/800x400?education,${course.id}`} 
                alt={course.title} 
                className="course-detail-image" 
              />
            </div>
            
            <div className="course-description">
              <h3>Description</h3>
              <p>{course.description || "No description available for this course."}</p>
            </div>
            
            <div className="course-meta-grid">
              <div className="meta-item">
                <h4>Students Enrolled</h4>
                <p>{course.enrolledStudents || 0}</p>
              </div>
              <div className="meta-item">
                <h4>Course Progress</h4>
                <p>{course.progress || 0}% Complete</p>
              </div>
              <div className="meta-item">
                <h4>Created</h4>
                <p>{new Date(course.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="meta-item">
                <h4>Last Updated</h4>
                <p>{new Date(course.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseDetail;