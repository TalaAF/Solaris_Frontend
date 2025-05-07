import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Box, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Snackbar, 
  Alert 
} from '@mui/material';
import { Visibility, Edit, Delete, Group } from '@mui/icons-material';
import AssignmentForm from './AssignmentForm';
import AssignmentDetails from './AssignmentDetails';
import SubmissionsView from './SubmissionsView';
import assignmentsData from './assignments.json';

const AssignmentsSection = () => {
  const [assignments, setAssignments] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [view, setView] = useState('list'); // list, form, details, submissions
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Fetch assignments with JSON fallback
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/assignments');
        if (!response.ok) throw new Error('API fetch failed');
        const data = await response.json();
        setAssignments(data.map(assignment => ({
          ...assignment,
          id: assignment.id || `assn-${Date.now()}-${Math.random()}`,
          grade: assignment.grade || 'N/A',
          submissions: assignment.submissions || 0,
          status: assignment.status || 'Open',
        })));
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setAssignments(assignmentsData.map(assignment => ({
          ...assignment,
          id: `assn-${Date.now()}-${Math.random()}`,
          grade: assignment.grade || 'N/A',
          submissions: assignment.submissions || 0,
          status: assignment.status || 'Open',
        })));
      }
    };
    fetchAssignments();
  }, []);

  const handleAddAssignment = async (newAssignment) => {
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment),
      });
      const savedAssignment = await response.json();
      setAssignments([...assignments, {
        ...savedAssignment,
        id: savedAssignment.id || `assn-${Date.now()}`,
      }]);
      setView('list');
      setSnackbar({ open: true, message: 'Assignment added successfully' });
    } catch (error) {
      console.error('Error adding assignment:', error);
      setAssignments([...assignments, {
        ...newAssignment,
        id: `assn-${Date.now()}`,
        submissions: newAssignment.submissions || 0,
        status: newAssignment.status || 'Open',
      }]);
      setView('list');
      setSnackbar({ open: true, message: 'Assignment added successfully' });
    }
  };

  const handleEditAssignment = async (id, updatedFields) => {
    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (response.ok) {
        setAssignments(assignments.map(a => 
          a.id === id ? { ...a, ...updatedFields } : a
        ));
        setView('list');
        setSelectedAssignment(null);
        setSnackbar({ open: true, message: 'Assignment updated successfully' });
      }
    } catch (error) {
      console.error('Error editing assignment:', error);
      setAssignments(assignments.map(a => 
        a.id === id ? { ...a, ...updatedFields } : a
      ));
      setView('list');
      setSelectedAssignment(null);
      setSnackbar({ open: true, message: 'Assignment updated successfully' });
    }
  };

  const handleDeleteAssignment = async () => {
    try {
      await fetch(`/api/assignments/${assignmentToDelete}`, {
        method: 'DELETE',
      });
      setAssignments(assignments.filter(a => a.id !== assignmentToDelete));
      setOpenDeleteDialog(false);
      setAssignmentToDelete(null);
      setSnackbar({ open: true, message: 'Assignment deleted successfully' });
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setAssignments(assignments.filter(a => a.id !== assignmentToDelete));
      setOpenDeleteDialog(false);
      setAssignmentToDelete(null);
      setSnackbar({ open: true, message: 'Assignment deleted successfully' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  return (
    <Box sx={{ p: 4 }}>
      {view === 'list' && (
        <>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 3, 
              fontWeight: 'bold', 
              color: '#1976d2',
              textAlign: 'center' 
            }}
          >
            Assignments
          </Typography>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Button
              variant="contained"
              onClick={() => setView('form')}
              sx={{
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#45a049' },
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
              }}
            >
              Add New Assignment
            </Button>
          </Box>
          {assignments.length === 0 ? (
            <Typography 
              sx={{ 
                textAlign: 'center', 
                color: '#666', 
                fontSize: '1.2rem',
                mt: 4 
              }}
            >
              There are no assignments currently. Click the button above to add a new assignment.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {assignments.map((assignment) => (
                <Grid item xs={12} sm={6} md={4} key={assignment.id}>
                  <Card 
                    sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.02)' }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {assignment.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Due Date:</strong> {assignment.dueDate}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Total Marks:</strong> {assignment.grade || 'N/A'}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <IconButton 
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setView('details');
                        }}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setView('form');
                        }}
                        title="Edit Assignment"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setAssignmentToDelete(assignment.id);
                          setOpenDeleteDialog(true);
                        }}
                        title="Delete Assignment"
                      >
                        <Delete />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setView('submissions');
                        }}
                        title="View Submissions"
                      >
                        <Group />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this assignment? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
              <Button 
                onClick={handleDeleteAssignment} 
                color="error" 
                variant="contained"
              >
                Confirm Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {view === 'form' && (
        <AssignmentForm
          assignment={selectedAssignment}
          onSave={(data) => selectedAssignment 
            ? handleEditAssignment(selectedAssignment.id, data) 
            : handleAddAssignment(data)}
          onCancel={() => {
            setView('list');
            setSelectedAssignment(null);
          }}
          buttonLabel={selectedAssignment ? 'Update' : 'Save'}
        />
      )}
      {view === 'details' && selectedAssignment && (
        <AssignmentDetails
          assignment={selectedAssignment}
          onBack={() => {
            setView('list');
            setSelectedAssignment(null);
          }}
        />
      )}
      {view === 'submissions' && selectedAssignment && (
        <SubmissionsView
          assignment={selectedAssignment}
          onBack={() => {
            setView('list');
            setSelectedAssignment(null);
          }}
        />
      )}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignmentsSection;