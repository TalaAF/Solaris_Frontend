<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import CourseList from "../courses/CourseList";
import "./Courses.css";

function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
=======
import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import CourseList from '../courses/CourseList';
import './Courses.css';

function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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
<<<<<<< HEAD

        // For now, using mockup departments
        setDepartments([
          { id: 1, name: "Anatomy" },
          { id: 2, name: "Biochemistry" },
          { id: 3, name: "Pathology" },
          { id: 4, name: "Medical Humanities" },
          { id: 5, name: "Clinical Sciences" },
        ]);

        // Set semesters (these would typically be derived from course data)
        setSemesters(["Fall 2024", "Spring 2025", "Fall 2025", "Spring 2026"]);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching filter data:", err);
        setError("Failed to load filter options. Please try again later.");
=======
        
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
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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
<<<<<<< HEAD

              {/* Filters section */}
              <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
=======
              
              {/* Filters section */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                <TextField
                  label="Search courses"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
<<<<<<< HEAD
                  sx={{ minWidth: "250px", flex: 1 }}
                />

                <FormControl size="small" sx={{ minWidth: "200px" }}>
                  <InputLabel id="department-filter-label">
                    Department
                  </InputLabel>
=======
                  sx={{ minWidth: '250px', flex: 1 }}
                />
                
                <FormControl size="small" sx={{ minWidth: '200px' }}>
                  <InputLabel id="department-filter-label">Department</InputLabel>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                  <Select
                    labelId="department-filter-label"
                    id="department-filter"
                    value={departmentFilter}
                    label="Department"
                    onChange={handleDepartmentChange}
                  >
                    <MenuItem value="all">All Departments</MenuItem>
<<<<<<< HEAD
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: "200px" }}>
=======
                    {departments.map(dept => (
                      <MenuItem key={dept.id} value={dept.name}>{dept.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: '200px' }}>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                  <InputLabel id="semester-filter-label">Semester</InputLabel>
                  <Select
                    labelId="semester-filter-label"
                    id="semester-filter"
                    value={semesterFilter}
                    label="Semester"
                    onChange={handleSemesterChange}
                  >
                    <MenuItem value="all">All Semesters</MenuItem>
<<<<<<< HEAD
                    {semesters.map((semester) => (
                      <MenuItem key={semester} value={semester}>
                        {semester}
                      </MenuItem>
=======
                    {semesters.map(semester => (
                      <MenuItem key={semester} value={semester}>{semester}</MenuItem>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                    ))}
                  </Select>
                </FormControl>
              </Box>
<<<<<<< HEAD

              {loading && <Typography>Loading courses...</Typography>}
              {error && <Typography color="error">{error}</Typography>}
              {!loading && !error && (
                <CourseList
=======
              
              {loading && <Typography>Loading courses...</Typography>}
              {error && <Typography color="error">{error}</Typography>}
              {!loading && !error && (
                <CourseList 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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

<<<<<<< HEAD
export default Courses;
=======
export default Courses;
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
