import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  TextField, 
  Button, 
  IconButton, 
  Chip 
} from '@mui/material';
import { Edit } from '@mui/icons-material';

// Sample submission data (replace with actual backend data)
const sampleSubmissions = [
  {
    id: 'sub1',
    studentName: 'John Doe',
    submissionDate: '2025-03-14',
    file: { name: 'assignment1.pdf' },
    grade: 85,
    status: 'Submitted',
  },
  {
    id: 'sub2',
    studentName: 'Jane Smith',
    submissionDate: '',
    file: null,
    grade: null,
    status: 'Not Submitted',
  },
];

const SubmissionsView = ({ assignment, onBack }) => {
  const [submissions, setSubmissions] = useState(sampleSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGrade, setEditingGrade] = useState(null);
  const [newGrade, setNewGrade] = useState('');

  const filteredSubmissions = submissions.filter(sub =>
    sub.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditGrade = (submissionId, currentGrade) => {
    setEditingGrade(submissionId);
    setNewGrade(currentGrade || '');
  };

  const handleSaveGrade = (submissionId) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId ? { ...sub, grade: parseInt(newGrade) } : sub
    ));
    setEditingGrade(null);
    setNewGrade('');
  };

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
        Submissions for {assignment.title}
      </Typography>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <TextField
          fullWidth
          label="Search by Student Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          sx={{ mb: 3 }}
        />
        <Table sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Submission Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>File</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.studentName}</TableCell>
                <TableCell>{submission.submissionDate || 'N/A'}</TableCell>
                <TableCell>
                  {submission.file ? (
                    <Button 
                      variant="text" 
                      onClick={() => alert(`Downloading ${submission.file.name}`)}
                    >
                      {submission.file.name}
                    </Button>
                  ) : (
                    'No file'
                  )}
                </TableCell>
                <TableCell>
                  {editingGrade === submission.id ? (
                    <TextField
                      type="number"
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  ) : (
                    submission.grade || 'N/A'
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={submission.status} 
                    color={submission.status === 'Submitted' ? 'success' : 'error'} 
                  />
                </TableCell>
                <TableCell>
                  {editingGrade === submission.id ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSaveGrade(submission.id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <IconButton
                      onClick={() => handleEditGrade(submission.id, submission.grade)}
                    >
                      <Edit />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ textAlign: 'right', mt: 3 }}>
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
    </Box>
  );
};

export default SubmissionsView;