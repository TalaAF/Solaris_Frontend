import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Calendar, Award, BookOpen, UserCheck, MessageCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './StudentProgressDetail.css';

// Mock data for a student's detailed progress
const mockStudentData = {
  1: {
    id: 1,
    name: "Emma Johnson",
    email: "emma.j@example.com",
    avatarUrl: "https://source.unsplash.com/random/100x100?portrait,woman,1",
    enrolledDate: "January 15, 2025",
    department: "Internal Medicine",
    totalCoursesCompleted: 5,
    totalHoursSpent: 78,
    averageQuizScore: 85,
    lastLogin: "May 8, 2025 (2 hours ago)",
    instructorNotes: "Emma is making excellent progress in cardiology courses. Consider recommending the advanced pathology course.",
    courses: [
      {
        id: 1,
        title: "Introduction to Cardiology",
        enrollmentDate: "January 15, 2025",
        progress: 85,
        quizScores: [
          { title: "Heart Anatomy Quiz", score: 92, date: "February 2, 2025" },
          { title: "ECG Basics Quiz", score: 88, date: "February 18, 2025" }
        ],
        timeSpent: "28 hours",
        completedModules: [
          { title: "Heart Anatomy", completedDate: "January 22, 2025" },
          { title: "Cardiac Cycle", completedDate: "February 5, 2025" },
          { title: "ECG Interpretation", completedDate: "February 15, 2025" },
          { title: "Valvular Disorders", completedDate: "March 3, 2025" }
        ],
        remainingModules: [
          { title: "Congenital Heart Disease" }
        ],
        lastActivity: {
          action: "Viewed",
          item: "Congenital Heart Disease lecture",
          date: "May 8, 2025"
        }
      },
      {
        id: 2,
        title: "Advanced Surgical Techniques",
        enrollmentDate: "February 10, 2025",
        progress: 65,
        quizScores: [
          { title: "Surgical Tools Quiz", score: 76, date: "March 1, 2025" },
          { title: "Sterile Field Management", score: 84, date: "March 20, 2025" }
        ],
        timeSpent: "32 hours",
        completedModules: [
          { title: "Introduction to Surgical Techniques", completedDate: "February 20, 2025" },
          { title: "Sterile Field Management", completedDate: "March 5, 2025" },
          { title: "Basic Suturing Techniques", completedDate: "April 2, 2025" }
        ],
        remainingModules: [
          { title: "Advanced Closure Methods" },
          { title: "Surgical Complications" },
          { title: "Post-operative Care" }
        ],
        lastActivity: {
          action: "Submitted",
          item: "Surgical Tools Recognition Quiz",
          date: "April 25, 2025"
        }
      },
      {
        id: 3,
        title: "Neurology Fundamentals",
        enrollmentDate: "March 15, 2025",
        progress: 45,
        quizScores: [
          { title: "Brain Anatomy Quiz", score: 68, date: "April 2, 2025" }
        ],
        timeSpent: "18 hours",
        completedModules: [
          { title: "Brain Anatomy", completedDate: "March 28, 2025" },
          { title: "Nervous System Functions", completedDate: "April 15, 2025" }
        ],
        remainingModules: [
          { title: "Neurological Assessment" },
          { title: "Common Neurological Disorders" },
          { title: "Brain Imaging Techniques" },
          { title: "Treatment Approaches" }
        ],
        lastActivity: {
          action: "Viewed",
          item: "Brain Anatomy video",
          date: "May 1, 2025"
        }
      }
    ]
  },
  2: {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@example.com",
    avatarUrl: "https://source.unsplash.com/random/100x100?portrait,man,1",
    enrolledDate: "December 5, 2024",
    department: "Cardiology",
    totalCoursesCompleted: 3,
    totalHoursSpent: 92,
    averageQuizScore: 94,
    lastLogin: "May 7, 2025 (1 day ago)",
    instructorNotes: "Michael demonstrates exceptional understanding of cardiac concepts. Has expressed interest in research opportunities.",
    courses: [
      {
        id: 1,
        title: "Introduction to Cardiology",
        enrollmentDate: "December 5, 2024",
        progress: 100,
        quizScores: [
          { title: "Heart Anatomy Quiz", score: 98, date: "December 20, 2024" },
          { title: "ECG Basics Quiz", score: 96, date: "January 8, 2025" },
          { title: "Final Assessment", score: 94, date: "February 5, 2025" }
        ],
        timeSpent: "42 hours",
        completedModules: [
          { title: "Heart Anatomy", completedDate: "December 15, 2024" },
          { title: "Cardiac Cycle", completedDate: "December 28, 2024" },
          { title: "ECG Interpretation", completedDate: "January 10, 2025" },
          { title: "Valvular Disorders", completedDate: "January 25, 2025" },
          { title: "Congenital Heart Disease", completedDate: "February 3, 2025" }
        ],
        remainingModules: [],
        lastActivity: {
          action: "Completed",
          item: "Final Assessment",
          date: "February 5, 2025"
        }
      },
      {
        id: 4,
        title: "Neurology Fundamentals",
        enrollmentDate: "February 15, 2025",
        progress: 85,
        quizScores: [
          { title: "Brain Anatomy Quiz", score: 90, date: "March 1, 2025" },
          { title: "Neurological Assessment Quiz", score: 86, date: "April 5, 2025" }
        ],
        timeSpent: "50 hours",
        completedModules: [
          { title: "Brain Anatomy", completedDate: "March 1, 2025" },
          { title: "Nervous System Functions", completedDate: "March 15, 2025" },
          { title: "Neurological Assessment", completedDate: "April 1, 2025" },
          { title: "Common Neurological Disorders", completedDate: "April 20, 2025" },
          { title: "Brain Imaging Techniques", completedDate: "May 5, 2025" }
        ],
        remainingModules: [
          { title: "Treatment Approaches" }
        ],
        lastActivity: {
          action: "Completed",
          item: "Neurological Assessments quiz",
          date: "May 7, 2025"
        }
      }
    ]
  }
};

const StudentProgressDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    // In a real app, fetch student data from API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundStudent = mockStudentData[studentId];
      if (foundStudent) {
        setStudent(foundStudent);
        setNoteInput(foundStudent.instructorNotes || '');
      }
      setLoading(false);
    }, 800);
  }, [studentId]);

  const handleSaveNotes = () => {
    // In a real app, save notes to API
    if (student) {
      setStudent(prev => ({
        ...prev,
        instructorNotes: noteInput
      }));
      toast.success('Notes saved successfully');
    }
  };

  const getCompletionStatus = (progress) => {
    if (progress >= 100) return 'Completed';
    if (progress >= 70) return 'In Progress';
    if (progress >= 30) return 'Started';
    return 'Not Started';
  };
  
  const getCompletionStatusIcon = (progress) => {
    if (progress >= 100) return <CheckCircle size={16} className="status-icon complete" />;
    if (progress >= 30) return <Clock size={16} className="status-icon in-progress" />;
    return <XCircle size={16} className="status-icon not-started" />;
  };

  const getAverageQuizScore = (quizScores) => {
    if (!quizScores || quizScores.length === 0) return 'N/A';
    const total = quizScores.reduce((sum, quiz) => sum + quiz.score, 0);
    return Math.round(total / quizScores.length);
  };

  if (loading) {
    return (
      <div className="student-progress-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-progress-detail-page">
        <div className="error-container">
          <AlertTriangle size={32} />
          <h2>Student Not Found</h2>
          <p>The student you're looking for doesn't exist or you don't have permission to view their data.</p>
          <button 
            className="solaris-button primary-button"
            onClick={() => navigate('/instructor/student-progress')}
          >
            Back to Student List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-progress-detail-page">
      <div className="detail-header">
        <button 
          className="back-button" 
          onClick={() => navigate('/instructor/student-progress')}
        >
          <ChevronLeft size={16} />
          Back to Students
        </button>
        
        <div className="detail-title-container">
          <h1 className="detail-title">Student Progress: {student.name}</h1>
        </div>
      </div>

      <div className="student-overview-card">
        <div className="student-profile">
          <div className="student-avatar large">
            <img src={student.avatarUrl} alt={`${student.name}'s avatar`} />
          </div>
          <div className="student-basic-info">
            <h2 className="student-name">{student.name}</h2>
            <p className="student-email">{student.email}</p>
            <p className="student-department">{student.department}</p>
            <div className="enrollment-date">
              <Calendar size={14} />
              <span>Enrolled: {student.enrolledDate}</span>
            </div>
          </div>
        </div>
        
        <div className="student-metrics">
          <div className="metric-item">
            <div className="metric-icon">
              <BookOpen />
            </div>
            <div className="metric-content">
              <h3>{student.courses.length}</h3>
              <p>Enrolled Courses</p>
            </div>
          </div>
          
          <div className="metric-item">
            <div className="metric-icon">
              <Award />
            </div>
            <div className="metric-content">
              <h3>{student.averageQuizScore}%</h3>
              <p>Avg. Quiz Score</p>
            </div>
          </div>
          
          <div className="metric-item">
            <div className="metric-icon">
              <Clock />
            </div>
            <div className="metric-content">
              <h3>{student.totalHoursSpent}h</h3>
              <p>Total Time Spent</p>
            </div>
          </div>
          
          <div className="metric-item">
            <div className="metric-icon">
              <UserCheck />
            </div>
            <div className="metric-content">
              <h3>{student.lastLogin.split(' ')[0]}</h3>
              <p>Last Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        <button 
          className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`detail-tab ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          Course Progress
        </button>
        <button 
          className={`detail-tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Instructor Notes
        </button>
      </div>

      <div className="detail-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="progress-summary-section">
              <h2 className="section-title">Progress Summary</h2>
              <div className="progress-summary-grid">
                {student.courses.map(course => (
                  <div key={course.id} className="course-summary-card">
                    <h3 className="course-title">{course.title}</h3>
                    <div className="progress-wrapper">
                      <div className="progress-circle-wrapper">
                        <div className="progress-circle">
                          <svg viewBox="0 0 36 36" className="progress-ring">
                            <path 
                              className="progress-ring-bg"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path 
                              className="progress-ring-fill"
                              strokeDasharray={`${course.progress}, 100`}
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="progress-percentage">{course.progress}%</div>
                        </div>
                      </div>
                      <div className="course-info">
                        <div className="course-stat">
                          <span className="stat-label">Status:</span>
                          <span className={`stat-value status-${getCompletionStatus(course.progress).toLowerCase().replace(' ', '-')}`}>
                            {getCompletionStatusIcon(course.progress)}
                            {getCompletionStatus(course.progress)}
                          </span>
                        </div>
                        <div className="course-stat">
                          <span className="stat-label">Quiz Avg:</span>
                          <span className="stat-value">{getAverageQuizScore(course.quizScores)}%</span>
                        </div>
                        <div className="course-stat">
                          <span className="stat-label">Time Spent:</span>
                          <span className="stat-value">{course.timeSpent}</span>
                        </div>
                      </div>
                    </div>
                    <div className="recent-activity">
                      <span className="activity-label">Last Activity:</span>
                      <span className="activity-value">
                        {course.lastActivity.action} {course.lastActivity.item} on {course.lastActivity.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="activity-timeline-section">
              <h2 className="section-title">Recent Activity</h2>
              <div className="activity-timeline">
                {student.courses.slice(0, 2).flatMap(course => {
                  const activities = [];
                  
                  // Add quiz activities
                  course.quizScores.forEach(quiz => {
                    activities.push({
                      date: quiz.date,
                      course: course.title,
                      action: `Completed ${quiz.title} with score ${quiz.score}%`,
                      type: 'quiz'
                    });
                  });
                  
                  // Add module completion activities
                  course.completedModules.forEach(module => {
                    activities.push({
                      date: module.completedDate,
                      course: course.title,
                      action: `Completed module: ${module.title}`,
                      type: 'module'
                    });
                  });
                  
                  return activities;
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map((activity, index) => (
                  <div key={index} className="timeline-item">
                    <div className={`timeline-icon ${activity.type}`}>
                      {activity.type === 'quiz' ? <Award size={14} /> : <CheckCircle size={14} />}
                    </div>
                    <div className="timeline-content">
                      <p className="timeline-date">{activity.date}</p>
                      <p className="timeline-course">{activity.course}</p>
                      <p className="timeline-action">{activity.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'courses' && (
          <div className="courses-content">
            {student.courses.map(course => (
              <div key={course.id} className="course-detail-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <div className="course-meta">
                    <div className="enrollment-date small">
                      <Calendar size={14} />
                      <span>Enrolled: {course.enrollmentDate}</span>
                    </div>
                    <div className={`completion-status ${getCompletionStatus(course.progress).toLowerCase().replace(' ', '-')}`}>
                      {getCompletionStatusIcon(course.progress)}
                      {getCompletionStatus(course.progress)}
                    </div>
                  </div>
                </div>
                
                <div className="progress-section">
                  <div className="progress-header">
                    <h4>Course Progress</h4>
                    <span className="progress-percent">{course.progress}% Complete</span>
                  </div>
                  <div className="progress-bar large">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="course-details-grid">
                  <div className="course-modules">
                    <h4>Module Progress</h4>
                    <div className="modules-list">
                      {course.completedModules.map((module, index) => (
                        <div key={index} className="module-item completed">
                          <CheckCircle size={16} />
                          <div className="module-details">
                            <span className="module-name">{module.title}</span>
                            <span className="module-date">Completed {module.completedDate}</span>
                          </div>
                        </div>
                      ))}
                      
                      {course.remainingModules.map((module, index) => (
                        <div key={index} className="module-item incomplete">
                          <Clock size={16} />
                          <div className="module-details">
                            <span className="module-name">{module.title}</span>
                            <span className="module-date">Not started</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="course-assessments">
                    <h4>Quizzes & Assessments</h4>
                    {course.quizScores.length > 0 ? (
                      <div className="quiz-scores">
                        {course.quizScores.map((quiz, index) => (
                          <div key={index} className="quiz-item">
                            <div className="quiz-info">
                              <h5 className="quiz-title">{quiz.title}</h5>
                              <span className="quiz-date">{quiz.date}</span>
                            </div>
                            <div className="quiz-score">
                              <div className="score-badge">{quiz.score}%</div>
                              <div className="score-bar">
                                <div 
                                  className={`score-fill ${quiz.score >= 70 ? 'pass' : 'fail'}`}
                                  style={{ width: `${quiz.score}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="quiz-average">
                          <span>Average Score:</span>
                          <span className="average-value">{getAverageQuizScore(course.quizScores)}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="no-assessments">
                        <p>No assessments completed yet</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="time-tracking">
                  <h4>Time Tracking</h4>
                  <div className="time-stat">
                    <Clock size={16} />
                    <div className="time-details">
                      <span className="time-value">{course.timeSpent}</span>
                      <span className="time-label">Total time spent on this course</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className="notes-content">
            <div className="notes-card">
              <h3 className="notes-title">
                <MessageCircle size={18} />
                Instructor Notes
              </h3>
              <p className="notes-description">
                Add notes about this student's performance, special requirements, or areas that need attention.
                These notes are only visible to instructors.
              </p>
              
              <textarea 
                className="notes-textarea"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add notes about this student's performance and progress..."
                rows={6}
              ></textarea>
              
              <div className="notes-actions">
                <button 
                  className="solaris-button secondary-button"
                  onClick={() => setNoteInput(student.instructorNotes || '')}
                >
                  Cancel
                </button>
                <button 
                  className="solaris-button primary-button"
                  onClick={handleSaveNotes}
                >
                  Save Notes
                </button>
              </div>
            </div>
            
            <div className="contact-card">
              <h3 className="contact-title">
                <MessageCircle size={18} />
                Contact Student
              </h3>
              <p className="contact-description">
                Send a direct message to this student about their performance or to schedule a meeting.
              </p>
              
              <div className="contact-actions">
                <button 
                  className="solaris-button secondary-button"
                  onClick={() => toast.success('Email feature will be implemented in a future update')}
                >
                  Send Email
                </button>
                <button 
                  className="solaris-button primary-button"
                  onClick={() => toast.success('Chat feature will be implemented in a future update')}
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressDetail;