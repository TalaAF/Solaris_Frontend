import React, { useState } from "react";
import CourseTable from "../../admin/CourseTable";
import { courses as initialCourses } from "../../../mocks/mockDataAdmin";
import "./CourseManagement.css";

const CourseManagement = () => {
  const [courses, setCourses] = useState(initialCourses || []);

  const handleCourseAdd = (courseData) => {
    console.log("Adding course:", courseData);
    // In a real app, you would make an API call here
    const newCourse = {
      ...courseData,
      id: Math.max(0, ...courses.map((c) => c.id)) + 1,
      enrolledStudents: 0,
    };
    setCourses([...courses, newCourse]);
    alert("Course created successfully");
  };

  const handleCourseUpdate = (courseData) => {
    console.log("Updating course:", courseData);
    // In a real app, you would make an API call here
    const updatedCourses = courses.map(item => 
      item.id === courseData.id ? courseData : item
    );
    setCourses(updatedCourses);
    alert("Course updated successfully");
  };

  const handleCourseToggleStatus = (courseId, newStatus) => {
    console.log(`${newStatus ? "Activating" : "Deactivating"} course with ID:`, courseId);
    // In a real app, you would make an API call here
    const updatedCourses = courses.map(item => 
      item.id === courseId ? { ...item, isActive: newStatus } : item
    );
    setCourses(updatedCourses);
    alert(`Course ${newStatus ? "activated" : "deactivated"} successfully`);
  };

  return (
    <>
      <div className="admin-course-page">
        <div className="admin-course-header">
          <h1 className="admin-title">Course Management</h1>
          <p className="admin-subtitle">Manage all courses in the system</p>
        </div>

        <CourseTable 
          courses={courses} 
          onCourseAdd={handleCourseAdd} 
          onCourseUpdate={handleCourseUpdate}
          onCourseToggleStatus={handleCourseToggleStatus}
        />
      </div>
    </>
  );
};

export default CourseManagement;