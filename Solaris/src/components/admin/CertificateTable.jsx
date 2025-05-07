import React, { useState } from "react";
import { 
  Award, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Eye, 
  Trash2 
} from "lucide-react";
import CertificateDialog from "./CertificateDialog";
import CertificatePreviewDialog from "./CertificatePreviewDialog";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import "./CertificateTable.css";

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const CertificateTable = ({ certificates = [], onCertificateAdd, onCertificateUpdate, onCertificateDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Add defensive check for certificates
  if (!Array.isArray(certificates)) {
    console.error("certificates prop is not an array:", certificates);
    return <div>Error: Invalid certificate data</div>;
  }

  const filteredCertificates = certificates.filter((certificate) => {
    // Add null/undefined checks for each property
    return (
      (certificate.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (certificate.courseName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (certificate.departmentName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenAddDialog = () => {
    setSelectedCertificate(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (certificate) => {
    setSelectedCertificate(certificate);
    setIsEditDialogOpen(true);
  };

  const handleOpenPreviewDialog = (certificate) => {
    setSelectedCertificate(certificate);
    setIsPreviewDialogOpen(true);
  };

  const handleOpenDeleteDialog = (certificate) => {
    setSelectedCertificate(certificate);
    setIsDeleteDialogOpen(true);
  };

  const handleAddCertificate = (formData) => {
    // Simulate fetching course and department names
    const courseName = "Course Name"; // In a real app would be fetched
    const departmentName = "Department Name"; // In a real app would be fetched
    
    const newCertificate = {
      ...formData,
      id: Math.max(0, ...certificates.map(c => c.id || 0), 0) + 1,
      courseName,
      departmentName,
      issuedCount: 0,
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    if (onCertificateAdd) {
      onCertificateAdd(newCertificate);
    }
    
    setIsAddDialogOpen(false);
    alert("Certificate template added successfully");
  };

  const handleUpdateCertificate = (formData) => {
    if (!selectedCertificate) return;
    
    if (onCertificateUpdate) {
      onCertificateUpdate(formData);
    }
    
    setIsEditDialogOpen(false);
    setSelectedCertificate(null);
    alert("Certificate template updated successfully");
  };

  const handleConfirmDelete = () => {
    if (!selectedCertificate) return;
    
    if (onCertificateDelete) {
      onCertificateDelete(selectedCertificate.id);
    }
    
    setIsDeleteDialogOpen(false);
    setSelectedCertificate(null);
    alert("Certificate template deleted successfully");
  };

  return (
    <div className="certificate-table-container">
      <div className="certificate-table-header">
        <h2>Certificate Templates</h2>
        <div className="certificate-table-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="search"
              placeholder="Search certificates..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="add-button" onClick={handleOpenAddDialog}>
            <Plus size={16} />
            <span>Add Template</span>
          </button>
        </div>
      </div>

      <div className="certificate-table-wrapper">
        <table className="certificate-table">
          <thead>
            <tr>
              <th>Certificate Template</th>
              <th>Course</th>
              <th>Department</th>
              <th>Issued</th>
              <th>Created</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((certificate) => (
                <tr key={certificate.id}>
                  <td>
                    <div className="certificate-info">
                      <div className="certificate-icon-container">
                        <Award className="certificate-icon" />
                      </div>
                      <div>
                        <div className="certificate-title">{certificate.name}</div>
                        <div className="certificate-description">{certificate.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>{certificate.courseName}</td>
                  <td>{certificate.departmentName}</td>
                  <td>{certificate.issuedCount || 0} students</td>
                  <td>{formatDate(certificate.dateCreated)}</td>
                  <td>
                    <span className={`status-badge ${certificate.isActive ? "published" : "draft"}`}>
                      {certificate.isActive ? "Active" : "Inactive"}
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
                        <button className="dropdown-item" onClick={() => handleOpenEditDialog(certificate)}>
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button className="dropdown-item" onClick={() => handleOpenPreviewDialog(certificate)}>
                          <Eye size={14} />
                          <span>Preview Template</span>
                        </button>
                        <button className="dropdown-item">
                          <span>View Issued Certificates</span>
                        </button>
                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item delete"
                          onClick={() => handleOpenDeleteDialog(certificate)}
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
                <td colSpan="7" className="empty-table">
                  No certificate templates found. Create your first template.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Certificate Dialog */}
      {isAddDialogOpen && (
        <CertificateDialog 
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleAddCertificate}
          certificate={null}
          title="Add Certificate Template"
        />
      )}

      {/* Edit Certificate Dialog */}
      {isEditDialogOpen && selectedCertificate && (
        <CertificateDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedCertificate(null);
          }}
          onSave={handleUpdateCertificate}
          certificate={selectedCertificate}
          title="Edit Certificate Template"
        />
      )}

      {/* Preview Certificate Dialog */}
      {isPreviewDialogOpen && selectedCertificate && (
        <CertificatePreviewDialog
          isOpen={isPreviewDialogOpen}
          onClose={() => {
            setIsPreviewDialogOpen(false);
            setSelectedCertificate(null);
          }}
          template={selectedCertificate.template}
          certificateName={selectedCertificate.name}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedCertificate(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Certificate Template"
          description={selectedCertificate 
            ? `Are you sure you want to delete the certificate template "${selectedCertificate.name}"? This action cannot be undone.` 
            : "Are you sure you want to delete this certificate template? This action cannot be undone."
          }
        />
      )}
    </div>
  );
};

export default CertificateTable;