import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormLabel
} from '@mui/material';

const ExamForm = ({ exam = null, onSave, onCancel }) => {
  const [inputMethod, setInputMethod] = useState('write'); // 'upload' or 'write'
  const [formData, setFormData] = useState(
    exam || {
      name: '',
      numberOfQuestions: 0,
      dateTime: '',
      totalMarks: '',
      questions: [],
      immediateResults: false,
      published: false,
      studentsCompleted: 0,
    }
  );
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null); // Ref to reset file input

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Please enter an exam name';
    if (inputMethod === 'write' && formData.numberOfQuestions > 0) {
      formData.questions.forEach((q, i) => {
        if (!q.text) newErrors[`question${i}`] = `Question ${i + 1} text is required`;
        if (q.type === 'multiple-choice' && (!q.options || q.options.some(opt => !opt))) {
          newErrors[`options${i}`] = `All options for Question ${i + 1} are required`;
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const cleanedQuestions = formData.questions.slice(0, formData.numberOfQuestions).map(q => {
        if (q.type === 'multiple-choice') {
          return {
            type: 'multiple-choice',
            text: q.text,
            options: q.options || [],
            numberOfOptions: q.numberOfOptions || 4
          };
        } else if (q.type === 'true-false') {
          return {
            type: 'true-false',
            text: q.text,
            options: ['True', 'False']
          };
        } else {
          return {
            type: 'constructive',
            text: q.text,
            options: []
          };
        }
      });
      onSave({
        ...formData,
        questions: cleanedQuestions
      });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validMimeType = file.type === 'application/json';
    const validExtension = file.name.toLowerCase().endsWith('.json');
    if (!validMimeType || !validExtension) {
      setErrors({ file: 'Please upload a valid JSON file (.json)' });
      fileInputRef.current.value = ''; // Reset file input
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data.questions)) {
          setErrors({ file: 'Invalid file format: "questions" must be an array' });
          fileInputRef.current.value = ''; // Reset file input
          return;
        }
        // Validate question types and structure
        const validatedQuestions = data.questions.map((q, i) => {
          if (!q.text || !q.type) {
            throw new Error(`Question ${i + 1} is missing text or type`);
          }
          if (q.type === 'multiple-choice') {
            if (!q.options || q.options.length < 2) {
              throw new Error(`Question ${i + 1} (multiple-choice) must have at least 2 options`);
            }
            return {
              type: 'multiple-choice',
              text: q.text,
              options: q.options,
              numberOfOptions: q.options.length
            };
          } else if (q.type === 'true-false') {
            return {
              type: 'true-false',
              text: q.text,
              options: ['True', 'False']
            };
          } else if (q.type === 'constructive') {
            return {
              type: 'constructive',
              text: q.text,
              options: []
            };
          } else {
            throw new Error(`Question ${i + 1} has an invalid type`);
          }
        });
        setFormData({
          ...formData,
          questions: validatedQuestions,
          numberOfQuestions: validatedQuestions.length
        });
        setErrors({});
      } catch (err) {
        setErrors({ file: `Error parsing file: ${err.message}` });
        fileInputRef.current.value = ''; // Reset file input
      }
    };
    reader.readAsText(file);
  };

  const initializeQuestions = (num) => {
    const questions = Array.from({ length: num }, (_, i) => 
      formData.questions[i] || { type: 'multiple-choice', text: '', options: Array(4).fill(''), numberOfOptions: 4 }
    );
    setFormData({ ...formData, numberOfQuestions: num, questions });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    if (!updatedQuestions[index]) {
      updatedQuestions[index] = { type: 'multiple-choice', text: '', options: Array(4).fill(''), numberOfOptions: 4 };
    }
    if (field === 'text') {
      updatedQuestions[index].text = value;
    } else if (field === 'type') {
      updatedQuestions[index].type = value;
      if (value === 'multiple-choice') {
        updatedQuestions[index].options = Array(updatedQuestions[index].numberOfOptions || 4).fill('');
      } else if (value === 'true-false') {
        updatedQuestions[index].options = ['True', 'False'];
        delete updatedQuestions[index].numberOfOptions;
      } else {
        updatedQuestions[index].options = [];
        delete updatedQuestions[index].numberOfOptions;
      }
    } else if (field === 'numberOfOptions') {
      updatedQuestions[index].numberOfOptions = value;
      updatedQuestions[index].options = Array(value).fill('');
    } else {
      updatedQuestions[index].options[field] = value;
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

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
        {exam ? 'Edit Exam' : 'Add New Exam'}
      </Typography>
      <Grid container spacing={4} direction="column">
        <Grid item>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Exam Name
          </Typography>
          <TextField
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Date and Time
          </Typography>
          <TextField
            fullWidth
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Total Marks
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={formData.totalMarks || ''}
            onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'medium' }}>
              How would you like to add questions?
            </FormLabel>
            <RadioGroup
              row
              value={inputMethod}
              onChange={(e) => setInputMethod(e.target.value)}
            >
              <FormControlLabel value="write" control={<Radio />} label="Write questions manually" />
              <FormControlLabel value="upload" control={<Radio />} label="Upload a file" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {inputMethod === 'upload' && (
          <Grid item>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
              Upload Questions File (JSON)
            </Typography>
            <TextField
              fullWidth
              type="file"
              inputRef={fileInputRef}
              onChange={handleFileUpload}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'application/json' }}
              error={!!errors.file}
              helperText={errors.file || 'Upload a JSON file containing questions'}
            />
          </Grid>
        )}
        {inputMethod === 'write' && (
          <>
            <Grid item>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                Number of Questions
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={formData.numberOfQuestions || ''}
                onChange={(e) => initializeQuestions(parseInt(e.target.value) || 0)}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                Questions
              </Typography>
              {formData.numberOfQuestions > 0 ? (
                Array.from({ length: formData.numberOfQuestions }).map((_, index) => (
                  <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Question {index + 1}
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Question Type</InputLabel>
                      <Select
                        value={formData.questions[index]?.type || 'multiple-choice'}
                        onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                        label="Question Type"
                      >
                        <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                        <MenuItem value="true-false">True/False</MenuItem>
                        <MenuItem value="constructive">Constructive (Open-Ended)</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label={`Question ${index + 1} Text`}
                      value={formData.questions[index]?.text || ''}
                      onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      error={!!errors[`question${index}`]}
                      helperText={errors[`question${index}`]}
                    />
                    {formData.questions[index]?.type === 'multiple-choice' && (
                      <>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Number of Options</InputLabel>
                          <Select
                            value={formData.questions[index]?.numberOfOptions || 4}
                            onChange={(e) => handleQuestionChange(index, 'numberOfOptions', parseInt(e.target.value))}
                            label="Number of Options"
                          >
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                          </Select>
                        </FormControl>
                        {Array.from({ length: formData.questions[index]?.numberOfOptions || 4 }).map((_, optIndex) => (
                          <Box key={optIndex} sx={{ mb: 1 }}>
                            <TextField
                              fullWidth
                              label={`Option ${optIndex + 1}`}
                              value={formData.questions[index]?.options?.[optIndex] || ''}
                              onChange={(e) => handleQuestionChange(index, optIndex, e.target.value)}
                              variant="outlined"
                              error={!!errors[`options${index}`]}
                              helperText={errors[`options${index}`]}
                            />
                          </Box>
                        ))}
                      </>
                    )}
                    {formData.questions[index]?.type === 'true-false' && (
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Options: True, False
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Enter the number of questions to add question fields.
                </Typography>
              )}
            </Grid>
          </>
        )}
        <Grid item>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Immediate Results
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.immediateResults}
                onChange={(e) => setFormData({ ...formData, immediateResults: e.target.checked })}
              />
            }
            label="Enable Immediate Results"
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Publish Immediately
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
            }
            label="Publish Exam"
          />
        </Grid>
        <Grid item>
          <Grid container spacing={2} direction="column" alignItems="flex-end">
            <Grid item>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ 
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' },
                  py: 1.5,
                  px: 4,
                  width: 200
                }}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={onCancel}
                sx={{ 
                  backgroundColor: '#d32f2f',
                  '&:hover': { backgroundColor: '#b71c1c' },
                  py: 1.5,
                  px: 4,
                  width: 200
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExamForm;