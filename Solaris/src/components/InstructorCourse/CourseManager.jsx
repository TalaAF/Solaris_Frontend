import React, { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Button } from '@mui/material';
import { MenuBook, Assignment, Quiz, People, ArrowBack, LibraryAdd } from '@mui/icons-material';
import CourseOverviewSection from './CourseOverviewSection';
import AssignmentsSection from './AssignmentsSection';
import ExamsSection from './ExamsSection';
import StudentManagementSection from './StudentManagementSection';
import ContentManagementSection from './ContentManagementSection';

const CourseManager = ({ onBack }) => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', padding: '20px', direction: 'ltr' }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Button
            onClick={onBack}
            className="back-button"
            sx={{
              backgroundColor: '#e6b400',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: 500,
              '&:hover': { backgroundColor: '#c49000' },
              minWidth: 'auto',
            }}
          >
            <ArrowBack sx={{ fontSize: '1.5rem' }} />
          </Button>
        </Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <TabList onChange={handleChange} aria-label="course management tabs">
              <Tab label="Course Overview" value="1" icon={<MenuBook />} sx={{ color: '#1976d2', '&.Mui-selected': { color: '#1976d2' } }} />
              <Tab label="Content Management" value="5" icon={<LibraryAdd />} sx={{ color: '#1976d2', '&.Mui-selected': { color: '#1976d2' } }} />
              <Tab label="Assignments" value="2" icon={<Assignment />} sx={{ color: '#1976d2', '&.Mui-selected': { color: '#1976d2' } }} />
              <Tab label="Exams" value="3" icon={<Quiz />} sx={{ color: '#1976d2', '&.Mui-selected': { color: '#1976d2' } }} />
              <Tab label="Student Management" value="4" icon={<People />} sx={{ color: '#1976d2', '&.Mui-selected': { color: '#1976d2' } }} />
            </TabList>
          </Box>
          <TabPanel value="1">
            <CourseOverviewSection />
          </TabPanel>
          <TabPanel value="2">
            <AssignmentsSection />
          </TabPanel>
          <TabPanel value="3">
            <ExamsSection />
          </TabPanel>
          <TabPanel value="4">
            <StudentManagementSection />
          </TabPanel>
          <TabPanel value="5">
            <ContentManagementSection />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default CourseManager;