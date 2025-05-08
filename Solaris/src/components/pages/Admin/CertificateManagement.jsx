import React, { useState, useEffect } from "react";
import CertificateTable from "../../../components/admin/CertificateTable";
import CertificateService from "../../../services/CertificateService";
import { toast } from "react-hot-toast";
import "./CertificateManagement.css";

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificateTemplates = async () => {
      try {
        setLoading(true);
        const response = await CertificateService.getAllCertificateTemplates();
        // Make sure we're getting an array of certificates
        setCertificates(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching certificate templates:", error);
        setError("Failed to load certificate templates");
        setLoading(false);
        toast.error("Failed to load certificate templates");
      }
    };

    fetchCertificateTemplates();
  }, []);

  const handleCertificateAdd = async (certificateData) => {
    try {
      const response = await CertificateService.createCertificateTemplate(certificateData);
      setCertificates([...certificates, response.data]);
      toast.success("Certificate template added successfully");
    } catch (error) {
      console.error("Error adding certificate template:", error);
      toast.error("Failed to add certificate template");
    }
  };

  const handleCertificateUpdate = async (certificateData) => {
    try {
      const response = await CertificateService.updateCertificateTemplate(certificateData.id, certificateData);
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
      const updatedCertificates = certificates.filter(item => item.id !== certificateId);
      setCertificates(updatedCertificates);
      toast.success("Certificate template deleted successfully");
    } catch (error) {
      console.error("Error deleting certificate template:", error);
      toast.error("Failed to delete certificate template");
    }
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
        />
      </div>
    </>
  );
};

export default CertificateManagement;