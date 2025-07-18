import React, { useState, useEffect, useRef } from "react";
import { 
  Award, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Eye, 
  Trash2,
  Search 
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

const CertificateTable = ({ 
  certificates = [], 
  onCertificateAdd, 
  onCertificateUpdate, 
  onCertificateDelete,
  pagination,
  onPageChange,
  onSearch,
  onFilterChange
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Add defensive check for certificates
  if (!Array.isArray(certificates)) {
    console.error("certificates prop is not an array:", certificates);
    return <div>Error: Invalid certificate data</div>;
  }

  // When the search query changes, trigger a callback to the parent component
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // If there's a debounce timer, clear it
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Set a debounce timer
    window.searchTimeout = setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      }
    }, 500); // Wait 500ms after user stops typing to trigger search
  };

  // Filter certificates based on search query (for local filtering)
  // Note: This is a fallback to the API-based search
  const filteredCertificates = searchQuery && !onSearch
    ? certificates.filter(cert => 
        cert.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.semesterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : certificates;

  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleOpenAddDialog = () => {
    setSelectedCertificate(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (certificate) => {
    setSelectedCertificate(certificate);
    setIsEditDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleOpenPreviewDialog = (certificate) => {
    setSelectedCertificate(certificate);
    setIsPreviewDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleOpenDeleteDialog = (certificate) => {
    setSelectedCertificate(certificate);
    setIsDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleAddCertificate = (formData) => {
    if (onCertificateAdd) {
      onCertificateAdd(formData);
    }
    
    setIsAddDialogOpen(false);
  };

  const handleUpdateCertificate = (formData) => {
    if (!selectedCertificate) return;
    
    // Ensure id is included in the formData
    const updateData = {
      ...formData,
      id: selectedCertificate.id
    };
    
    if (onCertificateUpdate) {
      onCertificateUpdate(updateData);
    }
    
    setIsEditDialogOpen(false);
    setSelectedCertificate(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedCertificate) return;
    
    if (onCertificateDelete) {
      onCertificateDelete(selectedCertificate.id);
    }
    
    setIsDeleteDialogOpen(false);
    setSelectedCertificate(null);
  };

  return (
    <div className="certificate-table-container">
      <div className="certificate-table-header">
        <h2>Certificate Templates</h2>
        <div className="certificate-table-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={handleSearchChange}
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
              <th>Semester</th>
              
              <th>Issued</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
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
                  <td>{certificate.semesterName || "General"}</td>
                  <td>{certificate.departmentName || "General"}</td>
                  <td>{certificate.issuedCount || 0} students</td>
                  <td>{formatDate(certificate.dateCreated) || formatDate(certificate.formattedCreatedDate)}</td>
                  <td>
                    <span className={`status-badge ${certificate.isActive ? "published" : "draft"}`}>
                      {certificate.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="action-cell">
                    <div className="dropdown" ref={openMenuId === certificate.id ? menuRef : null}>
                      <button 
                        className="dropdown-trigger"
                        onClick={() => toggleMenu(certificate.id)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenuId === certificate.id && (
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
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-table">
                  {searchQuery 
                    ? "No certificate templates match your search." 
                    : "No certificate templates found. Create your first template."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 0}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page + 1} of {pagination.totalPages}
          </span>
          <button 
            className="pagination-button"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

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
          template={selectedCertificate.template || selectedCertificate.templateContent}
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