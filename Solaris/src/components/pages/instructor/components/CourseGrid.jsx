import React from 'react';
import CourseCard from './CourseCard';

const CourseGrid = ({ courses, onCourseClick }) => {
  return (
    <div className="courses-grid">
      {courses.map((course) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          onClick={onCourseClick} 
        />
      ))}
    </div>
  );
};

export default CourseGrid;