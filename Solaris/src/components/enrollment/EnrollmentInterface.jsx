// src/components/enrollment/EnrollmentInterface.jsx
import React, { useState } from 'react';
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
import './EnrollmentInterface.css';

const EnrollmentInterface = () => {
  // State variables
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  
  // Mock data for development
  const studentData = {
    id: "2202357",
    name: "Saja Khaled Amer Alshawawra",
    term: "Spring-2025",
    status: "Registered",
    totalCredits: 16,
    majorGPA: 3.75,
    cumulativeGPA: 3.8
  };
  
  const courseData = {
    completed: [
      { code: "PHIL350", title: "COMPUTER ETHICS", credits: 3, type: "Major Requirement", status: "completed", term: "Fall 2024" },
      { code: "RELS300", title: "CULTURAL RELIGIOUS STUDIES", credits: 3, type: "University Requirement", status: "completed", term: "Fall 2024" },
      { code: "SWER312", title: "SOFTWARE TESTING & QUALITY ASSURANCE", credits: 3, type: "Major Requirement", status: "completed", term: "Fall 2024" },
      { code: "SWER385", title: "INTELLIGENT SYSTEMS", credits: 3, type: "Major Requirement", status: "completed", term: "Fall 2024" },
      { code: "SWER401", title: "CAPSTONE PROJECT I", credits: 1, type: "Major Requirement", status: "completed", term: "Fall 2024" }
    ],
    registered: [
      { code: "SWER402", title: "CAPSTONE PROJECT II", credits: 3, type: "Major Requirement", status: "in-progress", term: "Spring 2025" },
      { code: "SWERGR1", title: "Mobile Application Development", credits: 3, type: "Major Elective", status: "in-progress", term: "Spring 2025" },
      { code: "ANAT201", title: "Human Anatomy", credits: 4, type: "Medical Requirement", status: "in-progress", term: "Spring 2025" }
    ],
    available: [
      { code: "MED201", title: "Medical Terminology", credits: 2, type: "Medical Requirement", status: "available", term: "Fall 2025" },
      { code: "PHARM101", title: "Introduction to Pharmacology", credits: 3, type: "Medical Requirement", status: "available", term: "Fall 2025" },
      { code: "SWER420", title: "AI in Healthcare", credits: 3, type: "Major Elective", status: "available", term: "Fall 2025" }
    ]
  };
  
  const registrationOpen = true;
  
  // Calculate total credits
  const calculateTotalCredits = (courses) => {
    return courses.reduce((total, course) => total + course.credits, 0);
  };
  
  // Progress - using 65% to match sample
  const completedCredits = calculateTotalCredits(courseData.completed);
  const progress = {
    completed: 65,
    total: completedCredits + calculateTotalCredits(courseData.registered),
    allTotal: 31 // Using 31 from the image
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
  const handleRegister = () => {
    if (selectedCourses.length === 0) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(`Successfully registered for ${selectedCourses.length} courses!`);
      setSelectedCourses([]);
    }, 1000);
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
            <div className="stat-value">{studentData.majorGPA}</div>
            <div className="stat-label">Major GPA</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{studentData.cumulativeGPA}</div>
            <div className="stat-label">Cumulative GPA</div>
          </div>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div className="progress-dashboard">
        <div className="progress-header">
          <h2>Degree Progress</h2>
          <div className="progress-percentage-badge">{progress.completed}% Complete</div>
        </div>
        <div className="progress-visualization">
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress.completed}%` }}
            ></div>
          </div>
          <div className="progress-stats">
            <div className="progress-stat">
              <div className="progress-stat-value">{completedCredits}</div>
              <div className="progress-stat-label">Credits Completed</div>
            </div>
            <div className="progress-stat">
              <div className="progress-stat-value">{progress.allTotal - completedCredits}</div>
              <div className="progress-stat-label">Credits Remaining</div>
            </div>
            <div className="progress-stat">
              <div className="progress-stat-value">{progress.allTotal}</div>
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
                      <div className="course-card" key={course.code}>
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
                      <div className="course-card completed" key={course.code}>
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
                  <div className={`registration-status-badge ${registrationOpen ? 'open' : 'closed'}`}>
                    Registration {registrationOpen ? 'Open' : 'Closed'}
                  </div>
                </div>
                
                <div className="registration-info">
                  <AlertCircle size={18} />
                  <p>
                    Registration for Fall 2025 is currently {registrationOpen ? 'open' : 'closed'}.
                    {registrationOpen && ' Select courses below to register.'}
                  </p>
                </div>
                
                {courseData.available.length > 0 ? (
                  <>
                    <div className="selectable-courses-grid">
                      {courseData.available.map((course) => (
                        <div 
                          className={`course-card available ${selectedCourses.includes(course.code) ? 'selected' : ''}`} 
                          key={course.code}
                          onClick={() => registrationOpen && handleCourseSelection(course.code)}
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
                      
                      {registrationOpen && (
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