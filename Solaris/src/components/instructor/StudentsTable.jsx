import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Download, UserPlus } from 'lucide-react';
import './StudentsTable.css';

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents([
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.j@medical.edu',
          initials: 'SJ',
          courses: ['Anatomy 101', 'Clinical Diagnosis'],
          status: 'Active',
          progress: 78,
          enrolledDate: 'Jan 15, 2023'
        },
        {
          id: 2,
          name: 'Michael Chen',
          email: 'michael.c@medical.edu',
          initials: 'MC',
          courses: ['Medical Ethics', 'Pathology'],
          status: 'Active',
          progress: 92,
          enrolledDate: 'Feb 2, 2023'
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          email: 'emily.r@medical.edu',
          initials: 'ER',
          courses: ['Anatomy 101', 'Pharmacology'],
          status: 'Inactive',
          progress: 45,
          enrolledDate: 'Jan 20, 2023'
        },
        {
          id: 4,
          name: 'David Patel',
          email: 'david.p@medical.edu',
          initials: 'DP',
          courses: ['Clinical Diagnosis', 'Medical Ethics'],
          status: 'Active',
          progress: 67,
          enrolledDate: 'Mar 5, 2023'
        },
        {
          id: 5,
          name: 'Jessica Lee',
          email: 'jessica.l@medical.edu',
          initials: 'JL',
          courses: ['Pathology', 'Pharmacology'],
          status: 'Active',
          progress: 85,
          enrolledDate: 'Feb 10, 2023'
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter students based on search term, course, and status
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = 
      selectedCourse === 'All Courses' || 
      student.courses.includes(selectedCourse);
    
    const matchesStatus = 
      selectedStatus === 'All Status' || 
      student.status === selectedStatus;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  // All unique courses from student data
  const allCourses = ['All Courses', ...new Set(students.flatMap(student => student.courses))];
  
  // All statuses from student data
  const allStatuses = ['All Status', 'Active', 'Inactive'];

  return (
    <div className="students-container">
      <div className="students-header">
        <h1>Students</h1>
        <div className="header-actions">
          <button className="export-button">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button className="add-student-button">
            <UserPlus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      <div className="students-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="dropdown-filters">
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="filter-dropdown"
          >
            {allCourses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-dropdown"
          >
            {allStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Enrolled Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="loading-cell">
                  <div className="loading-spinner"></div>
                  <span>Loading students...</span>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">
                  No students found matching your filters.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="student-cell">
                    <div className="student-avatar" data-initials={student.initials.charAt(0)}></div>
                    <div className="student-info">
                      <div className="student-name">{student.name}</div>
                      <div className="student-email">{student.email}</div>
                    </div>
                  </td>
                  <td className="courses-cell">
                    {student.courses.map((course, index) => (
                      <span key={index} className="course-badge">{course}</span>
                    ))}
                  </td>
                  <td>
                    <span className={`status-badge ${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="date-cell">{student.enrolledDate}</td>
                  <td>
                    <button className="action-button">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsTable;