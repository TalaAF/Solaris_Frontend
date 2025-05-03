import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import './styles/ProfileInfo.css';

const ProfileInfo = ({ profile }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setProfileImage(base64Image);
        localStorage.setItem('profileImage', base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!profile) {
    return <div className="profile-info-card">Loading profile...</div>;
  }

  return (
    <div className="profile-info-card">
      <div className="card-header">
        <FaUser className="card-icon" />
        <h2 className="section-heading">Profile Information</h2>
      </div>
      <p className="section-subtitle">Your personal and academic details</p>
      <div className="profile-pic-container">
        <div className="profile-pic-wrapper">
          {profileImage || profile.profileImage ? (
            <img
              src={profileImage || profile.profileImage}
              alt="Profile"
              className="profile-pic-image"
            />
          ) : (
            <div className="profile-pic">
              {profile.firstName?.charAt(0)}
              {profile.lastName?.charAt(0)}
            </div>
          )}
          <button className="profile-pic-edit" onClick={triggerFileInput}>
            ✎
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
        <div className="profile-info">
          <p className="profile-name">{profile.name || 'N/A'}</p>
          <p className="profile-role">{profile.role || 'N/A'}</p>
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
          className="edit-profile-button"
          onClick={() => navigate('/profile/edit')}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;