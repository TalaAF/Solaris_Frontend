import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArrowUpDown } from 'lucide-react';
import CoursesTabs from './components/CoursesTabs';
import CourseService from '../../../services/CourseService';
import { useAuth } from '../../../context/AuthContext'; // Import auth context if available
import { useCourseContext } from '../../../context/CourseContext';
import EmptyState from '../../common/EmptyState';
import './InstructorCourses.css';

const InstructorCourses = () => {
  // 1. First, initialize courses as an empty array to ensure it's always an array
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('title-asc');
  const navigate = useNavigate();
  const { setCurrentCourse } = useCourseContext();

  // If you have an auth context with user information
  // const { user } = useAuth();
  
  // Count courses by status
  // 2. Update the courseCounts calculation to add defensive checks
  const courseCounts = {
    all: Array.isArray(courses) ? courses.length : 0,
    active: Array.isArray(courses) ? courses.filter(course => course.status === 'active' || course.published).length : 0,
    draft: Array.isArray(courses) ? courses.filter(course => course.status === 'draft' || !course.published).length : 0,
    archived: Array.isArray(courses) ? courses.filter(course => course.status === 'archived' || course.archived).length : 0
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // Call the appropriate CourseService method
        // If your backend expects the instructor ID from the token:
        // const response = await CourseService.getCoursesByInstructor('current');
        
        // Alternative approach if you need to pass a specific ID:
        // const response = await CourseService.getCoursesByInstructor(user.id);
        
        // Option 1: Use the API endpoint that doesn't require an ID parameter
        const response = await CourseService.getAllCourses();
        
        // Option 2: If you have the user context with ID available
        // const { user } = useAuth();
        // const response = await CourseService.getCoursesByInstructor(user.id);
        
        // Option 3: If you have a specific endpoint for instructor's own courses
        // This would be the cleaner approach if available
        // const response = await api.get('/api/instructor/courses');
        
        // 3. Fix the fetchCourses function to ensure we're always setting courses to an array
        if (response && response.data) {
          // Handle different possible API response formats
          let coursesData;
          
          if (Array.isArray(response.data)) {
            // Response data is directly an array
            coursesData = response.data;
          } else if (response.data.content && Array.isArray(response.data.content)) {
            // Response data has a content property that's an array (common in paged responses)
            coursesData = response.data.content;
          } else if (response.data.courses && Array.isArray(response.data.courses)) {
            // Response data has a courses property that's an array
            coursesData = response.data.courses;
          } else {
            // Fallback to empty array if no array can be found
            console.error("Could not find courses array in response:", response.data);
            coursesData = [];
          }
          
          setCourses(coursesData);
          console.log("Courses data:", coursesData);
        } else {
          console.error("Invalid response format:", response);
          setCourses([]);  // Set to empty array
          setError("Failed to load courses: Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching instructor courses:", err);
        setCourses([]);  // Set to empty array on error
        setError(
          err.response?.data?.message || 
          "Failed to load courses. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 4. Also make sure the filter function is using an array
  useEffect(() => {
    if (!Array.isArray(courses)) {
      setFilteredCourses([]);
      return;
    }
    
    let result = [...courses];
    
    // Filter by status (tab)
    if (activeTab !== 'all') {
      if (activeTab === 'active') {
        result = result.filter(course => course.status === 'active' || course.published);
      } else if (activeTab === 'draft') {
        result = result.filter(course => course.status === 'draft' || !course.published);
      } else if (activeTab === 'archived') {
        result = result.filter(course => course.status === 'archived' || course.archived);
      }
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(course =>
        course.title?.toLowerCase().includes(query) ||
        course.code?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    const [field, direction] = sortOption.split('-');
    result.sort((a, b) => {
      let aValue, bValue;
      
      if (field === 'title') {
        aValue = a.title || '';
        bValue = b.title || '';
      } else if (field === 'date') {
        aValue = new Date(a.updatedAt || a.createdAt).getTime();
        bValue = new Date(b.updatedAt || b.createdAt).getTime();
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
  }, [courses, activeTab, searchQuery, sortOption]);

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
          <p className="instructor-subtitle">Manage and organize your courses</p>
        </div>
        <button 
          className="solaris-button primary-button"
          onClick={() => navigate('/instructor/courses/new')}
        >
          <Plus size={16} />
          New Course
        </button>
      </div>
      
      <div className="courses-actions">
        <CoursesTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          courseCounts={courseCounts}
        />
        
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
          
          <div className="sort-container">
            <ArrowUpDown className="sort-icon" size={16} />
            <select 
              className="sort-select"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="title-asc">Name (A-Z)</option>
              <option value="title-desc">Name (Z-A)</option>
              <option value="date-desc">Recently Updated</option>
              <option value="date-asc">Oldest First</option>
              <option value="students-desc">Most Students</option>
              <option value="students-asc">Fewest Students</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredCourses.length === 0 ? (
        <EmptyState 
          title="No courses found"
          description={searchQuery ? "Try adjusting your search term or filter criteria" : "Create your first course to get started"}
          action={
            searchQuery ? null : {
              label: "Create Course",
              onClick: () => navigate('/instructor/courses/new')
            }
          }
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
                  alt={course.title}
                  className="course-image"
                />
                <div className={`course-status ${getStatusClass(course)}`}>
                  {getStatusText(course)}
                </div>
              </div>
              
              <div className="course-content">
                <h2 className="course-title">{course.title}</h2>
                <p className="course-description">
                  {course.description?.length > 100 
                    ? course.description.substring(0, 100) + '...' 
                    : course.description}
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
                  
                  {course.progress !== undefined && (
                    <div className="course-progress">
                      <div className="progress-text">
                        <span>Course Setup</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
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