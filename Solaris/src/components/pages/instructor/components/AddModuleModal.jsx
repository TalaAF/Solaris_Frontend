import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../modals.css';

const AddModuleModal = ({ module = null, isEditing = false, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);
  const [errors, setErrors] = useState({});

  // Pre-fill form if editing
  useEffect(() => {
    if (module && isEditing) {
      setTitle(module.title || '');
      setDescription(module.description || '');
      setOrder(module.order || 0);
    }
  }, [module, isEditing]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({
      title,
      description,
      order
    });
    
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Module' : 'Add New Module'}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="module-title">Title*</label>
            <input
              id="module-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter module title"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="module-description">Description</label>
            <textarea
              id="module-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter module description"
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="module-order">Order</label>
            <input
              id="module-order"
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="solaris-button secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="solaris-button primary-button"
            >
              {isEditing ? 'Update Module' : 'Add Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModuleModal;