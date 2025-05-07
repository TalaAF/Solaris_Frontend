import React, { useState } from "react";
import { Search, UserRound, MoreHorizontal, UserMinus, UserCheck, UserX } from "lucide-react";
import "./CourseStudentTable.css";

const CourseStudentTable = ({ students, onToggleStatus, onRemoveStudent }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredStudents = students.filter(student => 
    student.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadgeClass = (status) => {
    return status === "active" ? "status-badge active" : "status-badge inactive";
  };
  
  return (
    <div className="students-table-container">
      <div className="students-table-header">
        <h2>Enrolled Students</h2>
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="search"
            placeholder="Search students..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="students-table-wrapper">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Enrollment Date</th>
              <th>Progress</th>
              <th>Grade</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="student-info">
                    <div className="avatar-circle">
                      <UserRound className="student-icon" />
                    </div>
                    <span className="student-name">{student.user?.fullName || "Unknown Student"}</span>
                  </div>
                </td>
                <td>{student.user?.email || "N/A"}</td>
                <td>
                  {student.enrollmentDate 
                    ? new Date(student.enrollmentDate).toLocaleDateString()
                    : "N/A"
                  }
                </td>
                <td>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-value" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{student.progress}%</span>
                  </div>
                </td>
                <td>{student.grade}</td>
                <td>
                  <span className={getStatusBadgeClass(student.status)}>
                    {student.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="action-cell">
                  <div className="dropdown">
                    <button className="dropdown-trigger">
                      <MoreHorizontal size={16} />
                    </button>
                    <div className="dropdown-menu">
                      <div className="dropdown-header">Actions</div>
                      <div className="dropdown-divider"></div>
                      <button 
                        className="dropdown-item" 
                        onClick={() => onToggleStatus(student.id)}
                      >
                        {student.status === "active" ? (
                          <>
                            <UserX size={14} />
                            <span>Set Inactive</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} />
                            <span>Set Active</span>
                          </>
                        )}
                      </button>
                      <div className="dropdown-divider"></div>
                      <button 
                        className="dropdown-item delete" 
                        onClick={() => onRemoveStudent(student.id)}
                      >
                        <UserMinus size={14} />
                        <span>Remove from Course</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="empty-table">
                  No students enrolled in this course
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseStudentTable;