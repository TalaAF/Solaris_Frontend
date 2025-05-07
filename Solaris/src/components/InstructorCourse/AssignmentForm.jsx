import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Input 
} from '@mui/material';

const AssignmentForm = ({ assignment = null, onSave, onCancel, buttonLabel }) => {
  const [formData, setFormData] = useState(
    assignment || {
      title: '',
      description: '',
      dueDate: '',
      grade: '',
      supportingFiles: [],
      status: 'Open',
      submissions: 0,
    }
  );
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Please enter a title';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
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
        {assignment ? 'Edit Assignment' : 'Add New Assignment'}
      </Typography>
      <Grid container spacing={4} direction="column">
        <Grid item>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Assignment Title
          </Typography>
          <TextField
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Description
          </Typography>
          <TextField
            fullWidth
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            variant="outlined"
            multiline
            rows={6}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Due Date
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
            value={formData.grade || ''}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Upload File
          </Typography>
          <Input
            type="file"
            onChange={(e) => setFormData({ ...formData, supportingFiles: Array.from(e.target.files) })}
            inputProps={{ multiple: true }}
          />
          {formData.supportingFiles?.length > 0 && (
            <Button
              color="secondary"
              onClick={() => setFormData({ ...formData, supportingFiles: [] })}
              sx={{ mt: 1 }}
            >
              Clear Files
            </Button>
          )}
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

export default AssignmentForm;