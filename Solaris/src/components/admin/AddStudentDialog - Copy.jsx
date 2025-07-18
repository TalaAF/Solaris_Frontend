import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Dialog from "../common/Dialog";
import AdminUserService from "../../services/AdminUserService";
import "./AddStudentDialog.css";

const AddStudentDialog = ({ isOpen, onClose, onSubmit, courseId, currentStudents = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Safe check for currentStudents to avoid filter errors
  const currentStudentIds = Array.isArray(currentStudents) 
    ? currentStudents.map(student => student.studentId || (student.user && student.user.id))
    : [];

  useEffect(() => {
    if (isOpen) {
      fetchAvailableStudents();
    }
  }, [isOpen, courseId]);

  useEffect(() => {
    // Filter students based on search term
    if (students.length > 0) {
      const filtered = students.filter(student => 
        (student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         student.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const fetchAvailableStudents = async () => {
    setLoading(true);
    try {
      // Use the client-side filtering method to get available students
      const response = await AdminUserService.getAvailableStudentsForCourse(courseId);
      const availableStudents = response.data.content || response.data || [];
      
      setStudents(availableStudents);
      setFilteredStudents(availableStudents);
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load available students");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectStudent = (studentId) => {
    onSubmit(studentId);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Student to Course"
      className="add-student-dialog"
    >
      <div className="search-container">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="student-list">
        {loading ? (
          <div className="loading-message">Loading students...</div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchAvailableStudents}>Retry</button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="no-results">No available students found</div>
        ) : (
          <div className="student-items-container">
            {filteredStudents.map(student => (
              <div key={student.id} className="student-item">
                <div className="student-info">
                  <div className="student-name">
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="student-email">{student.email}</div>
                </div>
                <button
                  className="add-button"
                  onClick={() => handleSelectStudent(student.id)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="dialog-footer">
        <button className="cancel-button" onClick={onClose}>
          Close
        </button>
      </div>
    </Dialog>
  );
};

export default AddStudentDialog;