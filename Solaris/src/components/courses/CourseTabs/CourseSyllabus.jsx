import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip as Badge,
} from "@mui/material";
import { FileText, Video, ClipboardList } from "lucide-react";
import "./CourseSyllabus.css";

/**
 * CourseSyllabus Component
 *
 * Displays a detailed outline of the course content and schedule,
 * including modules, items, and their statuses.
 */
function CourseSyllabus({ courseData }) {
  if (!courseData) return null;

  // Helper function to get content type icon
  const getContentIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="item-icon" />;
      case "document":
        return <FileText className="item-icon" />;
      case "quiz":
        return <ClipboardList className="item-icon" />;
      default:
        return <FileText className="item-icon" />;
    }
  };

  return (
    <Card className="syllabus-card">
      <CardHeader
        title="Course Syllabus"
        subheader="Weekly topics and learning objectives"
      />
      <CardContent>
        <div className="syllabus-content">
          {courseData.modules.map((module, index) => (
            <div key={module.id} className="syllabus-module">
              <div className="module-header">
                <div className="module-number">{index + 1}</div>
                <Typography variant="h6" className="module-title">
                  {module.title}
                </Typography>
              </div>

              <div className="module-items">
                {module.items.map((item) => (
                  <div key={item.id} className="syllabus-item">
                    <div className="item-content">
                      <div className="item-type">
                        {getContentIcon(item.type)}
                      </div>
                      <div className="item-details">
                        <Typography variant="subtitle1" className="item-title">
                          {item.title}
                        </Typography>
                        <div className="item-meta">
                          <span className="item-category">{item.type}</span>
                          <span className="item-separator">•</span>
                          <span className="item-duration">{item.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      label={item.type}
                      variant="outlined"
                      size="small"
                      className={`content-type type-${item.type}`}
                    />
                    <Badge
                      label={
                        item.status === "completed"
                          ? "completed"
                          : item.status === "in-progress"
                            ? "in progress"
                            : "not started"
                      }
                      className={`item-status status-${item.status}`}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                ))}
              </div>
              <Typography variant="h6">
                Week {module.number}: {module.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {module.description}
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseSyllabus;
