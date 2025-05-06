import React, { useState } from "react";
import Dialog from "../common/Dialog";
import { FileText, Video, FileType, Presentation, Clock, Calendar, User } from "lucide-react";
import "./ViewContentDialog.css";
import { formatDate } from "../../utils/dateUtils";

const ViewContentDialog = ({ isOpen, onClose, content }) => {
  const [activeTab, setActiveTab] = useState("details");

  // Mock content data for demonstration
  const mockContentData = {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.\n\nProin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.",
    attachments: [
      { id: 1, name: "lesson-slides.pdf", type: "pdf", size: "2.4 MB" },
      { id: 2, name: "example-video.mp4", type: "video", size: "14.7 MB" }
    ]
  };

  const getContentIcon = (type) => {
    switch (type) {
      case "lesson":
        return <FileText className="content-type-icon" />;
      case "video":
        return <Video className="content-type-icon" />;
      case "document":
        return <FileType className="content-type-icon" />;
      case "presentation":
        return <Presentation className="content-type-icon" />;
      default:
        return <FileText className="content-type-icon" />;
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

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="file-icon" />;
      case "video":
        return <Video className="file-icon" />;
      default:
        return <FileType className="file-icon" />;
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="View Content"
      maxWidth="800px"
    >
      <div className="view-content-container">
        <div className="content-header">
          <div className="content-icon-wrapper">
            {getContentIcon(content.type)}
          </div>
          <div className="content-title-info">
            <h2 className="content-title">{content.title}</h2>
            <div className="content-meta">
              <span className={getTypeBadgeClass(content.type)}>
                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
              </span>
              <span className="content-course">{content.courseName}</span>
            </div>
          </div>
        </div>

        <div className="content-tabs">
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button 
            className={`tab-button ${activeTab === 'attachments' ? 'active' : ''}`}
            onClick={() => setActiveTab('attachments')}
          >
            Attachments
          </button>
        </div>

        <div className="content-tab-content">
          {activeTab === 'details' && (
            <div className="content-details">
              <div className="detail-item">
                <div className="detail-label">
                  <User size={16} />
                  <span>Created by</span>
                </div>
                <div className="detail-value">{content.createdBy || "Admin User"}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">
                  <Calendar size={16} />
                  <span>Created date</span>
                </div>
                <div className="detail-value">{formatDate(content.createdAt)}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">
                  <Clock size={16} />
                  <span>Duration</span>
                </div>
                <div className="detail-value">{content.duration} minutes</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">
                  <span>Status</span>
                </div>
                <div className="detail-value">
                  <span className={`status-badge ${content.isPublished ? "published" : "draft"}`}>
                    {content.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'content' && (
            <div className="content-body">
              <div className="content-text">
                <p>{mockContentData.text}</p>
              </div>
              
              {content.type === 'video' && (
                <div className="video-container">
                  <div className="video-placeholder">
                    <Video size={48} />
                    <p>Video content would appear here</p>
                  </div>
                </div>
              )}
              
              {content.type === 'presentation' && (
                <div className="presentation-container">
                  <div className="presentation-placeholder">
                    <Presentation size={48} />
                    <p>Presentation slides would appear here</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'attachments' && (
            <div className="content-attachments">
              {mockContentData.attachments.length > 0 ? (
                <ul className="attachments-list">
                  {mockContentData.attachments.map(attachment => (
                    <li key={attachment.id} className="attachment-item">
                      <div className="attachment-icon">
                        {getFileIcon(attachment.type)}
                      </div>
                      <div className="attachment-info">
                        <div className="attachment-name">{attachment.name}</div>
                        <div className="attachment-size">{attachment.size}</div>
                      </div>
                      <button className="attachment-download-button">
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-attachments">
                  <p>No attachments for this content</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ViewContentDialog;