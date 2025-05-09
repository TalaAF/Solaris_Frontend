import React, { useState, useEffect } from 'react';
import AdminBasicInfo from './AdminBasicInfo';
import AdminPermissions from './AdminPermissions';
import AdminActivityLog from './AdminActivityLog';
import AdminSecuritySettings from './AdminSecuritySettings';
import AdminProfileForm from './AdminProfileForm';
import { FaUser } from 'react-icons/fa';
import { getInitials } from './getInitials';
import './styles/AdminProfile.css';
import AdminData from './data/admin.json';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        localStorage.removeItem('admin');
        const adminData = AdminData;
        localStorage.setItem('admin', JSON.stringify(adminData));
        setAdmin(adminData);
      } catch (err) {
        setError('Failed to load admin data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProfileUpdate = (updatedAdmin) => {
    setAdmin(updatedAdmin);
    setIsEditing(false);
    setSaveMessage('✅ Your information has been updated successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="admin-profile-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <p style={{ color: '#4B5563', fontSize: '1.2rem' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-profile-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <p style={{ color: '#EF4444', fontSize: '1.2rem' }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="admin-profile-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <p style={{ color: '#EF4444', fontSize: '1.2rem' }}>Admin data unavailable Kuwait.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-layout">
        <div className="left-column">
          <div className="admin-header-card">
            {admin.image ? (
              <img
                src={admin.image}
                alt="Admin Profile"
                style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
              />
            ) : (
              <div
                className="initials-circle"
                aria-label={`Profile avatar for ${admin.name || 'Admin'}`}
                style={{ marginBottom: '1rem' }}
              >
                {getInitials(admin.name)}
              </div>
            )}
            <div style={{ marginTop: 'auto' }}>
              <p className="admin-name">{admin.name || 'N/A'}</p>
              <p className="admin-role">Admin</p>
            </div>
          </div>
        </div>
        <div className="right-column">
          <div className="tab-navigation">
            <div className={`tab ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => { setActiveTab('basic'); setIsEditing(false); }}>
              Basic Info
            </div>
            <div className={`tab ${activeTab === 'permissions' ? 'active' : ''}`} onClick={() => { setActiveTab('permissions'); setIsEditing(false); }}>
              Permissions
            </div>
            <div className={`tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => { setActiveTab('activity'); setIsEditing(false); }}>
              Activity Log
            </div>
            <div className={`tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => { setActiveTab('security'); setIsEditing(false); }}>
              Security Settings
            </div>
          </div>
          <div className="tab-content">
            {saveMessage && (
              <div
                style={{
                  background: 'linear-gradient(to right, #ff8c00, #ff5500)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                {saveMessage}
              </div>
            )}
            {activeTab === 'basic' && (
              <div className="basic-info-card">
                <AdminBasicInfo admin={admin} onEdit={handleEdit} />
                {isEditing && (
                  <AdminProfileForm
                    admin={admin}
                    onUpdate={handleProfileUpdate}
                    onCancel={handleCancelEdit}
                  />
                )}
              </div>
            )}
            {activeTab === 'permissions' && <AdminPermissions permissions={admin.permissions} />}
            {activeTab === 'activity' && <AdminActivityLog activityLog={admin.activityLog} />}
            {activeTab === 'security' && (
              <AdminSecuritySettings
                admin={admin}
                onUpdate={handleProfileUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;