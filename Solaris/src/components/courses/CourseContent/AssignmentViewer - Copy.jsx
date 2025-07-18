import React, { useState } from 'react';
import { Button, TextField, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function AssignmentViewer({ title, assignment }) {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(assignment.submissionStatus === 'submitted');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    // In a real app, you would upload the file to the server here
    setSubmitted(true);
    alert('Assignment submitted successfully! (This is just a demo)');
  };

  // Calculate if the assignment is past due
  const isPastDue = new Date(assignment.dueDate) < new Date();

  return (
    <div className="assignment-viewer">
      <Paper elevation={1} className="assignment-details" sx={{ p: 3, mb: 3 }}>
        <h3>{assignment.title || title}</h3>
        
        <div className="assignment-info">
          <p><strong>Due Date:</strong> {assignment.dueDate}</p>
          <p><strong>Status:</strong> {
            isPastDue && assignment.submissionStatus !== 'submitted' 
              ? 'Past Due' 
              : assignment.submissionStatus
          }</p>
        </div>
        
        <div className="assignment-description">
          <h4>Instructions</h4>
          <p>{assignment.description}</p>
        </div>
      </Paper>
      
      {!submitted ? (
        <Paper elevation={1} className="assignment-submission" sx={{ p: 3 }}>
          <h4>Submit Your Assignment</h4>
          
          <div className="file-upload">
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {file && <p>Selected file: {file.name}</p>}
          </div>
          
          <TextField
            label="Comments"
            multiline
            rows={4}
            value={comment}
            onChange={handleCommentChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!file}
            sx={{ mt: 2 }}
          >
            Submit Assignment
          </Button>
        </Paper>
      ) : (
        <Paper elevation={1} sx={{ p: 3 }}>
          <div className="submission-success">
            <h4>Assignment Submitted</h4>
            <p>Thank you for your submission.</p>
            <p>You can view your submission status in the Assignments tab.</p>
          </div>
        </Paper>
      )}
    </div>
  );
}

export default AssignmentViewer;