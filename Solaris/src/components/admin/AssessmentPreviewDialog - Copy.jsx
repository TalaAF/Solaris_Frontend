import React from "react";
import Dialog from "../common/Dialog";
import { FileText } from "lucide-react";
import "./AssessmentPreviewDialog.css";
import { formatDate } from "../../utils/dateUtils";

const AssessmentPreviewDialog = ({ isOpen, onClose, assessment }) => {
  const getStatusBadgeClass = (published) => {
    return published ? "status-badge published" : "status-badge draft";
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "quiz":
        return "type-badge quiz";
      case "exam":
        return "type-badge exam";
      case "assignment":
        return "type-badge assignment";
      default:
        return "type-badge quiz";
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Assessment Preview"
      maxWidth="700px"
    >
      <div className="assessment-preview-container">
        <div className="assessment-preview-header">
          <div className="assessment-preview-icon">
            <FileText />
          </div>
          <div>
            <h2 className="assessment-preview-title">{assessment.title}</h2>
            <div className="assessment-preview-subtitle">
              <span className={getTypeBadgeClass(assessment.type)}>
                {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
              </span>
              <span className="assessment-preview-course">{assessment.courseName}</span>
            </div>
          </div>
        </div>

        <div className="assessment-preview-details">
          <div className="assessment-preview-info">
            <h3>Details</h3>
            <ul className="assessment-preview-list">
              <li>
                <span className="list-label">Due Date:</span>
                <span className="list-value">{formatDate(assessment.dueDate)}</span>
              </li>
              <li>
                <span className="list-label">Duration:</span>
                <span className="list-value">{assessment.duration} minutes</span>
              </li>
              <li>
                <span className="list-label">Total Points:</span>
                <span className="list-value">{assessment.totalPoints}</span>
              </li>
              <li>
                <span className="list-label">Passing Points:</span>
                <span className="list-value">{assessment.passingPoints}</span>
              </li>
              <li>
                <span className="list-label">Status:</span>
                <span className={getStatusBadgeClass(assessment.isPublished)}>
                  {assessment.isPublished ? "Published" : "Draft"}
                </span>
              </li>
            </ul>
          </div>

          <div className="assessment-preview-description">
            <h3>Description</h3>
            <div className="description-content">
              {assessment.description}
            </div>
          </div>
        </div>

        <div className="assessment-preview-content">
          <h3>Assessment Content</h3>
          <div className="assessment-content-placeholder">
            [Assessment questions and content would appear here]
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AssessmentPreviewDialog;