<<<<<<< HEAD
import React from "react";
import { Chip as Badge } from "@mui/material";
import "./CourseHeader.css";

/**
 * CourseHeader Component
 *
=======
import React from 'react';
import { Chip as Badge } from '@mui/material';
import './CourseHeader.css';

/**
 * CourseHeader Component
 * 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
 * Displays the course title, code, and description.
 * A focused component that handles just the header section of the course view.
 */
function CourseHeader({ courseData }) {
  if (!courseData) return null;

  return (
    <div className="course-header">
      <div className="course-header-title">
        <h6 className="course-title">{courseData.title}</h6>
<<<<<<< HEAD
        <Badge
=======
        <Badge 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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
