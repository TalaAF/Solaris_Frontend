import React from 'react';
import { FaUserGraduate } from 'react-icons/fa';
import './styles/AccountSummary.css';

const AccountSummary = ({ profile }) => {
  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-summary-card">
      <div className="card-header">
        <FaUserGraduate className="card-icon" />
        <h2 className="section-heading">Account Summary</h2>
      </div>
      <p className="section-subtitle">A quick overview of your academic status</p>
      <div className="info-list">
        <div className="info-item">
          <span className="label">Student Name:</span>
          <span className="value">{profile.name || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Semester:</span>
          <span className="value">{profile.semester || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Enrolled Courses:</span>
          <span className="value">{profile.enrolledCourses || 0}</span>
        </div>
        <div className="info-item">
          <span className="label">Total Progress:</span>
          <span className="value">
            {profile.progress !== undefined && profile.progress !== null
              ? `${profile.progress}%`
              : 'N/A'}
          </span>
        </div>
        <div className="info-item">
          <span className="label">Status:</span>
          <span className="value">{profile.status || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;