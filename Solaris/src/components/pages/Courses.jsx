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
  CircularProgress
} from "@mui/material";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import CourseList from "../courses/CourseList";
import CourseService from "../../services/CourseService";
import "./Courses.css";

function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersChanged, setFiltersChanged] = useState(false);

  // Fetch departments and semesters from backend
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        console.log("Fetching filter options for Courses page...");
        
        // Fetch both departments and semesters in parallel
        const [deptsResponse, semestersResponse] = await Promise.all([
          CourseService.getDepartments(),
          CourseService.getSemesters()
        ]);
        
        console.log("Department response:", deptsResponse);
        console.log("Semesters response:", semestersResponse);
        
        // Set departments - handle different response formats
        const departmentData = deptsResponse?.data?.content || deptsResponse?.data || [];
        setDepartments(Array.isArray(departmentData) ? departmentData : []);
        
        // Set semesters
        const semesterData = semestersResponse?.data || [];
        setSemesters(Array.isArray(semesterData) ? semesterData : []);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching filter data:", err);
        setError("Failed to load filter options. Please try again later.");
        
        // Fallback to default values
        setDepartments([
          { id: 1, name: "Anatomy" },
          { id: 2, name: "Biochemistry" },
          { id: 3, name: "Pathology" },
          { id: 4, name: "Medical Humanities" },
          { id: 5, name: "Clinical Sciences" },
        ]);
        
        setSemesters([
          "Fall 2024",
          "Spring 2025",
          "Fall 2025",
          "Spring 2026"
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  // Handle search input change with debounce
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setFiltersChanged(true);
  };

  // Handle department filter change
  const handleDepartmentChange = (event) => {
    setDepartmentFilter(event.target.value);
    setFiltersChanged(true);
  };

  // Handle semester filter change
  const handleSemesterChange = (event) => {
    setSemesterFilter(event.target.value);
    setFiltersChanged(true);
  };

  // Apply filters - only used if you want a separate apply button
  const handleApplyFilters = () => {
    setFiltersChanged(false);
    // The effect of this is that it forces a re-render of CourseList
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
              <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", alignItems: "center" }}>
                <TextField
                  label="Search courses"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ minWidth: "250px", flex: 1 }}
                />

                <FormControl size="small" sx={{ minWidth: "200px" }}>
                  <InputLabel id="department-filter-label">
                    Department
                  </InputLabel>
                  <Select
                    labelId="department-filter-label"
                    id="department-filter"
                    value={departmentFilter}
                    label="Department"
                    onChange={handleDepartmentChange}
                    disabled={loading}
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: "200px" }}>
                  <InputLabel id="semester-filter-label">Semester</InputLabel>
                  <Select
                    labelId="semester-filter-label"
                    id="semester-filter"
                    value={semesterFilter}
                    label="Semester"
                    onChange={handleSemesterChange}
                    disabled={loading}
                  >
                    <MenuItem value="all">All Semesters</MenuItem>
                    {semesters.map((semester, index) => (
                      <MenuItem key={index} value={semester}>
                        {semester}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {loading && (
                  <CircularProgress size={24} sx={{ ml: 2 }} />
                )}
              </Box>

              {error && <Typography color="error">{error}</Typography>}
              
              {/* Pass filters to CourseList - use key to force re-render when filters change */}
              <CourseList
                key={`${searchTerm}-${departmentFilter}-${semesterFilter}`}
                searchTerm={searchTerm}
                departmentFilter={departmentFilter}
                semesterFilter={semesterFilter}
              />
            </Box>
          </Container>
        </div>
      </main>
    </div>
  );
}

export default Courses;