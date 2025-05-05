// components/pages/CourseDetails.jsx
import React from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import CourseView from "../courses/CourseView"; // Import the course view component
import "./CourseDetails.css";

function CourseDetails() {
  return (
    <div className="app-container">
      <Sidebar userRole="student" />
      <main className="main-content">
        <Header title="Course Details" />
        <div className="content-wrapper">
          <CourseView />{" "}
          {/* The CourseView component will handle the courseId from URL params */}
        </div>
      </main>
    </div>
  );
}

export default CourseDetails;
