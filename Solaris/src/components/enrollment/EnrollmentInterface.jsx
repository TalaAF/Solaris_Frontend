// src/components/enrollment/EnrollmentInterface.jsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Calendar, 
  User, 
  Award, 
  Layers,
  AlertCircle
} from 'lucide-react';
import EnrollmentService from '../../services/EnrollmentService';
import './EnrollmentInterface.css';

const EnrollmentInterface = () => {
  // State variables
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [courseData, setCourseData] = useState({
    completed: [],
    registered: [],
    available: []
  });

  // Fetch student and enrollment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First get enrollment data
        const enrollmentData = await EnrollmentService.getStudentEnrollment();
        console.log('Raw Enrollment Data:', enrollmentData); // Debug log

        // Check if we have valid enrollment data array
        if (!Array.isArray(enrollmentData) || enrollmentData.length === 0) {
          throw new Error('No enrollment data found');
        }

        // Extract student info from first enrollment
        const studentInfo = {
          id: Number(enrollmentData[0].studentId),
          name: enrollmentData[0].studentName
        };

        console.log('Extracted Student Info:', studentInfo); // Debug log

        if (!studentInfo.id || isNaN(studentInfo.id)) {
          throw new Error('Invalid student ID');
        }

        // Fetch dashboard data with valid student ID
        const dashboardData = await EnrollmentService.getStudentDashboard(studentInfo.id);

        // Transform enrollments data
        const transformedEnrollments = enrollmentData.map(enrollment => ({
          id: enrollment.courseId,
          code: `COURSE${enrollment.courseId}`,
          title: enrollment.courseName,
          credits: 3,
          type: 'Major Requirement',
          term: new Date(enrollment.enrollmentDate).toLocaleDateString(),
          status: enrollment.status,
          progress: enrollment.progress
        }));

        // Update states
        setCourseData({
          completed: dashboardData?.completedCourses || [],
          registered: transformedEnrollments,
          available: [] // Will be populated when available courses endpoint is ready
        });

        setStudentData({
          id: studentInfo.id,
          name: studentInfo.name,
          term: dashboardData?.currentTerm || "Spring-2025",
          status: dashboardData?.status || "Registered",
          totalCredits: 120,
          majorGPA: dashboardData?.majorGPA || 0,
          cumulativeGPA: dashboardData?.cumulativeGPA || 0
        });

      } catch (err) {
        console.error('Error fetching enrollment data:', err);
        setError(err.message || 'Failed to load enrollment data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total credits
  const calculateTotalCredits = (courses) => {
    return courses.reduce((total, course) => total + course.credits, 0);
  };

  // Handle tab change
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  // Handle course selection
  const handleCourseSelection = (courseCode) => {
    if (selectedCourses.includes(courseCode)) {
      setSelectedCourses(selectedCourses.filter(code => code !== courseCode));
    } else {
      setSelectedCourses([...selectedCourses, courseCode]);
    }
  };

  // Handle course registration
  const handleRegister = async () => {
    if (selectedCourses.length === 0) return;
    
    try {
      setLoading(true);
      
      await EnrollmentService.registerCourses(studentData.id, selectedCourses);
      
      // Refresh the course data after successful registration
      const enrollmentData = await EnrollmentService.getStudentEnrollment();
      setCourseData(prevData => ({
        ...prevData,
        registered: enrollmentData.enrollments,
        available: enrollmentData.availableCourses
      }));

      setSelectedCourses([]);
      alert('Successfully registered for courses!');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register for courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get the appropriate icon for course type
  const getCourseTypeIcon = (type) => {
    switch (type) {
      case 'Major Requirement':
        return <BookOpen size={16} className="course-type-icon" />;
      case 'Major Elective':
        return <Layers size={16} className="course-type-icon" />;
      case 'University Requirement':
        return <Award size={16} className="course-type-icon" />;
      case 'Medical Requirement':
        return <AlertCircle size={16} className="course-type-icon" />;
      default:
        return <BookOpen size={16} className="course-type-icon" />;
    }
  };

  // Render courses function (removed as it is unused)

  // Show loading state
  if (loading && !studentData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading enrollment data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={32} />
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="enrollment-container">
      {/* Student Profile Section */}
      <div className="student-profile-section">
        <div className="student-avatar">
          <User size={32} />
        </div>
        <div className="student-details">
          <h1 className="student-name">{studentData.name}</h1>
          <div className="student-meta">
            <div className="student-meta-item">
              <span className="student-meta-label">ID</span>
              <span className="student-meta-value">{studentData.id}</span>
            </div>
            <div className="student-meta-item">
              <span className="student-meta-label">Status</span>
              <span className="student-meta-value status-badge">{studentData.status}</span>
            </div>
            <div className="student-meta-item">
              <span className="student-meta-label">Term</span>
              <span className="student-meta-value">{studentData.term}</span>
            </div>
          </div>
        </div>
        <div className="student-academic-stats">
          <div className="stat-box">
            <div className="stat-value">
              {isNaN(studentData.majorGPA) ? '0' : studentData.majorGPA.toString()}
            </div>
            <div className="stat-label">Major GPA</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">
              {isNaN(studentData.cumulativeGPA) ? '0' : studentData.cumulativeGPA.toString()}
            </div>
            <div className="stat-label">Cumulative GPA</div>
          </div>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div className="progress-dashboard">
        <div className="progress-header">
          <h2>Degree Progress</h2>
          <div className="progress-percentage-badge">{Math.round((calculateTotalCredits(courseData.completed) / studentData.totalCredits) * 100)}% Complete</div>
        </div>
        <div className="progress-visualization">
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${Math.round((calculateTotalCredits(courseData.completed) / studentData.totalCredits) * 100)}%` }}
            ></div>
          </div>
          <div className="progress-stats">
            <div className="progress-stat">
              <div className="stat-value">
                {isNaN(calculateTotalCredits(courseData.completed)) ? '0' : calculateTotalCredits(courseData.completed).toString()}
              </div>
              <div className="progress-stat-label">Credits Completed</div>
            </div>
            <div className="progress-stat">
              <div className="stat-value">
                {isNaN(studentData.totalCredits - calculateTotalCredits(courseData.completed)) ? '0' : (studentData.totalCredits - calculateTotalCredits(courseData.completed)).toString()}
              </div>
              <div className="progress-stat-label">Credits Remaining</div>
            </div>
            <div className="progress-stat">
              <div className="stat-value">
                {isNaN(studentData.totalCredits) ? '0' : studentData.totalCredits.toString()}
              </div>
              <div className="progress-stat-label">Total Required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Management Section */}
      <div className="course-management-section">
        {/* Course Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 0 ? 'active' : ''}`} 
              onClick={() => handleTabChange(0)}
            >
              <Clock size={18} />
              <span>Registered Courses</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 1 ? 'active' : ''}`} 
              onClick={() => handleTabChange(1)}
            >
              <CheckCircle size={18} />
              <span>Completed Courses</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 2 ? 'active' : ''}`} 
              onClick={() => handleTabChange(2)}
            >
              <Calendar size={18} />
              <span>Available Courses</span>
            </button>
          </div>

          <div className="tab-content-container">
            {/* Registered Courses Tab */}
            {activeTab === 0 && (
              <div className="tab-content fade-in">
                <div className="tab-header">
                  <h3>Current Term: {studentData.term}</h3>
                  <div className="total-credits-badge">
                    {calculateTotalCredits(courseData.registered)} Credits
                  </div>
                </div>
                
                {courseData.registered.length > 0 ? (
                  <div className="courses-grid">
                    {courseData.registered.map((course) => (
                      <div className="course-card" key={`registered-${course.id}`}>
                        <div className="course-card-header">
                          <div className="course-code">{course.code}</div>
                          <div className="course-credits">{course.credits} CR</div>
                        </div>
                        <div className="course-card-body">
                          <h4 className="course-title">{course.title}</h4>
                          <div className="course-type">
                            {getCourseTypeIcon(course.type)}
                            <span>{course.type}</span>
                          </div>
                        </div>
                        <div className="course-card-footer">
                          <div className="course-status in-progress">
                            <Clock size={14} />
                            <span>In Progress</span>
                          </div>
                          <div className="course-term">{course.term}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-courses-message">
                    <Calendar size={32} />
                    <p>You are not currently registered for any courses.</p>
                  </div>
                )}
              </div>
            )}

            {/* Completed Courses Tab */}
            {activeTab === 1 && (
              <div className="tab-content fade-in">
                <div className="tab-header">
                  <h3>Completed Courses</h3>
                  <div className="total-credits-badge">
                    {calculateTotalCredits(courseData.completed)} Credits
                  </div>
                </div>
                
                {courseData.completed.length > 0 ? (
                  <div className="courses-grid">
                    {courseData.completed.map((course) => (
                      <div className="course-card completed" key={`completed-${course.id}`}>
                        <div className="course-card-header">
                          <div className="course-code">{course.code}</div>
                          <div className="course-credits">{course.credits} CR</div>
                        </div>
                        <div className="course-card-body">
                          <h4 className="course-title">{course.title}</h4>
                          <div className="course-type">
                            {getCourseTypeIcon(course.type)}
                            <span>{course.type}</span>
                          </div>
                        </div>
                        <div className="course-card-footer">
                          <div className="course-status completed">
                            <CheckCircle size={14} />
                            <span>Completed</span>
                          </div>
                          <div className="course-term">{course.term}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-courses-message">
                    <CheckCircle size={32} />
                    <p>You have not completed any courses yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Available Courses Tab */}
            {activeTab === 2 && (
              <div className="tab-content fade-in">
                <div className="tab-header">
                  <h3>Available Courses</h3>
                  <div className={`registration-status-badge ${courseData.available.length > 0 ? 'open' : 'closed'}`}>
                    Registration {courseData.available.length > 0 ? 'Open' : 'Closed'}
                  </div>
                </div>
                
                <div className="registration-info">
                  <AlertCircle size={18} />
                  <p>
                    Registration for Fall 2025 is currently {courseData.available.length > 0 ? 'open' : 'closed'}.
                    {courseData.available.length > 0 && ' Select courses below to register.'}
                  </p>
                </div>
                
                {courseData.available.length > 0 ? (
                  <>
                    <div className="selectable-courses-grid">
                      {courseData.available.map((course) => (
                        <div 
                          className={`course-card available ${selectedCourses.includes(course.code) ? 'selected' : ''}`} 
                          key={`available-${course.id}`}
                          onClick={() => courseData.available.length > 0 && handleCourseSelection(course.code)}
                        >
                          <div className="course-card-header">
                            <div className="course-code">{course.code}</div>
                            <div className="course-credits">{course.credits} CR</div>
                          </div>
                          <div className="course-card-body">
                            <h4 className="course-title">{course.title}</h4>
                            <div className="course-type">
                              {getCourseTypeIcon(course.type)}
                              <span>{course.type}</span>
                            </div>
                          </div>
                          <div className="course-card-footer">
                            <div className="course-term">{course.term}</div>
                            <div className="selection-checkbox">
                              <input 
                                type="checkbox" 
                                checked={selectedCourses.includes(course.code)}
                                onChange={() => {}}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="selection-summary">
                      <div className="selected-courses-info">
                        <span>{selectedCourses.length} courses selected</span>
                        <span>|</span>
                        <span>
                          {calculateTotalCredits(courseData.available.filter(course => 
                            selectedCourses.includes(course.code)))} credits
                        </span>
                      </div>
                      
                      {courseData.available.length > 0 && (
                        <button 
                          className="register-button"
                          disabled={selectedCourses.length === 0 || loading}
                          onClick={handleRegister}
                        >
                          {loading ? (
                            <>
                              <div className="loading-spinner-small"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            "Register for Selected Courses"
                          )}
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="no-courses-message">
                    <Calendar size={32} />
                    <p>There are no available courses for registration at this time.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentInterface;