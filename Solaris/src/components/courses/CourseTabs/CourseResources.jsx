import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { BookOpen, Image, FileText, Download } from "lucide-react";
import "./CourseResources.css";

/**
 * CourseResources Component
 *
 * Displays additional learning materials and references for the course,
 * such as textbooks, interactive resources, documents, and downloads.
 */
function CourseResources({ courseData }) {
  if (!courseData || !courseData.resources) return null;

  // Helper function to get resource type icon
  const getResourceIcon = (type) => {
    switch (type) {
      case "book":
        return <BookOpen className="resource-icon" />;
      case "interactive":
        return <Image className="resource-icon" />;
      case "document":
        return <FileText className="resource-icon" />;
      case "download":
        return <Download className="resource-icon" />;
      default:
        return <FileText className="resource-icon" />;
    }
  };

  return (
    <Card className="resources-card">
      <CardHeader
        title="Course Resources"
        subheader="Additional learning materials and references"
      />
      <CardContent>
        <div className="resources-list">
          {courseData.resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              className="resource-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="resource-content">
                <div className="resource-type-icon">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="resource-details">
                  <Typography variant="h6" className="resource-title">
                    {resource.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="resource-meta"
                  >
                    <span className="resource-type">{resource.type}</span>
                  </Typography>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
      <div
        style={{ padding: "16px", borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        Footer content
      </div>
      <Chip variant="outlined" label="Label" size="small" />
    </Card>
  );
}

export default CourseResources;
