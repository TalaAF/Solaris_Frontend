<<<<<<< HEAD
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip as Badge,
  Button,
} from "@mui/material";
import { ClipboardList, FileText, Calendar } from "lucide-react";
import "./CourseAssessments.css";

/**
 * CourseAssessments Component
 *
=======
import React from 'react';
import { Card, CardHeader, CardContent, Typography, Chip as Badge, Button } from "@mui/material";
import { ClipboardList, FileText, Calendar } from 'lucide-react';
import './CourseAssessments.css';

/**
 * CourseAssessments Component
 * 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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
<<<<<<< HEAD
      case "quiz":
        return <ClipboardList className="assessment-icon" />;
      case "assignment":
        return <FileText className="assessment-icon" />;
      case "exam":
=======
      case 'quiz':
        return <ClipboardList className="assessment-icon" />;
      case 'assignment':
        return <FileText className="assessment-icon" />;
      case 'exam':
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        return <ClipboardList className="assessment-icon" />;
      default:
        return <FileText className="assessment-icon" />;
    }
  };

  // Helper function to get action button text
  const getActionText = (status) => {
    switch (status) {
<<<<<<< HEAD
      case "completed":
        return "Review";
      case "upcoming":
      case "pending":
        return "Start";
      default:
        return "View";
=======
      case 'completed':
        return 'Review';
      case 'upcoming':
      case 'pending':
        return 'Start';
      default:
        return 'View';
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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
<<<<<<< HEAD
          {courseData.assessments.map((assessment) => (
=======
          {courseData.assessments.map(assessment => (
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
            <div key={assessment.id} className="assessment-item">
              <div className="assessment-content">
                <div className="assessment-type-icon">
                  {getAssessmentIcon(assessment.type)}
                </div>
                <div className="assessment-details">
<<<<<<< HEAD
                  <Typography variant="h6" className="assessment-title">
                    {assessment.title}
                  </Typography>
=======
                  <Typography variant="h6" className="assessment-title">{assessment.title}</Typography>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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
<<<<<<< HEAD

=======
              
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
              <div className="assessment-actions">
                {assessment.score && (
                  <div className="assessment-score">{assessment.score}</div>
                )}
<<<<<<< HEAD
                <Badge
=======
                <Badge 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                  label={assessment.status}
                  className={`assessment-status status-${assessment.status}`}
                  variant="outlined"
                />
<<<<<<< HEAD
                <Button
                  className="action-button"
                  variant="contained"
                  disabled={assessment.status === "upcoming"}
=======
                <Button 
                  className="action-button"
                  variant="contained"
                  disabled={assessment.status === 'upcoming'}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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
