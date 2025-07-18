import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SortAsc, Users, AlertTriangle, Trophy, Clock, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import './StudentProgress.css';

const StudentProgress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('byCourse');
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [filterOption, setFilterOption] = useState("all");
  
  // Mock data for instructor's courses
  const mockInstructorCourses = [
    {
      id: 1,
      code: "MED-301",
      title: "Introduction to Cardiology",
      term: "Spring 2025",
      section: "A",
      enrolledCount: 42,
      atRiskCount: 5,
      averageProgress: 68,
      lastActive: "Today"
    },
    {
      id: 2,
      code: "MED-405",
      title: "Advanced Surgical Techniques",
      term: "Spring 2025",
      section: "C",
      enrolledCount: 28,
      atRiskCount: 3,
      averageProgress: 72,
      lastActive: "Yesterday"
    },
    {
      id: 4,
      code: "MED-320",
      title: "Neurology Fundamentals", 
      term: "Spring 2025",
      section: "B",
      enrolledCount: 35,
      atRiskCount: 4,
      averageProgress: 65,
      lastActive: "2 days ago"
    }
  ];

  // Mock students for the selected course
  const mockStudentsByCourse = {
    1: [
      {
        id: 1,
        studentId: "S202145628",
        name: "Emma Johnson",
        email: "emma.j@university.edu",
        avatarUrl: "https://source.unsplash.com/random/100x100?portrait,woman,1",
        progress: 85,
        gradeToDate: "A-",
        completedAssignments: 15,
        totalAssignments: 18,
        lastActive: "2 hours ago",
        status: "active"
      },
      {
        id: 2,
        studentId: "S202135892",
        name: "Michael Chen",
        email: "m.chen@university.edu",
        avatarUrl: "https://source.unsplash.com/random/100x100?portrait,man,1",
        progress: 100,
        gradeToDate: "A",
        completedAssignments: 18,
        totalAssignments: 18,
        lastActive: "1 day ago",
        status: "excellent"
      },
      {
        id: 4,
        studentId: "S202149275",
        name: "David Wilson",
        email: "d.wilson@university.edu",
        avatarUrl: "https://source.unsplash.com/random/100x100?portrait,man,2",
        progress: 40,
        gradeToDate: "C+",
        completedAssignments: 8,
        totalAssignments: 18,
        lastActive: "Just now",
        status: "atRisk"
      },
      {
        id: 5,
        studentId: "S202162104",
        name: "Sarah Rodriguez",
        email: "s.rodriguez@university.edu",
        avatarUrl: "https://source.unsplash.com/random/100x100?portrait,woman,3",
        progress: 72,
        gradeToDate: "B",
        completedAssignments: 14,
        totalAssignments: 18,
        lastActive: "3 days ago",
        status: "active"
      }
    ],
    2: [
      {
        id: 1,
        studentId: "S202145628",
        name: "Emma Johnson",
        email: "emma.j@university.edu",
        avatarUrl: "https://source.unsplash.com/random/100x100?portrait,woman,1",
        progress: 65,
        gradeToDate: "B+",
        completedAssignments: 8,
        totalAssignments: 12,
        lastActive: "2 hours ago",
        status: "active"
      },
      {
        id: 3,
        studentId: "S202158761",
        name: "Sophia Patel",
        email: "sophia.p@university.edu",
        avatarUrl: "https://source.unsplash.com/random/100x100?portrait,woman,2",
        progress: 32,
        gradeToDate: "D+",
        completedAssignments: 4,
        totalAssignments: 12,
        lastActive: "5 days ago",
        status: "atRisk"
      },
      {
        id: 4,
        studentId: "S202149275",
        name: "David Wilson",
        email: "d.wilson@university.edu",
        avatarUrl: "https://source.unsplash.com/random/100x100?portrait,man,2",
        progress: 25,
        gradeToDate: "F",
        completedAssignments: 3,
        totalAssignments: 12,
        lastActive: "Just now",
        status: "atRisk"
      }
    ],
    4: [
      {
        id: 2,
        studentId: "S202135892",
        name: "Michael Chen",
        email: "m.chen@university.edu",
        avatarUrl: "https://source.unsplash.com/random/100x100?portrait,man,1",
        progress: 85,
        gradeToDate: "A-",
        completedAssignments: 13,
        totalAssignments: 15,
        lastActive: "1 day ago",
        status: "excellent"
      },
      {
        id: 4,
        studentId: "S202149275",
        name: "David Wilson",
        email: "d.wilson@university.edu",
        avatarUrl: "https://source.unsplash.com/random/100x100?portrait,man,2",
        progress: 60,
        gradeToDate: "B-",
        completedAssignments: 9,
        totalAssignments: 15,
        lastActive: "Just now",
        status: "active"
      },
      {
        id: 6,
        studentId: "S202183746",
        name: "James Taylor",
        email: "j.taylor@university.edu",
        avatarUrl: "https://source.unsplash.com/random/100x100?portrait,man,3",
        progress: 92,
        gradeToDate: "A",
        completedAssignments: 15,
        totalAssignments: 15,
        lastActive: "6 hours ago",
        status: "excellent"
      }
    ]
  };

  useEffect(() => {
    // Fetch instructor courses
    setLoading(true);
    
    setTimeout(() => {
      setInstructorCourses(mockInstructorCourses);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // When a course is selected, fetch its students
    if (selectedCourse) {
      setLoading(true);
      
      setTimeout(() => {
        const courseStudents = mockStudentsByCourse[selectedCourse.id] || [];
        setStudents(courseStudents);
        setLoading(false);
      }, 600);
    } else {
      setStudents([]);
    }
  }, [selectedCourse]);

  // Filter and sort students
  const filteredStudents = students.filter(student => {
    // Apply search filter
    if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !student.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !student.studentId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (filterOption === 'atRisk' && student.status !== 'atRisk') return false;
    if (filterOption === 'excellent' && student.status !== 'excellent') return false;
    if (filterOption === 'active' && student.status !== 'active') return false;
    
    return true;
  }).sort((a, b) => {
    // Apply sorting
    switch(sortOption) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'progress-high':
        return b.progress - a.progress;
      case 'progress-low':
        return a.progress - b.progress;
      case 'id':
        return a.studentId.localeCompare(b.studentId);
      case 'grade':
        return a.gradeToDate.localeCompare(b.gradeToDate);
      default:
        return 0;
    }
  });

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setFilterOption('all');
    setSearchTerm('');
  };

  const handleViewStudentDetail = (studentId) => {
    if (selectedCourse) {
      navigate(`/instructor/student-progress/${studentId}?course=${selectedCourse.id}`);
    }
  };

  return (
    <div className="student-progress-page">
      <div className="instructor-dashboard-header">
        <div>
          <h1 className="instructor-title">Student Progress</h1>
          <p className="instructor-subtitle">Track academic performance of students in your courses</p>
        </div>
      </div>

      <div className="view-selection">
        <button 
          className={`view-tab ${activeView === 'byCourse' ? 'active' : ''}`}
          onClick={() => setActiveView('byCourse')}
        >
          <Users size={18} />
          By Course
        </button>
      </div>

      <div className="courses-container">
        <h2 className="section-title">Your Courses</h2>
        
        {loading && !instructorCourses.length ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : (
          <div className="instructor-courses-grid">
            {instructorCourses.map(course => (
              <div 
                key={course.id}
                className={`course-card ${selectedCourse && selectedCourse.id === course.id ? 'selected' : ''}`}
                onClick={() => handleCourseSelect(course)}
              >
                <div className="course-header">
                  <div className="course-code">{course.code}</div>
                  <div className="course-term">{course.term} • Section {course.section}</div>
                </div>
                <h3 className="course-title">{course.title}</h3>
                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-label">Students</span>
                    <span className="stat-value">{course.enrolledCount}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">At Risk</span>
                    <span className="stat-value risk">{course.atRiskCount}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Avg. Progress</span>
                    <span className="stat-value">{course.averageProgress}%</span>
                  </div>
                </div>
                {selectedCourse && selectedCourse.id === course.id && (
                  <div className="selected-indicator">
                    <span>Currently Viewing</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <div className="students-container">
          <div className="section-header">
            <h2 className="section-title">
              Students in {selectedCourse.code}: {selectedCourse.title}
            </h2>
            <div className="section-meta">
              <span>Section {selectedCourse.section}</span>
              <span className="dot-separator">•</span>
              <span>{selectedCourse.term}</span>
              <span className="dot-separator">•</span>
              <span>{selectedCourse.enrolledCount} Enrolled</span>
            </div>
          </div>

          {/* Simplified and improved student filtering tabs */}
          <div className="student-filters">
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filterOption === 'all' ? 'active' : ''}`}
                onClick={() => setFilterOption('all')}
              >
                <Users size={16} />
                <span>All Students</span>
                <span className="tab-count">{students.length}</span>
              </button>
              
              <button 
                className={`filter-tab ${filterOption === 'atRisk' ? 'active' : ''}`}
                onClick={() => setFilterOption('atRisk')}
              >
                <AlertTriangle size={16} />
                <span>At Risk</span>
                <span className="tab-count">
                  {students.filter(s => s.status === 'atRisk').length}
                </span>
              </button>
              
              <button 
                className={`filter-tab ${filterOption === 'excellent' ? 'active' : ''}`}
                onClick={() => setFilterOption('excellent')}
              >
                <Trophy size={16} />
                <span>Top Performers</span>
                <span className="tab-count">
                  {students.filter(s => s.status === 'excellent').length}
                </span>
              </button>
              
              <button 
                className={`filter-tab ${filterOption === 'active' ? 'active' : ''}`}
                onClick={() => setFilterOption('active')}
              >
                <Clock size={16} />
                <span>Active</span>
                <span className="tab-count">
                  {students.filter(s => s.status === 'active').length}
                </span>
              </button>
            </div>

            <div className="search-sort-controls">
              <div className="search-box">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="sort-box">
                <SortAsc className="sort-icon" size={18} />
                <select 
                  className="sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="id">Student ID</option>
                  <option value="progress-high">Progress (High-Low)</option>
                  <option value="progress-low">Progress (Low-High)</option>
                  <option value="grade">Grade (A-F)</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading student data...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Users size={32} />
              </div>
              <h3>No students found</h3>
              <p>
                {searchTerm || filterOption !== 'all'
                  ? "No students match your search criteria. Try adjusting your filters or search terms."
                  : "There are no students enrolled in this course yet."}
              </p>
            </div>
          ) : (
            <div className="students-table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th className="student-column">Student</th>
                    <th className="id-column">ID</th>
                    <th className="progress-column">Progress</th>
                    <th className="grade-column">Grade</th>
                    <th className="assignments-column">Assignments</th>
                    <th className="last-active-column">Last Active</th>
                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr 
                      key={student.id}
                      className={`student-row ${student.status === 'atRisk' ? 'at-risk' : ''}`}
                    >
                      <td className="student-cell">
                        <div className="student-info">
                          <div className="student-avatar">
                            <img src={student.avatarUrl} alt={`${student.name}'s avatar`} />
                          </div>
                          <div className="student-details">
                            <div className="student-name">{student.name}</div>
                            <div className="student-email">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="id-column">{student.studentId}</td>
                      <td className="progress-column">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${student.progress}%`,
                              backgroundColor: student.progress < 40 ? '#ef4444' : 
                                              student.progress < 70 ? '#eab308' : 
                                              student.progress < 90 ? '#3b82f6' : '#10b981'
                            }}
                          ></div>
                        </div>
                        <div className="progress-percentage">{student.progress}%</div>
                      </td>
                      <td className={`grade-column ${
                        student.gradeToDate.startsWith('A') ? 'grade-a' :
                        student.gradeToDate.startsWith('B') ? 'grade-b' :
                        student.gradeToDate.startsWith('C') ? 'grade-c' :
                        student.gradeToDate.startsWith('D') ? 'grade-d' : 'grade-f'
                      }`}>{student.gradeToDate}</td>
                      <td className="assignments-column">
                        <div className="assignments-cell">
                          <span className="assignments-count">{student.completedAssignments}/{student.totalAssignments}</span>
                          <span className="completion-rate">
                            ({Math.round(student.completedAssignments/student.totalAssignments*100)}%)
                          </span>
                        </div>
                      </td>
                      <td className="last-active-column">{student.lastActive}</td>
                      <td className="actions-column">
                        <button 
                          className="view-details-button"
                          onClick={() => handleViewStudentDetail(student.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentProgress;