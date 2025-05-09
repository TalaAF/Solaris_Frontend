import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles/AdminSecuritySettings.css';

const AdminSecuritySettings = ({ admin, onUpdate }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = () => {
    setError('');

    const storedPassword = admin?.password || '';
    if (currentPassword !== storedPassword) {
      setError('❌ Incorrect current password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('⚠️ Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const updatedAdmin = { ...admin, password: newPassword };
    try {
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      if (onUpdate) onUpdate(updatedAdmin);
      alert('✅ Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    }
  };

  return (
    <div className="admin-security-settings-card">
      <h2 className="section-heading">Security Settings</h2>
      <p className="section-subtitle">Manage your security preferences</p>
      <div className="info-stack">
        <div className="password-container">
          <label className="label">Current Password</label>
          <div className="password-field" style={{ position: 'relative' }}>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowCurrent(!showCurrent)}
              onMouseDown={(e) => e.preventDefault()}
              style={{ fontSize: '1rem', padding: '0.25rem', position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
            >
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="password-container">
          <label className="label">New Password</label>
          <div className="password-field" style={{ position: 'relative' }}>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNew(!showNew)}
              onMouseDown={(e) => e.preventDefault()}
              style={{ fontSize: '1rem', padding: '0.25rem', position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="password-container">
          <label className="label">Confirm New Password</label>
          <div className="password-field" style={{ position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirm(!showConfirm)}
              onMouseDown={(e) => e.preventDefault()}
              style={{ fontSize: '1rem', padding: '0.25rem', position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {error && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>{error}</p>}
        <div className="two-factor">
          <label className="checkbox-label">
            2FA Status: {admin.twoFactorAuth ? 'Enabled' : 'Disabled'}
          </label>
        </div>
        <h3 className="section-subheading">Login Log</h3>
        {admin.loginLog.map((log, index) => (
          <div key={index} className="login-log-item">
            <span>IP: {log.ip}</span>
            <span>Location: {admin.country || 'Unknown'}</span>
            <span>Time: {log.timestamp}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleUpdatePassword}
        style={{
          background: 'linear-gradient(to right, #10b981, #059669)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '0.75rem 1.5rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: '1rem',
          width: '100%',
        }}
      >
        Change Password
      </button>
    </div>
  );
};

export default AdminSecuritySettings;