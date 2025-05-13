import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CourseService from '../../../services/CourseService';
import QuizService from '../../../services/QuizService';
import { 
  ChevronLeft, Plus, Save, CheckCircle, Trash2, 
  FileQuestion, Clock, Award, Settings, Edit
} from 'lucide-react';
import './QuizCreator.css';

const QuizCreator = () => {
  // Get courseId and quizId from URL params OR from location state
  const { courseId: urlCourseId, quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Try to get courseId from multiple sources without using state
  const courseId = urlCourseId || 
    location.state?.courseId || 
    new URLSearchParams(location.search).get('courseId');
  
  // Determine if we're in edit mode based on presence of quizId
  const [isEditMode, setIsEditMode] = useState(!!quizId);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState('quiz-details'); // 'quiz-details' or 'questions'
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  // Quiz form data
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    randomizeQuestions: false,
    published: false,
    courseId: parseInt(courseId, 10)  // Important: use courseId directly, not as state
  });
  
  // Question form data
  const [questionForm, setQuestionForm] = useState({
    text: '',
    type: 'MULTIPLE_CHOICE',
    points: 5,
    feedback: '',
    options: [
      { text: '', isCorrect: false, feedback: '' },
      { text: '', isCorrect: false, feedback: '' },
      { text: '', isCorrect: false, feedback: '' },
      { text: '', isCorrect: false, feedback: '' }
    ]
  });

  // Function to fetch course data
  const fetchCourseData = async (cId) => {
    try {
      if (!cId) {
        console.warn("No course ID provided to fetchCourseData");
        return null;
      }
      
      const courseData = await CourseService.getCourseById(cId);
      
      if (courseData) {
        setCourse(courseData);
        return courseData;
      } else {
        console.warn("Course data is empty");
        return null;
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course information");
      return null;
    }
  };

  // Handle initial setup - load quiz for editing if quizId is present
  useEffect(() => {
    const setupComponent = async () => {
      try {
        // First fetch course data regardless of mode
        if (courseId) {
          await fetchCourseData(courseId);
        } else {
          console.error("No course ID available");
          toast.error("Course ID is required to create a quiz");
          setTimeout(() => {
            navigate('/instructor/courses');
          }, 1000);
          return;
        }
        
        // Check if we're in edit mode (quizId exists)
        if (quizId) {
          try {
            const quizData = await QuizService.getQuizById(quizId);
            
            // Set current quiz state
            setCurrentQuiz(quizData);
            
            // Pre-populate the form with existing data
            setQuizForm({
              title: quizData.title || '',
              description: quizData.description || '',
              timeLimit: quizData.timeLimit || 30,
              passingScore: quizData.passingScore || 70,
              randomizeQuestions: quizData.randomizeQuestions || false,
              published: quizData.published || false,
              courseId: quizData.courseId || parseInt(courseId, 10)
            });
            
            // Fetch questions for this quiz
            try {
              const questionsResponse = await QuizService.getQuizQuestions(quizId);
              if (questionsResponse && Array.isArray(questionsResponse.data)) {
                setQuestions(questionsResponse.data);
              } else if (questionsResponse && questionsResponse.data && Array.isArray(questionsResponse.data.questions)) {
                setQuestions(questionsResponse.data.questions);
              } else if (questionsResponse && Array.isArray(questionsResponse)) {
                setQuestions(questionsResponse);
              }
            } catch (questionsError) {
              console.error("Error fetching quiz questions:", questionsError);
              toast.error("Failed to load quiz questions");
            }
            
            // Move to questions tab if we have the quiz data
            setActiveStep('questions');
          } catch (quizError) {
            console.error("Error fetching quiz for editing:", quizError);
            toast.error("Failed to load quiz for editing");
            setError("Failed to load quiz for editing. Please try again.");
          }
        }
      } catch (err) {
        console.error("Error setting up quiz creator:", err);
        setError(err.message || "An error occurred while loading");
      } finally {
        setLoading(false);
      }
    };
    
    setupComponent();
  }, [quizId, courseId, navigate]);
  
  // Handle quiz form input changes
  const handleQuizInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setQuizForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle question form input changes
  const handleQuestionInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setQuestionForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle option text change
  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...questionForm.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: field === 'isCorrect' ? value : value
    };
    
    setQuestionForm(prev => ({
      ...prev,
      options: updatedOptions
    }));
  };
  
  // Add a new option
  const addOption = () => {
    setQuestionForm(prev => ({
      ...prev,
      options: [
        ...prev.options,
        { text: '', isCorrect: false, feedback: '' }
      ]
    }));
  };
  
  // Remove an option
  const removeOption = (index) => {
    if (questionForm.options.length <= 2) {
      toast.error('Questions must have at least 2 options');
      return;
    }
    
    const updatedOptions = [...questionForm.options];
    updatedOptions.splice(index, 1);
    
    setQuestionForm(prev => ({
      ...prev,
      options: updatedOptions
    }));
  };
  
  // Submit quiz details
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Format data for API - Important: use courseId directly, not from state
      const quizData = {
        ...quizForm,
        timeLimit: parseInt(quizForm.timeLimit, 10),
        passingScore: parseFloat(quizForm.passingScore),
        courseId: parseInt(courseId, 10)
      };
      
      let response;
      
      if (isEditMode && quizId) {
        // Update existing quiz
        response = await QuizService.updateQuiz(quizId, quizData);
        
        if (response && response.data) {
          setCurrentQuiz(response.data);
          toast.success('Quiz updated successfully');
        } else if (response) {
          setCurrentQuiz(response);
          toast.success('Quiz updated successfully');
        }
      } else {
        // Create new quiz
        response = await QuizService.createQuiz(quizData);
        
        if (response && response.data) {
          setCurrentQuiz(response.data);
          toast.success('Quiz created successfully');
        } else if (response) {
          setCurrentQuiz(response);
          toast.success('Quiz created successfully');
        }
      }
      
      // Move to questions step
      setActiveStep('questions');
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} quiz:`, err);
      toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'create'} quiz`);
    } finally {
      setSaving(false);
    }
  };
  
  // Submit a question
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Validation for multiple choice questions
      if (questionForm.type === 'MULTIPLE_CHOICE') {
        // Ensure at least one option is marked as correct
        if (!questionForm.options.some(option => option.isCorrect)) {
          toast.error('Please mark at least one option as correct');
          setSaving(false);
          return;
        }
        
        // Ensure no more than one option is marked as correct
        if (questionForm.options.filter(option => option.isCorrect).length > 1) {
          toast.error('Multiple choice questions can only have one correct answer');
          setSaving(false);
          return;
        }
      } else if (questionForm.type === 'MULTIPLE_ANSWER') {
        // Ensure at least one option is marked as correct
        if (!questionForm.options.some(option => option.isCorrect)) {
          toast.error('Please mark at least one option as correct');
          setSaving(false);
          return;
        }
      }
      
      // Ensure all options have text
      if (questionForm.options.some(option => !option.text.trim())) {
        toast.error('Please provide text for all options');
        setSaving(false);
        return;
      }
      
      // Format data for API
      const questionData = {
        ...questionForm,
        points: parseInt(questionForm.points, 10),
        quizId: currentQuiz.id
      };
      
      // Create question
      const response = await QuizService.createQuestion(questionData);
      
      if (response) {
        // Add to questions list
        setQuestions(prev => [...prev, response]);
        
        // Reset form for next question
        setQuestionForm({
          text: '',
          type: 'MULTIPLE_CHOICE',
          points: 5,
          feedback: '',
          options: [
            { text: '', isCorrect: false, feedback: '' },
            { text: '', isCorrect: false, feedback: '' },
            { text: '', isCorrect: false, feedback: '' },
            { text: '', isCorrect: false, feedback: '' }
          ]
        });
        
        toast.success('Question added successfully');
        
        // Fetch updated quiz details to show accurate question count
        const updatedQuiz = await QuizService.getQuizById(currentQuiz.id);
        if (updatedQuiz) {
          setCurrentQuiz(updatedQuiz);
        }
      }
    } catch (err) {
      console.error("Error adding question:", err);
      toast.error(err.message || 'Failed to add question');
    } finally {
      setSaving(false);
    }
  };
  
  // Delete a question
  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }
    
    try {
      await QuizService.deleteQuestion(questionId);
      
      // Remove from questions list
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      
      toast.success('Question deleted successfully');
      
      // Fetch updated quiz details
      const updatedQuiz = await QuizService.getQuizById(currentQuiz.id);
      if (updatedQuiz) {
        setCurrentQuiz(updatedQuiz);
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      toast.error(err.message || 'Failed to delete question');
    }
  };
  
  // Publish quiz
  const handlePublishQuiz = async () => {
    try {
      if (questions.length === 0) {
        toast.error('Cannot publish a quiz without questions');
        return;
      }
      
      const response = await QuizService.publishQuiz(currentQuiz.id);
      
      if (response) {
        setCurrentQuiz(response);
        toast.success('Quiz published successfully');
      }
    } catch (err) {
      console.error("Error publishing quiz:", err);
      toast.error(err.message || 'Failed to publish quiz');
    }
  };
  
  // Finish quiz creation
  const handleFinishQuiz = () => {
    navigate(`/instructor/courses/${courseId}/content`);
  };
  
  if (loading) {
    return (
      <div className="quiz-creator-page loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="quiz-creator-page error">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className="solaris-button primary-button"
          onClick={() => navigate(`/instructor/courses/${courseId}/content`)}
        >
          Back to Course Content
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-creator-page">
      {!course ? (
        <div className="error-state">
          <h2>Error</h2>
          <p>Course not found or you don't have access to this course.</p>
          <button 
            className="solaris-button primary-button"
            onClick={() => navigate('/instructor/courses')}
          >
            Back to Courses
          </button>
        </div>
      ) : (
        <div>
          <div className="quiz-creator-header">
            <button 
              className="back-button" 
              onClick={() => navigate(`/instructor/courses/${courseId}/content`)}
            >
              <ChevronLeft size={16} />
              Back to Course Content
            </button>
            
            <div className="title-container">
              <h1>
                {activeStep === 'quiz-details' 
                  ? (isEditMode ? 'Edit Quiz' : 'Create New Quiz') 
                  : `Add Questions to: ${currentQuiz?.title}`}
              </h1>
              <p className="course-name">Course: {course?.title}</p>
            </div>
          </div>
          
          <div className="quiz-creator-steps">
            <div 
              className={`step ${activeStep === 'quiz-details' ? 'active' : (currentQuiz ? 'completed' : '')}`}
              onClick={() => currentQuiz && setActiveStep('quiz-details')}
            >
              <div className="step-number">
                {currentQuiz ? <CheckCircle size={20} /> : '1'}
              </div>
              <div className="step-label">Quiz Details</div>
            </div>
            
            <div className="step-connector"></div>
            
            <div 
              className={`step ${activeStep === 'questions' ? 'active' : ''}`}
              onClick={() => currentQuiz && setActiveStep('questions')}
            >
              <div className="step-number">2</div>
              <div className="step-label">Add Questions</div>
            </div>
          </div>
          
          <div className="quiz-creator-content">
            {activeStep === 'quiz-details' ? (
              <div className="quiz-details-section">
                <form onSubmit={handleQuizSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">Quiz Title*</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={quizForm.title}
                      onChange={handleQuizInputChange}
                      placeholder="Enter quiz title"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={quizForm.description}
                      onChange={handleQuizInputChange}
                      placeholder="Enter quiz description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="timeLimit">Time Limit (minutes)*</label>
                      <input
                        type="number"
                        id="timeLimit"
                        name="timeLimit"
                        value={quizForm.timeLimit}
                        onChange={handleQuizInputChange}
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
                        value={quizForm.passingScore}
                        onChange={handleQuizInputChange}
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
                      checked={quizForm.randomizeQuestions}
                      onChange={handleQuizInputChange}
                    />
                    <label htmlFor="randomizeQuestions">Randomize question order for each student</label>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="solaris-button secondary-button"
                      onClick={() => navigate(`/instructor/courses/${courseId}/content`)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="solaris-button primary-button"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : (isEditMode ? 'Update Quiz Details' : 'Continue to Add Questions')}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="questions-section">
                <div className="quiz-summary">
                  <div className="quiz-info">
                    <h3>{currentQuiz?.title}</h3>
                    {currentQuiz?.description && <p>{currentQuiz.description}</p>}
                    
                    <div className="quiz-meta">
                      <div className="quiz-meta-item">
                        <Clock size={16} />
                        <span>{currentQuiz?.timeLimit} minutes</span>
                      </div>
                      <div className="quiz-meta-item">
                        <Award size={16} />
                        <span>Pass: {currentQuiz?.passingScore}%</span>
                      </div>
                      <div className="quiz-meta-item">
                        <FileQuestion size={16} />
                        <span>{currentQuiz?.questionCount || questions.length || 0} questions</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="quiz-actions">
                    <button 
                      className="solaris-button secondary-button"
                      onClick={() => setActiveStep('quiz-details')}
                    >
                      <Edit size={16} />
                      Edit Details
                    </button>
                    
                    <button 
                      className="solaris-button success-button"
                      onClick={handlePublishQuiz}
                      disabled={questions.length === 0 || currentQuiz?.published}
                    >
                      <CheckCircle size={16} />
                      {currentQuiz?.published ? 'Published' : 'Publish Quiz'}
                    </button>
                    
                    <button 
                      className="solaris-button primary-button"
                      onClick={handleFinishQuiz}
                    >
                      Finish
                    </button>
                  </div>
                </div>
                
                <div className="questions-list">
                  <h3>Questions ({questions.length})</h3>
                  
                  {questions.length > 0 ? (
                    questions.map((question, index) => (
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
                                className={`question-option ${option.isCorrect || option.correct ? 'correct' : ''}`}
                              >
                                <div className="option-marker">
                                  {question.type === 'MULTIPLE_CHOICE' ? (
                                    <span className="radio-marker">{option.isCorrect || option.correct ? '●' : '○'}</span>
                                  ) : (
                                    <span className="checkbox-marker">{option.isCorrect || option.correct ? '☑' : '☐'}</span>
                                  )}
                                </div>
                                <div className="option-text">{option.text}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="question-actions">
                          <button 
                            className="action-button delete"
                            onClick={() => handleDeleteQuestion(question.id)}
                            title="Delete Question"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-questions">
                      <p>No questions added yet. Use the form below to add your first question.</p>
                    </div>
                  )}
                </div>
                
                <div className="add-question-form">
                  <h3>Add New Question</h3>
                  
                  <form onSubmit={handleQuestionSubmit}>
                    <div className="form-group">
                      <label htmlFor="type">Question Type*</label>
                      <select
                        id="type"
                        name="type"
                        value={questionForm.type}
                        onChange={handleQuestionInputChange}
                        required
                      >
                        <option value="MULTIPLE_CHOICE">Multiple Choice (Select One)</option>
                        <option value="MULTIPLE_ANSWER">Multiple Answer (Select Many)</option>
                        <option value="TRUE_FALSE">True/False</option>
                        <option value="SHORT_ANSWER">Short Answer</option>
                        <option value="ESSAY">Essay/Long Answer</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="text">Question Text*</label>
                      <textarea
                        id="text"
                        name="text"
                        value={questionForm.text}
                        onChange={handleQuestionInputChange}
                        placeholder="Enter your question"
                        rows={2}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="points">Points*</label>
                      <input
                        type="number"
                        id="points"
                        name="points"
                        value={questionForm.points}
                        onChange={handleQuestionInputChange}
                        min="1"
                        required
                      />
                    </div>
                    
                    {(questionForm.type === 'MULTIPLE_CHOICE' || questionForm.type === 'MULTIPLE_ANSWER') && (
                      <div className="options-section">
                        <label>
                          Answer Options
                          <span className="helper-text">
                            {questionForm.type === 'MULTIPLE_CHOICE' 
                              ? '(Select one correct answer)' 
                              : '(Select all correct answers)'}
                          </span>
                        </label>
                        
                        {questionForm.options.map((option, index) => (
                          <div key={index} className="option-row">
                            <div className="option-check">
                              <input
                                type={questionForm.type === 'MULTIPLE_CHOICE' ? 'radio' : 'checkbox'}
                                name={questionForm.type === 'MULTIPLE_CHOICE' ? 'correctOption' : `option-${index}`}
                                checked={option.isCorrect}
                                onChange={(e) => {
                                  if (questionForm.type === 'MULTIPLE_CHOICE') {
                                    // For radio buttons, deselect all other options
                                    const updatedOptions = questionForm.options.map((opt, i) => ({
                                      ...opt,
                                      isCorrect: i === index
                                    }));
                                    setQuestionForm(prev => ({
                                      ...prev,
                                      options: updatedOptions
                                    }));
                                  } else {
                                    handleOptionChange(index, 'isCorrect', e.target.checked);
                                  }
                                }}
                              />
                            </div>
                            
                            <div className="option-inputs">
                              <input
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                required
                              />
                              
                              <input
                                type="text"
                                placeholder="Feedback (optional)"
                                value={option.feedback}
                                onChange={(e) => handleOptionChange(index, 'feedback', e.target.value)}
                              />
                            </div>
                            
                            {questionForm.options.length > 2 && (
                              <button 
                                type="button" 
                                className="remove-option-btn"
                                onClick={() => removeOption(index)}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        
                        <button 
                          type="button" 
                          className="add-option-btn"
                          onClick={addOption}
                        >
                          <Plus size={16} />
                          Add Option
                        </button>
                      </div>
                    )}
                    
                    {questionForm.type === 'TRUE_FALSE' && (
                      <div className="true-false-section">
                        <label>Correct Answer</label>
                        
                        <div className="true-false-options">
                          <label className="radio-option">
                            <input
                              type="radio"
                              name="trueFalseAnswer"
                              value="true"
                              checked={questionForm.options[0]?.isCorrect === true}
                              onChange={() => {
                                setQuestionForm({
                                  ...questionForm,
                                  options: [
                                    { text: 'True', isCorrect: true, feedback: '' },
                                    { text: 'False', isCorrect: false, feedback: '' }
                                  ]
                                });
                              }}
                              required
                            />
                            <span>True</span>
                          </label>
                          
                          <label className="radio-option">
                            <input
                              type="radio"
                              name="trueFalseAnswer"
                              value="false"
                              checked={questionForm.options[1]?.isCorrect === true}
                              onChange={() => {
                                setQuestionForm({
                                  ...questionForm,
                                  options: [
                                    { text: 'True', isCorrect: false, feedback: '' },
                                    { text: 'False', isCorrect: true, feedback: '' }
                                  ]
                                });
                              }}
                            />
                            <span>False</span>
                          </label>
                        </div>
                      </div>
                    )}
                    
                    {(questionForm.type === 'SHORT_ANSWER' || questionForm.type === 'ESSAY') && (
                      <div className="text-answer-section">
                        <label>
                          Expected Answer
                          <span className="helper-text">
                            Provide expected answer or key points for grading (visible to instructors only)
                          </span>
                        </label>
                        
                        <textarea
                          name="expectedAnswer"
                          placeholder="Enter expected answer or grading rubric"
                          rows={3}
                          value={questionForm.expectedAnswer || ''}
                          onChange={(e) => setQuestionForm({...questionForm, expectedAnswer: e.target.value})}
                        />
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label htmlFor="feedback">
                        General Feedback
                        <span className="helper-text">(Optional)</span>
                      </label>
                      <textarea
                        id="feedback"
                        name="feedback"
                        value={questionForm.feedback}
                        onChange={handleQuestionInputChange}
                        placeholder="Feedback to show students after answering"
                        rows={2}
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="submit" 
                        className="solaris-button primary-button"
                        disabled={saving}
                      >
                        {saving ? 'Adding...' : 'Add Question'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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

export default QuizCreator;