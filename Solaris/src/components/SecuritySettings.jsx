import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles/SecuritySettings.css';

const SecuritySettings = ({ profile, onUpdate }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(profile?.twoFactorAuth || false);
  const [error, setError] = useState('');

  const handleClickShowPassword = (field) => () => {
    if (field === 'current') setShowCurrent(!showCurrent);
    if (field === 'new') setShowNew(!showNew);
    if (field === 'confirm') setShowConfirm(!showConfirm);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleUpdatePassword = () => {
    setError('');

    const storedPassword = profile?.password || '';
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

    const updatedProfile = { ...profile, password: newPassword, twoFactorAuth };
    try {
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      if (onUpdate) onUpdate(updatedProfile);
      alert('✅ Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTwoFactorAuth(false);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    }
  };

  return (
    <div className="security-settings-card">
      <div className="card-header">
        <h3 className="section-heading">Security Settings</h3>
      </div>
      <p className="section-subtitle">Update your password and security preferences</p>
      <div className="info-stack">
        <div className="password-container">
          <label className="label">Current Password</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              style={{
                width: '100%',
                padding: '0.75rem 2.5rem 0.75rem 1rem',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
              }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={handleClickShowPassword('current')}
              onMouseDown={handleMouseDownPassword}
              style={{ fontSize: '1rem', padding: '0.25rem', position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
            >
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="password-container">
          <label className="label">New Password</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={{
                width: '100%',
                padding: '0.75rem 2.5rem 0.75rem 1rem',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
              }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={handleClickShowPassword('new')}
              onMouseDown={handleMouseDownPassword}
              style={{ fontSize: '1rem', padding: '0.25rem', position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="password-container">
          <label className="label">Confirm New Password</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={{
                width: '100%',
                padding: '0.75rem 2.5rem 0.75rem 1rem',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
              }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={handleClickShowPassword('confirm')}
              onMouseDown={handleMouseDownPassword}
              style={{ fontSize: '1rem', padding: '0.25rem', position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {error && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>{error}</p>}
        <div className="two-factor">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={() => setTwoFactorAuth(!twoFactorAuth)}
            />
            Enable two-factor authentication
          </label>
        </div>
      </div>
      <button
        onClick={handleUpdatePassword}
        className="bg-mint"
        style={{ width: '100%', marginTop: '1rem', padding: '0.75rem 1.5rem', fontWeight: 600 }}
      >
        Update Password
      </button>
    </div>
  );
};

export default SecuritySettings;