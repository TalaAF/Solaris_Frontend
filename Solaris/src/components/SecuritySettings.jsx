import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';
import './styles/SecuritySettings.css';

const SecuritySettings = ({ profile, onUpdate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [error, setError] = useState('');

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const updatedProfile = { ...profile, password: newPassword, twoFactorAuth };
    localStorage.setItem('profile', JSON.stringify(updatedProfile));
    onUpdate(updatedProfile);
    alert('Password updated successfully!');
    setNewPassword('');
    setConfirmPassword('');
    setTwoFactorAuth(false);
    setError('');
  };

  return (
    <Card className="security-settings-card">
      <h3 className="section-heading">Security Settings</h3>
      <p className="section-subtitle">Update your password and security preferences</p>
      <div className="info-stack">
        <div className="password-container">
          <label className="label">Current Password</label>
          <div className="password-field">
            <p className="info-text">{showPassword ? profile.password || '******' : '******'}</p>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div>
          <label className="label">New Password</label>
          <InputField
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            error={error}
          />
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <InputField
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
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
      <Button onClick={handleUpdatePassword} className="bg-mint">
        Update Password
      </Button>
    </Card>
  );
};

export default SecuritySettings;