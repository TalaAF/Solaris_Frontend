// src/components/enrollment/EnrollmentInterface.jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { CheckCircle, Clock, BookOpen, ChevronLeft } from 'lucide-react';
import './EnrollmentInterface.css';

// Main enrollment component
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

  return (
    <div className="enrollment-container">
      {/* Student Information Card */}
      <Card className="student-info-card">
        <div className="student-info-header">
          <div className="student-info-left">
            <h2 className="student-name">{studentData.name}</h2>
            <p className="student-id">ID: <strong>{studentData.id}</strong></p>
            <p className="student-status">Status: <strong>{studentData.status}</strong></p>
          </div>
          <div className="gpa-container">
            <p>Major GPA: <strong>{studentData.majorGPA}</strong></p>
            <p>Cumulative GPA: <strong>{studentData.cumulativeGPA}</strong></p>
            <p>Term: <strong>{studentData.term}</strong></p>
          </div>
        </div>
      </Card>

      {/* Progress Overview */}
      <Card className="progress-card">
        <div className="progress-section">
          <div className="progress-header">
            <span>Overall Completion</span>
            <span className="progress-percentage">{progress.completed}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress.completed}%` }}
            ></div>
          </div>
          <p className="progress-details">
            {completedCredits} of {progress.allTotal} total credits completed
          </p>
        </div>
      </Card>

      {/* Course Tabs */}
      <Card className="courses-card">
        <div className="course-tabs">
          <button 
            className={`tab-button ${activeTab === 0 ? 'active' : ''}`} 
            onClick={() => handleTabChange(0)}
          >
            Registered Courses
          </button>
          <button 
            className={`tab-button ${activeTab === 1 ? 'active' : ''}`} 
            onClick={() => handleTabChange(1)}
          >
            Completed Courses
          </button>
          <button 
            className={`tab-button ${activeTab === 2 ? 'active' : ''}`} 
            onClick={() => handleTabChange(2)}
          >
            Available Courses
          </button>
        </div>

        {/* Registered Courses Tab */}
        {activeTab === 0 && (
          <div className="tab-content">
            <h3 className="tab-title">Current Term: {studentData.term}</h3>
            {courseData.registered.length > 0 ? (
              <div className="course-list">
                <div className="course-list-header">
                  <div className="course-code">Code</div>
                  <div className="course-title">Title</div>
                  <div className="course-credits">Credits</div>
                  <div className="course-type">Type</div>
                </div>
                {courseData.registered.map((course) => (
                  <div className="course-item" key={course.code}>
                    <div className="course-code-container">
                      <span className="course-code">{course.code}</span>
                    </div>
                    <div className="course-title">{course.title}</div>
                    <div className="course-credits">{course.credits}</div>
                    <div className="course-type">{course.type}</div>
                  </div>
                ))}
                <div className="course-summary">
                  <div className="course-summary-title">Total Credits:</div>
                  <div className="course-summary-value">{calculateTotalCredits(courseData.registered)}</div>
                </div>
              </div>
            ) : (
              <div className="no-courses-message">
                <p>You are not currently registered for any courses.</p>
              </div>
            )}
          </div>
        )}

        {/* Completed Courses Tab */}
        {activeTab === 1 && (
          <div className="tab-content completed-tab">
            {courseData.completed.length > 0 ? (
              <div className="course-list">
                <div className="course-list-header">
                  <div className="course-code">Code</div>
                  <div className="course-title">Title</div>
                  <div className="course-credits">Credits</div>
                  <div className="course-type">Type</div>
                </div>
                {courseData.completed.map((course) => (
                  <div className="course-item" key={course.code}>
                    <div className="course-code-container">
                      <span className="course-code">{course.code}</span>
                    </div>
                    <div className="course-title">{course.title}</div>
                    <div className="course-credits">{course.credits}</div>
                    <div className="course-type">{course.type}</div>
                  </div>
                ))}
                <div className="course-summary">
                  <div className="course-summary-title">Total Credits:</div>
                  <div className="course-summary-value">{calculateTotalCredits(courseData.completed)}</div>
                </div>
              </div>
            ) : (
              <div className="no-courses-message">
                <p>You have not completed any courses yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Available Courses Tab */}
        {activeTab === 2 && (
          <div className="tab-content available-tab">
            <div className="registration-status">
              <h3>Registration Status: 
                <span className={registrationOpen ? 'status-open' : 'status-closed'}>
                  {registrationOpen ? 'Open' : 'Closed'}
                </span>
              </h3>
              <p className="registration-note">
                Registration for Fall 2025 is currently {registrationOpen ? 'open' : 'closed'}.
                {registrationOpen && ' Select courses below to register.'}
              </p>
            </div>
            
            {courseData.available.length > 0 ? (
              <div className="course-list">
                <div className="course-list-header">
                  <div className="course-select">Select</div>
                  <div className="course-code">Code</div>
                  <div className="course-title">Title</div>
                  <div className="course-credits">Credits</div>
                  <div className="course-type">Type</div>
                </div>
                {courseData.available.map((course) => (
                  <div className="course-item" key={course.code}>
                    <div className="course-select">
                      <input 
                        type="checkbox" 
                        disabled={!registrationOpen}
                        checked={selectedCourses.includes(course.code)}
                        onChange={() => handleCourseSelection(course.code)}
                      />
                    </div>
                    <div className="course-code-container">
                      <span className="course-code">{course.code}</span>
                    </div>
                    <div className="course-title">{course.title}</div>
                    <div className="course-credits">{course.credits}</div>
                    <div className="course-type">{course.type}</div>
                  </div>
                ))}
                <div className="course-summary">
                  <div className="course-summary-title">Selected Credits:</div>
                  <div className="course-summary-value">
                    {calculateTotalCredits(courseData.available.filter(course => 
                      selectedCourses.includes(course.code)))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-courses-message">
                <p>There are no available courses for registration at this time.</p>
              </div>
            )}
            
            {registrationOpen && courseData.available.length > 0 && (
              <div className="registration-actions">
                <button 
                  className="register-button"
                  disabled={selectedCourses.length === 0 || loading}
                  onClick={handleRegister}
                >
                  {loading ? "Processing..." : "Register for Selected Courses"}
                </button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EnrollmentInterface;