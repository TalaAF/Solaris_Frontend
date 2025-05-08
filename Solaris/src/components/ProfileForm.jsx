import React, { useState } from 'react';
import './styles/ProfileForm.css';

const ProfileForm = ({ profile, onUpdate, onCancel }) => {
  const defaultProfile = {
    name: 'User',
    email: 'user@example.com',
    phone: '',
    country: '',
    timezone: '',
    image: null,
  };

  const [formData, setFormData] = useState({
    phone: profile?.phone || defaultProfile.phone,
    country: profile?.country || defaultProfile.country,
    timezone: profile?.timezone || defaultProfile.timezone,
    image: profile?.image || defaultProfile.image,
  });
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState(null);
  const [imagePreview, setImagePreview] = useState(profile?.image || null);

  if (!profile && !onUpdate) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#EF4444' }}>
          Error: Profile data unavailable.
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setImagePreview(dataUrl);
        setFormData((prev) => ({ ...prev, image: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedProfile = { ...profile, ...formData };
    localStorage.setItem('profile', JSON.stringify(updatedProfile));
    if (onUpdate) onUpdate(updatedProfile);
    setSaveMessage('✅ Profile updated successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="profile-form-card">
      <h3 className="section-heading">Edit Profile</h3>
      <p className="section-subtitle">Update your personal information</p>
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
      <form onSubmit={handleSubmit} className="info-stack">
        <div style={{ marginBottom: '1rem' }}>
          <label className="label">Profile Image</label>
          <div style={{ marginBottom: '0.5rem', position: 'relative' }}>
            {imagePreview && <img src={imagePreview} alt="Profile Preview" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%', objectFit: 'cover' }} />}
            {!imagePreview && <p>No image uploaded</p>}
            {imagePreview && (
              <button
                type="button"
                onClick={handleDeleteImage}
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  background: 'linear-gradient(to right, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                ×
              </button>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#fff' }}
          />
        </div>
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            name="name"
            value={profile?.name || defaultProfile.name}
            disabled
            placeholder="Enter your name"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            value={profile?.email || defaultProfile.email}
            disabled
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
        </div>
        <div>
          <label className="label">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
              borderColor: errors.phone ? '#EF4444' : '',
            }}
          />
          {errors.phone && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.phone}</p>}
        </div>
        <div>
          <label className="label">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Enter your country"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
              borderColor: errors.country ? '#EF4444' : '',
            }}
          />
          {errors.country && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.country}</p>}
        </div>
        <div>
          <label className="label">Timezone</label>
          <input
            type="text"
            name="timezone"
            value={formData.timezone}
            onChange={handleInputChange}
            placeholder="Enter your timezone"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
              borderColor: errors.timezone ? '#EF4444' : '',
            }}
          />
          {errors.timezone && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.timezone}</p>}
        </div>
        <div className="edit-profile-actions">
          <button
            type="submit"
            style={{
              background: 'linear-gradient(to right, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'linear-gradient(to right, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;