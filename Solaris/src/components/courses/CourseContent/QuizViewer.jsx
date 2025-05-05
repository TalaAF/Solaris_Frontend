import React, { useState } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';

function QuizViewer({ title, quizData }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSubmit = () => {
    // Calculate score
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      const questionId = index;
      if (answers[questionId] === question.correctAnswer) {
        correct++;
      }
    });
    
    const calculatedScore = Math.round((correct / quizData.questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
  };

  return (
    <div className="quiz-viewer">
      <h3>{quizData.title || title}</h3>
      
      {!submitted ? (
        <>
          <div className="quiz-instructions">
            <p>Answer all questions below. You can only submit once.</p>
          </div>
          
          <div className="quiz-questions">
            {quizData.questions.map((question, index) => (
              <div key={index} className="quiz-question">
                <h4>Question {index + 1}</h4>
                <p>{question.question}</p>
                
                <FormControl component="fieldset">
                  <RadioGroup
                    name={`question-${index}`}
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  >
                    {question.options.map((option, optIdx) => (
                      <FormControlLabel 
                        key={optIdx} 
                        value={option} 
                        control={<Radio />} 
                        label={option} 
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            ))}
          </div>
          
          <Button 
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < quizData.questions.length}
            sx={{ mt: 3 }}
          >
            Submit Quiz
          </Button>
        </>
      ) : (
        <div className="quiz-results">
          <h3>Quiz Results</h3>
          <div className="quiz-score">
            <p>Your score: <strong>{score}%</strong></p>
            {score >= 70 ? (
              <div className="quiz-pass">Congratulations! You passed the quiz!</div>
            ) : (
              <div className="quiz-fail">You did not pass. Please review the material and try again.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizViewer;