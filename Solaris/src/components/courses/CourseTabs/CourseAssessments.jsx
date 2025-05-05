import React, { useState } from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import mockAssignmentData from "../../../mocks/assignmentData";
import mockQuizData from "../../../mocks/quizData";
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

  const handleAnswerChange = (questionId, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answerIndex,
    });
  };

  const submitQuiz = () => {
    // Calculate score based on answers
    const quiz = selectedAssessment;
    let correct = 0;
    let totalPoints = 0;

    quiz.questions.forEach((q) => {
      totalPoints += q.points;
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct += q.points;
      }
    });

    const percentage = Math.round((correct / totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    // Set results
    setQuizResult({
      score: percentage,
      passed,
      pointsEarned: correct,
      totalPoints,
      submittedDate: new Date().toISOString(),
    });

    setQuizSubmitted(true);
  };

  const handleBackToAssessments = () => {
    setSelectedAssessment(null);
    setAssessmentType(null);
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
                  <div className="assessment-icon assignment-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="assessment-details">
                    <h3>{assignment.title}</h3>
                    <p className="assessment-due-date">Due: {formatDate(assignment.dueDate)}</p>
                    <p className="assessment-description">{assignment.description}</p>
                    <div className={`assessment-status status-${assignment.status}`}>
                      {assignment.status === "not-submitted" ? (
                        "Not Submitted"
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
                  <div className="assessment-icon quiz-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div className="assessment-details">
                    <h3>{quiz.title}</h3>
                    <p className="assessment-due-date">Due: {formatDate(quiz.dueDate)}</p>
                    <p className="assessment-description">{quiz.description}</p>
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
                <p>{question.question}</p>

                <div className="question-options">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="option">
                      <label className="option-label">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optIndex}
                          checked={quizAnswers[question.id] === optIndex}
                          onChange={() => handleAnswerChange(question.id, optIndex)}
                        />
                        <span className="option-text">{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
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
                <button className="upload-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Upload File
                </button>
                <div className="file-types">
                  Allowed file types: {assignment.allowedFileTypes}
                </div>
              </div>
              
              <div className="submit-container">
                <button className="submit-button">Submit Assignment</button>
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
