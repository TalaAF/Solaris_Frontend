import React from 'react';
import { Card, CardHeader, CardContent, Typography, Chip as Badge, Button } from "@mui/material";
import { ClipboardList, FileText, Calendar } from 'lucide-react';
import './CourseAssessments.css';

/**
 * CourseAssessments Component
 * 
 * Displays quizzes, assignments, and exams for the course,
 * including due dates, status, and scores.
 */
function CourseAssessments({ courseData }) {
  if (!courseData || !courseData.assessments) return null;

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to get content type icon
  const getAssessmentIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <ClipboardList className="assessment-icon" />;
      case 'assignment':
        return <FileText className="assessment-icon" />;
      case 'exam':
        return <ClipboardList className="assessment-icon" />;
      default:
        return <FileText className="assessment-icon" />;
    }
  };

  // Helper function to get action button text
  const getActionText = (status) => {
    switch (status) {
      case 'completed':
        return 'Review';
      case 'upcoming':
      case 'pending':
        return 'Start';
      default:
        return 'View';
    }
  };

  return (
    <Card className="assessments-card">
      <CardHeader
        title="Assessments"
        subheader="Quizzes, assignments and exams for this course"
      />
      <CardContent>
        <div className="assessments-list">
          {courseData.assessments.map(assessment => (
            <div key={assessment.id} className="assessment-item">
              <div className="assessment-content">
                <div className="assessment-type-icon">
                  {getAssessmentIcon(assessment.type)}
                </div>
                <div className="assessment-details">
                  <Typography variant="h6" className="assessment-title">{assessment.title}</Typography>
                  <div className="assessment-meta">
                    <span className="assessment-type">{assessment.type}</span>
                    <span className="meta-separator">•</span>
                    <div className="assessment-due">
                      <Calendar className="due-icon" />
                      <span>Due: {formatDate(assessment.dueDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="assessment-actions">
                {assessment.score && (
                  <div className="assessment-score">{assessment.score}</div>
                )}
                <Badge 
                  label={assessment.status}
                  className={`assessment-status status-${assessment.status}`}
                  variant="outlined"
                />
                <Button 
                  className="action-button"
                  variant="contained"
                  disabled={assessment.status === 'upcoming'}
                >
                  {getActionText(assessment.status)}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseAssessments;
