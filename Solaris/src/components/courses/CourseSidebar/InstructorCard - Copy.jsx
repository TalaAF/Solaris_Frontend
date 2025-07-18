import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { MessageSquare, Users } from "lucide-react";
import "./InstructorCard.css";

/**
 * InstructorCard Component
 *
 * Displays information about the course instructor including
 * their name, title, avatar, and contact options.
 */
function InstructorCard({ instructor }) {
  if (!instructor) return null;

  const { name, avatar, title } = instructor;
  // For demo purposes, assuming current user is a student
  const isStudent = true;

  return (
    <Card className="instructor-card">
      <CardHeader
        title="Instructor"
        // If you had subtitle content in CardDescription, add it here:
        // subheader="Your instructor information"
      />
      <CardContent className="instructor-content">
        <div className="instructor-profile">
          <div className="instructor-avatar">
            {avatar ? (
              <img src={avatar} alt={name} className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="instructor-info">
            <Typography variant="h6" className="instructor-name">
              {name}
            </Typography>
            <Typography variant="body2" className="instructor-role">
              {title}
            </Typography>
          </div>
        </div>
        <div className="instructor-actions">
          <Button
            variant="outlined"
            size="small"
            startIcon={<MessageSquare size={16} />}
          >
            Contact
          </Button>
          {isStudent && (
            <Button variant="outlined" size="small" className="action-button">
              <Users className="action-icon" />
              Office Hours
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCard;
