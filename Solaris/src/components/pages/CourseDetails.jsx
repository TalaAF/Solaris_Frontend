// components/pages/CourseDetails.jsx
<<<<<<< HEAD
import React from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import CourseView from "../courses/CourseView"; // Import the course view component
import "./CourseDetails.css";
=======
import React from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import CourseView from '../courses/CourseView'; // Import the course view component
import './CourseDetails.css';
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2

function CourseDetails() {
  return (
    <div className="app-container">
      <Sidebar userRole="student" />
      <main className="main-content">
        <Header title="Course Details" />
        <div className="content-wrapper">
<<<<<<< HEAD
          <CourseView />{" "}
          {/* The CourseView component will handle the courseId from URL params */}
=======
          <CourseView /> {/* The CourseView component will handle the courseId from URL params */}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        </div>
      </main>
    </div>
  );
}

export default CourseDetails;
