import React, { useState } from "react";
import { 
  FileText, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Eye 
} from "lucide-react";
import AssessmentDialog from "./AssessmentDialog";
import AssessmentPreviewDialog from "./AssessmentPreviewDialog";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import "./AssessmentTable.css";
import { formatDate } from "../../utils/dateUtils";

const AssessmentTable = ({ 
  assessments: initialAssessments, 
  onAssessmentAdd, 
  onAssessmentUpdate, 
  onAssessmentToggleStatus,
  onAssessmentDelete
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assessments, setAssessments] = useState(initialAssessments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("Add Assessment");

  const filteredAssessments = assessments.filter((assessment) => 
    assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddDialog = () => {
    setSelectedAssessment(null);
    setDialogTitle("Create New Assessment");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (assessment) => {
    setSelectedAssessment(assessment);
    setDialogTitle("Edit Assessment");
    setIsDialogOpen(true);
  };

  const handlePreviewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setIsPreviewDialogOpen(true);
  };

  const handleDeleteAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setIsDeleteDialogOpen(true);
  };

  const handleTogglePublish = (assessment) => {
    const newStatus = !assessment.isPublished;
    const updatedAssessments = assessments.map(item => 
      item.id === assessment.id ? { ...item, isPublished: newStatus } : item
    );
    setAssessments(updatedAssessments);
    
    if (onAssessmentToggleStatus) {
      onAssessmentToggleStatus(assessment.id, newStatus);
    }
  };

  const handleSaveAssessment = (formData) => {
    if (formData.id) {
      // Update existing assessment
      const updatedAssessments = assessments.map(item => 
        item.id === formData.id ? { ...formData } : item
      );
      setAssessments(updatedAssessments);
      
      if (onAssessmentUpdate) {
        onAssessmentUpdate(formData);
      }
    } else {
      // Add new assessment
      const newAssessment = {
        ...formData,
        id: Math.max(...assessments.map(item => item.id), 0) + 1
      };
      setAssessments([...assessments, newAssessment]);
      
      if (onAssessmentAdd) {
        onAssessmentAdd(newAssessment);
      }
    }
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedAssessment) {
      const updatedAssessments = assessments.filter(
        (item) => item.id !== selectedAssessment.id
      );
      setAssessments(updatedAssessments);
      
      if (onAssessmentDelete) {
        onAssessmentDelete(selectedAssessment.id);
      }
      
      setIsDeleteDialogOpen(false);
    }
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
    <div className="assessment-table-container">
      <div className="assessment-table-header">
        <h2>Assessments</h2>
        <div className="assessment-table-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="search"
              placeholder="Search assessments..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="add-button" onClick={handleOpenAddDialog}>
            <Plus size={16} />
            <span>Add Assessment</span>
          </button>
        </div>
      </div>

      <div className="assessment-table-wrapper">
        <table className="assessment-table">
          <thead>
            <tr>
              <th>Assessment</th>
              <th>Course</th>
              <th>Type</th>
              <th>Due Date</th>
              <th>Duration</th>
              <th>Points</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssessments.length > 0 ? (
              filteredAssessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td>
                    <div className="assessment-info">
                      <div className="assessment-icon-container">
                        <FileText className="assessment-icon" />
                      </div>
                      <div>
                        <div className="assessment-title">{assessment.title}</div>
                        <div className="assessment-description">{assessment.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>{assessment.courseName}</td>
                  <td>
                    <span className={getTypeBadgeClass(assessment.type)}>
                      {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
                    </span>
                  </td>
                  <td>{formatDate(assessment.dueDate)}</td>
                  <td>{assessment.duration} min</td>
                  <td>
                    {assessment.passingPoints}/{assessment.totalPoints}
                  </td>
                  <td>
                    <span className={`status-badge ${assessment.isPublished ? "published" : "draft"}`}>
                      {assessment.isPublished ? "Published" : "Draft"}
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
                        <button className="dropdown-item" onClick={() => handlePreviewAssessment(assessment)}>
                          <Eye size={14} />
                          <span>Preview</span>
                        </button>
                        <button 
                          className={`dropdown-item ${assessment.isPublished ? "unpublish" : "publish"}`}
                          onClick={() => handleTogglePublish(assessment)}
                        >
                          <span>{assessment.isPublished ? "Unpublish" : "Publish"}</span>
                        </button>
                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item delete"
                          onClick={() => handleDeleteAssessment(assessment)}
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
                <td colSpan="8" className="empty-table">No assessments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <AssessmentDialog 
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveAssessment}
          assessment={selectedAssessment}
          title={dialogTitle}
        />
      )}

      {isPreviewDialogOpen && selectedAssessment && (
        <AssessmentPreviewDialog
          isOpen={isPreviewDialogOpen}
          onClose={() => setIsPreviewDialogOpen(false)}
          assessment={selectedAssessment}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Assessment"
        description="Are you sure you want to delete this assessment? This action cannot be undone."
      />
    </div>
  );
};

export default AssessmentTable;