import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography, Button } from '@mui/material';
import { FaBook, FaUsers, FaCalendarAlt, FaFileAlt, FaTasks, FaCheckCircle } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import overviewData from './overview.json';

const CourseOverviewSection = () => {
  const [overview, setOverview] = useState(overviewData);

  useEffect(() => {
    setOverview(overviewData);
  }, []);

  const handleSaveOverview = () => {
    console.log('Updated Overview:', overview);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Course Banner */}
      <div
        style={{
          height: '180px',
          background: 'linear-gradient(135deg, #1976d2, #4fc3f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          marginBottom: '16px',
        }}
      >
        <Typography variant="h4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
          {overview.courseName}
        </Typography>
      </div>

      {/* Course Info Card */}
      <Card
        sx={{
          mb: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ padding: '16px' }}>
          <Typography variant="h6" sx={{ color: '#1976d2', mb: 2, fontSize: '1.5rem' }}>
            Course Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                <FaBook style={{ marginRight: '8px' }} /> <strong>Code:</strong> {overview.courseCode}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                <FaUsers style={{ marginRight: '8px' }} /> <strong>Students:</strong> {overview.studentsEnrolled}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                <FaCalendarAlt style={{ marginRight: '8px' }} /> <strong>Start:</strong> {overview.startDate}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                <FaCalendarAlt style={{ marginRight: '8px' }} /> <strong>End:</strong> {overview.endDate}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ color: '#1976d2' }}>{overview.description}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        {[
          { icon: <FaBook />, title: 'Lectures', value: overview.lecturesCount },
          { icon: <FaFileAlt />, title: 'Files', value: overview.filesCount },
          { icon: <FaTasks />, title: 'Assignments', value: overview.assignmentsCount },
          { icon: <FaTasks />, title: 'Exams', value: overview.numExams || 0 },
          {
            icon: <FaCheckCircle />,
            title: 'Completion',
            value: `${Math.round(overview.completionRate * 100)}%`,
          },
          {
            icon: <FaCheckCircle />,
            title: 'Status',
            value: overview.status,
            color: overview.status === 'Active' ? 'green' : 'red',
          },
        ].map((stat, idx) => (
          <Card
            key={idx}
            sx={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              backgroundColor: 'white',
              textAlign: 'center',
              padding: '12px',
            }}
          >
            <CardContent>
              <div style={{ fontSize: '1.5rem', color: '#1976d2', marginBottom: '8px' }}>{stat.icon}</div>
              <Typography sx={{ color: stat.color || '#1976d2', fontWeight: 'bold' }}>{stat.value}</Typography>
              <Typography sx={{ color: '#1976d2', fontSize: '0.9rem' }}>{stat.title}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Visualization */}
      <Card
        sx={{
          mb: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ padding: '16px' }}>
          <Typography variant="h6" sx={{ color: '#1976d2', mb: 2, fontSize: '1.5rem' }}>
            Course Progress
          </Typography>
          <div style={{ width: '120px', margin: '0 auto' }}>
            <CircularProgressbar
              value={overview.completionRate * 100}
              text={`${Math.round(overview.completionRate * 100)}%`}
              styles={buildStyles({
                pathColor: '#1976d2',
                textColor: '#1976d2',
                trailColor: '#d6d6d6',
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card
        sx={{
          mb: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ padding: '16px', maxHeight: '200px', overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ color: '#1976d2', mb: 2, fontSize: '1.5rem' }}>
            Recent Activity
          </Typography>
          {overview.recentActivity.map((activity, idx) => (
            <Typography
              key={idx}
              sx={{ color: '#1976d2', mb: 1, display: 'flex', alignItems: 'center' }}
            >
              <FaCheckCircle style={{ marginRight: '8px', color: '#1976d2' }} /> {activity}
            </Typography>
          ))}
        </CardContent>
      </Card>

         </div>
  );
};

export default CourseOverviewSection;