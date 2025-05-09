import React from 'react';
import './styles/AdminBasicInfo.css';

const AdminBasicInfo = ({ admin, onEdit }) => {
  return (
    <div className="admin-basic-info-card">
      <h2 className="section-heading">Basic Info</h2>
      <p className="section-subtitle">Your personal and account details</p>
      <div className="info-list">
        <div className="info-item">
          <span className="label">Full Name:</span>
          <span className="value">{admin.name || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Role:</span>
          <span className="value">{admin.role || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Email:</span>
          <span className="value">{admin.email || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Phone:</span>
          <span className="value">{admin.phone || 'Not provided'}</span>
        </div>
        <div className="info-item">
          <span className="label">Country:</span>
          <span className="value">{admin.country || 'Not provided'}</span>
        </div>
        <div className="info-item">
          <span className="label">Last Login:</span>
          <span className="value">{admin.lastLogin || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Account Status:</span>
          <span className="value">{admin.accountStatus || 'N/A'}</span>
        </div>
      </div>
      <div className="edit-profile-container">
        <button
          onClick={onEdit}
          style={{
            background: 'linear-gradient(to right, #ff8c00, #ff5500)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default AdminBasicInfo;