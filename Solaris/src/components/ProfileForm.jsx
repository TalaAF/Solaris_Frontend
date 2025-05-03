import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';
import './styles/ProfileForm.css';

const ProfileForm = ({ profile, onUpdate }) => {
  const navigate = useNavigate();

  // Fallback profile data if profile is null
  const defaultProfile = {
    name: 'User',
    email: 'user@example.com',
    phone: '',
    country: '',
    timezone: '',
  };

  const [formData, setFormData] = useState({
    phone: profile?.phone || defaultProfile.phone,
    country: profile?.country || defaultProfile.country,
    timezone: profile?.timezone || defaultProfile.timezone,
  });
  const [errors, setErrors] = useState({});

  if (!profile && !onUpdate) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#EF4444' }}>
          Error: Profile data unavailable. <button onClick={() => navigate('/profile')} style={{ color: '#3B82F6', textDecoration: 'underline', background: 'none', border: 'none' }}>Go Back</button>
        </p>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.timezone.trim()) newErrors.timezone = 'Timezone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedProfile = { ...profile, ...formData };
    localStorage.setItem('profile', JSON.stringify(updatedProfile));
    if (onUpdate) onUpdate(updatedProfile);
    alert('Profile updated successfully!');
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <Card className="profile-form-card">
      <h3 className="section-heading">Edit Profile</h3>
      <p className="section-subtitle">Update your personal information</p>
      <form onSubmit={handleSubmit} className="info-stack">
        <div>
          <label className="label">Name</label>
          <InputField
            type="text"
            name="name"
            value={profile?.name || defaultProfile.name}
            disabled
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="label">Email</label>
          <InputField
            type="email"
            name="email"
            value={profile?.email || defaultProfile.email}
            disabled
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="label">Phone</label>
          <InputField
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            error={errors.phone}
          />
        </div>
        <div>
          <label className="label">Country</label>
          <InputField
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Enter your country"
            error={errors.country}
          />
        </div>
        <div>
          <label className="label">Timezone</label>
          <InputField
            type="text"
            name="timezone"
            value={formData.timezone}
            onChange={handleInputChange}
            placeholder="Enter your timezone"
            error={errors.timezone}
          />
        </div>
        <div className="edit-profile-actions">
          <Button type="submit" className="bg-mint">Save Changes</Button>
          <Button type="button" className="bg-red" onClick={handleCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;