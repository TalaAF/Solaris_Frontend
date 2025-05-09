import React, { useState } from 'react';
import { getInitials } from './getInitials';
import './styles/AdminProfileForm.css';

const AdminProfileForm = ({ admin, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: admin.name || '',
    email: admin.email || '',
    phone: admin.phone || '',
    country: admin.country || '',
    image: admin.image || null,
  });
  const [imagePreview, setImagePreview] = useState(admin.image || null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
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

    const updatedAdmin = { ...admin, ...formData };
    localStorage.setItem('admin', JSON.stringify(updatedAdmin));
    onUpdate(updatedAdmin);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="section-heading">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="info-stack">
          <div style={{ marginBottom: '1rem' }}>
            <label className="label">Profile Image</label>
            <div style={{ marginBottom: '0.5rem', position: 'relative' }}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="initials-circle"
                  aria-label={`Profile avatar preview for ${formData.name || 'Admin'}`}
                >
                  {getInitials(formData.name)}
                </div>
              )}
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
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#fff' }}
            />
          </div>
          <div>
            <label className="label">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                backgroundColor: '#fff',
                color: '#000',
                borderColor: errors.name ? '#EF4444' : '',
              }}
            />
            {errors.name && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.name}</p>}
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                backgroundColor: '#fff',
                color: '#000',
                borderColor: errors.email ? '#EF4444' : '',
              }}
            />
            {errors.email && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.email}</p>}
          </div>
          <div>
            <label className="label">Phone *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                backgroundColor: '#fff',
                color: '#000',
                borderColor: errors.phone ? '#EF4444' : '',
              }}
            />
            {errors.phone && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.phone}</p>}
          </div>
          <div>
            <label className="label">Country *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                backgroundColor: '#fff',
                color: '#000',
                borderColor: errors.country ? '#EF4444' : '',
              }}
            />
            {errors.country && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.country}</p>}
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
                marginLeft: '0.5rem',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfileForm;