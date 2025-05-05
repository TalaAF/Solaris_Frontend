// src/components/pages/Enrollment.jsx
import React from 'react';
import EnrollmentInterface from '../enrollment/EnrollmentInterface';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function Enrollment() {
  return (
    <div className="content-wrapper">
      <div className="enrollment-page-container">
        <div className="course-view-breadcrumb">
          <Link to="/dashboard" className="back-link">
            <ChevronLeft className="chevron-icon" size={16} />
            Back to Dashboard
          </Link>
        </div>
        
        <h1 className="page-title">Course Enrollment</h1>
        
        <EnrollmentInterface />
      </div>
    </div>
  );
}

export default Enrollment;