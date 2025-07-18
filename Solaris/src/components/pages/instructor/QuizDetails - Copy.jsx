import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Plus, CheckCircle, Trash2, Award, 
  Clock, Settings, User, FileQuestion, BarChart2, Edit,
  Save, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import QuizService from '../../../services/QuizService';
import './QuizDetails.css';

const QuizDetails = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('questions'); // 'questions', 'settings', 'analytics'
  
  // State for inline editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    randomizeQuestions: false,
    startDate: '',
    endDate: ''
  });
  
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        
        // Fetch quiz details with questions
        const quizData = await QuizService.getQuizWithQuestions(quizId);
        
        if (quizData) {
          setQuiz(quizData);
          
          // Initialize edit form with quiz data
          setEditForm({
            title: quizData.title || '',
            description: quizData.description || '',
            timeLimit: quizData.timeLimit || 30,
            passingScore: quizData.passingScore || 70,
            randomizeQuestions: quizData.randomizeQuestions || false,
            startDate: quizData.startDate || '',
            endDate: quizData.endDate || ''
          });
          
          // Extract questions from quiz
          if (quizData.questions) {
            setQuestions(quizData.questions);
          }
          
          // Try to fetch analytics if there are questions
          if (quizData.questionCount > 0) {
            try {
              const analyticsData = await QuizService.getQuizAnalytics(quizId);
              setAnalytics(analyticsData);
            } catch (err) {
              console.warn("Could not fetch analytics, quiz may not have attempts yet");
            }
          }
        } else {
          setError("Quiz not found");
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    
    if (quizId) {
      fetchQuizData();
    }
  }, [quizId]);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };
  
  // Handle publish/unpublish quiz
  const handlePublishToggle = async () => {
    try {
      let response;
      
      if (quiz.published) {
        response = await QuizService.unpublishQuiz(quizId);
        toast.success("Quiz unpublished");
      } else {
        // Check if quiz has questions before publishing
        if (!questions.length) {
          toast.error("Cannot publish a quiz without questions");
          return;
        }
        
        response = await QuizService.publishQuiz(quizId);
        toast.success("Quiz published successfully");
      }
      
      if (response) {
        setQuiz(prev => ({
          ...prev,
          published: response.published
        }));
      }
    } catch (err) {
      console.error("Error updating quiz publish status:", err);
      toast.error("Failed to update quiz status");
    }
  };
  
  // Delete quiz
  const handleDeleteQuiz = async () => {
    if (!confirm("Are you sure you want to delete this quiz? This will also delete all questions and student attempts.")) {
      return;
    }
    
    try {
      await QuizService.deleteQuiz(quizId);
      toast.success("Quiz deleted successfully");
      // Navigate back to course content
      navigate(-1);
    } catch (err) {
      console.error("Error deleting quiz:", err);
      toast.error("Failed to delete quiz");
    }
  };
  
  // Navigate to add questions
  const handleAddQuestions = () => {
    navigate(`/instructor/quizzes/${quizId}/questions`);
  };
  
  // Delete a question
  const handleDeleteQuestion = async (questionId) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }
    
    try {
      await QuizService.deleteQuestion(questionId);
      
      // Remove from questions list
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      
      // Update quiz data
      setQuiz(prev => ({
        ...prev,
        questionCount: prev.questionCount - 1
      }));
      
      toast.success("Question deleted successfully");
    } catch (err) {
      console.error("Error deleting question:", err);
      toast.error("Failed to delete question");
    }
  };
  
  // Handle input changes in edit form
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Start editing mode
  const handleStartEditing = () => {
    // Ensure form has latest quiz data
    setEditForm({
      title: quiz.title || '',
      description: quiz.description || '',
      timeLimit: quiz.timeLimit || 30,
      passingScore: quiz.passingScore || 70,
      randomizeQuestions: quiz.randomizeQuestions || false,
      startDate: formatDateForInput(quiz.startDate) || '',
      endDate: formatDateForInput(quiz.endDate) || ''
    });
    
    // Switch to settings tab if not already there
    if (activeTab !== 'settings') {
      setActiveTab('settings');
    }
    
    setIsEditing(true);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  // Save quiz changes
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Format data for API
      const quizData = {
        ...editForm,
        timeLimit: parseInt(editForm.timeLimit, 10),
        passingScore: parseFloat(editForm.passingScore),
        id: quizId
      };
      
      // Update quiz
      const response = await QuizService.updateQuiz(quizId, quizData);
      
      if (response) {
        // Update local quiz state
        setQuiz(prev => ({
          ...prev,
          ...response
        }));
        
        toast.success("Quiz updated successfully");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating quiz:", err);
      toast.error(err.message || "Failed to update quiz");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="quiz-details-page loading">
        <div className="spinner"></div>
        <p>Loading quiz details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="quiz-details-page error">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className="solaris-button primary-button"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-details-page">
      <div className="quiz-details-header">
        <button 
          className="back-button" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} />
          Back
        </button>
        
        {!isEditing ? (
          <div className="title-container">
            <div className="quiz-title-row">
              <h1>{quiz?.title}</h1>
              {quiz?.published ? (
                <span className="status-badge published">
                  <CheckCircle size={14} />
                  Published
                </span>
              ) : (
                <span className="status-badge draft">Draft</span>
              )}
            </div>
            <p className="quiz-description">{quiz?.description || "No description provided."}</p>
          </div>
        ) : (
          <div className="title-container editing">
            <div className="form-group">
              <label htmlFor="title">Quiz Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editForm.title}
                onChange={handleEditFormChange}
                placeholder="Enter quiz title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                placeholder="Enter quiz description"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>
      
      {!isEditing && (
        <>
          <div className="quiz-details-meta">
            <div className="meta-item">
              <div className="meta-icon">
                <Clock size={18} />
              </div>
              <div className="meta-content">
                <div className="meta-label">Time Limit</div>
                <div className="meta-value">{quiz?.timeLimit} minutes</div>
              </div>
            </div>
            
            <div className="meta-item">
              <div className="meta-icon">
                <Award size={18} />
              </div>
              <div className="meta-content">
                <div className="meta-label">Passing Score</div>
                <div className="meta-value">{quiz?.passingScore}%</div>
              </div>
            </div>
            
            <div className="meta-item">
              <div className="meta-icon">
                <FileQuestion size={18} />
              </div>
              <div className="meta-content">
                <div className="meta-label">Questions</div>
                <div className="meta-value">{quiz?.questionCount || 0}</div>
              </div>
            </div>
            
            <div className="meta-item">
              <div className="meta-icon">
                <User size={18} />
              </div>
              <div className="meta-content">
                <div className="meta-label">Attempts</div>
                <div className="meta-value">{analytics?.totalAttempts || 0}</div>
              </div>
            </div>
          </div>
          
          <div className="quiz-actions">
            <button 
              className="solaris-button secondary-button"
              onClick={handleStartEditing}
            >
              <Edit size={16} />
              Edit Quiz
            </button>
            
            <button 
              className="solaris-button primary-button"
              onClick={handleAddQuestions}
            >
              <Plus size={16} />
              Add Questions
            </button>
            
            <button 
              className={`solaris-button ${quiz?.published ? 'warning-button' : 'success-button'}`}
              onClick={handlePublishToggle}
              disabled={!questions.length && !quiz?.published}
            >
              <CheckCircle size={16} />
              {quiz?.published ? 'Unpublish' : 'Publish Quiz'}
            </button>
            
            <button 
              className="solaris-button danger-button"
              onClick={handleDeleteQuiz}
            >
              <Trash2 size={16} />
              Delete Quiz
            </button>
          </div>
        </>
      )}
      
      <div className="quiz-details-tabs">
        <button 
          className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
          disabled={isEditing}
        >
          <FileQuestion size={16} />
          Questions
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={16} />
          Settings
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
          disabled={!analytics || isEditing}
        >
          <BarChart2 size={16} />
          Analytics
        </button>
      </div>
      
      <div className="quiz-details-content">
        {activeTab === 'questions' && !isEditing && (
          <div className="questions-tab">
            <div className="tab-header">
              <h2>Questions ({questions.length})</h2>
              <button 
                className="solaris-button primary-button"
                onClick={handleAddQuestions}
              >
                <Plus size={16} />
                Add Questions
              </button>
            </div>
            
            {questions.length === 0 ? (
              <div className="empty-state">
                <FileQuestion size={48} color="#e2e8f0" />
                <h3>No Questions Yet</h3>
                <p>This quiz doesn't have any questions yet. Add questions to make this quiz available to students.</p>
                <button 
                  className="solaris-button primary-button"
                  onClick={handleAddQuestions}
                >
                  <Plus size={16} />
                  Add First Question
                </button>
              </div>
            ) : (
              <div className="questions-list">
                {questions.map((question, index) => (
                  <div key={question.id} className="question-item">
                    <div className="question-number">{index + 1}</div>
                    <div className="question-content">
                      <div className="question-header">
                        <h4>{question.text}</h4>
                        <div className="question-meta">
                          <span className="question-type">{formatQuestionType(question.type)}</span>
                          <span className="question-points">{question.points} pts</span>
                        </div>
                      </div>
                      
                      <div className="question-options">
                        {question.options && question.options.map((option, optIndex) => (
                          <div 
                            key={option.id || optIndex} 
                            className={`question-option ${option.correct || option.isCorrect ? 'correct' : ''}`}
                          >
                            <div className="option-marker">
                              {question.type === 'MULTIPLE_CHOICE' ? (
                                <span className="radio-marker">{option.correct || option.isCorrect ? '●' : '○'}</span>
                              ) : (
                                <span className="checkbox-marker">{option.correct || option.isCorrect ? '☑' : '☐'}</span>
                              )}
                            </div>
                            <div className="option-text">{option.text}</div>
                          </div>
                        ))}
                      </div>
                      
                      {question.feedback && (
                        <div className="question-feedback">
                          <strong>Feedback:</strong> {question.feedback}
                        </div>
                      )}
                    </div>
                    
                    <div className="question-actions">
                      <button 
                        className="action-button"
                        onClick={() => navigate(`/instructor/questions/${question.id}/edit`)}
                        title="Edit Question"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button 
                        className="action-button delete"
                        onClick={() => handleDeleteQuestion(question.id)}
                        title="Delete Question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="tab-header">
              <h2>Quiz Settings</h2>
              {!isEditing ? (
                <button 
                  className="solaris-button secondary-button"
                  onClick={handleStartEditing}
                >
                  <Edit size={16} />
                  Edit Settings
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="solaris-button secondary-button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button 
                    className="solaris-button primary-button"
                    onClick={handleSaveQuiz}
                    disabled={saving}
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <div className="settings-table">
                <div className="settings-row">
                  <div className="settings-key">Status</div>
                  <div className="settings-value">
                    {quiz?.published ? (
                      <span className="status-inline published">Published</span>
                    ) : (
                      <span className="status-inline draft">Draft</span>
                    )}
                  </div>
                </div>
                
                <div className="settings-row">
                  <div className="settings-key">Time Limit</div>
                  <div className="settings-value">{quiz?.timeLimit} minutes</div>
                </div>
                
                <div className="settings-row">
                  <div className="settings-key">Passing Score</div>
                  <div className="settings-value">{quiz?.passingScore}%</div>
                </div>
                
                <div className="settings-row">
                  <div className="settings-key">Randomize Questions</div>
                  <div className="settings-value">
                    {quiz?.randomizeQuestions ? 'Yes' : 'No'}
                  </div>
                </div>
                
                <div className="settings-row">
                  <div className="settings-key">Available From</div>
                  <div className="settings-value">
                    {formatDate(quiz?.startDate)}
                  </div>
                </div>
                
                <div className="settings-row">
                  <div className="settings-key">Available Until</div>
                  <div className="settings-value">
                    {formatDate(quiz?.endDate)}
                  </div>
                </div>
                
                <div className="settings-row">
                  <div className="settings-key">Created At</div>
                  <div className="settings-value">
                    {formatDate(quiz?.createdAt)}
                  </div>
                </div>
                
                <div className="settings-row">
                  <div className="settings-key">Last Updated</div>
                  <div className="settings-value">
                    {formatDate(quiz?.updatedAt)}
                  </div>
                </div>
              </div>
            ) : (
              <form className="edit-form" onSubmit={handleSaveQuiz}>
                <div className="form-section">
                  <h3>Quiz Configuration</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="timeLimit">Time Limit (minutes)*</label>
                      <input
                        type="number"
                        id="timeLimit"
                        name="timeLimit"
                        value={editForm.timeLimit}
                        onChange={handleEditFormChange}
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="passingScore">Passing Score (%)*</label>
                      <input
                        type="number"
                        id="passingScore"
                        name="passingScore"
                        value={editForm.passingScore}
                        onChange={handleEditFormChange}
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="randomizeQuestions"
                      name="randomizeQuestions"
                      checked={editForm.randomizeQuestions}
                      onChange={handleEditFormChange}
                    />
                    <label htmlFor="randomizeQuestions">Randomize question order for each student</label>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3>Availability</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="startDate">Available From</label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={editForm.startDate}
                        onChange={handleEditFormChange}
                      />
                      <p className="helper-text">Leave blank for immediate availability</p>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="endDate">Available Until</label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={editForm.endDate}
                        onChange={handleEditFormChange}
                      />
                      <p className="helper-text">Leave blank for no end date</p>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions-bottom">
                  <button 
                    type="button" 
                    className="solaris-button secondary-button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="solaris-button primary-button"
                    disabled={saving}
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        
        {activeTab === 'analytics' && analytics && !isEditing && (
          <div className="analytics-tab">
            <div className="tab-header">
              <h2>Quiz Analytics</h2>
              <button 
                className="solaris-button secondary-button"
                onClick={() => navigate(`/instructor/quizzes/${quizId}/analytics`)}
              >
                <BarChart2 size={16} />
                View Full Analytics
              </button>
            </div>
            
            <div className="analytics-summary">
              <div className="analytics-card">
                <div className="analytics-icon">
                  <Award size={24} />
                </div>
                <div className="analytics-content">
                  <div className="analytics-value">{analytics.averageScore?.toFixed(1)}%</div>
                  <div className="analytics-label">Average Score</div>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="analytics-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="analytics-content">
                  <div className="analytics-value">{analytics.passRate?.toFixed(1)}%</div>
                  <div className="analytics-label">Pass Rate</div>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="analytics-icon">
                  <BarChart2 size={24} />
                </div>
                <div className="analytics-content">
                  <div className="analytics-value">{analytics.difficultyLevel?.toFixed(1)}/100</div>
                  <div className="analytics-label">Difficulty Level</div>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="analytics-icon">
                  <User size={24} />
                </div>
                <div className="analytics-content">
                  <div className="analytics-value">{analytics.totalAttempts}</div>
                  <div className="analytics-label">Total Attempts</div>
                </div>
              </div>
            </div>
            
            {analytics.questionPerformance && analytics.questionPerformance.length > 0 && (
              <div className="question-analytics">
                <h3>Question Performance</h3>
                
                <div className="table-responsive">
                  <table className="analytics-table">
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Type</th>
                        <th>Difficulty</th>
                        <th>Correct %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.questionPerformance.map((question, index) => (
                        <tr key={question.questionId || index}>
                          <td className="question-text">{question.text}</td>
                          <td>{formatQuestionType(question.type)}</td>
                          <td>
                            <div className="difficulty-bar">
                              <div 
                                className="difficulty-fill"
                                style={{ width: `${question.difficulty}%` }}
                                data-difficulty={getDifficultyLabel(question.difficulty)}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <div className="correct-percentage">
                              <span 
                                className={getPerformanceClass(question.correctPercentage)}
                              >
                                {question.correctPercentage?.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format question type for display
const formatQuestionType = (type) => {
  switch (type) {
    case 'MULTIPLE_CHOICE':
      return 'Multiple Choice';
    case 'MULTIPLE_ANSWER':
      return 'Multiple Answer';
    case 'TRUE_FALSE':
      return 'True/False';
    case 'SHORT_ANSWER':
      return 'Short Answer';
    case 'ESSAY':
      return 'Essay';
    default:
      return type?.replace('_', ' ');
  }
};

// Helper function to get difficulty label
const getDifficultyLabel = (difficulty) => {
  if (difficulty < 30) return 'Easy';
  if (difficulty < 70) return 'Medium';
  return 'Hard';
};

// Helper function to get performance class
const getPerformanceClass = (percentage) => {
  if (percentage >= 70) return 'good';
  if (percentage >= 40) return 'average';
  return 'poor';
};

export default QuizDetails;