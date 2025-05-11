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
  ChevronsRight,
  Award,
  RefreshCw
} from "lucide-react";
import CourseDialog from "./CourseDialog";
import "./CourseTable.css";
import { formatDate } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import TablePagination from '../ui/TablePagination';
import AdminCourseService from "../../services/AdminCourseService";

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
  onCourseToggleStatus,
  onRefreshEnrollment
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(initialCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("Add Course");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    departmentId: "",
    instructorEmail: "",
    isPublished: "",
    semester: ""
  });
  
  const [departments, setDepartments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [refreshingCourseId, setRefreshingCourseId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (showFilters) {
      fetchFilterOptions();
    }
  }, [showFilters]);

  useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

  const fetchFilterOptions = async () => {
    setFilterLoading(true);
    try {
      console.log("Fetching filter options...");
      
      const [deptResponse, instructorResponse] = await Promise.all([
        AdminCourseService.getDepartments(),
        AdminCourseService.getInstructors()
      ]);
      
      // Log responses for debugging
      console.log("Department response:", deptResponse);
      console.log("Raw instructor response:", instructorResponse);
      
      // Process departments - handle both direct and paginated responses
      const deptData = deptResponse?.data?.content || deptResponse?.data || [];
      setDepartments(Array.isArray(deptData) ? deptData : []);
      
      // Process instructors the same way as CourseDialog does
      const instructorData = instructorResponse?.data?.content || 
                            instructorResponse?.data || [];
      
      console.log("Extracted instructor data:", instructorData);
      console.log(`Found ${Array.isArray(instructorData) ? instructorData.length : 0} instructors`);
      
      // If we have instructors but they're not in the expected format, try to adapt
      if (Array.isArray(instructorData) && instructorData.length > 0) {
        // Check if the first item looks like an instructor
        const firstItem = instructorData[0];
        console.log("First instructor item:", firstItem);
        
        // Check for missing properties that we might need to handle
        if (firstItem && (!firstItem.firstName || !firstItem.lastName || !firstItem.email)) {
          console.warn("Instructor data missing expected properties");
        }
      }
      
      setInstructors(Array.isArray(instructorData) ? instructorData : []);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      setDepartments([]);
      setInstructors([]);
    } finally {
      setFilterLoading(false);
    }
  };

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
      onCourseToggleStatus(course.id, course.published);
    } else {
      const updatedCourses = courses.map(c => 
        c.id === course.id ? { ...c, published: !c.published } : c
      );
      setCourses(updatedCourses);
    }
  };

  const handleSubmitCourse = (formData) => {
    if (selectedCourse) {
      if (onCourseUpdate) {
        onCourseUpdate(selectedCourse.id, formData);
      } else {
        const updatedCourses = courses.map(c => 
          c.id === selectedCourse.id ? { ...formData, id: selectedCourse.id } : c
        );
        setCourses(updatedCourses);
      }
    } else {
      if (onCourseAdd) {
        onCourseAdd(formData);
      } else {
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
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

  const applyFilters = () => {
    if (onFilterChange) {
      // Only include non-empty filters
      const activeFilters = {};
      
      if (searchQuery) activeFilters.search = searchQuery;
      if (filters.departmentId) activeFilters.departmentId = filters.departmentId;
      if (filters.instructorEmail) activeFilters.instructorEmail = filters.instructorEmail;
      if (filters.isPublished) activeFilters.isPublished = filters.isPublished === 'true';
      if (filters.semester) activeFilters.semester = filters.semester; // Add semester filter
      
      onFilterChange(activeFilters);
    }
  };

  const resetFilters = () => {
    setFilters({
      departmentId: "",
      instructorEmail: "",
      isPublished: "",
      semester: "" // Reset semester filter too
    });
    setSearchQuery("");
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };
  
  // Add these handler functions after your other handler functions
  const handleRefreshCourse = async (course) => {
    if (onRefreshEnrollment) {
      setRefreshingCourseId(course.id);
      try {
        await onRefreshEnrollment(course.id);
      } finally {
        setRefreshingCourseId(null);
      }
    }
  };

  const handleRefreshAllCourses = async () => {
    if (onRefreshEnrollment) {
      setRefreshingCourseId('all');
      try {
        await onRefreshEnrollment(); // No argument refreshes all courses
      } finally {
        setRefreshingCourseId(null);
      }
    }
  };

  const getEnrollmentPercentage = (enrolled, capacity) => {
    if (!capacity) return 0;
    return Math.min((enrolled / capacity) * 100, 100);
  };

  const handleViewDetails = (course) => {
    // Pass the entire course object as state when navigating
    navigate(`/admin/courses/${course.id}`, { 
      state: { courseData: course } 
    });
  };

  const handleManageStudents = (course) => {
    // Pass the entire course object as state when navigating
    navigate(`/admin/courses/${course.id}/students`, { 
      state: { courseData: course } 
    });
  };

  const handleSettings = (course) => {
    navigate(`/admin/courses/${course.id}/settings`);
  };

  const handleGenerateCertificates = (course) => {
    // Navigate to certificate generation page with course context
    navigate(`/admin/courses/${course.id}/certificates`, { 
      state: { courseData: course } 
    });
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
          {onRefreshEnrollment && (
            <button 
              className={`refresh-button ${refreshingCourseId === 'all' ? 'refreshing' : ''}`}
              onClick={handleRefreshAllCourses}
              disabled={loading || refreshingCourseId !== null}
            >
              <RefreshCw 
                size={16} 
                className={refreshingCourseId === 'all' ? 'spinning' : ''} 
              />
              <span>Refresh Enrollments</span>
            </button>
          )}
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
              value={filters.departmentId}
              onChange={(e) => setFilters({...filters, departmentId: e.target.value})}
              disabled={filterLoading}
            >
              <option value="">All Departments</option>
              {Array.isArray(departments) && departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Instructor</label>
            <select 
              value={filters.instructorEmail}
              onChange={(e) => setFilters({...filters, instructorEmail: e.target.value})}
              disabled={filterLoading}
              className="form-select"
            >
              <option value="">All Instructors</option>
              {Array.isArray(instructors) && instructors.length > 0 ? 
                instructors.map((instructor) => (
                  <option 
                    key={instructor.id || `instructor-${Math.random()}`} 
                    value={instructor.email}
                  >
                    {instructor.firstName || ''} {instructor.lastName || ''} 
                    {instructor.email ? ` (${instructor.email})` : ''}
                  </option>
                )) : 
                <option value="" disabled>No instructors available</option>
              }
            </select>
            {filterLoading && <div className="filter-loading-indicator">Loading...</div>}
            {!filterLoading && instructors.length === 0 && (
              <div className="filter-empty-message">No instructors found</div>
            )}
          </div>
          <div className="filter-group">
            <label>Semester</label>
            <select
              value={filters.semester}
              onChange={(e) => setFilters({...filters, semester: e.target.value})}
            >
              <option value="">All Semesters</option>
              <option value="Fall 2024">Fall 2024</option>
              <option value="Spring 2025">Spring 2025</option>
              <option value="Summer 2025">Summer 2025</option>
              <option value="Fall 2025">Fall 2025</option>
              <option value="Spring 2026">Spring 2026</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.isPublished}
              onChange={(e) => setFilters({...filters, isPublished: e.target.value})}
            >
              <option value="">All Courses</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
          <div className="filter-actions">
            <button 
              className="apply-filters" 
              onClick={applyFilters}
              disabled={filterLoading}
            >
              Apply Filters
            </button>
            <button 
              className="reset-filters" 
              onClick={resetFilters}
              disabled={filterLoading}
            >
              Reset
            </button>
          </div>
          {filterLoading && <div className="filter-loading">Loading options...</div>}
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
                <th>Semester</th>
                <th>Credits</th>
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
                      <span className="course-semester">
                        {course.semester || "Not specified"}
                      </span>
                    </td>
                    <td>
                      <span className="course-credits">
                        {course.credits || 0}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${course.isPublished ? 'published' : 'draft'}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
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
                          <button className="dropdown-item" onClick={() => handleGenerateCertificates(course)}>
                            <Award size={14} />
                            <span>Generate Certificates</span>
                          </button>
                          <button className="dropdown-item" onClick={() => handleSettings(course)}>
                            <Settings size={14} />
                            <span>Settings</span>
                          </button>
                          {onRefreshEnrollment && (
                            <>
                              <div className="dropdown-divider"></div>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleRefreshCourse(course)}
                                disabled={refreshingCourseId !== null}
                              >
                                <RefreshCw 
                                  size={14} 
                                  className={refreshingCourseId === course.id ? 'spinning' : ''} 
                                />
                                <span>
                                  {refreshingCourseId === course.id 
                                    ? 'Refreshing...' 
                                    : 'Refresh Enrollment'}
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table">No courses found.</td>
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

      {isDialogOpen && (
        <CourseDialog
          course={selectedCourse}
          title={dialogTitle}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmitCourse}
        />
      )}
    </div>
  );
};

export default CourseTable;