<<<<<<< HEAD
import React, { useState } from "react";
import { Button } from "@mui/material";
import { ClipboardList, Clock, AlertCircle } from "lucide-react";
import "./QuizContent.css";

/**
 * QuizContent Component
 *
=======
import React, { useState } from 'react';
import { Button } from '@mui/material';
import { ClipboardList, Clock, AlertCircle } from 'lucide-react';
import './QuizContent.css';

/**
 * QuizContent Component
 * 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
 * Displays and handles interaction with quiz questions.
 * Includes state management for user responses and submission.
 */
function QuizContent({ item }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  if (!item) return null;

  // Mock quiz data - in a real app, this would come from the API
  const quizData = {
    title: item.title,
<<<<<<< HEAD
    description:
      "Answer the following questions to test your understanding of the material.",
    timeLimit: "20 minutes",
    questions: [
      {
        id: 1,
        text: "What is the primary function of the mitochondria?",
        type: "multiple-choice",
        options: [
          { id: "a", text: "Energy production through cellular respiration" },
          { id: "b", text: "Protein synthesis" },
          { id: "c", text: "Cell division" },
          { id: "d", text: "Waste removal" },
        ],
        correctAnswer: "a",
      },
      {
        id: 2,
        text: "Which of the following is NOT a type of tissue found in the human body?",
        type: "multiple-choice",
        options: [
          { id: "a", text: "Epithelial tissue" },
          { id: "b", text: "Connective tissue" },
          { id: "c", text: "Chromatic tissue" },
          { id: "d", text: "Nervous tissue" },
        ],
        correctAnswer: "c",
      },
    ],
  };

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
=======
    description: 'Answer the following questions to test your understanding of the material.',
    timeLimit: '20 minutes',
    questions: [
      {
        id: 1,
        text: 'What is the primary function of the mitochondria?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Energy production through cellular respiration' },
          { id: 'b', text: 'Protein synthesis' },
          { id: 'c', text: 'Cell division' },
          { id: 'd', text: 'Waste removal' }
        ],
        correctAnswer: 'a'
      },
      {
        id: 2,
        text: 'Which of the following is NOT a type of tissue found in the human body?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Epithelial tissue' },
          { id: 'b', text: 'Connective tissue' },
          { id: 'c', text: 'Chromatic tissue' },
          { id: 'd', text: 'Nervous tissue' }
        ],
        correctAnswer: 'c'
      }
    ]
  };

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    }));
  };

  const handleSubmit = () => {
    // Validate that all questions are answered
<<<<<<< HEAD
    const allAnswered = quizData.questions.every((q) => answers[q.id]);

    if (!allAnswered) {
      setError("Please answer all questions before submitting.");
=======
    const allAnswered = quizData.questions.every(q => answers[q.id]);
    
    if (!allAnswered) {
      setError('Please answer all questions before submitting.');
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
      return;
    }

    // Calculate results
    let correct = 0;
    const questionResults = {};
<<<<<<< HEAD

    quizData.questions.forEach((question) => {
=======
    
    quizData.questions.forEach(question => {
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
      const isCorrect = answers[question.id] === question.correctAnswer;
      questionResults[question.id] = {
        userAnswer: answers[question.id],
        correctAnswer: question.correctAnswer,
<<<<<<< HEAD
        isCorrect,
      };

      if (isCorrect) correct++;
    });

    const score = Math.round((correct / quizData.questions.length) * 100);

=======
        isCorrect
      };
      
      if (isCorrect) correct++;
    });
    
    const score = Math.round((correct / quizData.questions.length) * 100);
    
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    setResults({
      score,
      correct,
      total: quizData.questions.length,
<<<<<<< HEAD
      questionResults,
    });

    setSubmitted(true);
    setError(null);

=======
      questionResults
    });
    
    setSubmitted(true);
    setError(null);
    
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    // In a real app, you would send the answers to the backend
    // await courseService.submitQuizAnswers(courseId, quizId, answers);
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
    setError(null);
  };

  return (
    <div className="quiz-content">
      <div className="quiz-header">
        <div className="quiz-title-container">
          <ClipboardList className="quiz-icon" />
          <h2 className="quiz-title">{quizData.title}</h2>
        </div>
        <div className="quiz-meta">
          <div className="quiz-time">
            <Clock className="meta-icon" />
            <span>{quizData.timeLimit}</span>
          </div>
        </div>
      </div>
<<<<<<< HEAD

=======
      
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
      {error && (
        <div className="quiz-error">
          <AlertCircle className="error-icon" />
          <span>{error}</span>
        </div>
      )}
<<<<<<< HEAD

      {submitted && results ? (
        <div className="quiz-results">
          <div
            className={`results-score ${results.score >= 70 ? "score-passing" : "score-failing"}`}
          >
            <div className="score-number">{results.score}%</div>
            <div className="score-text">
              {results.score >= 70 ? "Passed" : "Failed"}
=======
      
      {submitted && results ? (
        <div className="quiz-results">
          <div className={`results-score ${results.score >= 70 ? 'score-passing' : 'score-failing'}`}>
            <div className="score-number">{results.score}%</div>
            <div className="score-text">
              {results.score >= 70 ? 'Passed' : 'Failed'}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
            </div>
            <div className="score-details">
              {results.correct} of {results.total} questions correct
            </div>
          </div>
<<<<<<< HEAD

          <div className="results-breakdown">
            <h3 className="breakdown-title">Question Breakdown</h3>

            {quizData.questions.map((question) => {
              const result = results.questionResults[question.id];
              const selectedOption = question.options.find(
                (opt) => opt.id === result.userAnswer,
              );
              const correctOption = question.options.find(
                (opt) => opt.id === result.correctAnswer,
              );

              return (
                <div
                  key={question.id}
                  className={`result-question ${result.isCorrect ? "question-correct" : "question-incorrect"}`}
=======
          
          <div className="results-breakdown">
            <h3 className="breakdown-title">Question Breakdown</h3>
            
            {quizData.questions.map(question => {
              const result = results.questionResults[question.id];
              const selectedOption = question.options.find(opt => opt.id === result.userAnswer);
              const correctOption = question.options.find(opt => opt.id === result.correctAnswer);
              
              return (
                <div 
                  key={question.id} 
                  className={`result-question ${result.isCorrect ? 'question-correct' : 'question-incorrect'}`}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                >
                  <div className="question-text">
                    <span className="question-number">{question.id}.</span>
                    <span>{question.text}</span>
                  </div>
<<<<<<< HEAD

=======
                  
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                  <div className="question-result">
                    <div className="your-answer">
                      <span className="answer-label">Your answer:</span>
                      <span className="answer-text">{selectedOption.text}</span>
                    </div>
<<<<<<< HEAD

                    {!result.isCorrect && (
                      <div className="correct-answer">
                        <span className="answer-label">Correct answer:</span>
                        <span className="answer-text">
                          {correctOption.text}
                        </span>
=======
                    
                    {!result.isCorrect && (
                      <div className="correct-answer">
                        <span className="answer-label">Correct answer:</span>
                        <span className="answer-text">{correctOption.text}</span>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
<<<<<<< HEAD

=======
          
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
          <div className="results-actions">
            <Button className="retry-button" onClick={resetQuiz}>
              Try Again
            </Button>
<<<<<<< HEAD
            <Button className="continue-button">Continue to Next Lesson</Button>
=======
            <Button className="continue-button">
              Continue to Next Lesson
            </Button>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
          </div>
        </div>
      ) : (
        <>
          <p className="quiz-description">{quizData.description}</p>
<<<<<<< HEAD

          <div className="quiz-questions">
            {quizData.questions.map((question) => (
=======
          
          <div className="quiz-questions">
            {quizData.questions.map(question => (
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
              <div key={question.id} className="quiz-question">
                <h3 className="question-text">
                  <span className="question-number">{question.id}.</span>
                  <span>{question.text}</span>
                </h3>
<<<<<<< HEAD

                <div className="question-options">
                  {question.options.map((option) => (
                    <div key={option.id} className="option-container">
                      <input
                        type="radio"
                        id={`q${question.id}-${option.id}`}
                        name={`question-${question.id}`}
                        className="option-input"
                        checked={answers[question.id] === option.id}
                        onChange={() =>
                          handleAnswerChange(question.id, option.id)
                        }
                      />
                      <label
=======
                
                <div className="question-options">
                  {question.options.map(option => (
                    <div key={option.id} className="option-container">
                      <input 
                        type="radio" 
                        id={`q${question.id}-${option.id}`} 
                        name={`question-${question.id}`} 
                        className="option-input"
                        checked={answers[question.id] === option.id}
                        onChange={() => handleAnswerChange(question.id, option.id)}
                      />
                      <label 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                        htmlFor={`q${question.id}-${option.id}`}
                        className="option-label"
                      >
                        {option.text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
<<<<<<< HEAD

=======
          
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
          <div className="quiz-actions">
            <Button className="submit-button" onClick={handleSubmit}>
              Submit Answers
            </Button>
<<<<<<< HEAD
            <Button variant="outlined" size="small">
              Previous
            </Button>
=======
            <Button variant="outlined" size="small">Previous</Button>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
          </div>
        </>
      )}
    </div>
  );
}

export default QuizContent;
