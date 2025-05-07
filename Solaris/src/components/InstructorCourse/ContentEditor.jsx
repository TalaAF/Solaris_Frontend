import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Save } from 'lucide-react';
import './ContentEditor.css';

function ContentEditor({ module, onSave, onClose }) {
  const [currentItem, setCurrentItem] = useState({
    id: '',
    type: 'Lecture',
    title: '',
    description: '',
    supportingFiles: [],
    uploadDate: new Date().toISOString().split('T')[0],
    published: false,
    link: '',
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (module?.itemToEdit) {
      setCurrentItem({
        ...module.itemToEdit,
        type: module.itemToEdit.type || 'Lecture',
        supportingFiles: module.itemToEdit.supportingFiles || [],
        link: module.itemToEdit.link || '',
        uploadDate: module.itemToEdit.uploadDate || new Date().toISOString().split('T')[0],
        published: module.itemToEdit.published || false,
      });
    }
  }, [module]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = validateFiles(currentItem.type, files);
    if (!validFiles.valid) {
      alert(validFiles.message);
      return;
    }
    setCurrentItem(prev => ({ ...prev, supportingFiles: files, link: '' }));
  };

  const validateFiles = (type, files) => {
    if (files.length === 0) return { valid: true };
    const file = files[0];
    const validTypes = {
      Lecture: ['application/pdf', 'video/mp4'],
      Lab: ['application/pdf', 'video/mp4'],
      'Clinical Rotation': ['application/pdf', 'video/mp4'],
      Tutorial: ['application/pdf'],
    };
    const acceptedTypes = validTypes[type] || [];
    if (!acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        message: `Invalid file type. Accepted types for ${type} are: ${acceptedTypes.join(', ')}.`,
      };
    }
    return { valid: true };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedItem = {
      ...currentItem,
      id: currentItem.id || `item-${Date.now()}`,
      uploadDate: currentItem.uploadDate,
    };
    onSave(updatedItem);
  };

  const contentTypeLabel = currentItem.type === 'Lecture' ? 'Lecture Title' :
                          currentItem.type === 'Lab' ? 'Experiment Name' :
                          currentItem.type === 'Clinical Rotation' ? 'Clinical Activity Name' :
                          'Session Name';

  const dateLabel = currentItem.type === 'Lecture' ? 'Publish Date' :
                   currentItem.type === 'Lab' ? 'Report Submission Date' :
                   currentItem.type === 'Clinical Rotation' ? 'Activity Date' :
                   'Session Date';

  return (
    <div className="content-editor">
      <h2 className="editor-title">{module?.itemToEdit ? 'Edit' : 'Add New'} {currentItem.type}</h2>
      <form onSubmit={handleSubmit} className="editor-form">
        <TextField
          name="title"
          label={contentTypeLabel}
          value={currentItem.title}
          onChange={handleInputChange}
          fullWidth
          className="form-field"
          required
        />
        <TextField
          name="description"
          label="Description"
          value={currentItem.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          className="form-field"
        />
        <FormControl fullWidth className="form-field">
          <InputLabel>Content Format</InputLabel>
          <Select
            value={currentItem.supportingFiles.length > 0 ? 'File' : currentItem.link ? 'Link' : ''}
            onChange={(e) => {
              const value = e.target.value;
              setCurrentItem(prev => ({ ...prev, supportingFiles: value === 'File' ? prev.supportingFiles : [], link: value === 'Link' ? prev.link : '' }));
            }}
            label="Content Format"
          >
            <MenuItem value="File">Upload File</MenuItem>
            <MenuItem value="Link">Enter Link</MenuItem>
          </Select>
        </FormControl>
        {currentItem.supportingFiles.length > 0 || (currentItem.supportingFiles.length === 0 && !currentItem.link) ? (
          <TextField
            type="file"
            inputRef={fileInputRef}
            onChange={handleFileChange}
            fullWidth
            className="form-field"
            inputProps={{ accept: currentItem.type === 'Tutorial' ? 'application/pdf' : 'application/pdf,video/mp4' }}
          />
        ) : (
          <TextField
            name="link"
            label="Content Link"
            value={currentItem.link}
            onChange={(e) => setCurrentItem(prev => ({ ...prev, link: e.target.value, supportingFiles: [] }))}
            fullWidth
            className="form-field"
          />
        )}
        <TextField
          name="uploadDate"
          label={dateLabel}
          type="date"
          value={currentItem.uploadDate}
          onChange={(e) => setCurrentItem(prev => ({ ...prev, uploadDate: e.target.value }))}
          fullWidth
          className="form-field"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth className="form-field">
          <InputLabel>Publish Status</InputLabel>
          <Select
            value={currentItem.published ? 'Published' : 'Unpublished'}
            onChange={(e) => setCurrentItem(prev => ({ ...prev, published: e.target.value === 'Published' }))}
            label="Publish Status"
          >
            <MenuItem value="Published">Published</MenuItem>
            <MenuItem value="Unpublished">Unpublished</MenuItem>
          </Select>
        </FormControl>
        <div className="form-actions">
          <Button
            type="submit"
            startIcon={<Save />}
            className="save-button"
          >
            Update
          </Button>
          <Button
            onClick={onClose}
            className="cancel-button"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ContentEditor;