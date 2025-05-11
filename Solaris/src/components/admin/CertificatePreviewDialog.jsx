// CertificatePreviewDialog.js
import React, { useEffect, useRef } from "react";
import { X, Award } from "lucide-react";
import Dialog from "../common/Dialog";
import "./CertificatePreviewDialog.css";

const CertificatePreviewDialog = ({ isOpen, onClose, template, certificateName }) => {
  const dialogRef = useRef(null);
  
  // Handle click outside to close dialog
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener when dialog is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="custom-dialog-overlay">
      <div className="custom-dialog certificate-preview" ref={dialogRef}>
        <div className="custom-dialog-header">
          <h2 className="custom-dialog-title">Certificate Template Preview</h2>
          <button className="custom-dialog-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="custom-dialog-content">
          <div className="certificate-preview-container">
            <div className="certificate-document">
              <div className="certificate-border">
                <div className="certificate-content">
                  <div className="certificate-header">
                    <div className="certificate-seal">
                      <Award size={48} className="award-icon" />
                    </div>
                    <h1 className="certificate-title">
                      {certificateName || "HONOR CERTIFICATE"}
                    </h1>
                    <div className="certificate-seal">
                      <Award size={48} className="award-icon" />
                    </div>
                  </div>
                  
                  <div className="certificate-decoration-line"></div>
                  
                  <p className="certificate-subtext">This is to certify that</p>
                  
                  <p className="certificate-student-name">[Student Name]</p>
                  
                  <p className="certificate-subtext">is hereby recognized for</p>
                  
                  <div className="certificate-decoration-line"></div>
                  
                  <p className="certificate-description">
                    In recognition of exceptional dedication, academic excellence, and commitment 
                    to the highest standards of education.
                  </p>
                  
                  <div className="certificate-footer">
                    <div className="certificate-date-container">
                      <p className="certificate-date">[Date]</p>
                      <div className="date-line"></div>
                      <p className="certificate-date-label">Date</p>
                    </div>
                    
                    <div className="certificate-signature-container">
                      <p className="certificate-signature">[Signature]</p>
                      <div className="signature-line"></div>
                      <p className="certificate-authority">[Issuing Authority]</p>
                      <p className="certificate-title-small">Academic Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreviewDialog;