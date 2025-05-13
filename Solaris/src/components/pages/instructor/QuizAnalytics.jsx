import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, FileQuestion, Award, Users, BarChart2, 
  CheckCircle, XCircle, Clock, Calendar, PercentCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import QuizService from '../../../services/QuizService';
import './QuizAnalytics.css';

const QuizAnalytics = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchQuizAndAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch quiz data
        const quizData = await QuizService.getQuizById(quizId);
        setQuiz(quizData);
        
        // Fetch quiz analytics
        const analyticsData = await QuizService.getQuizAnalytics(quizId);
        setAnalytics(analyticsData);
        
        // Fetch quiz attempts
        const attemptsData = await QuizService.getAttemptsByQuiz(quizId);
        setAttempts(attemptsData);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError(err.message || "Failed to load quiz analytics");
        toast.error(err.message || "Failed to load quiz analytics");
      } finally {
        setLoading(false);
      }
    };
    
    if (quizId) {
      fetchQuizAndAnalytics();
    }
  }, [quizId]);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="quiz-analytics-page loading">
        <div className="spinner"></div>
        <p>Loading quiz analytics...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="quiz-analytics-page error">
        <h2>Error Loading Analytics</h2>
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
    <div className="quiz-analytics-page">
      <div className="analytics-header">
        <button 
          className="back-button" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} />
          Back to Quizzes
        </button>
        
        <div className="title-container">
          <h1>Quiz Analytics: {quiz?.title}</h1>
        </div>
      </div>
      
      {(!analytics || analytics.totalAttempts === 0) ? (
        <div className="no-analytics">
          <div className="empty-state-icon">
            <BarChart2 size={48} />
          </div>
          <h2>No Analytics Available</h2>
          <p>
            This quiz has not been attempted by any students yet. 
            Analytics will be available once students start taking the quiz.
          </p>
        </div>
      ) : (
        <div className="analytics-container">
          {/* Quiz Overview */}
          <div className="analytics-section quiz-overview">
            <h2>Quiz Overview</h2>
            <div className="overview-cards">
              <div className="overview-card">
                <div className="card-icon">
                  <Award size={24} />
                </div>
                <div className="card-content">
                  <div className="card-value">{analytics.averageScore?.toFixed(1)}%</div>
                  <div className="card-label">Average Score</div>
                </div>
              </div>
              
              <div className="overview-card">
                <div className="card-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="card-content">
                  <div className="card-value">{analytics.passRate?.toFixed(1)}%</div>
                  <div className="card-label">Pass Rate</div>
                </div>
              </div>
              
              <div className="overview-card">
                <div className="card-icon">
                  <BarChart2 size={24} />
                </div>
                <div className="card-content">
                  <div className="card-value">{analytics.difficultyLevel?.toFixed(1)}/100</div>
                  <div className="card-label">Difficulty Level</div>
                </div>
              </div>
              
              <div className="overview-card">
                <div className="card-icon">
                  <Users size={24} />
                </div>
                <div className="card-content">
                  <div className="card-value">{analytics.totalAttempts}</div>
                  <div className="card-label">Total Attempts</div>
                </div>
              </div>
              
              <div className="overview-card">
                <div className="card-icon">
                  <Clock size={24} />
                </div>
                <div className="card-content">
                  <div className="card-value">{analytics.averageCompletionTime || 'N/A'}</div>
                  <div className="card-label">Avg. Completion Time</div>
                </div>
              </div>
              
              <div className="overview-card">
                <div className="card-icon">
                  <FileQuestion size={24} />
                </div>
                <div className="card-content">
                  <div className="card-value">{quiz?.questionCount || 0}</div>
                  <div className="card-label">Total Questions</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Question Performance */}
          {analytics.questionPerformance && (
            <div className="analytics-section question-performance">
              <h2>Question Performance</h2>
              <div className="table-responsive">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Type</th>
                      <th>Difficulty</th>
                      <th>Correct %</th>
                      <th>Avg. Points</th>
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
                        <td>{question.averagePoints?.toFixed(1)} / {question.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Student Attempts */}
          {attempts && attempts.length > 0 && (
            <div className="analytics-section student-attempts">
              <h2>Student Attempts</h2>
              <div className="table-responsive">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Date</th>
                      <th>Score</th>
                      <th>Result</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map(attempt => (
                      <tr key={attempt.id}>
                        <td>{attempt.studentName}</td>
                        <td>{formatDate(attempt.submittedAt)}</td>
                        <td>
                          <span className={getScoreClass(attempt.percentageScore)}>
                            {attempt.percentageScore?.toFixed(1)}%
                          </span>
                        </td>
                        <td>
                          {attempt.passed ? (
                            <span className="badge passed">
                              <CheckCircle size={14} />
                              Passed
                            </span>
                          ) : (
                            <span className="badge failed">
                              <XCircle size={14} />
                              Failed
                            </span>
                          )}
                        </td>
                        <td>
                          <button 
                            className="solaris-button secondary-button sm"
                            onClick={() => navigate(`/instructor/quiz-attempts/${attempt.id}/detailed`)}
                          >
                            View Details
                          </button>
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
  );
};

// Helper functions
const formatQuestionType = (type) => {
  if (!type) return 'Unknown';
  return type.replace('_', ' ').toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
};

const getDifficultyLabel = (difficulty) => {
  if (difficulty < 30) return 'Easy';
  if (difficulty < 70) return 'Medium';
  return 'Hard';
};

const getPerformanceClass = (percentage) => {
  if (percentage >= 70) return 'good';
  if (percentage >= 40) return 'average';
  return 'poor';
};

const getScoreClass = (score) => {
  if (score >= 70) return 'score-high';
  if (score >= 40) return 'score-medium';
  return 'score-low';
};

export default QuizAnalytics;