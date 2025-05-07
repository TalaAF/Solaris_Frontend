import React, { useState, useEffect } from "react";
import ContentTable from "../../admin/ContentTable";
import ContentService from "../../../services/ContentService";
import { toast } from "react-hot-toast";
import "./ContentManagement.css";

const ContentManagement = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: "",
    courseId: "",
    type: ""
  });

  // Fetch content data when component mounts or pagination/filters change
  useEffect(() => {
    fetchContent();
  }, [pagination.page, pagination.size, filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      const response = await ContentService.getAllContents(
        pagination.page,
        pagination.size, 
        filters
      );
      
      // Handle response based on structure
      if (response.data && response.data.content) {
        setContent(response.data.content);
        setPagination(prev => ({
          ...prev,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 1
        }));
      } else if (Array.isArray(response.data)) {
        setContent(response.data);
      } else {
        // Set empty content if response format is unexpected
        setContent([]);
      }
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to load content. Please check your connection and try again later.");
      toast.error("Failed to load content");
      // Set empty content on error
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to check if the component is still mounted before updating state
  const handleContentAdd = async (contentData) => {
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', contentData.title);
      if (contentData.description) {
        formData.append('description', contentData.description);
      }
      if (contentData.type) {
        formData.append('type', contentData.type);
      }
      
      if (contentData.file) {
        formData.append('file', contentData.file);
      }
      
      await ContentService.createContent(contentData.courseId, formData);
      
      toast.success("Content created successfully");
      fetchContent(); // Refresh the list
    } catch (err) {
      console.error("Error adding content:", err);
      toast.error("Failed to add content");
      setLoading(false); // This line is already here, which is good
    }
  };

  // Fix the other handler functions the same way:
  const handleContentUpdate = async (contentData) => {
    try {
      setLoading(true);
      await ContentService.updateContent(
        contentData.id,
        contentData.title,
        contentData.description
      );
      toast.success("Content updated successfully");
      fetchContent(); // Refresh the list
    } catch (err) {
      console.error("Error updating content:", err);
      toast.error("Failed to update content");
      setLoading(false); // Always reset loading state on error
    }
  };

  const handleContentDelete = async (contentId) => {
    try {
      setLoading(true);
      await ContentService.deleteContent(contentId);
      toast.success("Content deleted successfully");
      fetchContent(); // Refresh the list
    } catch (err) {
      console.error("Error deleting content:", err);
      toast.error("Failed to delete content");
      setLoading(false);
    }
  };

  const handleContentToggleStatus = async (contentId, isPublished) => {
    try {
      setLoading(true);
      await ContentService.toggleContentStatus(contentId, isPublished);
      
      toast.success(`Content ${isPublished ? "published" : "unpublished"} successfully`);
      fetchContent(); // Refresh the list
    } catch (err) {
      console.error(`Error ${isPublished ? "publishing" : "unpublishing"} content:`, err);
      toast.error(`Failed to ${isPublished ? "publish" : "unpublish"} content`);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: newSize, page: 0 }));
  };

  const handleSearchChange = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="admin-content-page">
      <div className="admin-content-header">
        <h1 className="admin-title">Content Management</h1>
        <p className="admin-subtitle">Manage course materials and learning content</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <ContentTable 
        content={content} 
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onContentAdd={handleContentAdd} 
        onContentUpdate={handleContentUpdate}
        onContentToggleStatus={handleContentToggleStatus}
        onContentDelete={handleContentDelete}
      />
    </div>
  );
};

export default ContentManagement;