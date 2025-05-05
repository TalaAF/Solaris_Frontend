import React from "react";
import { Chip as Badge } from "@mui/material";
import "./CourseHeader.css";

/**
 * CourseHeader Component
 *
 * Displays the course title, code, and description.
 * A focused component that handles just the header section of the course view.
 */
function CourseHeader({ courseData }) {
  if (!courseData) return null;

  return (
    <div className="course-header">
      <div className="course-header-title">
        <h6 className="course-title">{courseData.title}</h6>
        <Badge
          label={courseData.code}
          className="course-badge"
          variant="outlined"
          size="small"
        />
      </div>
      <p className="course-description">{courseData.description}</p>
    </div>
  );
}

export default CourseHeader;
