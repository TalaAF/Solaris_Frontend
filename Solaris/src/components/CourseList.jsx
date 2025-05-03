import React from 'react';
import './styles/CourseList.css';

const CourseList = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return <div className="course-list-card">No courses available.</div>;
  }

  return (
    <div className="course-list-card">
      <h2 className="section-heading">Course List</h2>
      <p className="section-subtitle">Your enrolled courses</p>
      <div className="info-list">
        {courses.map((course) => (
          <div key={course.id}>
            <span className="label">{course.name}: </span>
            <span className="value">
              {course.status} (Progress: {course.progress || 0}%)
            </span><br />
            <span className="label">Instructor: </span>
            <span className="value">{course.instructor}</span><br /><br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;