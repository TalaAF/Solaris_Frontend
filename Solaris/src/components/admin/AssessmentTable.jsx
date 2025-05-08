import React, { useState, useEffect } from "react";
import { 
  FileText, 
  ClipboardCheck,
  FileQuestion,
  Edit, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Eye, 
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
  BarChart2
} from "lucide-react";
import { toast } from "react-hot-toast";
import AssessmentDialog from "./AssessmentDialog";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import TablePagination from "../ui/TablePagination";
import { formatDate } from "../../utils/dateUtils";
import "./AssessmentTable.css";

const AssessmentTable = ({ 
  assessments, 
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
  onAssessmentAdd, 
  onAssessmentUpdate, 
  onAssessmentDelete,
  onAssessmentToggleStatus,
  assessmentType = "assignment" // 'quiz' or 'assignment'
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("Create Assessment");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    courseId: "",
    status: ""
  });

  const handleOpenAddDialog = () => {
    setSelectedAssessment(null);
    setDialogTitle(`Create ${assessmentType === 'quiz' ? 'Quiz' : 'Assignment'}`);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (assessment) => {
    setSelectedAssessment(assessment);
    setDialogTitle(`Edit ${assessmentType === 'quiz' ? 'Quiz' : 'Assignment'}`);
    setIsDialogOpen(true);
  };

  const handleDeleteAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = (assessment) => {
    if (onAssessmentToggleStatus) {
      // For quizzes, we have published property
      // For assignments, we might have a different property name
      const isCurrentlyPublished = assessment.published !== undefined ? 
        assessment.published : assessment.isPublished;
      
      onAssessmentToggleStatus(assessment.id, isCurrentlyPublished);
    }
  };

  const handleSubmitAssessment = (formData) => {
    if (selectedAssessment) {
      // Update existing assessment
      if (onAssessmentUpdate) {
        onAssessmentUpdate(selectedAssessment.id, formData);
      }
    } else {
      // Add new assessment
      if (onAssessmentAdd) {
        onAssessmentAdd(formData);
      }
    }
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedAssessment && onAssessmentDelete) {
      onAssessmentDelete(selectedAssessment.id);
      setIsDeleteDialogOpen(false);
    }
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
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      courseId: "",
      status: ""
    });
    
    if (onFilterChange) {
      onFilterChange({
        search: searchQuery
      });
    }
    setShowFilters(false);
  };

  const getStatusBadgeClass = (assessment) => {
    // For quizzes, we have published property
    // For assignments, we might have isPublished or another property
    const isPublished = assessment.published !== undefined ? 
      assessment.published : assessment.isPublished;
    
    return `status-badge ${isPublished ? "published" : "draft"}`;
  };

  const getAssessmentIcon = (assessment) => {
    if (assessmentType === 'quiz') {
      return <FileQuestion className="assessment-icon" />;
    } else {
      return <ClipboardCheck className="assessment-icon" />;
    }
  };

  return (
    <div className="assessment-table-container">
      <div className="assessment-table-header">
        <h2>{assessmentType === 'quiz' ? 'Quizzes' : 'Assignments'}</h2>
        <div className="assessment-table-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="search"
              placeholder={`Search ${assessmentType === 'quiz' ? 'quizzes' : 'assignments'}...`}
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
            <span>{`Add ${assessmentType === 'quiz' ? 'Quiz' : 'Assignment'}`}</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Course</label>
            <select 
              value={filters.courseId}
              onChange={(e) => setFilters({...filters, courseId: e.target.value})}
            >
              <option value="">All Courses</option>
              {/* You can fetch and populate this dynamically */}
              <option value="1">Introduction to Programming</option>
              <option value="2">Advanced Algorithms</option>
              <option value="3">Machine Learning</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
          <div className="filter-actions">
            <button className="apply-filters" onClick={applyFilters}>Apply Filters</button>
            <button className="reset-filters" onClick={resetFilters}>Reset</button>
          </div>
        </div>
      )}

      <div className="assessment-table-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading {assessmentType === 'quiz' ? 'quizzes' : 'assignments'}...</p>
          </div>
        ) : (
          <table className="assessment-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Course</th>
                {assessmentType === 'quiz' && <th>Questions</th>}
                <th>Due Date</th>
                {assessmentType === 'quiz' && <th>Time Limit</th>}
                {assessmentType === 'assignment' && <th>Max Score</th>}
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments && assessments.length > 0 ? (
                assessments.map((assessment) => (
                  <tr key={assessment.id}>
                    <td>
                      <div className="assessment-info">
                        <div className="assessment-icon-container">
                          {getAssessmentIcon(assessment)}
                        </div>
                        <div>
                          <div className="assessment-title">{assessment.title}</div>
                          {assessment.description && (
                            <div className="assessment-description">{assessment.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{assessment.courseName}</td>
                    {assessmentType === 'quiz' && <td>{assessment.questionCount || 0}</td>}
                    <td>{assessment.dueDate ? formatDate(assessment.dueDate) : assessment.endDate ? formatDate(assessment.endDate) : 'No date set'}</td>
                    {assessmentType === 'quiz' && <td>{assessment.timeLimit ? `${assessment.timeLimit} min` : 'No limit'}</td>}
                    {assessmentType === 'assignment' && <td>{assessment.maxScore || 0}</td>}
                    <td>
                      <span className={getStatusBadgeClass(assessment)}>
                        {assessment.published || assessment.isPublished ? 'Published' : 'Draft'}
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
                          <button className="dropdown-item" onClick={() => handleOpenEditDialog(assessment)}>
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          {assessmentType === 'quiz' && (
                            <button className="dropdown-item" onClick={() => window.location.href = `/admin/quizzes/${assessment.id}/details`}>
                              <Eye size={14} />
                              <span>View Details</span>
                            </button>
                          )}
                          {assessmentType === 'quiz' && (
                            <button className="dropdown-item" onClick={() => window.location.href = `/admin/quizzes/${assessment.id}/analytics`}>
                              <BarChart2 size={14} />
                              <span>Analytics</span>
                            </button>
                          )}
                          <button 
                            className={`dropdown-item ${assessment.published || assessment.isPublished ? "unpublish" : "publish"}`}
                            onClick={() => handleToggleStatus(assessment)}
                          >
                            {assessment.published || assessment.isPublished ? 
                              <><XCircle size={14} /><span>Unpublish</span></> : 
                              <><CheckCircle size={14} /><span>Publish</span></>}
                          </button>
                          <div className="dropdown-divider"></div>
                          <button 
                            className="dropdown-item delete"
                            onClick={() => handleDeleteAssessment(assessment)}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={assessmentType === 'quiz' ? "7" : "6"} className="empty-table">
                    No {assessmentType === 'quiz' ? 'quizzes' : 'assignments'} found.
                  </td>
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
          itemName={assessmentType === 'quiz' ? 'quizzes' : 'assignments'}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}

      {/* Replace the conditional dialog rendering with the unified dialog */}
      {isDialogOpen && (
        <AssessmentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmitAssessment}
          assessment={selectedAssessment}
          title={dialogTitle}
          assessmentType={assessmentType}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${assessmentType === 'quiz' ? 'Quiz' : 'Assignment'}`}
        description={`Are you sure you want to delete this ${assessmentType === 'quiz' ? 'quiz' : 'assignment'}? This action cannot be undone.`}
      />
    </div>
  );
};

export default AssessmentTable;