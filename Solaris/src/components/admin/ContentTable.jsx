import React, { useState } from "react";
import { 
  FileText, 
  Video, 
  FileType, 
  Presentation, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Eye 
} from "lucide-react";
import ContentDialog from "./ContentDialog";
import ViewContentDialog from "./ViewContentDialog";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import "./ContentTable.css";
import { formatDate } from "../../utils/dateUtils";

const ContentTable = ({ content: initialContent, onContentAdd, onContentUpdate, onContentToggleStatus, onContentDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [content, setContent] = useState(initialContent);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("Add Content");

  const filteredContent = content.filter((item) => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    const updatedContent = content.map(item => 
      item.id === contentItem.id ? { ...item, isPublished: newStatus } : item
    );
    setContent(updatedContent);
    
    if (onContentToggleStatus) {
      onContentToggleStatus(contentItem.id, newStatus);
    }
  };

  const handleSubmitContent = (formData) => {
    if (formData.id) {
      // Update existing content
      const updatedContent = content.map(item => 
        item.id === formData.id ? { ...formData } : item
      );
      setContent(updatedContent);
      
      if (onContentUpdate) {
        onContentUpdate(formData);
      }
    } else {
      // Add new content
      const newContent = {
        ...formData,
        id: Math.max(...content.map(item => item.id), 0) + 1,
        createdAt: new Date().toISOString()
      };
      setContent([...content, newContent]);
      
      if (onContentAdd) {
        onContentAdd(newContent);
      }
    }
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedContent) {
      const updatedContent = content.filter(item => item.id !== selectedContent.id);
      setContent(updatedContent);
      
      if (onContentDelete) {
        onContentDelete(selectedContent.id);
      }
      
      setIsDeleteDialogOpen(false);
    }
  };

  const getContentIcon = (type) => {
    switch (type) {
      case "lesson":
        return <FileText className="content-icon" />;
      case "video":
        return <Video className="content-icon" />;
      case "document":
        return <FileType className="content-icon" />;
      case "presentation":
        return <Presentation className="content-icon" />;
      default:
        return <FileText className="content-icon" />;
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "lesson":
        return "type-badge lesson";
      case "video":
        return "type-badge video";
      case "document":
        return "type-badge document";
      case "presentation":
        return "type-badge presentation";
      default:
        return "type-badge lesson";
    }
  };

  return (
    <div className="content-table-container">
      <div className="content-table-header">
        <h2>Learning Content</h2>
        <div className="content-table-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="search"
              placeholder="Search content..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="add-button" onClick={handleOpenAddDialog}>
            <Plus size={16} />
            <span>Add Content</span>
          </button>
        </div>
      </div>

      <div className="content-table-wrapper">
        <table className="content-table">
          <thead>
            <tr>
              <th>Content</th>
              <th>Course</th>
              <th>Type</th>
              <th>Created By</th>
              <th>Created Date</th>
              <th>Duration</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContent.length > 0 ? (
              filteredContent.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="content-info">
                      <div className="content-icon-container">
                        {getContentIcon(item.type)}
                      </div>
                      <div className="content-title">{item.title}</div>
                    </div>
                  </td>
                  <td>{item.courseName}</td>
                  <td>
                    <span className={getTypeBadgeClass(item.type)}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </td>
                  <td>{item.createdBy}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{item.duration} min</td>
                  <td>
                    <span className={`status-badge ${item.isPublished ? "published" : "draft"}`}>
                      {item.isPublished ? "Published" : "Draft"}
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
                        <button className="dropdown-item" onClick={() => handleOpenEditDialog(item)}>
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button className="dropdown-item" onClick={() => handleViewContent(item)}>
                          <Eye size={14} />
                          <span>View Content</span>
                        </button>
                        <button 
                          className={`dropdown-item ${item.isPublished ? "unpublish" : "publish"}`}
                          onClick={() => handleToggleStatus(item)}
                        >
                          <span>{item.isPublished ? "Unpublish" : "Publish"}</span>
                        </button>
                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item delete"
                          onClick={() => handleDeleteContent(item)}
                        >
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-table">No content found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
        description="Are you sure you want to delete this content? This action cannot be undone."
      />
    </div>
  );
};

export default ContentTable;