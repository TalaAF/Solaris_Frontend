import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, Users, BadgeCheck } from 'lucide-react';
import CourseService from '../../services/CourseService';
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
        // Get the current user ID from auth context or local storage
        const currentUserId = localStorage.getItem('userId') || 1; // Fallback to 1 for testing
        
        console.log(`Fetching enrollments for student ID: ${currentUserId}`);
        
        // Step 1: Get all enrollments for the student
        const enrollmentsResponse = await CourseService.getStudentEnrollments(currentUserId);
        console.log("Enrollments response:", enrollmentsResponse);
        
        if (!enrollmentsResponse?.data) {
          throw new Error("No enrollment data returned");
        }
        
        const enrollments = Array.isArray(enrollmentsResponse.data) 
          ? enrollmentsResponse.data 
          : enrollmentsResponse.data._embedded?.enrollmentDTOList || [];
        
        console.log("Processed enrollments:", enrollments);
        
        if (enrollments.length === 0) {
          setActiveCourses([]);
          setArchivedCourses([]);
          return;
        }
        
        // Step 2: Fetch full course details for each enrollment
        const coursePromises = enrollments.map(enrollment => 
          CourseService.getCourseById(enrollment.courseId)
            .then(resp => {
              const courseData = resp.data;
              
              // Merge course data with enrollment data
              return {
                id: courseData.id,
                title: courseData.title || courseData.name || enrollment.courseName || 'Untitled Course',
                code: courseData.code || `COURSE-${courseData.id}`,
                description: courseData.description || 'No description available',
                department: courseData.department || courseData.departmentName || 'General',
                semester: courseData.semester || (courseData.startDate ? determineSemester(courseData) : 'Current Term'),
                credits: courseData.credits || 3,
                instructor: courseData.instructor?.name || courseData.instructorName || 'Unknown',
                enrolled: courseData.enrolledCount || courseData.currentEnrollment || 0,
                
                // Use enrollment-specific data for student progress
                progress: enrollment.progress || 0,
                status: getStatusFromEnrollment(enrollment.status),
                grade: enrollment.grade || null,
                lastAccessed: enrollment.lastAccessDate,
                enrollmentDate: enrollment.enrollmentDate,
                isArchived: enrollment.status === 'COMPLETED' || enrollment.status === 'DROPPED',
                
                // Visual elements
                imageUrl: courseData.imageUrl || `https://source.unsplash.com/random/300x200?${encodeURIComponent(courseData.title || 'education')}`
              };
            })
            .catch(err => {
              console.error(`Error fetching details for course ${enrollment.courseId}:`, err);
              // Create a fallback object with enrollment data only
              return {
                id: enrollment.courseId,
                title: enrollment.courseName || `Course #${enrollment.courseId}`,
                code: `COURSE-${enrollment.courseId}`,
                description: 'Course details could not be loaded',
                department: 'Unknown',
                semester: 'Current Term',
                progress: enrollment.progress || 0,
                status: getStatusFromEnrollment(enrollment.status),
                grade: enrollment.grade || null,
                isArchived: enrollment.status === 'COMPLETED' || enrollment.status === 'DROPPED',
                imageUrl: `https://source.unsplash.com/random/300x200?education`
              };
            })
        );
        
        // Wait for all course data to be fetched
        const coursesData = await Promise.all(coursePromises);
        console.log("Transformed courses with enrollment data:", coursesData);
        
        // Separate active and archived courses
        setActiveCourses(coursesData.filter(course => !course.isArchived));
        setArchivedCourses(coursesData.filter(course => course.isArchived));
        
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to load your enrolled courses. Please try again later.');
        
        // Use example data for development as fallback
        const exampleCourses = [
          {
            id: 1,
            title: "Introduction to React",
            description: "Learn the fundamentals of React development",
            department: "Computer Science",
            semester: "Spring 2025",
            credits: 3,
            instructor: "John Smith",
            enrolled: 24,
            progress: 65,
            status: "in-progress",
            imageUrl: "https://source.unsplash.com/random/300x200?react"
          },
          {
            id: 2,
            title: "Advanced Web Development",
            description: "Master modern web development techniques",
            department: "Computer Science",
            semester: "Spring 2025",
            credits: 4,
            instructor: "Jane Doe",
            enrolled: 18,
            progress: 30,
            status: "in-progress",
            imageUrl: "https://source.unsplash.com/random/300x200?web"
          },
          {
            id: 3,
            title: "UI/UX Design Principles",
            description: "Learn how to create intuitive user interfaces",
            department: "Design",
            semester: "Fall 2024",
            credits: 3,
            instructor: "Michael Johnson",
            enrolled: 32,
            isArchived: true,
            grade: "A",
            imageUrl: "https://source.unsplash.com/random/300x200?design"
          }
        ];
        
        setActiveCourses(exampleCourses.filter(course => !course.isArchived));
        setArchivedCourses(exampleCourses.filter(course => course.isArchived));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Helper function to determine semester based on dates
  const determineSemester = (course) => {
    if (!course.startDate) return 'Spring 2025';
    
    const startDate = new Date(course.startDate);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    
    if (month >= 0 && month <= 4) return `Spring ${year}`;
    if (month >= 5 && month <= 7) return `Summer ${year}`;
    return `Fall ${year}`;
  };

  // Helper function to convert enrollment status to display status
  const getStatusFromEnrollment = (enrollmentStatus) => {
    switch (enrollmentStatus) {
      case 'ACTIVE': return 'in-progress';
      case 'PENDING': return 'upcoming';
      case 'COMPLETED': return 'completed';
      case 'DROPPED': return 'dropped';
      default: return 'in-progress';
    }
  };

  // Filter active courses based on search term and filters
  const filteredActiveCourses = activeCourses.filter(course => {
    const titleMatch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const codeMatch = course.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const instructorMatch = typeof course.instructor === 'string' ? 
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    
    return (
      (searchTerm === '' || titleMatch || codeMatch || instructorMatch) &&
      (departmentFilter === 'all' || course.department === departmentFilter) &&
      (semesterFilter === 'all' || course.semester === semesterFilter)
    );
  });
  
  // Filter archived courses based on search term and filters
  const filteredArchivedCourses = archivedCourses.filter(course => {
    const titleMatch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const codeMatch = course.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const instructorMatch = typeof course.instructor === 'string' ? 
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    
    return (
      (searchTerm === '' || titleMatch || codeMatch || instructorMatch) &&
      (departmentFilter === 'all' || course.department === departmentFilter) &&
      (semesterFilter === 'all' || course.semester === semesterFilter)
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="courses-loading">Loading courses...</div>;
  }

  if (error && activeCourses.length === 0 && archivedCourses.length === 0) {
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
                      
                      {/* Updated course meta section */}
                      <div className="course-meta">
                        <div className="meta-item">
                          <Calendar className="meta-icon" />
                          <span>{course.semester}</span>
                        </div>
                        <div className="meta-item">
                          <Clock className="meta-icon" />
                          <span>{course.credits} Credits</span>
                        </div>
                        {course.lastAccessed && (
                          <div className="meta-item">
                            <Clock className="meta-icon" />
                            <span>Accessed: {formatDate(course.lastAccessed)}</span>
                          </div>
                        )}
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