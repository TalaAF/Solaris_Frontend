import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  LinearProgress,
  Chip as Badge,
} from "@mui/material";
import "./CourseOverview.css";

/**
 * CourseOverview Component
 *
 * Displays an overview of the course including description,
 * learning objectives, and progress tracking.
 * Updated to work with API data.
 */
function CourseOverview({ courseData }) {
  if (!courseData) return null;

  // Helper function to determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "in-progress":
        return "status-in-progress";
      case "not-started":
        return "status-not-started";
      default:
        return "status-default";
    }
  };

  // Calculate module progress
  const calculateModuleProgress = (module) => {
    if (module.status === "completed") return 100;
    if (module.status === "not-started") return 0;

    if (module.items && module.items.length > 0) {
      const completedItems = module.items.filter(
        (item) => item.status === "completed",
      ).length;
      return Math.round((completedItems / module.items.length) * 100);
    }

    return 0;
  };

  // Generate learning objectives from course description if not provided
  const generateLearningObjectives = () => {
    // If we don't have real learning objectives, let's generate some based on the description
    const description = courseData.description || "";

    // Extract keywords from description
    const keywords = description
      .split(/\s+/)
      .filter((word) => word.length > 5)
      .filter((word, i, arr) => arr.indexOf(word) === i)
      .slice(0, 5);

    // Generate objectives based on keywords
    return [
      `Understand the fundamentals of ${courseData.title}`,
      `Apply ${keywords[0] || "key concepts"} in practical scenarios`,
      `Analyze ${keywords[1] || "important aspects"} of ${courseData.title}`,
      `Evaluate ${keywords[2] || "critical elements"} in various contexts`,
      `Create ${keywords[3] || "solutions"} using learned principles`,
    ];
  };

  const learningObjectives = generateLearningObjectives();
  const modules = courseData.modules || [];

  return (
    <Card className="overview-card">
      <CardHeader
        title="Course Overview"
        subheader="General information and course progress"
      />
      <CardContent>
        <div className="overview-sections">
          <section className="overview-section">
            <Typography variant="h6" className="section-title">
              About This Course
            </Typography>
            <Typography variant="body1" className="section-text">
              {courseData.description ||
                "No description available for this course."}
            </Typography>
          </section>

          <section className="overview-section">
            <Typography variant="h6" className="section-title">
              Learning Objectives
            </Typography>
            <ul className="objectives-list">
              {learningObjectives.map((objective, index) => (
                <li key={index} className="objective-item">
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <section className="overview-section">
            <Typography variant="h6" className="section-title">
              Course Progress
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Track your advancement through the course materials
            </Typography>
            <div className="modules-progress">
              {modules.length > 0 ? (
                modules.map((module) => (
                  <div key={module.id} className="module-progress">
                    <div className="progress-header">
                      <span className="module-name">{module.title}</span>
                      <Badge
                        label={module.status
                          .replace(/-/g, " ")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                        className={`module-status ${getStatusColor(module.status)}`}
                        sx={{
                          height: 24,
                          borderRadius: "12px",
                        }}
                      />
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={calculateModuleProgress(module)}
                      className={`module-progress-bar ${getStatusColor(module.status)}`}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor:
                            module.status === "not-started"
                              ? "#e2e8f0"
                              : "#e6b400",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </div>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No modules available for this course.
                </Typography>
              )}
            </div>

            <div className="overall-progress" style={{ marginTop: "1.5rem" }}>
              <div className="progress-header">
                <Typography variant="subtitle2">Overall Progress</Typography>
                <Typography variant="caption" color="text.secondary">
                  {courseData.progress || 0}% Complete
                </Typography>
              </div>
              <LinearProgress
                variant="determinate"
                value={courseData.progress || 0}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#f1f5f9",
                  marginTop: "0.5rem",
                  marginBottom: "1rem",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#e6b400",
                    borderRadius: 5,
                  },
                }}
              />
              <Badge
                label={courseData.progress > 0 ? "In Progress" : "Not Started"}
                className="progress-badge"
                sx={{
                  backgroundColor: "rgba(230, 180, 0, 0.15)",
                  color: "#e6b400",
                  border: "1px solid #e6b400",
                  borderRadius: "16px",
                  padding: "4px 12px",
                  fontWeight: 500,
                }}
              />
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseOverview;
