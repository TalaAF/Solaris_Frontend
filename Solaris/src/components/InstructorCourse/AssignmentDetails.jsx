import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';

const AssignmentDetails = ({ assignment, onBack }) => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold', 
          color: '#1976d2',
          textAlign: 'center' 
        }}
      >
        {assignment.title}
      </Typography>
      <Card sx={{ maxWidth: 800, mx: 'auto', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <CardContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Description:</strong> {assignment.description || 'No description provided'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Due Date:</strong> {assignment.dueDate}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Total Marks:</strong> {assignment.grade || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Attachments:</strong>
            {assignment.supportingFiles?.length > 0 ? (
              <List>
                {assignment.supportingFiles.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={file.name} />
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => alert(`Downloading ${file.name}`)} // Replace with actual download logic
                    >
                      Download
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              ' No attachments'
            )}
          </Typography>
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default AssignmentDetails;