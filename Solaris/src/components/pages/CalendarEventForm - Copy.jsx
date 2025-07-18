// src/components/CalendarEventForm.jsx
import React, { useState, useEffect } from 'react';
import './CalendarEventForm.css';

function CalendarEventForm({ event, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    type: 'personal',
    shared: false,
    audience: 'ALL'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      const formattedDate = event.date instanceof Date
        ? event.date.toISOString().split('T')[0]
        : event.date;
        
      setFormData({
        title: event.title || '',
        date: formattedDate || new Date().toISOString().split('T')[0],
        startTime: event.startTime || '09:00',
        endTime: event.endTime || '10:00',
        location: event.location || '',
        description: event.description || '',
        type: event.type || 'personal',
        shared: event.shared || false,
        audience: event.audience || 'ALL'
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: event ? event.id : null
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (event && event.id) {
      onDelete(event.id);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <form className="calendar-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="type">Event Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="lecture">Lecture</option>
            <option value="lab">Lab</option>
            <option value="seminar">Seminar</option>
            <option value="meeting">Meeting</option>
            <option value="exam">Exam</option>
            <option value="assignment">Assignment</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        <div className="form-group">
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="shared"
              name="shared"
              checked={formData.shared}
              onChange={handleChange}
            />
            <label htmlFor="shared">Share with others</label>
          </div>
        </div>

        {formData.shared && (
          <div className="form-group">
            <label htmlFor="audience">Share with</label>
            <select
              id="audience"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
            >
              <option value="ALL">Everyone</option>
              <option value="STUDENTS">Students Only</option>
              <option value="TEACHERS">Teachers Only</option>
              <option value="ADMINISTRATORS">Administrators Only</option>
            </select>
          </div>
        )}

        <div className="form-buttons">
          {event && event.id && !showDeleteConfirm && (
            <button 
              type="button" 
              className="btn-delete" 
              onClick={handleDeleteClick}
            >
              Delete Event
            </button>
          )}
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Save Event
          </button>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this event?</p>
          <div className="confirmation-buttons">
            <button 
              className="btn-cancel" 
              onClick={handleCancelDelete}
            >
              Cancel
            </button>
            <button 
              className="btn-confirm-delete" 
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CalendarEventForm;