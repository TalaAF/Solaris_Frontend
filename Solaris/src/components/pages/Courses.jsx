import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Search, Filter, BookOpen, Users, BadgeCheck } from "lucide-react";
import CourseService from '../../services/CourseService';
import "./Courses.css";

function Courses() {

   const DEFAULT_COURSE_IMAGES = [
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80", // Medical students
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80", // Stethoscope with books
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80", // Medical lab
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80", // ECG/EKG
    "https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80", // Medical education concept
    "https://images.unsplash.com/photo-1583912086096-8c60d75a13de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80"  // Anatomy model
  ];
  
  // Helper function to get a default image based on course info
  const getDefaultCourseImage = (course) => {
    // Generate a deterministic index based on course ID to always get the same image for the same course
    const index = course.id ? (Number(course.id) % DEFAULT_COURSE_IMAGES.length) : 0;
    
    // Always return a default image based on the course ID, ignoring any existing imageUrl
    return DEFAULT_COURSE_IMAGES[index];
  };
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Course data states
  const [activeCourses, setActiveCourses] = useState([]);
  const [archivedCourses, setArchivedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  // Fetch departments and semesters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Try to fetch departments from API
        const deptResponse = await CourseService.getAllCourses();
        console.log("Department response:", deptResponse);
        
        // Handle different response formats
        let coursesData = [];
        
        if (deptResponse?.data) {
          // Check what format the data is in
          if (Array.isArray(deptResponse.data)) {
            coursesData = deptResponse.data;
          } else if (deptResponse.data._embedded?.courseList) {
            coursesData = deptResponse.data._embedded.courseList;
          } else if (typeof deptResponse.data === 'object') {
            // If it's a single course object
            coursesData = [deptResponse.data];
          } else {
            console.warn("Unexpected data format returned from getAllCourses()");
          }
        }
        
        // Extract unique departments from courses
        const uniqueDepartments = [...new Set(
          coursesData
            .map(course => course?.department || course?.departmentName)
            .filter(Boolean)
        )].sort();
        
        setDepartments(uniqueDepartments.map((name, id) => ({ id: id+1, name })));
        
        // Get unique semesters from courses
        const uniqueSemesters = [...new Set(
          coursesData
            .map(course => course?.semester || course?.semesterName)
            .filter(Boolean)
        )].sort();
        
        setSemesters(uniqueSemesters.length > 0 ? uniqueSemesters : [
          "Fall 2024",
          "Spring 2025",
          "Fall 2025",
          "Spring 2026"
        ]);
      } catch (err) {
        console.error("Error fetching filter data:", err);
        // Fallback data
        setDepartments([
          { id: 1, name: "Anatomy" },
          { id: 2, name: "Biochemistry" },
          { id: 3, name: "Pathology" },
          { id: 4, name: "Medical Humanities" },
          { id: 5, name: "Clinical Sciences" },
        ]);

        setSemesters([
          "Fall 2024",
          "Spring 2025",
          "Fall 2025", 
          "Spring 2026"
        ]);
      }
    };

    fetchFilters();
  }, []);

  // Fetch courses from API using proper service method
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Get the current user ID from auth context or local storage
        const currentUserId = localStorage.getItem('userId') || 1; // Fallback to 1 for testing
        
        console.log(`Fetching courses with progress for student ID: ${currentUserId}`);
        
        // Try alternative endpoints if the main one fails
        let coursesResponse;
        try {
          coursesResponse = await CourseService.getCoursesWithProgress(currentUserId);
        } catch (primaryError) {
          console.log("Primary endpoint failed, trying fallback:", primaryError);
          
          // Try a fallback method if available
          coursesResponse = await CourseService.getStudentEnrollments(currentUserId);
        }
        
        console.log("Courses response:", coursesResponse);
        
        if (!coursesResponse?.data) {
          throw new Error("No course data returned");
        }
        
        // Process courses based on the API response format - handle different structures
        let courses = [];
        
        if (Array.isArray(coursesResponse.data)) {
          courses = coursesResponse.data;
        } else if (coursesResponse.data._embedded?.entityModelList) {
          courses = coursesResponse.data._embedded.entityModelList;
        } else if (coursesResponse.data._embedded?.enrollmentDTOList) {
          courses = coursesResponse.data._embedded.enrollmentDTOList;
        } else if (typeof coursesResponse.data === 'object') {
          // It might be a single course or a different structure
          console.log("Single object returned for courses, examining structure");
          
          // Try to find arrays in the response
          for (const key in coursesResponse.data) {
            if (Array.isArray(coursesResponse.data[key])) {
              console.log(`Found array in response.data.${key}`);
              courses = coursesResponse.data[key];
              break;
            }
          }
          
          // If we still didn't find an array, use the object itself
          if (courses.length === 0 && coursesResponse.data.id) {
            courses = [coursesResponse.data];
          }
        }
        
        console.log("Processed courses:", courses);
        
        // Transform course data to match our component needs
        const processedCourses = courses.map(course => {
          // Debugging for this specific course
          console.log("Processing course:", course);
          
          // Handle nested objects better
          const instructorName = course.instructor?.name || 
            course.instructorName || 
            (typeof course.instructor === 'string' ? course.instructor : null) ||
            'Unknown';
            
          // Extract department info (could be in various places)
          const departmentInfo = course.department || 
            course.departmentName || 
            course.departmentInfo?.name ||
            (course.courseInfo?.department || 'General');
            
          return {
            id: course.id || course.courseId,
            title: course.title || course.name || course.courseName || 'Untitled Course',
            
            // For code field - explicitly handle null value
            code: (course.code !== null && course.code !== undefined) ? course.code : `COURSE-${course.id}`,
            
            description: course.description || 'No description available',
            
            // For department - use departmentName directly as your API has this field
            department: course.departmentName || departmentInfo || 'General',
            
            // For semester - use startDate since your JSON example has it but semester is null
            semester: course.semester || 
              course.semesterName || 
              (course.startDate ? determineSemester(course) : 'Current Term'),
            
            // For credits - use a default if null (your API shows credits as null)
            credits: (course.credits !== null && course.credits !== undefined) ? 
              course.credits : 3,
            
            // For instructor - use instructorName directly as your API has this field
            instructor: course.instructorName || instructorName,
            
            // For enrollment - use currentEnrollment as shown in your API
            enrolled: course.currentEnrollment || course.enrolled || 0,
            
            progress: course.progress || 0,
            status: determineStatus(course) || 'in-progress',
            grade: course.grade || null,
            lastAccessed: course.lastAccessDate,
            enrollmentDate: course.enrollmentDate,
            isArchived: course.archived || false,
            imageUrl: course.imageUrl || `https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80?${encodeURIComponent(course.title || 'education')}`
          };
        });
        
        // Add this after your courses are processed, before setting activeCourses
        console.log("FINAL PROCESSED COURSES:", processedCourses);
        if (processedCourses.length > 0) {
          console.log("SAMPLE COURSE FIELDS:");
          console.log("- title:", processedCourses[0].title);
          console.log("- code:", processedCourses[0].code);
          console.log("- department:", processedCourses[0].department);
          console.log("- instructor:", processedCourses[0].instructor);
          console.log("- credits:", processedCourses[0].credits);
          console.log("- semester:", processedCourses[0].semester);
        }
        
        // Separate active and archived courses
        setActiveCourses(processedCourses.filter(course => !course.isArchived));
        setArchivedCourses(processedCourses.filter(course => course.isArchived));
        
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to load your enrolled courses. Please try again later.');
        
        // Use example data for development as fallback
        const exampleCourses = [
          {
            id: 1,
            title: "Introduction to React",
            code: "COMP-301",
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
            code: "COMP-401",
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
            code: "DESIGN-201",
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

  // Helper functions
  const determineSemester = (course) => {
    if (!course.startDate) return 'Spring 2025';
    
    const startDate = new Date(course.startDate);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    
    if (month >= 0 && month <= 4) return `Spring ${year}`;
    if (month >= 5 && month <= 7) return `Summer ${year}`;
    return `Fall ${year}`;
  };

  const determineSemesterFromDates = (startDate, endDate) => {
    if (!startDate) return 'Current Term';
    
    const start = new Date(startDate);
    const year = start.getFullYear();
    const month = start.getMonth();
    
    if (month >= 0 && month <= 4) return `Spring ${year}`;
    if (month >= 5 && month <= 7) return `Summer ${year}`;
    return `Fall ${year}`;
  };

  const getStatusFromEnrollment = (enrollmentStatus) => {
    switch (enrollmentStatus) {
      case 'ACTIVE': return 'in-progress';
      case 'PENDING': return 'upcoming';
      case 'COMPLETED': return 'completed';
      case 'DROPPED': return 'dropped';
      default: return 'in-progress';
    }
  };

  const determineStatus = (course) => {
    if (course.archived) return 'completed';
    
    const now = new Date();
    const start = course.startDate ? new Date(course.startDate) : null;
    const end = course.endDate ? new Date(course.endDate) : null;
    
    if (start && start > now) return 'upcoming';
    if (end && end < now) return 'completed';
    return 'in-progress';
  };

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

  // Handle course click - navigate to course details
  const handleCourseClick = (course) => {
    console.log("Clicked course:", course);
    // Navigation handled by Link component
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

  // UI interaction handlers
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setDepartmentFilter(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSemesterFilter(event.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle continue learning click
  const handleContinueClick = (e, courseId) => {
    e.preventDefault(); // Prevent Link navigation
    console.log(`Continue learning for course ${courseId}`);
    window.location.href = `/course/${courseId}/learn`;
  };

  return (
    <div className="sc-container">
      <div className="sc-header">
        <h1 className="sc-title">My Courses</h1>
        <p className="sc-subtitle">Browse and access your enrolled courses</p>
      </div>

      {/* Search and filters section */}
      <div className="sc-controls">
        <div className="sc-search-container">
          <Search className="sc-search-icon" size={18} />
          <input
            type="text"
            className="sc-search-input"
            placeholder="Search for courses..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="sc-filter-toggle" onClick={toggleFilters}>
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Collapsible filters */}
        <div className={`sc-filters ${showFilters ? 'sc-filters-visible' : ''}`}>
          <div className="sc-filter-group">
            <label htmlFor="department-filter">Department:</label>
            <select
              id="department-filter"
              className="sc-select"
              value={departmentFilter}
              onChange={handleDepartmentChange}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sc-filter-group">
            <label htmlFor="semester-filter">Semester:</label>
            <select
              id="semester-filter"
              className="sc-select"
              value={semesterFilter}
              onChange={handleSemesterChange}
            >
              <option value="all">All Semesters</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sc-tabs">
        <button 
          className={`sc-tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Courses
        </button>
        <button 
          className={`sc-tab-button ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
        >
          Completed Courses
        </button>
      </div>

      {/* Content area */}
      <div className="sc-content">
        {loading && (
          <div className="sc-loading">
            <div className="sc-spinner"></div>
            <p>Loading your courses...</p>
          </div>
        )}
        
        {error && !loading && activeCourses.length === 0 && archivedCourses.length === 0 && (
          <div className="sc-error">
            <p>{error}</p>
            <button 
              className="sc-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}
        
        {!loading && (
          <>
            {/* Active Courses Tab */}
            {activeTab === 'active' && (
              <>
                {filteredActiveCourses.length === 0 ? (
                  <div className="sc-empty">
                    <div className="sc-empty-icon">
                      <BookOpen size={32} />
                    </div>
                    <h3 className="sc-empty-title">No active courses found</h3>
                    <p className="sc-empty-message">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="sc-course-grid">
                    {filteredActiveCourses.map(course => (
                      <div className="sc-course-card" key={course.id}>
                        <Link to={`/courses/${course.id}`} className="sc-course-link">
                          <div className="sc-course-image">
                            <img 
                               src={getDefaultCourseImage(course)} 
  alt={course.title} 
  onError={(e) => {
    // If image fails to load, use a fallback
    e.target.onerror = null;
    e.target.src = DEFAULT_COURSE_IMAGES[0];
  }}
                            />
                            <div className="sc-course-code">
                              {/* Display code directly, without conditional rendering */}
                              {course.code || `COURSE-${course.id}`}
                            </div>
                          </div>
                          
                          {/* Title */}
                          <h3 className="sc-course-title">{course.title}</h3>
                          
                          {/* Department - Direct output */}
                          <div className="sc-course-department" style={{fontWeight: 'bold'}}>
                            {course.department || course.departmentName || 'General'}
                          </div>
                          
                          {/* Instructor - Direct output */}
                          <div className="sc-course-instructor" style={{fontWeight: 'bold'}}>
                            Teacher: {course.instructor || course.instructorName || 'Unknown'}
                          </div>
                          
                          {/* Progress bar remains the same */}
                          <div className="sc-progress-container">
                            <div className="sc-progress-bar">
                              <div 
                                className="sc-progress-fill" 
                                style={{ width: `${course.progress || 0}%` }}
                              ></div>
                            </div>
                            <div className="sc-progress-text">
                              <span>Progress</span>
                              <span>{course.progress || 0}%</span>
                            </div>
                          </div>
                          
                          {/* Meta information with explicit display */}
                          <div className="sc-course-meta">
                            <div className="sc-meta-item">
                              <Calendar size={14} />
                              <span style={{fontWeight: 'bold'}}>
                                {course.semester || determineSemester(course) || 'Current Term'}
                              </span>
                            </div>
                            <div className="sc-meta-item">
                              <Clock size={14} />
                              <span style={{fontWeight: 'bold'}}>
                                {course.credits || 3} Credits
                              </span>
                            </div>
                          </div>
                        </Link>
                        
                        <button 
                          className="sc-continue-button"
                          onClick={(e) => handleContinueClick(e, course.id)}
                        >
                          Continue Learning
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            
            {/* Archived Courses Tab */}
            {activeTab === 'archived' && (
              <>
                {filteredArchivedCourses.length === 0 ? (
                  <div className="sc-empty">
                    <div className="sc-empty-icon">
                      <BookOpen size={32} />
                    </div>
                    <h3 className="sc-empty-title">No completed courses found</h3>
                    <p className="sc-empty-message">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="sc-course-grid">
                    {filteredArchivedCourses.map(course => (
                      <div key={course.id} className="sc-course-card sc-archived">
                        <Link to={`/courses/${course.id}`} className="sc-course-link">
                          <div className="sc-course-image sc-grayscale">
                            <img 
                              src={course.imageUrl} 
                              alt={course.title} 
                            />
                            <div className="sc-course-code">{course.code}</div>
                            <div className="sc-completed-badge">
                              <BadgeCheck size={16} />
                              <span>Completed</span>
                            </div>
                          </div>
                          <h3 className="sc-course-title">{course.title}</h3>
                          <div className="sc-course-department">{course.department}</div>
                          <div className="sc-course-instructor">{course.instructor}</div>
                          
                          {course.grade && (
                            <div className="sc-grade">
                              Final Grade: <span>{course.grade}</span>
                            </div>
                          )}
                          
                          <div className="sc-course-meta">
                            <div className="sc-meta-item">
                              <Calendar size={14} />
                              <span>{course.semester}</span>
                            </div>
                            <div className="sc-meta-item">
                              <Clock size={14} />
                              <span>{course.credits} Credits</span>
                            </div>
                          </div>
                        </Link>
                        
                        <button 
                          className="sc-continue-button sc-secondary"
                          onClick={(e) => handleContinueClick(e, course.id)}
                        >
                          View Course
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Courses;