import React from 'react';
import { FaUser } from 'react-icons/fa';
import './styles/ProfileInfo.css';

const ProfileInfo = ({ profile, onUpdate, onEdit }) => {
  if (!profile) {
    return <div className="profile-info-card">Loading profile...</div>;
  }

  return (
    <div className="profile-info-card">
      <div className="card-header">
        <img
          src={profile.image || 'https://via.placeholder.com/150'}
          alt="Profile"
          style={{
            maxWidth: '150px',
            maxHeight: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1rem',
          }}
        />
        <div style={{ marginTop: 'auto' }}>
          <h2 className="section-heading">Profile Information</h2>
          <p className="section-subtitle">Your personal and academic details</p>
        </div>
      </div>
      <div className="info-list">
        <div className="info-item">
          <span className="label">Email:</span>
          <span className="value">{profile.email || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Phone:</span>
          <span className="value">{profile.phone || 'Not provided'}</span>
        </div>
        <div className="info-item">
          <span className="label">Country:</span>
          <span className="value">{profile.country || 'Not provided'}</span>
        </div>
        <div className="info-item">
          <span className="label">Timezone:</span>
          <span className="value">{profile.timezone || 'Not provided'}</span>
        </div>
        <div className="info-item">
          <span className="label">Student ID:</span>
          <span className="value">{profile.studentId || 'N/A'}</span>
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
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(255, 140, 0, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(to right, #ff5500, #ff8c00)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 8px rgba(255, 140, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(to right, #ff8c00, #ff5500)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(255, 140, 0, 0.2)';
          }}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;