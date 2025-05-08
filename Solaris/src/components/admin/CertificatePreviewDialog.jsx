import React from "react";
import Dialog from "../common/Dialog";
import { Award } from "lucide-react";
import "./CertificatePreviewDialog.css";

const CertificatePreviewDialog = ({ isOpen, onClose, template, certificateName }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Certificate Template Preview"
      maxWidth="auto"
      className="certificate-preview"
    >
      <div className="certificate-preview-container">
        <div className="certificate-document">
          <div className="certificate-content">
            <p className="certificate-subtext">This is to certify that</p>
            <p className="certificate-student-name">[Student Name]</p>
            <p className="certificate-subtext">has successfully completed the requirements for</p>
            <h2 className="certificate-course-name">{certificateName}</h2>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CertificatePreviewDialog;