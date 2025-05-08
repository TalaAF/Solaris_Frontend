import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Search,
  Settings,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import CourseDialog from "./CourseDialog";
import "./CourseTable.css";
import { formatDate } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import TablePagination from '../ui/TablePagination';

const CourseTable = ({ 
  courses: initialCourses, 
  loading = false,
  pagination = { 
    page: 0, 
    size: 10, 
    totalElements: 0, 
    totalPages: 0 
  },
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  onCourseAdd, 
  onCourseUpdate, 
  onCourseToggleStatus 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(initialCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("Add Course");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    instructor: "",
    status: ""
  });
  const navigate = useNavigate();

  // Update courses when initialCourses prop changes
  useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

  // Client-side filtering for search input
  const filteredCourses = courses.filter((course) => 
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (onCourseToggleStatus) {
      // Pass the current status to determine the action
      onCourseToggleStatus(course.id, course.published);
    } else {
      // Client-side fallback
      const updatedCourses = courses.map(c => 
        c.id === course.id ? { ...c, published: !c.published } : c
      );
      setCourses(updatedCourses);
    }
  };

  const handleSubmitCourse = (formData) => {
    if (selectedCourse) {
      // Update existing course
      if (onCourseUpdate) {
        onCourseUpdate(selectedCourse.id, formData);
      } else {
        // Client-side fallback
        const updatedCourses = courses.map(c => 
          c.id === selectedCourse.id ? { ...formData, id: selectedCourse.id } : c
        );
        setCourses(updatedCourses);
      }
    } else {
      // Add new course
      if (onCourseAdd) {
        onCourseAdd(formData);
      } else {
        // Client-side fallback
        const newCourse = {
          ...formData,
          id: Math.max(...courses.map(c => c.id), 0) + 1,
          enrolledStudents: 0
        };
        setCourses([...courses, newCourse]);
      }
    }
    setIsDialogOpen(false);
  };

  // Calculate enrollment percentage
  const getEnrollmentPercentage = (enrolled, capacity) => {
    if (!capacity) return 0;
    return Math.min((enrolled / capacity) * 100, 100);
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

  // Handle search with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
    // If backend search is enabled, update filters after a delay
    if (onFilterChange) {
      const timer = setTimeout(() => {
        onFilterChange({
          ...filters,
          search: e.target.value
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  };

  // Apply filters to backend
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        search: searchQuery
      });
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      department: "",
      instructor: "",
      status: ""
    });
    
    if (onFilterChange) {
      onFilterChange({
        search: searchQuery
      });
    }
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
              onChange={handleSearchChange}
              onKeyUp={(e) => e.key === 'Enter' && applyFilters()}
            />
            <button 
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <Filter size={18} />
            </button>
          </div>
          <button className="add-button" onClick={handleOpenAddDialog}>
            <Plus size={16} />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Department</label>
            <select 
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
            >
              <option value="">All Departments</option>
              <option value="5">Computer Science</option>
              <option value="3">Physics</option>
              <option value="2">Mathematics</option>
              <option value="1">Administration</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Instructor</label>
            <select 
              value={filters.instructor}
              onChange={(e) => setFilters({...filters, instructor: e.target.value})}
            >
              <option value="">All Instructors</option>
              <option value="1">John Doe</option>
              <option value="2">Jane Smith</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="filter-actions">
            <button className="apply-filters" onClick={applyFilters}>Apply Filters</button>
            <button className="reset-filters" onClick={resetFilters}>Reset</button>
          </div>
        </div>
      )}

      <div className="course-table-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : (
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
                          {course.description && (
                            <div className="course-description">{course.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{course.departmentName || (course.department && course.department.name)}</td>
                    <td>{course.instructorName || (course.instructor && course.instructor.name)}</td>
                    <td>
                      <div className="enrollment-info">
                        <div className="enrollment-text">
                          {course.students?.length || course.enrolledStudents || 0}/{course.maxCapacity || 0} students
                        </div>
                        <div className="enrollment-progress-container">
                          <div 
                            className="enrollment-progress" 
                            style={{ 
                              width: `${getEnrollmentPercentage(
                                course.students?.length || course.enrolledStudents || 0, 
                                course.maxCapacity
                              )}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="course-dates">
                        {course.startDate && course.endDate ? (
                          <>
                            <span>{formatDate(course.startDate)}</span> - 
                            <span>{formatDate(course.endDate)}</span>
                          </>
                        ) : (
                          <span>No dates set</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${course.published ? "active" : "inactive"}`}>
                        {course.published ? "Published" : "Unpublished"}
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
                            className={`dropdown-item ${course.published ? "deactivate" : "activate"}`}
                            onClick={() => handleToggleStatus(course)}
                          >
                            <span>{course.published ? "Unpublish" : "Publish"}</span>
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
        )}
      </div>

      {/* Pagination controls */}
      {!loading && (
        <TablePagination
          totalItems={pagination.totalElements}
          currentPage={pagination.page}
          pageSize={pagination.size}
          itemName="courses"
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}

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