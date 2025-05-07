import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ExamDetails = ({ exam, onBack }) => {
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold', 
          color: '#1976d2',
          textAlign: 'center' 
        }}
      >
        Exam Details: {exam.name}
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Date & Time:</strong> {new Date(exam.dateTime).toLocaleString()}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Total Marks:</strong> {exam.totalMarks}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Students Completed:</strong> {exam.studentsCompleted}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Published:</strong> {exam.published ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body1">
          <strong>Immediate Results:</strong> {exam.immediateResults ? 'Yes' : 'No'}
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Questions
        </Typography>
        {exam.questions && exam.questions.length > 0 ? (
          exam.questions.map((question, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Question {index + 1}: {question.text} ({question.type})
              </Typography>
              {question.type === 'multiple-choice' && question.options && (
                <Box sx={{ ml: 2 }}>
                  {question.options.map((option, optIndex) => (
                    <Typography key={optIndex} variant="body2">
                      Option {optIndex + 1}: {option}
                    </Typography>
                  ))}
                </Box>
              )}
              {question.type === 'true-false' && (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2">Options: True, False</Typography>
                </Box>
              )}
              {question.type === 'constructive' && (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2">Open-ended question (no options)</Typography>
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: '#666' }}>
            No questions available for this exam.
          </Typography>
        )}
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          onClick={onBack}
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
            py: 1.5,
            px: 4
          }}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default ExamDetails;