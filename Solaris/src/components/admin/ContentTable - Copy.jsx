import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Video, 
  FileType, 
  Presentation, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Eye,
  Trash2,
  Filter
} from "lucide-react";
import ContentDialog from "./ContentDialog";
import ViewContentDialog from "./ViewContentDialog";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import TablePagination from "../ui/TablePagination";
import "./ContentTable.css";
import { formatDate } from "../../utils/dateUtils";
import CourseService from "../../services/CourseService";

const ContentTable = ({ 
  content: initialContent, 
  loading = false,
  pagination = { 
    page: 0, 
    size: 10, 
    totalElements: 0, 
    totalPages: 0 
  },
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onFilterChange,
  onContentAdd, 
  onContentUpdate, 
  onContentToggleStatus, 
  onContentDelete
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [content, setContent] = useState(initialContent || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("Add Content");
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    courseId: "",
    type: ""
  });

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent || []);
  }, [initialContent]);

  // Load courses for filtering
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await CourseService.getCourses();
        if (response.data && response.data.content) {
          setCourses(response.data.content);
        } else if (Array.isArray(response.data)) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Error loading courses for filter:", error);
      }
    };
    
    loadCourses();
  }, []);

  // Handle search with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
    // If backend search is enabled, update filters after a delay
    if (onSearchChange) {
      const timer = setTimeout(() => {
        onSearchChange(e.target.value);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedContent(null);
    setDialogTitle("Add Content");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (contentItem) => {
    setSelectedContent(contentItem);
    setDialogTitle("Edit Content");
    setIsDialogOpen(true);
  };

  const handleViewContent = (contentItem) => {
    setSelectedContent(contentItem);
    setIsViewDialogOpen(true);
  };

  const handleDeleteContent = (contentItem) => {
    setSelectedContent(contentItem);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = (contentItem) => {
    const newStatus = !contentItem.isPublished;
    if (onContentToggleStatus) {
      onContentToggleStatus(contentItem.id, newStatus);
    }
  };

  const handleSubmitContent = (formData) => {
    if (formData.id) {
      // Update existing content
      if (onContentUpdate) {
        onContentUpdate(formData);
      }
    } else {
      // Add new content
      if (onContentAdd) {
        onContentAdd(formData);
      }
    }
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedContent && onContentDelete) {
      onContentDelete(selectedContent.id);
      setIsDeleteDialogOpen(false);
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
      type: ""
    });
    
    if (onFilterChange) {
      onFilterChange({
        search: searchQuery
      });
    }
    setShowFilters(false);
  };

  const getContentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return <Video size={18} className="content-icon video" />;
      case "document":
        return <FileType size={18} className="content-icon document" />;
      case "presentation":
        return <Presentation size={18} className="content-icon presentation" />;
      default:
        return <FileText size={18} className="content-icon lesson" />;
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return "status-badge video";
      case "document":
        return "status-badge document";
      case "presentation":
        return "status-badge presentation";
      default:
        return "status-badge active";
    }
  };

  return (
    <div className="content-table-container">
      <div className="content-table-header">
        <h2>Content</h2>
        <div className="content-table-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="search"
              placeholder="Search content..."
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
            <span>Add Content</span>
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
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Content Type</label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="presentation">Presentation</option>
            </select>
          </div>
          <div className="filter-actions">
            <button className="apply-filters" onClick={applyFilters}>Apply Filters</button>
            <button className="reset-filters" onClick={resetFilters}>Reset</button>
          </div>
        </div>
      )}

      <div className="content-table-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading content...</p>
          </div>
        ) : (
          <table className="content-table">
            <thead>
              <tr>
                <th>Content</th>
                <th>Course</th>
                <th>Type</th>
                <th>Created</th>
                <th>Format</th>
                <th>Size</th>
                <th className="action-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.length > 0 ? (
                content.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="content-info">
                        <div className="content-icon-container">
                          {getContentIcon(item.type)}
                        </div>
                        <div className="content-details">
                          <div className="content-name">{item.title}</div>
                          {item.description && (
                            <div className="content-description">{item.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{item.courseName || "—"}</td>
                    <td>
                      <span className={getTypeBadgeClass(item.type)}>
                        {item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Document'}
                      </span>
                    </td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.fileType || "—"}</td>
                    <td>{item.fileSize ? `${Math.round(item.fileSize / 1024)} KB` : "—"}</td>
                    <td className="action-cell">
                      <div className="dropdown">
                        <button className="dropdown-trigger">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="dropdown-menu">
                          <div className="dropdown-header">Actions</div>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item" onClick={() => handleViewContent(item)}>
                            <Eye size={14} />
                            <span>View Content</span>
                          </button>
                          <button className="dropdown-item" onClick={() => handleOpenEditDialog(item)}>
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <div className="dropdown-divider"></div>
                          <button 
                            className="dropdown-item delete"
                            onClick={() => handleDeleteContent(item)}
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
                  <td colSpan="7" className="empty-table">No content found.</td>
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
          itemName="contents"
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}

      <ContentDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmitContent}
        content={selectedContent}
        title={dialogTitle}
      />

      {isViewDialogOpen && selectedContent && (
        <ViewContentDialog
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          content={selectedContent}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Content"
        description={`Are you sure you want to delete "${selectedContent?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ContentTable;