import React, { useState, useEffect } from 'react';
import { 
  Typography, Table, TableBody, TableCell, TableHead, TableRow, 
  Button, TextField, Select, MenuItem, Box, IconButton, 
  Badge, LinearProgress, Modal, Avatar, Chip, Divider, 
  Paper, Grid, Stack, FormControl, InputLabel 
} from '@mui/material';
import { 
  FileDownload, Visibility, Message, Edit, CalendarToday, 
  Save, Refresh, Person, Search, FilterList, Delete 
} from '@mui/icons-material';
import studentsData from './students.json';
import BarChart from './BarChart';

const StudentManagementSection = () => {
  const [students, setStudents] = useState(studentsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [tempAttendance, setTempAttendance] = useState({});

  useEffect(() => {
    setStudents(studentsData);
  }, []);

  const handleTempAttendanceChange = (studentId, field, value) => {
    setTempAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveAttendance = () => {
    const updatedStudents = students.map(s => {
      const tempRecord = tempAttendance[s.id];
      if (tempRecord) {
        const newRecord = { date: attendanceDate, status: tempRecord.status || 'Present', note: tempRecord.note || '' };
        return {
          ...s,
          attendanceRecords: [...(s.attendanceRecords || []), newRecord],
          attendance: calculateAttendance([...(s.attendanceRecords || []), newRecord])
        };
      }
      return s;
    });
    setStudents(updatedStudents);
    setTempAttendance({}); // Clear temporary changes
    alert('Save successful'); // Add confirmation message
    setShowAttendance(false); // Return to the student table view
  };

  const handleMarkAllPresent = () => {
    const updatedTemp = {};
    students.forEach(s => {
      updatedTemp[s.id] = { status: 'Present', note: '' };
    });
    setTempAttendance(updatedTemp);
  };

  const calculateAttendance = (records) => {
    if (!records || records.length === 0) return '0%';
    const presentCount = records.filter(r => r.status === 'Present').length;
    const total = records.length;
    const presentPercent = total ? Math.round((presentCount / total) * 100) : 0;
    return `${presentPercent}%`;
  };

  const exportAttendanceReport = () => {
    const headers = ['Name,Status,Notes'];
    const data = students.map(s => {
      const record = tempAttendance[s.id] || { status: 'Present', note: '' };
      return `${s.name},${record.status},${record.note || '-'}`;
    });
    const csv = [...headers, ...data].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${attendanceDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEditStatus = (id, newStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const exportToCSV = (data, filename) => {
    const headers = ['Name,Email,Status,Attendance,Grade'];
    const csv = [
      ...headers,
      ...data.map(row => `${row.name},${row.email},${row.status},${row.attendance},${row.grade}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'At Risk': return 'warning';
      case 'Withdrawn': return 'error';
      default: return 'default';
    }
  };

  const filteredStudents = students.filter(s => 
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'All' || s.status === statusFilter)
  );

  const renderStudentTable = () => (
    <Table sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: '8px', '&:hover': { backgroundColor: '#f5f5f5' } }}>
      <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
        <TableRow>
          <TableCell>Student Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Progress</TableCell>
          <TableCell>Attendance</TableCell>
          <TableCell>Average</TableCell>
          <TableCell>Tools</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredStudents.map(s => (
          <TableRow key={s.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
            <TableCell>
              <Button color="primary" onClick={() => setSelectedStudent(s)}>{s.name}</Button>
            </TableCell>
            <TableCell>
              <Typography variant="body2">{s.email}</Typography>
            </TableCell>
            <TableCell>
              <Chip label={s.status} color={statusColor(s.status)} size="small" />
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress variant="determinate" value={parseInt(s.attendance)} sx={{ width: '60%' }} />
                <Typography>{s.attendance}</Typography>
              </Box>
            </TableCell>
            <TableCell>
              <Typography>{s.attendance}</Typography>
              {parseInt(s.attendance) < 80 && <span style={{ color: 'orange' }}>⚠</span>}
            </TableCell>
            <TableCell>{s.grade}</TableCell>
            <TableCell>
              <IconButton onClick={() => setSelectedStudent(s)}><Visibility /></IconButton>
              <IconButton><Message /></IconButton>
              <IconButton onClick={() => handleEditStatus(s.id, prompt('New status:', s.status))}><Edit /></IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderAttendanceView = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <CalendarToday sx={{ mr: 1 }} /> Attendance Management
      </Typography>
      <FormControl sx={{ mb: 2, minWidth: 120 }}>
        <InputLabel>Date</InputLabel>
        <Select
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
        >
          {[...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return <MenuItem key={i} value={date.toISOString().split('T')[0]}>{date.toLocaleDateString()}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>
                <Select
                  value={tempAttendance[s.id]?.status || 'Present'}
                  onChange={(e) => handleTempAttendanceChange(s.id, 'status', e.target.value)}
                >
                  <MenuItem value="Present">Present</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                  <MenuItem value="Late">Late</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={tempAttendance[s.id]?.note || ''}
                  onChange={(e) => handleTempAttendanceChange(s.id, 'note', e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<Save />} 
          onClick={handleSaveAttendance}
        >
          Save Changes
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={handleMarkAllPresent}
        >
          Mark All as Present
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<FileDownload />} 
          onClick={exportAttendanceReport}
        >
          Export Report
        </Button>
      </Stack>
    </Box>
  );

  const renderStudentProfile = () => (
    <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 60, height: 60 }}>{selectedStudent?.name[0]}</Avatar>
            <Box>
              <Typography variant="h4">{selectedStudent?.name.toUpperCase()}</Typography>
              <Chip label={selectedStudent?.status} color={statusColor(selectedStudent?.status)} />
            </Box>
          </Box>
          <Divider />
          <Typography variant="h6">Academic Performance</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Evaluation</TableCell>
                <TableCell>Mark</TableCell>
                <TableCell>Out Of</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Quiz 1</TableCell>
                <TableCell>8</TableCell>
                <TableCell>10</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography>Overall GPA: <Chip label={selectedStudent?.grade} color="success" /></Typography>
          <Divider />
          <Typography variant="h6">Attendance</Typography>
          {selectedStudent?.attendanceRecords && (
            <BarChart
              data={{
                Present: 80,
                Absent: 15,
                Late: 5
              }}
            />
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>4/5/2025</TableCell>
                <TableCell>Absent</TableCell>
                <TableCell>Medical Excuse</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Divider />
          <Typography variant="h6">Interaction</Typography>
          <Typography>Logins: 25</Typography>
          <Typography>Posts: 4 comments, 2 questions</Typography>
          <Divider />
          <Typography variant="h6">Instructor Notes</Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography>Good progress - 4/5/2025</Typography>
              <IconButton><Edit /></IconButton>
              <IconButton><Delete /></IconButton>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Person sx={{ mr: 1 }} /> Student Management
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="At Risk">At Risk</MenuItem>
            <MenuItem value="Withdrawn">Withdrawn</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<CalendarToday />}
          onClick={() => setShowAttendance(true)}
        >
          Manage Attendance
        </Button>
        <Button
          variant="contained"
          startIcon={<FileDownload />}
          onClick={() => exportToCSV(students, 'students.csv')}
        >
          Export Data
        </Button>
      </Stack>
      {showAttendance ? renderAttendanceView() : renderStudentTable()}
      {renderStudentProfile()}
    </Box>
  );
};

export default StudentManagementSection;