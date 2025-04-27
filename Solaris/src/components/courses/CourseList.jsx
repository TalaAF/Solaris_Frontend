import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, Users, BadgeCheck } from 'lucide-react';
import CourseService from '../services/CourseService';
import './CourseList.css';

/**
 * CourseList Component
 * 
 * Displays a list of courses the student is enrolled in
 * and allows filtering and searching through them.
 * 
 * @param {string} searchTerm - Search term from parent component
 * @param {string} departmentFilter - Department filter from parent component
 * @param {string} semesterFilter - Semester filter from parent component
 */
function CourseList({ searchTerm = '', departmentFilter = 'all', semesterFilter = 'all' }) {
  // State for course data
  const [activeCourses, setActiveCourses] = useState([]);
  const [archivedCourses, setArchivedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  
  // Get current user ID (in a real app, this would come from auth context)
  const currentUserId = 1; // Example user ID

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Get all courses
        const response = await CourseService.getAllCourses();
        
        // Process and categorize courses
        if (response.data && response.data._embedded && response.data._embedded.entityModelList) {
          const allCourses = response.data._embedded.entityModelList;
          
          // Transform backend data to match frontend structure
          const transformedCourses = allCourses.map(course => ({
            id: course.id,
            title: course.title,
            code: `CODE${course.id}`, // Generate a code if backend doesn't provide one
            description: course.description,
            department: course.departmentName || 'General',
            semester: determineSemester(course), // Helper function to determine semester
            credits: 3, // Default if not provided by backend
            instructor: course.instructorEmail,
            enrolled: course.currentEnrollment || 0,
            progress: calculateProgress(course), // Calculate progress from backend data
            imageUrl: getPlaceholderImage(course), // Helper to get image URL
            status: determineStatus(course), // Helper to determine status
            grade: course.averageRating ? `${convertToLetterGrade(course.averageRating)}` : null
          }));
          
          // Separate active and archived courses
          setActiveCourses(transformedCourses.filter(course => !course.isArchived));
          setArchivedCourses(transformedCourses.filter(course => course.isArchived));
        } else {
          setActiveCourses([]);
          setArchivedCourses([]);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Helper function to determine semester based on dates
  const determineSemester = (course) => {
    if (!course.startDate) return 'Fall 2023';
    
    const startDate = new Date(course.startDate);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    
    if (month >= 0 && month <= 4) return `Spring ${year}`;
    if (month >= 5 && month <= 7) return `Summer ${year}`;
    return `Fall ${year}`;
  };

  // Helper function to calculate progress
  const calculateProgress = (course) => {
    // In a real implementation, this would use actual progress data
    return Math.floor(Math.random() * 100); // Placeholder random progress
  };

  // Helper function to get placeholder image
  const getPlaceholderImage = (course) => {
    // In a real implementation, this would use actual course images
    return `https://source.unsplash.com/random/300x200?${encodeURIComponent(course.title)}`;
  };

  // Helper function to determine course status
  const determineStatus = (course) => {
    // In a real implementation, this would use actual course status
    if (course.isArchived) return 'completed';
    
    const progress = calculateProgress(course);
    if (progress > 0) return 'in-progress';
    return 'upcoming';
  };

  // Helper function to convert numerical grade to letter grade
  const convertToLetterGrade = (grade) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  // Filter active courses based on search term and filters
  const filteredActiveCourses = activeCourses.filter(course => {
    return (
      (searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (departmentFilter === 'all' || course.department === departmentFilter) &&
      (semesterFilter === 'all' || course.semester === semesterFilter)
    );
  });
  
  // Filter archived courses based on search term and filters
  const filteredArchivedCourses = archivedCourses.filter(course => {
    return (
      (searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (departmentFilter === 'all' || course.department === departmentFilter) &&
      (semesterFilter === 'all' || course.semester === semesterFilter)
    );
  });

  if (loading) {
    return <div className="courses-loading">Loading courses...</div>;
  }

  if (error) {
    return <div className="courses-error">{error}</div>;
  }

  return (
    <div className="courses-container">
      {/* Tabs */}
      <div className="courses-tabs">
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Courses
        </button>
        <button 
          className={`tab-button ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
        >
          Completed Courses
        </button>
      </div>
      
      {/* Active Courses Tab */}
      {activeTab === 'active' && (
        <>
          {filteredActiveCourses.length === 0 ? (
            <div className="empty-courses">
              <div className="empty-icon">
                <BookOpen />
              </div>
              <h3 className="empty-title">No courses found</h3>
              <p className="empty-message">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="course-grid">
              {filteredActiveCourses.map(course => (
                <Link to={`/courses/${course.id}`} key={course.id} className="course-card-link">
                  <div className="course-card">
                    <div 
                      className="course-image" 
                      style={{ backgroundImage: `url(${course.imageUrl})` }}
                    >
                      <div className="course-image-overlay">
                        <span className="course-code">{course.code}</span>
                        <h5 className="course-title">{course.title}</h5>
                      </div>
                    </div>
                    <div className="course-content">
                      <div className="course-info">
                        <div>
                          <div className="course-department">{course.department}</div>
                          <div className="course-instructor">{course.instructor}</div>
                        </div>
                        <div className={`course-status status-${course.status}`}>
                          {course.status === 'in-progress' ? 'In Progress' : 
                           course.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </div>
                      </div>
                      
                      {course.status === 'in-progress' && (
                        <div className="course-progress">
                          <div className="progress-bar-container">
                            <div 
                              className="progress-bar" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="progress-text">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                        </div>
                      )}
                      
                      <p className="course-description">
                        {course.description}
                      </p>
                      
                      <div className="course-meta">
                        <div className="meta-item">
                          <Calendar className="meta-icon" />
                          <span>{course.semester}</span>
                        </div>
                        <div className="meta-item">
                          <Clock className="meta-icon" />
                          <span>{course.credits} Credits</span>
                        </div>
                        <div className="meta-item">
                          <Users className="meta-icon" />
                          <span>{course.enrolled}</span>
                        </div>
                      </div>
                      
                      <button className="course-action">
                        {course.status === 'in-progress' ? 'Continue Learning' : 
                         course.status === 'upcoming' ? 'View Details' : 'Review Course'}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Archived Courses Tab */}
      {activeTab === 'archived' && (
        <>
          {filteredArchivedCourses.length === 0 ? (
            <div className="empty-courses">
              <div className="empty-icon">
                <BookOpen />
              </div>
              <h3 className="empty-title">No completed courses found</h3>
              <p className="empty-message">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="course-grid">
              {filteredArchivedCourses.map(course => (
                <Link to={`/courses/${course.id}`} key={course.id} className="course-card-link">
                  <div className="course-card archived">
                    <div 
                      className="course-image grayscale" 
                      style={{ backgroundImage: `url(${course.imageUrl})` }}
                    >
                      <div className="course-image-overlay">
                        <span className="course-code">{course.code}</span>
                        <h3 className="course-title">{course.title}</h3>
                      </div>
                      <div className="completed-badge">
                        <BadgeCheck className="completed-icon" />
                        <span>Completed</span>
                      </div>
                    </div>
                    <div className="course-content">
                      <div className="course-info">
                        <div>
                          <div className="course-department">{course.department}</div>
                          <div className="course-instructor">{course.instructor}</div>
                        </div>
                        {course.grade && (
                          <div className="course-grade">
                            Grade: {course.grade}
                          </div>
                        )}
                      </div>
                      
                      <p className="course-description">
                        {course.description}
                      </p>
                      
                      <div className="course-meta">
                        <div className="meta-item">
                          <Calendar className="meta-icon" />
                          <span>{course.semester}</span>
                        </div>
                        <div className="meta-item">
                          <Clock className="meta-icon" />
                          <span>{course.credits} Credits</span>
                        </div>
                      </div>
                      
                      <button className="course-action secondary">
                        View Course
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CourseList;