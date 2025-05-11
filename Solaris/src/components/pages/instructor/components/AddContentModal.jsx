import React, { useState } from 'react';
import { X, FileText, Video, FileQuestion } from 'lucide-react';
import '../modals.css';

const AddContentModal = ({ onClose, onSubmit }) => {
  const [contentType, setContentType] = useState('document');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [order, setOrder] = useState(0);
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Update the sample quiz JSON to match the expected structure in ContentPreviewModal.jsx
  const sampleQuizJson = `{
    "title": "Medical Terminology Quiz",
    "description": "Test your knowledge of basic medical terminology",
    "timeLimit": 15,
    "passingScore": 70,
    "questions": [
      {
        "id": 1,
        "type": "MULTIPLE_CHOICE",
        "text": "What is the medical term for high blood pressure?",
        "points": 5,
        "options": [
          {
            "id": "a",
            "text": "Hyperglycemia",
            "correct": false
          },
          {
            "id": "b",
            "text": "Hypertension",
            "correct": true
          },
          {
            "id": "c",
            "text": "Hyperlipidemia",
            "correct": false
          },
          {
            "id": "d",
            "text": "Hypercalcemia",
            "correct": false
          }
        ]
      },
      {
        "id": 2,
        "type": "TRUE_FALSE",
        "text": "The femur is the longest bone in the human body.",
        "points": 3,
        "correctAnswer": true,
        "options": [
          {
            "id": "true",
            "text": "True",
            "correct": true
          },
          {
            "id": "false",
            "text": "False",
            "correct": false
          }
        ]
      },
      {
        "id": 3,
        "type": "MULTIPLE_SELECT",
        "text": "Which of the following are parts of the respiratory system?",
        "points": 7,
        "correctAnswers": ["a", "c", "e"],
        "options": [
          {
            "id": "a",
            "text": "Lungs",
            "correct": true
          },
          {
            "id": "b",
            "text": "Liver",
            "correct": false
          },
          {
            "id": "c",
            "text": "Trachea",
            "correct": true
          },
          {
            "id": "d",
            "text": "Kidneys",
            "correct": false
          },
          {
            "id": "e",
            "text": "Bronchi",
            "correct": true
          }
        ]
      }
    ]
  }`;
  
  const validate = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (contentType === 'document' && !content.trim() && !file) {
      newErrors.content = 'Document content or file is required';
    }
    
    if (contentType === 'video' && !videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required';
    }
    
    if (contentType === 'quiz' && !content.trim()) {
      newErrors.content = 'Quiz content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const contentData = {
      type: contentType,
      title,
      description,
      duration,
      order: parseInt(order),
      // Different properties based on content type
      ...(contentType === 'document' && { content, file }),
      ...(contentType === 'video' && { videoUrl }),
      ...(contentType === 'quiz' && { content }),
    };
    
    onSubmit(contentData);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>Add New Content</h2>
          <button className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="content-type-selector">
              <h3>Content Type</h3>
              <div className="content-type-options">
                <button
                  type="button"
                  className={`content-type-option ${contentType === 'document' ? 'active' : ''}`}
                  onClick={() => setContentType('document')}
                >
                  <FileText size={24} />
                  <span>Document</span>
                </button>
                
                <button
                  type="button"
                  className={`content-type-option ${contentType === 'video' ? 'active' : ''}`}
                  onClick={() => setContentType('video')}
                >
                  <Video size={24} />
                  <span>Video</span>
                </button>
                
                <button
                  type="button"
                  className={`content-type-option ${contentType === 'quiz' ? 'active' : ''}`}
                  onClick={() => setContentType('quiz')}
                >
                  <FileQuestion size={24} />
                  <span>Quiz</span>
                </button>
              </div>
            </div>
            
            <div className="content-details">
              <div className="form-group">
                <label htmlFor="content-title">Title *</label>
                <input
                  type="text"
                  id="content-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter content title"
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="content-description">Description</label>
                <textarea
                  id="content-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter content description"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="content-duration">Duration</label>
                  <input
                    type="text"
                    id="content-duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 10 min"
                  />
                </div>
                
                <div className="form-group half">
                  <label htmlFor="content-order">Order</label>
                  <input
                    type="number"
                    id="content-order"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    min={0}
                  />
                </div>
              </div>
              
              {/* Render different inputs based on content type */}
              {contentType === 'document' && (
                <>
                  <div className="form-group">
                    <label htmlFor="document-content">Document Content</label>
                    <textarea
                      id="document-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter document content or upload a file"
                      rows={6}
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="document-file">Or Upload a File</label>
                    <input
                      type="file"
                      id="document-file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                  
                  {errors.content && <span className="error-message">{errors.content}</span>}
                </>
              )}
              
              {contentType === 'video' && (
                <div className="form-group">
                  <label htmlFor="video-url">Video URL *</label>
                  <input
                    type="text"
                    id="video-url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Enter YouTube or Vimeo URL"
                  />
                  {errors.videoUrl && <span className="error-message">{errors.videoUrl}</span>}
                </div>
              )}
              
              {contentType === 'quiz' && (
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="content-quiz">Quiz Questions (JSON format)*</label>
                    <button 
                      type="button"
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '12px', 
                        backgroundColor: '#f1f5f9', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setContent(sampleQuizJson)}
                    >
                      Use Sample
                    </button>
                  </div>
                  <textarea
                    id="content-quiz"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Enter quiz JSON data'
                    rows={10}
                    className={errors.content ? 'error' : ''}
                  />
                  {errors.content && <span className="error-message">{errors.content}</span>}
                  <p className="form-help-text">
                    Use the sample button above to see the expected quiz format, or enter your own JSON structure.
                  </p>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
              >
                Add Content
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContentModal;