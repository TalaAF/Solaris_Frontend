import React, { useState } from "react";
import { Search, UserRound, MoreHorizontal, UserMinus, UserCheck, UserX, AlertCircle } from "lucide-react";
import "./CourseStudentTable.css";

const CourseStudentTable = ({ 
  students, 
  onToggleStatus, 
  onRemoveStudent, 
  loading = false, 
  error = null,
  courseTitle = "Course" // Add courseTitle prop with default
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredStudents = students?.filter(student => 
    student.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Enhanced status badge class function to handle all possible enrollment statuses
  const getStatusBadgeClass = (status) => {
    if (!status) return "status-badge inactive";
    
    // Handle both string status values and enum values
    if (typeof status === 'string' && (status === 'active' || status === 'inactive')) {
      return status === "active" ? "status-badge active" : "status-badge inactive";
    }
    
    // Handle enum values from backend
    switch(status) {
      case "APPROVED":
      case "IN_PROGRESS":
        return "status-badge active";
      case "COMPLETED":
        return "status-badge completed";
      case "PENDING":
        return "status-badge pending";
      case "REJECTED":
        return "status-badge rejected";
      case "EXPIRED":
        return "status-badge expired";
      case "CANCELLED":
        return "status-badge inactive";
      default:
        return "status-badge inactive";
    }
  };
  
  // Function to get user-friendly status text
  const getStatusText = (status) => {
    if (!status) return "Inactive";
    
    // Handle string status values
    if (typeof status === 'string' && (status === 'active' || status === 'inactive')) {
      return status === "active" ? "Active" : "Inactive";
    }
    
    // Handle enum values
    switch(status) {
      case "APPROVED":
        return "Active";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "PENDING":
        return "Pending";
      case "REJECTED":
        return "Rejected";
      case "EXPIRED":
        return "Expired";
      case "CANCELLED":
        return "Inactive";
      default:
        return status || "Unknown";
    }
  };
  
  // Check if a status can be toggled
  const canToggleStatus = (status) => {
    if (!status) return true;
    
    // These statuses should not be toggled
    return !["COMPLETED", "REJECTED", "EXPIRED"].includes(status);
  };
  
  return (
    <div className="students-table-container">
      <div className="students-table-header">
        <h2>{courseTitle ? `${courseTitle} Students` : 'Enrolled Students'}</h2>
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
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading students...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <AlertCircle className="error-icon" />
            <p>{error}</p>
            <button className="retry-button">Retry</button>
          </div>
        ) : (
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
                          style={{ width: `${student.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{student.progress || 0}%</span>
                    </div>
                  </td>
                  <td>{student.grade || "N/A"}</td>
                  <td>
                    <span className={getStatusBadgeClass(student.status)}>
                      {getStatusText(student.status)}
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
                        {canToggleStatus(student.status) && (
                          <button 
                            className="dropdown-item" 
                            onClick={() => onToggleStatus(student.id)}
                          >
                            {(student.status === "active" || student.status === "APPROVED" || student.status === "IN_PROGRESS") ? (
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
                        )}
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
        )}
      </div>
    </div>
  );
};

export default CourseStudentTable;