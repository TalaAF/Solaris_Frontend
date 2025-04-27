import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import CourseList from '../courses/CourseList';
import CourseService from '../services/CourseService';
import './Courses.css';

function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch departments and course data
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // In a real app, you would fetch departments from an API
        // const departmentsResponse = await axios.get('/api/departments');
        // setDepartments(departmentsResponse.data);
        
        // For now, using mockup departments
        setDepartments([
          { id: 1, name: 'Anatomy' },
          { id: 2, name: 'Biochemistry' },
          { id: 3, name: 'Pathology' },
          { id: 4, name: 'Medical Humanities' },
          { id: 5, name: 'Clinical Sciences' }
        ]);
        
        // Set semesters (these would typically be derived from course data)
        setSemesters([
          'Fall 2024',
          'Spring 2025',
          'Fall 2025',
          'Spring 2026'
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching filter data:', err);
        setError('Failed to load filter options. Please try again later.');
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle department filter change
  const handleDepartmentChange = (event) => {
    setDepartmentFilter(event.target.value);
  };

  // Handle semester filter change
  const handleSemesterChange = (event) => {
    setSemesterFilter(event.target.value);
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <Header title="Courses" />
        <div className="content-wrapper">
          <Container maxWidth="lg">
            <Box sx={{ paddingTop: 3, paddingBottom: 5 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                My Courses
              </Typography>
              
              {/* Filters section */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <TextField
                  label="Search courses"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ minWidth: '250px', flex: 1 }}
                />
                
                <FormControl size="small" sx={{ minWidth: '200px' }}>
                  <InputLabel id="department-filter-label">Department</InputLabel>
                  <Select
                    labelId="department-filter-label"
                    id="department-filter"
                    value={departmentFilter}
                    label="Department"
                    onChange={handleDepartmentChange}
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    {departments.map(dept => (
                      <MenuItem key={dept.id} value={dept.name}>{dept.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: '200px' }}>
                  <InputLabel id="semester-filter-label">Semester</InputLabel>
                  <Select
                    labelId="semester-filter-label"
                    id="semester-filter"
                    value={semesterFilter}
                    label="Semester"
                    onChange={handleSemesterChange}
                  >
                    <MenuItem value="all">All Semesters</MenuItem>
                    {semesters.map(semester => (
                      <MenuItem key={semester} value={semester}>{semester}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {loading && <Typography>Loading courses...</Typography>}
              {error && <Typography color="error">{error}</Typography>}
              {!loading && !error && (
                <CourseList 
                  searchTerm={searchTerm}
                  departmentFilter={departmentFilter}
                  semesterFilter={semesterFilter}
                />
              )}
            </Box>
          </Container>
        </div>
      </main>
    </div>
  );
}

export default Courses;