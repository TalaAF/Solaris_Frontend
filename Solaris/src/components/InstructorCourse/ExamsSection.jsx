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
  Alert, 
  TextField,
  Chip 
} from '@mui/material';
import { Visibility, Edit, Delete, BarChart, RocketLaunch } from '@mui/icons-material';
import ExamForm from './ExamForm';
import ExamDetails from './ExamDetails';
import ExamResults from './ExamResults';
import examsData from './exams.json';

const ExamsSection = () => {
  const [exams, setExams] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const [examToPublish, setExamToPublish] = useState(null);
  const [publishAction, setPublishAction] = useState('publish');
  const [view, setView] = useState('list');
  const [selectedExam, setSelectedExam] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        // Replace with actual backend endpoint to fetch exams
        const response = await fetch('/api/exams');
        if (!response.ok) throw new Error('API fetch failed');
        const data = await response.json();
        setExams(data.map(exam => ({
          ...exam,
          id: exam.id || `exam-${Date.now()}-${Math.random()}`,
          totalMarks: exam.totalMarks || 'N/A',
          studentsCompleted: exam.studentsCompleted || 0,
          published: exam.published || false,
          questions: exam.questions || [],
          immediateResults: exam.immediateResults || false,
        })));
      } catch (error) {
        console.error('Error fetching exams:', error);
        setExams(examsData.map(exam => ({
          ...exam,
          id: `exam-${Date.now()}-${Math.random()}`,
          totalMarks: exam.totalMarks || 'N/A',
          studentsCompleted: exam.studentsCompleted || 0,
          published: exam.published || false,
          questions: exam.questions || [],
          immediateResults: exam.immediateResults || false,
        })));
      }
    };
    fetchExams();
  }, []);

  const handleAddExam = async (newExam) => {
    try {
      // Replace with actual backend endpoint to add an exam
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExam),
      });
      const savedExam = await response.json();
      setExams([...exams, {
        ...savedExam,
        id: savedExam.id || `exam-${Date.now()}`,
      }]);
      setView('list');
      setSnackbar({ open: true, message: 'Exam added successfully' });
    } catch (error) {
      console.error('Error adding exam:', error);
      setExams([...exams, {
        ...newExam,
        id: `exam-${Date.now()}`,
        studentsCompleted: newExam.studentsCompleted || 0,
        published: newExam.published || false,
      }]);
      setView('list');
      setSnackbar({ open: true, message: 'Exam added successfully' });
    }
  };

  const handleEditExam = async (id, updatedFields) => {
    try {
      // Replace with actual backend endpoint to update an exam
      const response = await fetch(`/api/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (response.ok) {
        setExams(exams.map(e => 
          e.id === id ? { ...e, ...updatedFields } : e
        ));
        setView('list');
        setSelectedExam(null);
        setSnackbar({ open: true, message: 'Exam updated successfully' });
      }
    } catch (error) {
      console.error('Error editing exam:', error);
      setExams(exams.map(e => 
        e.id === id ? { ...e, ...updatedFields } : e
      ));
      setView('list');
      setSelectedExam(null);
      setSnackbar({ open: true, message: 'Exam updated successfully' });
    }
  };

  const handleDeleteExam = async () => {
    try {
      // Replace with actual backend endpoint to delete an exam
      await fetch(`/api/exams/${examToDelete}`, {
        method: 'DELETE',
      });
      setExams(exams.filter(e => e.id !== examToDelete));
      setOpenDeleteDialog(false);
      setExamToDelete(null);
      setSnackbar({ open: true, message: 'Exam deleted successfully' });
    } catch (error) {
      console.error('Error deleting exam:', error);
      setExams(exams.filter(e => e.id !== examToDelete));
      setOpenDeleteDialog(false);
      setExamToDelete(null);
      setSnackbar({ open: true, message: 'Exam deleted successfully' });
    }
  };

  const handleTogglePublish = async () => {
    const id = examToPublish;
    const updatedFields = { published: publishAction === 'publish' };
    try {
      // Replace with actual backend endpoint to update publish status
      const response = await fetch(`/api/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (response.ok) {
        setExams(exams.map(e => 
          e.id === id ? { ...e, ...updatedFields } : e
        ));
        setOpenPublishDialog(false);
        setExamToPublish(null);
        setSnackbar({ 
          open: true, 
          message: publishAction === 'publish' 
            ? 'Exam published successfully' 
            : 'Exam is now hidden from students' 
        });
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      setExams(exams.map(e => 
        e.id === id ? { ...e, ...updatedFields } : e
      ));
      setOpenPublishDialog(false);
      setExamToPublish(null);
      setSnackbar({ 
        open: true, 
        message: publishAction === 'publish' 
          ? 'Exam published successfully' 
          : 'Exam is now hidden from students' 
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  const filteredExams = exams.filter(exam =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Exams
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
              Add New Exam
            </Button>
          </Box>
          <TextField
            fullWidth
            label="Search by Exam Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
          />
          {filteredExams.length === 0 ? (
            <Typography 
              sx={{ 
                textAlign: 'center', 
                color: '#666', 
                fontSize: '1.2rem',
                mt: 4 
              }}
            >
              There are currently no exams. Click the 'Add New Exam' button to add a new exam.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredExams.map((exam) => (
                <Grid item xs={12} sm={6} md={4} key={exam.id}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                          {exam.name}
                        </Typography>
                        <Chip 
                          label={exam.published ? 'Published' : 'Unpublished'} 
                          color={exam.published ? 'success' : 'error'} 
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Date & Time:</strong> {new Date(exam.dateTime).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Total Marks:</strong> {exam.totalMarks}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Students Completed:</strong> {exam.studentsCompleted}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <IconButton 
                        onClick={() => {
                          setSelectedExam(exam);
                          setView('details');
                        }}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setSelectedExam(exam);
                          setView('form');
                        }}
                        title="Edit Exam"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setExamToDelete(exam.id);
                          setOpenDeleteDialog(true);
                        }}
                        title="Delete Exam"
                      >
                        <Delete />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setSelectedExam(exam);
                          setView('results');
                        }}
                        title="View Results"
                      >
                        <BarChart />
                      </IconButton>
                      <Button 
                        variant="contained"
                        onClick={() => {
                          setExamToPublish(exam.id);
                          setPublishAction(exam.published ? 'unpublish' : 'publish');
                          setOpenPublishDialog(true);
                        }}
                        sx={{
                          backgroundColor: exam.published ? '#d32f2f' : '#4CAF50',
                          '&:hover': { 
                            backgroundColor: exam.published ? '#b71c1c' : '#45a049' 
                          },
                          py: 0.5,
                          px: 2,
                          fontSize: '0.8rem'
                        }}
                      >
                        {exam.published ? 'Unpublish' : 'Publish'}
                      </Button>
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
                Are you sure you want to delete this exam? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
              <Button 
                onClick={handleDeleteExam} 
                color="error" 
                variant="contained"
              >
                Confirm Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openPublishDialog} onClose={() => setOpenPublishDialog(false)}>
            <DialogTitle>{publishAction === 'publish' ? 'Publish Exam' : 'Unpublish Exam'}</DialogTitle>
            <DialogContent>
              <Typography>
                {publishAction === 'publish' 
                  ? 'Do you want to publish this exam? Students will be able to view and solve it.'
                  : 'Do you want to unpublish this exam? Students will not be able to access it.'
                }
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPublishDialog(false)}>Cancel</Button>
              <Button 
                onClick={handleTogglePublish} 
                variant="contained"
                sx={{
                  backgroundColor: publishAction === 'publish' ? '#4CAF50' : '#d32f2f',
                  '&:hover': { 
                    backgroundColor: publishAction === 'publish' ? '#45a049' : '#b71c1c' 
                  }
                }}
              >
                {publishAction === 'publish' ? 'Confirm Publish' : 'Confirm Unpublish'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {view === 'form' && (
        <ExamForm
          exam={selectedExam}
          onSave={(data) => selectedExam 
            ? handleEditExam(selectedExam.id, data) 
            : handleAddExam(data)}
          onCancel={() => {
            setView('list');
            setSelectedExam(null);
          }}
        />
      )}
      {view === 'details' && selectedExam && (
        <ExamDetails
          exam={selectedExam}
          onBack={() => {
            setView('list');
            setSelectedExam(null);
          }}
        />
      )}
      {view === 'results' && selectedExam && (
        <ExamResults
          exam={selectedExam}
          onBack={() => {
            setView('list');
            setSelectedExam(null);
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

export default ExamsSection;