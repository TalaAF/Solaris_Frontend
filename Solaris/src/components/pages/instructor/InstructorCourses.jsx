import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown } from 'lucide-react';
import CourseService from '../../../services/CourseService';
import { useAuth } from '../../../context/AuthContext';
import { useCourseContext } from '../../../context/CourseContext';
import EmptyState from '../../common/EmptyState';
import './InstructorCourses.css';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('title-asc');
  const navigate = useNavigate();
  
  // Get auth context
  const { currentUser } = useAuth();
  
  // Get course context
  const { setCurrentCourse } = useCourseContext();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // Check authentication
        if (!currentUser) {
          setError("You must be logged in to view courses");
          setLoading(false);
          return;
        }
        
        if (!currentUser.email) {
          setError("User profile incomplete. Email is required.");
          setLoading(false);
          return;
        }
        
        // Simple approach: Get all courses and filter them
        const response = await CourseService.getCourses(0, 1000); // Get a large number to ensure we get all
        
        if (response && response.data) {
          // Handle different possible API response formats
          let coursesData;
          
          if (Array.isArray(response.data)) {
            coursesData = response.data;
          } else if (response.data.content && Array.isArray(response.data.content)) {
            coursesData = response.data.content;
          } else if (response.data.courses && Array.isArray(response.data.courses)) {
            coursesData = response.data.courses;
          } else {
            console.error("Could not find courses array in response:", response.data);
            coursesData = [];
          }
          
          // Filter for courses where this user is the instructor
          const instructorCourses = coursesData.filter(course => {
            // Check various ways the instructor might be specified in the course object
            if (course.instructor === currentUser.email) return true;
            if (course.instructorEmail === currentUser.email) return true;
            if (course.instructor?.email === currentUser.email) return true;
            if (course.instructor?.id === currentUser.id) return true;
            
            // Check instructors array if it exists
            if (Array.isArray(course.instructors)) {
              return course.instructors.some(instructor => 
                instructor === currentUser.email ||
                instructor.email === currentUser.email || 
                instructor.id === currentUser.id
              );
            }
            
            return false;
          });
          
          console.log(`Found ${instructorCourses.length} courses for instructor ${currentUser.email}`);
          setCourses(instructorCourses);
        } else {
          console.error("Invalid response format:", response);
          setCourses([]);
          setError("Failed to load assigned courses: Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching instructor courses:", err);
        setCourses([]);
        setError(
          err.response?.data?.message || err.message || 
          "Failed to load instructor courses. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentUser]);

  useEffect(() => {
    if (!Array.isArray(courses)) {
      setFilteredCourses([]);
      return;
    }
    
    let result = [...courses];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(course =>
        (course.title || '').toLowerCase().includes(query) ||
        (course.code || '').toLowerCase().includes(query) ||
        (course.description || '').toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    const [field, direction] = sortOption.split('-');
    result.sort((a, b) => {
      let aValue, bValue;
      
      if (field === 'title') {
        aValue = (a.title || '').toLowerCase();
        bValue = (b.title || '').toLowerCase();
      } else if (field === 'date') {
        aValue = new Date(a.updatedAt || a.createdAt || 0).getTime();
        bValue = new Date(b.updatedAt || b.createdAt || 0).getTime();
      } else if (field === 'students') {
        aValue = a.enrolledStudents || 0;
        bValue = b.enrolledStudents || 0;
      }
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredCourses(result);
  }, [courses, searchQuery, sortOption]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCourseClick = (course) => {
    // Store course in context before navigating
    setCurrentCourse(course);
    navigate(`/instructor/courses/${course.id}`);
  };

  // Function to get appropriate status class
  const getStatusClass = (course) => {
    if (course.archived || course.status === 'archived') return 'archived';
    if (course.published || course.status === 'active') return 'active';
    return 'draft';
  };

  // Function to get status text
  const getStatusText = (course) => {
    if (course.archived || course.status === 'archived') return 'Archived';
    if (course.published || course.status === 'active') return 'Active';
    return 'Draft';
  };

  if (loading) {
    return (
      <div className="instructor-courses loading">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="instructor-courses error">
        <h2>Error Loading Courses</h2>
        <p>{error}</p>
        <button 
          className="solaris-button primary-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="instructor-courses">
      <div className="instructor-dashboard-header">
        <div>
          <h1 className="instructor-title">My Courses</h1>
          <p className="instructor-subtitle">Courses you are assigned to teach</p>
        </div>
      </div>
      
      <div className="courses-actions">
        <div className="search-filter-controls">
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
         
        </div>
      </div>
      
      {filteredCourses.length === 0 ? (
        <EmptyState 
          title="No teaching assignments found"
          description={searchQuery ? "Try adjusting your search term" : "You are not currently assigned to teach any courses"}
          icon="File"
        />
      ) : (
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div 
              key={course.id} 
              className="course-card"
              onClick={() => handleCourseClick(course)}
            >
              <div className="course-image-container">
                <img 
                  src={course.coverImage || `https://source.unsplash.com/random/300x200?medicine,education`}
                  alt={course.title || 'Course'}
                  className="course-image"
                />
                <div className={`course-status ${getStatusClass(course)}`}>
                  {getStatusText(course)}
                </div>
              </div>
              
              <div className="course-content">
                <h2 className="course-title">{course.title || 'Untitled Course'}</h2>
                <p className="course-description">
                  {course.description 
                    ? (course.description.length > 100 
                        ? course.description.substring(0, 100) + '...' 
                        : course.description)
                    : 'No description available'}
                </p>
                
                <div className="course-meta">
                  <div className="course-stats">
                    <div className="course-stat">
                      <span>Students: {course.enrolledStudents || 0}</span>
                    </div>
                    <div className="course-stat">
                      <span>Last updated: {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;