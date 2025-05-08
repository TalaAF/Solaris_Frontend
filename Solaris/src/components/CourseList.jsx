import React from 'react';
import './styles/CourseList.css';

const CourseList = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return <div className="course-list-section">No courses available.</div>;
  }

  return (
    <div className="course-list-section">
      <div className="card-header">
        <h2 className="section-heading">Course List</h2>
      </div>
      <p className="section-subtitle">Your enrolled courses</p>
      <div className="course-list-items">
        {courses.map((course) => (
          <div key={course.id} className="course-item">
            <p className="course-title">{course.name}</p>
            <p className="course-details">
              Status: {course.status} (Progress: {course.progress || 0}%)
            </p>
            <p className="course-details">
              Instructor: {course.instructor}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;