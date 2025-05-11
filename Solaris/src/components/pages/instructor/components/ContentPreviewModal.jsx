import React from 'react';
import { X } from 'lucide-react';
import '../modals.css';

const ContentPreviewModal = ({ item, onClose }) => {
  if (!item) return null;
  
  const renderContent = () => {
    switch (item.type) {
      case 'document':
        return (
          <div className="document-preview">
            <div className="document-content">
              {item.content || 'No content available for preview'}
            </div>
          </div>
        );
        
      case 'video':
        return (
          <div className="video-preview">
            {item.videoUrl ? (
              <div className="video-embed">
                <iframe 
                  src={formatVideoUrl(item.videoUrl)}
                  title={item.title}
                  width="100%" 
                  height="400" 
                  frameBorder="0" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="video-placeholder">
                No video URL provided
              </div>
            )}
          </div>
        );
        
      case 'quiz':
        return (
          <div className="quiz-preview">
            <div className="quiz-info">
              <h3>Quiz Preview</h3>
              <p>This is a preview of how your quiz will appear to students.</p>
            </div>
            <div className="quiz-content">
              {item.content ? (
                <div className="quiz-questions-preview">
                  {(() => {
                    try {
                      const quizData = JSON.parse(item.content);
                      return (
                        <div>
                          <div className="quiz-header">
                            <h4>{quizData.title}</h4>
                            <p>{quizData.description}</p>
                            <div className="quiz-meta">
                              <span>Time Limit: {quizData.timeLimit} minutes</span>
                              <span>Passing Score: {quizData.passingScore}%</span>
                            </div>
                          </div>
                          
                          <div className="quiz-questions">
                            {quizData.questions.map((question, index) => (
                              <div key={question.id} className="quiz-question">
                                <div className="question-header">
                                  <span className="question-number">Question {index + 1}</span>
                                  <span className="question-type">{question.type.replace('-', ' ')}</span>
                                  <span className="question-points">{question.points} points</span>
                                </div>
                                <p className="question-text">{question.text}</p>
                                
                                {question.type === 'multiple-choice' && (
                                  <div className="question-options">
                                    {question.options.map(option => (
                                      <div key={option.id} className="option">
                                        <input 
                                          type="radio" 
                                          id={`q${question.id}-${option.id}`} 
                                          name={`q${question.id}`} 
                                          disabled 
                                        />
                                        <label htmlFor={`q${question.id}-${option.id}`}>
                                          {option.text}
                                          {option.id === question.correctAnswer && 
                                            <span className="correct-answer"> (Correct Answer)</span>}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {question.type === 'multiple-select' && (
                                  <div className="question-options">
                                    {question.options.map(option => (
                                      <div key={option.id} className="option">
                                        <input 
                                          type="checkbox" 
                                          id={`q${question.id}-${option.id}`} 
                                          name={`q${question.id}`} 
                                          disabled 
                                        />
                                        <label htmlFor={`q${question.id}-${option.id}`}>
                                          {option.text}
                                          {question.correctAnswers.includes(option.id) && 
                                            <span className="correct-answer"> (Correct Answer)</span>}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {question.type === 'true-false' && (
                                  <div className="question-options">
                                    <div className="option">
                                      <input 
                                        type="radio" 
                                        id={`q${question.id}-true`} 
                                        name={`q${question.id}`} 
                                        disabled 
                                      />
                                      <label htmlFor={`q${question.id}-true`}>
                                        True
                                        {question.correctAnswer === true && 
                                          <span className="correct-answer"> (Correct Answer)</span>}
                                      </label>
                                    </div>
                                    <div className="option">
                                      <input 
                                        type="radio" 
                                        id={`q${question.id}-false`} 
                                        name={`q${question.id}`} 
                                        disabled 
                                      />
                                      <label htmlFor={`q${question.id}-false`}>
                                        False
                                        {question.correctAnswer === false && 
                                          <span className="correct-answer"> (Correct Answer)</span>}
                                      </label>
                                    </div>
                                  </div>
                                )}
                                
                                {question.type === 'matching' && (
                                  <div className="matching-question">
                                    <div className="matching-pairs">
                                      {question.pairs.map(pair => (
                                        <div key={pair.id} className="matching-pair">
                                          <span className="matching-item">{pair.left}</span>
                                          <span className="matching-arrow">→</span>
                                          <span className="matching-answer">{pair.right}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {question.type === 'short-answer' && (
                                  <div className="short-answer-question">
                                    <input 
                                      type="text" 
                                      placeholder="Student answer goes here" 
                                      disabled 
                                      className="short-answer-input" 
                                    />
                                    <div className="acceptable-answers">
                                      <p>Acceptable answers:</p>
                                      <ul>
                                        {question.acceptableAnswers.map((answer, i) => (
                                          <li key={i}>{answer}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } catch (e) {
                      return <pre>{item.content}</pre>;
                    }
                  })()}
                </div>
              ) : (
                <p>No quiz content available for preview</p>
              )}
            </div>
          </div>
        );
        
      default:
        return <div>Unsupported content type</div>;
    }
  };
  
  // Helper function to format video URLs for embedding
  const formatVideoUrl = (url) => {
    // Check if it's a YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Extract video ID
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
      }
      
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Check if it's a Vimeo URL
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    
    // Return the original URL if it doesn't match known patterns
    return url;
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container extra-large">
        <div className="modal-header">
          <h2>Preview: {item.title}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-content preview-content">
          <div className="content-preview-container">
            {renderContent()}
          </div>
          
          <div className="content-preview-info">
            <div className="preview-info-item">
              <strong>Title:</strong> {item.title}
            </div>
            
            {item.description && (
              <div className="preview-info-item">
                <strong>Description:</strong> {item.description}
              </div>
            )}
            
            {item.duration && (
              <div className="preview-info-item">
                <strong>Duration:</strong> {item.duration}
              </div>
            )}
            
            <div className="preview-info-item">
              <strong>Type:</strong> {item.type}
            </div>
          </div>
          
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreviewModal;