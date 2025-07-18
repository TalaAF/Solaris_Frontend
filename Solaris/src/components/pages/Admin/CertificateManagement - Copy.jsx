import React, { useState, useEffect } from "react";
import CertificateTable from "../../../components/admin/CertificateTable";
import CertificateService from "../../../services/CertificateService";
import { toast } from "react-hot-toast";
import "./CertificateManagement.css";

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  
  // Function to fetch certificate templates with pagination
  const fetchCertificateTemplates = async (page = 0, size = 10, filters = {}) => {
    try {
      setLoading(true);
      const response = await CertificateService.getAllCertificateTemplates(page, size, filters);
      
      // Check if we got paginated data or array
      if (response.pagination) {
        setCertificates(Array.isArray(response.data) ? response.data : []);
        setPagination({
          page: response.pagination.number,
          size: response.pagination.size,
          totalElements: response.pagination.totalElements,
          totalPages: response.pagination.totalPages
        });
      } else {
        // Handle simple array response
        setCertificates(Array.isArray(response.data) ? response.data : []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching certificate templates:", error);
      setError("Failed to load certificate templates");
      setLoading(false);
      toast.error("Failed to load certificate templates");
    }
  };

  useEffect(() => {
    fetchCertificateTemplates();
  }, []);

  const handlePageChange = (newPage) => {
    fetchCertificateTemplates(newPage, pagination.size);
  };

  const handleCertificateAdd = async (certificateData) => {
    try {
      // Prepare data for the backend according to expected structure
      const templateData = {
        name: certificateData.name || "New Certificate Template",
      description: certificateData.description || "",
      semesterName: certificateData.semesterName || null,
      // Map 'template' field to 'templateContent' as expected by backend
      templateContent: certificateData.template || "",
      isActive: true
      };
      
      const response = await CertificateService.createCertificateTemplate(templateData);
      setCertificates([...certificates, response.data]);
      toast.success("Certificate template added successfully");
      // Refresh the list to ensure we have the latest data
      fetchCertificateTemplates(pagination.page, pagination.size);
    } catch (error) {
      console.error("Error adding certificate template:", error);
      toast.error("Failed to add certificate template");
    }
  };

  const handleCertificateUpdate = async (certificateData) => {
    try {
      // Prepare data for the backend according to expected structure
      const templateData = {
            name: certificateData.name,
      description: certificateData.description || "",
      semesterName: certificateData.semesterName || null,
      // Map 'template' field to 'templateContent' as expected by backend
      templateContent: certificateData.template || "",
      isActive: certificateData.isActive !== undefined ? certificateData.isActive : true
      };
      
      const response = await CertificateService.updateCertificateTemplate(certificateData.id, templateData);
      
      // Update the certificates state with the updated certificate
      const updatedCertificates = certificates.map(item => 
        item.id === certificateData.id ? response.data : item
      );
      
      setCertificates(updatedCertificates);
      toast.success("Certificate template updated successfully");
    } catch (error) {
      console.error("Error updating certificate template:", error);
      toast.error("Failed to update certificate template");
    }
  };

  const handleCertificateDelete = async (certificateId) => {
    try {
      await CertificateService.deleteCertificateTemplate(certificateId);
      
      // Remove the deleted certificate from the state
      const updatedCertificates = certificates.filter(item => item.id !== certificateId);
      setCertificates(updatedCertificates);
      
      toast.success("Certificate template deleted successfully");
    } catch (error) {
      console.error("Error deleting certificate template:", error);
      toast.error("Failed to delete certificate template");
    }
  };

  const handleSearch = (searchText) => {
    fetchCertificateTemplates(0, pagination.size, { search: searchText });
  };

  const handleFilterChange = (filters) => {
    fetchCertificateTemplates(0, pagination.size, filters);
  };

  if (loading) {
    return <div className="loading-container">Loading certificate templates...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <>
      <div className="admin-certificate-page">
        <div className="admin-certificate-header">
          <h1 className="admin-title">Certificate Management</h1>
          <p className="admin-subtitle">Manage certification templates for courses and programs</p>
        </div>

        <CertificateTable 
          certificates={certificates} 
          onCertificateAdd={handleCertificateAdd} 
          onCertificateUpdate={handleCertificateUpdate}
          onCertificateDelete={handleCertificateDelete}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
      </div>
    </>
  );
};

export default CertificateManagement;