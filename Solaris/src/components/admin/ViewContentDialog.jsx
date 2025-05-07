import React, { useState } from "react";
import Dialog from "../common/Dialog";
import { 
  FileText, 
  Video, 
  FileType, 
  Presentation, 
  Calendar, 
  Clock,
  User,
  BookOpen,
  Tag,
  Download
} from "lucide-react";
import "./ViewContentDialog.css";
import { formatDate } from "../../utils/dateUtils";

const ViewContentDialog = ({ isOpen, onClose, content }) => {
  const [activeTab, setActiveTab] = useState("details");

  if (!content) return null;
  
  const getContentIcon = () => {
    switch (content.type?.toLowerCase()) {
      case "video":
        return <Video size={24} className="content-type-icon video" />;
      case "document":
        return <FileType size={24} className="content-type-icon document" />;
      case "presentation":
        return <Presentation size={24} className="content-type-icon presentation" />;
      default:
        return <FileText size={24} className="content-type-icon lesson" />;
    }
  };

  const handleDownload = () => {
    // In a real app, this would download the file from the server
    const link = document.createElement('a');
    link.href = content.filePath; // This should be a valid URL in production
    link.download = content.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    } else {
      return `${(kb / 1024).toFixed(2)} MB`;
    }
  };

  const renderPreview = () => {
    // This is a simplified preview. In a real app, you'd have different
    // preview components based on content type (PDF viewer, video player, etc.)
    if (content.type?.toLowerCase() === 'video') {
      return (
        <div className="video-preview">
          <div className="video-placeholder">
            <Video size={48} />
            <span>Video Preview</span>
          </div>
        </div>
      );
    }
    
    if (content.filePath && content.fileType?.includes('pdf')) {
      return (
        <div className="pdf-preview">
          <div className="pdf-placeholder">
            <FileText size={48} />
            <span>PDF Preview</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="content-description-preview">
        {content.description || "No preview available for this content type."}
      </div>
    );
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
          <div className="content-title-row">
            {getContentIcon()}
            <h2>{content.title}</h2>
          </div>
          
          <div className="content-status">
            <span className={`status-badge ${content.isPublished ? 'published' : 'draft'}`}>
              {content.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        
        <div className="content-preview-section">
          <h3>Preview</h3>
          <div className="content-preview">
            {renderPreview()}
          </div>
        </div>
        
        <div className="content-metadata">
          <div className="metadata-section">
            <h3>Content Information</h3>
            <div className="metadata-grid">
              <div className="metadata-item">
                <BookOpen size={16} />
                <div className="metadata-label">Course</div>
                <div className="metadata-value">{content.courseName || 'No course assigned'}</div>
              </div>
              
              <div className="metadata-item">
                <Calendar size={16} />
                <div className="metadata-label">Created</div>
                <div className="metadata-value">{formatDate(content.createdAt)}</div>
              </div>
              
              <div className="metadata-item">
                <Clock size={16} />
                <div className="metadata-label">Updated</div>
                <div className="metadata-value">{formatDate(content.updatedAt)}</div>
              </div>
              
              <div className="metadata-item">
                <Clock size={16} />
                <div className="metadata-label">Duration</div>
                <div className="metadata-value">{content.duration || 'N/A'} minutes</div>
              </div>
              
              {content.tags && content.tags.length > 0 && (
                <div className="metadata-item">
                  <Tag size={16} />
                  <div className="metadata-label">Tags</div>
                  <div className="metadata-value tags-list">
                    {content.tags.map(tag => (
                      <span key={tag} className="content-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="metadata-section">
            <h3>File Details</h3>
            <div className="metadata-grid">
              <div className="metadata-item">
                <FileType size={16} />
                <div className="metadata-label">File Type</div>
                <div className="metadata-value">{content.fileType || 'Unknown'}</div>
              </div>
              
              <div className="metadata-item">
                <Clock size={16} />
                <div className="metadata-label">File Size</div>
                <div className="metadata-value">{formatFileSize(content.fileSize)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="content-actions">
          <button className="download-button" onClick={handleDownload}>
            <Download size={16} />
            <span>Download File</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewContentDialog;