import React, { useState } from "react";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Search,
  Settings,
  Eye
} from "lucide-react";
import CourseDialog from "./CourseDialog";
import "./CourseTable.css";
import { formatDate } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const CourseTable = ({ courses: initialCourses, onCourseAdd, onCourseUpdate, onCourseToggleStatus }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(initialCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("Add Course");
  const navigate = useNavigate();

  const filteredCourses = courses.filter((course) => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddDialog = () => {
    setSelectedCourse(null);
    setDialogTitle("Add Course");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (course) => {
    setSelectedCourse(course);
    setDialogTitle("Edit Course");
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (course) => {
    const newStatus = !course.isActive;
    const updatedCourses = courses.map(c => 
      c.id === course.id ? { ...c, isActive: newStatus } : c
    );
    setCourses(updatedCourses);
    
    if (onCourseToggleStatus) {
      onCourseToggleStatus(course.id, newStatus);
    }
  };

  const handleSubmitCourse = (formData) => {
    if (formData.id) {
      // Update existing course
      const updatedCourses = courses.map(c => 
        c.id === formData.id ? { ...formData } : c
      );
      setCourses(updatedCourses);
      
      if (onCourseUpdate) {
        onCourseUpdate(formData);
      }
    } else {
      // Add new course
      const newCourse = {
        ...formData,
        id: Math.max(...courses.map(c => c.id), 0) + 1,
        enrolledStudents: 0
      };
      setCourses([...courses, newCourse]);
      
      if (onCourseAdd) {
        onCourseAdd(newCourse);
      }
    }
    setIsDialogOpen(false);
  };

  // Calculate enrollment percentage
  const getEnrollmentPercentage = (enrolled, capacity) => {
    return (enrolled / capacity) * 100;
  };

  const handleViewDetails = (course) => {
    navigate(`/admin/courses/${course.id}`);
  };

  const handleManageStudents = (course) => {
    navigate(`/admin/courses/${course.id}/students`);
  };

  const handleSettings = (course) => {
    navigate(`/admin/courses/${course.id}/settings`);
  };

  return (
    <div className="course-table-container">
      <div className="course-table-header">
        <h2>Courses</h2>
        <div className="course-table-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="search"
              placeholder="Search courses..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="add-button" onClick={handleOpenAddDialog}>
            <Plus size={16} />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      <div className="course-table-wrapper">
        <table className="course-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Department</th>
              <th>Instructor</th>
              <th>Enrollment</th>
              <th>Duration</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="course-info">
                      <div className="course-icon">
                        <BookOpen size={16} />
                      </div>
                      <div className="course-details">
                        <div className="course-name">{course.title}</div>
                        <div className="course-description">{course.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>{course.departmentName}</td>
                  <td>{course.instructorName}</td>
                  <td>
                    <div className="enrollment-info">
                      <div className="enrollment-text">{course.enrolledStudents}/{course.maxCapacity} students</div>
                      <div className="enrollment-progress-container">
                        <div 
                          className="enrollment-progress" 
                          style={{ width: `${getEnrollmentPercentage(course.enrolledStudents, course.maxCapacity)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="course-dates">
                      <span>{formatDate(course.startDate)}</span> - 
                      <span>{formatDate(course.endDate)}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${course.isActive ? "active" : "inactive"}`}>
                      {course.isActive ? "Active" : "Inactive"}
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
                        <button className="dropdown-item" onClick={() => handleOpenEditDialog(course)}>
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button className="dropdown-item" onClick={() => handleViewDetails(course)}>
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>
                        <button className="dropdown-item" onClick={() => handleManageStudents(course)}>
                          <Users size={14} />
                          <span>Manage Students</span>
                        </button>
                        <button className="dropdown-item" onClick={() => handleSettings(course)}>
                          <Settings size={14} />
                          <span>Settings</span>
                        </button>
                        <div className="dropdown-divider"></div>
                        <button 
                          className={`dropdown-item ${course.isActive ? "deactivate" : "activate"}`}
                          onClick={() => handleToggleStatus(course)}
                        >
                          <span>{course.isActive ? "Deactivate" : "Activate"}</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-table">No courses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CourseDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmitCourse}
        course={selectedCourse}
        title={dialogTitle}
      />
    </div>
  );
};

export default CourseTable;