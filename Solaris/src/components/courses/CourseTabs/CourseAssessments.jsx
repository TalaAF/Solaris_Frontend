import React, { useState } from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import mockAssignmentData from "../../../mocks/assignmentData";
import mockQuizData, { QuestionType } from "../../../mocks/quizData";
import "./CourseAssessments.css";

/**
 * CourseAssessments Component
 *
 * Displays assignments and quizzes for the course with detailed views
 * and interactive features for taking quizzes and submitting assignments.
 */
function CourseAssessments({ courseData }) {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentType, setAssessmentType] = useState(null); // 'quiz' or 'assignment'
  const [quizInProgress, setQuizInProgress] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date specified";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleSelectAssessment = (assessment, type) => {
    setSelectedAssessment(assessment);
    setAssessmentType(type);
    setQuizInProgress(false);
    setQuizSubmitted(false);
    setQuizResult(null);
    setQuizAnswers({});
  };

  const startQuiz = () => {
    setQuizInProgress(true);
  };

  const handleAnswerChange = (questionId, value, type) => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.TRUE_FALSE:
        setQuizAnswers({
          ...quizAnswers,
          [questionId]: value
        });
        break;
      case QuestionType.MULTIPLE_ANSWER:
        const currentSelections = quizAnswers[questionId] || [];
        const updatedSelections = currentSelections.includes(value)
          ? currentSelections.filter(item => item !== value)
          : [...currentSelections, value];
        
        setQuizAnswers({
          ...quizAnswers,
          [questionId]: updatedSelections
        });
        break;
      case QuestionType.SHORT_ANSWER:
      case QuestionType.ESSAY:
        setQuizAnswers({
          ...quizAnswers,
          [questionId]: value
        });
        break;
      default:
        break;
    }
  };

  const submitQuiz = () => {
    const quiz = selectedAssessment;
    let correct = 0;
    let totalPoints = 0;
    let unansweredEssays = 0;

    quiz.questions.forEach((q) => {
      totalPoints += q.points;
      
      if (q.type === QuestionType.ESSAY) {
        // Essays need manual grading, track them separately
        unansweredEssays++;
        return;
      }
      
      const answer = quizAnswers[q.id];
      
      if (answer === undefined) return; // Skip unanswered questions
      
      switch (q.type) {
        case QuestionType.MULTIPLE_CHOICE:
          if (answer === q.correctAnswer) {
            correct += q.points;
          }
          break;
        case QuestionType.MULTIPLE_ANSWER:
          if (answer && Array.isArray(answer) && Array.isArray(q.correctAnswers)) {
            // Check if arrays have same length and all items match
            const isCorrect = 
              answer.length === q.correctAnswers.length && 
              answer.every(item => q.correctAnswers.includes(item)) &&
              q.correctAnswers.every(item => answer.includes(item));
            
            if (isCorrect) {
              correct += q.points;
            }
          }
          break;
        case QuestionType.TRUE_FALSE:
          if ((answer === true && q.correctAnswer === true) || 
              (answer === false && q.correctAnswer === false)) {
            correct += q.points;
          }
          break;
        case QuestionType.SHORT_ANSWER:
          const userAnswer = String(answer).trim().toLowerCase();
          const correctAnswer = String(q.correctAnswer).toLowerCase();
          const acceptableAnswers = 
            q.acceptableAnswers?.map(a => String(a).toLowerCase()) || [];
          
          if (userAnswer === correctAnswer || acceptableAnswers.includes(userAnswer)) {
            correct += q.points;
          }
          break;
        default:
          break;
      }
    });

    // Calculate score, excluding essay questions
    const nonEssayQuestions = quiz.questions.filter(q => q.type !== QuestionType.ESSAY);
    const nonEssayPoints = nonEssayQuestions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((correct / nonEssayPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    setQuizResult({
      score: percentage,
      passed,
      pointsEarned: correct,
      totalPoints: nonEssayPoints,
      submittedDate: new Date().toISOString(),
      pendingEssays: unansweredEssays > 0,
      totalEssayPoints: totalPoints - nonEssayPoints
    });

    setQuizSubmitted(true);
  };

  const handleBackToAssessments = () => {
    setSelectedAssessment(null);
    setAssessmentType(null);
    setUploadedFile(null);
    setUploadError(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset error state
    setUploadError(null);
    
    // Get file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedTypes = selectedAssessment.allowedFileTypes || ".py,.txt";
    const allowedExtensions = allowedTypes.split(',').map(type => 
      type.trim().replace('.', '').toLowerCase()
    );
    
    // Validate file type
    if (!allowedExtensions.includes(fileExtension)) {
      setUploadError(`Invalid file type. Allowed types: ${allowedTypes}`);
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds the 10MB limit");
      return;
    }
    
    // Set the file if it passes validation
    setUploadedFile(file);
  };

  const handleSubmitAssignment = () => {
    if (!uploadedFile) {
      setUploadError("Please upload a file before submitting");
      return;
    }

    // In a real application, you would send the file to your API
    console.log("Submitting file:", uploadedFile);
    
    // For the mock implementation, we'll update the local state to simulate submission
    setSelectedAssessment({
      ...selectedAssessment,
      status: "submitted",
      submissionDate: new Date().toISOString(),
    });
    
    // Reset upload state
    setUploadedFile(null);
    setUploadError(null);
  };

  const renderAssessmentsList = () => {
    const getFilteredAssessments = () => {
      switch (activeTab) {
        case "assignments":
          return { assignments: mockAssignmentData, quizzes: [] };
        case "quizzes":
          return { assignments: [], quizzes: mockQuizData };
        case "upcoming":
          const now = new Date();
          const upcomingAssignments = mockAssignmentData.filter(
            (a) => new Date(a.dueDate) > now && a.status === "not-submitted"
          );
          const upcomingQuizzes = mockQuizData.filter(
            (q) => new Date(q.dueDate) > now && q.status === "not-started"
          );
          return { assignments: upcomingAssignments, quizzes: upcomingQuizzes };
        default:
          return { assignments: mockAssignmentData, quizzes: mockQuizData };
      }
    };

    const { assignments, quizzes } = getFilteredAssessments();

    return (
      <div className="assessments-container">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="assessments-tabs"
        >
          <TabsList className="assessments-tabslist">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="assessments-grid">
            {assignments.map((assignment) => (
              <Card
                key={`assignment-${assignment.id}`}
                className="assessment-card"
                onClick={() => handleSelectAssessment(assignment, "assignment")}
              >
                <div className="assessment-card-content">
                  <div className="assessment-card-header">
                    <div className="assessment-icon assignment-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="assessment-title-wrapper">
                      <h3>{assignment.title}</h3>
                    </div>
                  </div>
                  
                  <div className="assessment-card-body">
                    <p className="assessment-description">{assignment.description}</p>
                  </div>
                  
                  <div className="assessment-card-footer">
                    <p className="assessment-due-date">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Due: {formatDate(assignment.dueDate)}
                    </p>
                    <div className={`assessment-status status-${assignment.status}`}>
                      {assignment.status === "not-submitted" ? (
                        "Due"
                      ) : assignment.status === "submitted" ? (
                        "Submitted"
                      ) : (
                        "Graded"
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {quizzes.map((quiz) => (
              <Card
                key={`quiz-${quiz.id}`}
                className="assessment-card"
                onClick={() => handleSelectAssessment(quiz, "quiz")}
              >
                <div className="assessment-card-content">
                  <div className="assessment-card-header">
                    <div className="assessment-icon quiz-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                    <div className="assessment-title-wrapper">
                      <h3>{quiz.title}</h3>
                    </div>
                  </div>
                  
                  <div className="assessment-card-body">
                    <p className="assessment-description">{quiz.description}</p>
                  </div>
                  
                  <div className="assessment-card-footer">
                    <p className="assessment-due-date">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Due: {formatDate(quiz.dueDate)}
                    </p>
                    <div className={`assessment-status status-${quiz.status}`}>
                      {quiz.status === "not-started" ? (
                        "Not Started"
                      ) : quiz.status === "in-progress" ? (
                        "In Progress"
                      ) : (
                        "Completed"
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {assignments.length === 0 && quizzes.length === 0 && (
              <div className="no-assessments">
                <p>No assessments found in this category.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderQuiz = () => {
    const quiz = selectedAssessment;

    if (quizInProgress && !quizSubmitted) {
      return (
        <div className="quiz-attempt">
          <div className="quiz-timer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="timer-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Time Remaining: {quiz.timeLimit}:00</span>
          </div>

          <div className="quiz-questions">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="quiz-question">
                <h4>Question {index + 1} ({question.points} pts)</h4>
                <p className="question-text">{question.question}</p>

                {question.type === QuestionType.MULTIPLE_CHOICE && (
                  <div className="question-options">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="option">
                        <label className="option-label">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={optIndex}
                            checked={quizAnswers[question.id] === optIndex}
                            onChange={() => handleAnswerChange(question.id, optIndex, question.type)}
                          />
                          <span className="option-text">{option}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === QuestionType.MULTIPLE_ANSWER && (
                  <div className="question-options">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="option">
                        <label className="option-label">
                          <input
                            type="checkbox"
                            name={`question-${question.id}`}
                            value={optIndex}
                            checked={(quizAnswers[question.id] || []).includes(optIndex)}
                            onChange={() => handleAnswerChange(question.id, optIndex, question.type)}
                          />
                          <span className="option-text">{option}</span>
                        </label>
                      </div>
                    ))}
                    <p className="question-hint">Select all that apply</p>
                  </div>
                )}

                {question.type === QuestionType.TRUE_FALSE && (
                  <div className="question-options true-false-options">
                    <div className="option">
                      <label className="option-label">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="true"
                          checked={quizAnswers[question.id] === true}
                          onChange={() => handleAnswerChange(question.id, true, question.type)}
                        />
                        <span className="option-text">True</span>
                      </label>
                    </div>
                    <div className="option">
                      <label className="option-label">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="false"
                          checked={quizAnswers[question.id] === false}
                          onChange={() => handleAnswerChange(question.id, false, question.type)}
                        />
                        <span className="option-text">False</span>
                      </label>
                    </div>
                  </div>
                )}

                {question.type === QuestionType.SHORT_ANSWER && (
                  <div className="question-text-input">
                    <input
                      type="text"
                      placeholder="Your answer..."
                      value={quizAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
                      className="short-answer-input"
                    />
                  </div>
                )}

                {question.type === QuestionType.ESSAY && (
                  <div className="question-text-input">
                    <textarea
                      placeholder="Your answer..."
                      value={quizAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
                      className="essay-input"
                      rows="6"
                    />
                    {question.rubric && (
                      <div className="rubric-info">
                        <details>
                          <summary>Grading Rubric</summary>
                          <ul className="rubric-list">
                            {question.rubric.map((criterion, idx) => (
                              <li key={idx}>{criterion}</li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="quiz-submission">
            <Button
              className="submit-quiz-btn"
              disabled={Object.keys(quizAnswers).length < quiz.questions.length}
              onClick={submitQuiz}
            >
              Submit Quiz
            </Button>
            <p className="submission-note">
              {Object.keys(quizAnswers).length < quiz.questions.length
                ? `Please answer all questions before submitting.`
                : `You've answered all questions. Review your answers before submitting.`}
            </p>
          </div>
        </div>
      );
    }

    if (quizSubmitted) {
      return (
        <div className="quiz-results">
          <div className="results-header">
            <h2>Quiz Results</h2>
          </div>

          <div className="results-summary">
            <div className={`score-display ${quizResult.passed ? "passing" : "failing"}`}>
              <div className="score-number">{quizResult.score}%</div>
              <div className="score-label">{quizResult.passed ? "Passed" : "Failed"}</div>
            </div>

            <div className="score-details">
              <div className="detail-item">
                <span className="detail-label">Points earned:</span>
                <span className="detail-value">
                  {quizResult.pointsEarned} / {quizResult.totalPoints}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Passing score:</span>
                <span className="detail-value">{quiz.passingScore}%</span>
              </div>
            </div>
          </div>

          {quizResult.pendingEssays && (
            <div className="pending-essays">
              <h3>Essay Questions Pending Review</h3>
              <p>Your essay responses have been submitted and will be graded by your instructor.
              {quizResult.totalEssayPoints > 0 && 
                ` These questions are worth an additional ${quizResult.totalEssayPoints} points 
                and are not included in your current score.`}
              </p>
            </div>
          )}

          <div className="results-actions">
            <Button className="back-to-assessments" onClick={handleBackToAssessments}>
              Back to Assessments
            </Button>

            {quiz.attempts && quiz.attempts.remaining > 0 && (
              <Button className="retake-quiz" onClick={startQuiz}>
                Retake Quiz
              </Button>
            )}
          </div>
        </div>
      );
    }

    // Quiz details view (not started)
    return (
      <div className="assessment-details quiz-details">
        <div className="assessment-header">
          <h2>{quiz.title}</h2>
          <div className="assessment-meta">
            <div className="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Due: {formatDate(quiz.dueDate)}</span>
            </div>
            <div className="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Time Limit: {quiz.timeLimit} minutes</span>
            </div>
            <div className="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <span>Points: {quiz.totalPoints}</span>
            </div>
          </div>
        </div>

        <div className="assessment-content">
          <div className="assessment-section">
            <h3>About this Quiz</h3>
            <p>{quiz.description}</p>
            <div className="quiz-meta">
              <div className="meta-row">
                <strong>Passing Score:</strong> {quiz.passingScore}%
              </div>
              <div className="meta-row">
                <strong>Attempts Allowed:</strong> {quiz.attempts?.max || 1}
              </div>
              <div className="meta-row">
                <strong>Attempts Remaining:</strong> {quiz.attempts?.remaining || 1}
              </div>
              {quiz.status === "completed" && (
                <div className="meta-row">
                  <strong>Your Score:</strong> {quiz.score}%
                </div>
              )}
            </div>
          </div>

          {quiz.status !== "completed" && (quiz.attempts?.remaining > 0 || !quiz.attempts) && (
            <div className="quiz-actions">
              <Button className="start-quiz" onClick={startQuiz}>
                Start Quiz
              </Button>
              <p className="quiz-warning">Once started, the timer cannot be paused.</p>
            </div>
          )}

          {quiz.status === "completed" && (
            <div className="quiz-completed">
              <div className="completed-message">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="completed-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Quiz completed on {formatDate(quiz.completedDate)}</span>
              </div>
              {quiz.attempts && quiz.attempts.remaining > 0 && (
                <Button className="retake-quiz" onClick={startQuiz}>
                  Retake Quiz
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAssignment = () => {
    const assignment = selectedAssessment;
    
    return (
      <div className="assessment-details">
        <h2>{assignment.title}</h2>
        
        {/* Key information */}
        <div className="assessment-meta">
          <div className="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div>
              <div>Due Date</div>
              <strong>{formatDate(assignment.dueDate)}</strong>
            </div>
          </div>
          
          <div className="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <div>
              <div>Points</div>
              <strong>{assignment.totalPoints}</strong>
            </div>
          </div>
          
          <div className="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <div>
              <div>Status</div>
              <strong>{assignment.status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</strong>
            </div>
          </div>
        </div>
        
        <div className="assessment-content">
          {/* Description section */}
          <div className="assessment-section">
            <h3>Description</h3>
            <p>{assignment.description}</p>
          </div>
          
          {/* Instructions section */}
          <div className="assessment-section">
            <h3>Instructions</h3>
            <p>{assignment.instructions}</p>
          </div>
          
          {/* Submission or feedback section */}
          {assignment.status === "not-submitted" && (
            <div className="assessment-section">
              <h3>Submit Assignment</h3>
              <div className="file-upload-container">
                {!uploadedFile ? (
                  <>
                    <label className="upload-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      Upload File
                      <input 
                        type="file" 
                        hidden 
                        onChange={handleFileUpload}
                        accept={assignment.allowedFileTypes || ".py,.txt"}
                      />
                    </label>
                    <div className="file-types">
                      Allowed file types: {assignment.allowedFileTypes || ".py, .txt"}
                    </div>
                  </>
                ) : (
                  <div className="file-selected">
                    <div className="file-info">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <div className="file-details">
                        <span className="file-name">{uploadedFile.name}</span>
                        <span className="file-size">{(uploadedFile.size / 1024).toFixed(2)} KB</span>
                      </div>
                    </div>
                    <button 
                      className="remove-file-btn" 
                      onClick={() => setUploadedFile(null)}
                      aria-label="Remove file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )}
                
                {uploadError && (
                  <div className="upload-error">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {uploadError}
                  </div>
                )}
              </div>
              
              <div className="submit-container">
                <button 
                  className={`submit-button ${!uploadedFile ? 'disabled' : ''}`}
                  disabled={!uploadedFile}
                  onClick={handleSubmitAssignment}
                >
                  Submit Assignment
                </button>
              </div>
            </div>
          )}
          
          {assignment.status === "submitted" && (
            <div className="assessment-section">
              <h3>Submission Information</h3>
              <p><strong>Submitted on:</strong> {formatDate(assignment.submissionDate)}</p>
              <p><strong>Status:</strong> Awaiting grade</p>
            </div>
          )}
          
          {assignment.status === "graded" && (
            <div className="assessment-section feedback-section">
              <h3>Feedback</h3>
              <p>{assignment.feedback}</p>
              <div className="grade-info">
                Score: <strong>{assignment.score}/{assignment.totalPoints}</strong>
                &nbsp;({Math.round((assignment.score / assignment.totalPoints) * 100)}%)
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="course-assessments">
      {selectedAssessment ? (
        <div className="assessment-detail-view">
          <Button className="back-button" onClick={handleBackToAssessments}>
            ← Back to Assessments
          </Button>

          {assessmentType === "quiz" ? renderQuiz() : renderAssignment()}
        </div>
      ) : (
        renderAssessmentsList()
      )}
    </div>
  );
}

export default CourseAssessments;
