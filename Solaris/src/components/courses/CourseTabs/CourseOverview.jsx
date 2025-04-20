import React from 'react';
import { Card, CardHeader, CardContent, Typography, LinearProgress, Chip as Badge } from "@mui/material";
import './CourseOverview.css';

/**
 * CourseOverview Component
 * 
 * Displays an overview of the course including description,
 * learning objectives, and progress tracking.
 */
function CourseOverview({ courseData }) {
  if (!courseData) return null;

  // Helper function to determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'not-started': return 'status-not-started';
      default: return 'status-default';
    }
  };

  // Calculate module progress
  const calculateModuleProgress = (module) => {
    if (module.status === 'completed') return 100;
    if (module.status === 'not-started') return 0;
    
    if (module.items && module.items.length > 0) {
      const completedItems = module.items.filter(item => item.status === 'completed').length;
      return Math.round((completedItems / module.items.length) * 100);
    }
    
    return 0;
  };

  return (
    <Card className="overview-card">
      <CardHeader
        title="Course Overview"
        subheader="General information and course progress"
      />
      <CardContent>
        <div className="overview-sections">
          <section className="overview-section">
            <Typography variant="h6" className="section-title">About This Course</Typography>
            <Typography variant="body1" className="section-text">
              {courseData.description} This comprehensive course provides medical students 
              with a detailed understanding of human anatomical structures and physiological functions. 
              Through lectures, dissections, and interactive activities, students will gain 
              knowledge essential for clinical practice.
            </Typography>
          </section>
          
          <section className="overview-section">
            <Typography variant="h6" className="section-title">Learning Objectives</Typography>
            <ul className="objectives-list">
              <li className="objective-item">Identify and describe major anatomical structures of the human body</li>
              <li className="objective-item">Explain the physiological functions of different body systems</li>
              <li className="objective-item">Understand the relationship between structure and function</li>
              <li className="objective-item">Apply anatomical knowledge to basic clinical scenarios</li>
              <li className="objective-item">Develop skills in laboratory techniques and dissection</li>
            </ul>
          </section>
          
          <section className="overview-section">
            <Typography variant="h6">Course Progress</Typography>
            <Typography variant="body2" color="text.secondary">Track your advancement through the course materials</Typography>
            <div className="modules-progress">
              {courseData.modules.map(module => (
                <div key={module.id} className="module-progress">
                  <div className="progress-header">
                    <span className="module-name">{module.title}</span>
                    <Badge className={`module-status ${getStatusColor(module.status)}`}>
                      {module.status.replace(/-/g, ' ')
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </Badge>
                  </div>
                  <LinearProgress 
                    variant="determinate"
                    value={calculateModuleProgress(module)}
                    className="progress-bar"
                  />
                </div>
              ))}
            </div>
            <LinearProgress 
              variant="determinate" 
              value={courseData.progress || 0} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Badge 
              label={courseData.status || "In Progress"} 
              variant="outlined"
              size="small"
              className={`course-status status-${courseData.status?.toLowerCase() || "in-progress"}`}
            />
          </section>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseOverview;