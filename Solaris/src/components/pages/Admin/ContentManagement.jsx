import React, { useState } from "react";
import Layout from "../../layout/Layout";
import ContentTable from "../../admin/ContentTable";
import { content as initialContent } from "../../../mocks/mockDataAdmin";
import "./ContentManagement.css";

const ContentManagement = () => {
  const [content, setContent] = useState(initialContent || []);

  const handleContentAdd = (contentData) => {
    console.log("Adding content:", contentData);
    // In a real app, you would make an API call here
    const newContent = {
      ...contentData,
      id: Math.max(0, ...content.map((c) => c.id)) + 1,
      createdAt: new Date().toISOString()
    };
    setContent([...content, newContent]);
    alert("Content created successfully");
  };

  const handleContentUpdate = (contentData) => {
    console.log("Updating content:", contentData);
    // In a real app, you would make an API call here
    const updatedContent = content.map(item => 
      item.id === contentData.id ? contentData : item
    );
    setContent(updatedContent);
    alert("Content updated successfully");
  };

  const handleContentToggleStatus = (contentId, newStatus) => {
    console.log(`${newStatus ? "Publishing" : "Unpublishing"} content with ID:`, contentId);
    // In a real app, you would make an API call here
    const updatedContent = content.map(item => 
      item.id === contentId ? { ...item, isPublished: newStatus } : item
    );
    setContent(updatedContent);
    alert(`Content ${newStatus ? "published" : "unpublished"} successfully`);
  };

  const handleContentDelete = (contentId) => {
    console.log("Deleting content with ID:", contentId);
    // In a real app, you would make an API call here
    const updatedContent = content.filter(item => item.id !== contentId);
    setContent(updatedContent);
    alert("Content deleted successfully");
  };

  return (
    <>
      <div className="admin-content-page">
        <div className="admin-content-header">
          <h1 className="admin-title">Content Management</h1>
          <p className="admin-subtitle">Manage course materials and learning content</p>
        </div>

        <ContentTable 
          content={content} 
          onContentAdd={handleContentAdd} 
          onContentUpdate={handleContentUpdate}
          onContentToggleStatus={handleContentToggleStatus}
          onContentDelete={handleContentDelete}
        />
      </div>
    </>
  );
};

export default ContentManagement;