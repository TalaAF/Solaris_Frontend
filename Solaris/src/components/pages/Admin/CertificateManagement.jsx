import React, { useState } from "react";
import CertificateTable from "../../../components/admin/CertificateTable";
import { certificateTemplates } from "../../../mocks/mockDataAdmin";
import "./CertificateManagement.css";

const CertificateManagement = () => {
  // Make sure we have data and it's an array
  const initialCertificates = Array.isArray(certificateTemplates) ? certificateTemplates : [];
  const [certificates, setCertificates] = useState(initialCertificates);

  console.log("Certificate templates data:", certificates); // Debugging

  const handleCertificateAdd = (certificateData) => {
    console.log("Adding certificate:", certificateData);
    // In a real app, you would make an API call here
    const newCertificate = {
      ...certificateData,
      id: Math.max(0, ...certificates.map((c) => c.id)) + 1,
      issuedCount: 0,
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    setCertificates([...certificates, newCertificate]);
    // Toast notification is handled in the CertificateTable component
  };

  const handleCertificateUpdate = (certificateData) => {
    console.log("Updating certificate:", certificateData);
    // In a real app, you would make an API call here
    const updatedCertificates = certificates.map(item => 
      item.id === certificateData.id ? {
        ...item,
        ...certificateData,
        lastModified: new Date().toISOString()
      } : item
    );
    setCertificates(updatedCertificates);
    // Toast notification is handled in the CertificateTable component
  };

  const handleCertificateDelete = (certificateId) => {
    console.log("Deleting certificate with ID:", certificateId);
    // In a real app, you would make an API call here
    const updatedCertificates = certificates.filter(item => item.id !== certificateId);
    setCertificates(updatedCertificates);
    // Toast notification is handled in the CertificateTable component
  };

  return (
    <>
      <div className="admin-certificate-page">
        <div>
          <h1 className="text-3xl font-bold">Certificate Management</h1>
          <p className="text-gray-500 mt-1">Manage certification templates for courses and programs</p>
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