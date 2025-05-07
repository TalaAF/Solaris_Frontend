import React, { useState } from 'react';
import { Card, CardContent, Grid, Typography, TextField, Button } from '@mui/material';

const AttendanceForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    date: '',
    status: '',
    note: '',
  });

  const handleSubmit = () => {
    if (formData.studentName && formData.date) {
      onSave(formData);
      setFormData({ studentName: '', date: '', status: '', note: '' });
    }
  };

  return (
    <Card sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#1976d2', mb: 2 }}>Add Attendance</Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Student Name"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              variant="outlined"
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={3}>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              variant="outlined"
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ backgroundColor: '#FFC107', '&:hover': { backgroundColor: '#FFB300' }, color: '#fff' }}
            >
              Add Attendance
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AttendanceForm;