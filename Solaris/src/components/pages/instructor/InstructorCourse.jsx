//npm install @mui/lab @mui/material @emotion/react @emotion/styled lucide-react

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import coursesData from './data/courses.json';
import CourseManager from '../../InstructorCourse/CourseManager';
import InstructorCourses from '../../InstructorCourse/InstructorCourses';

const InstructorCourse = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleBack = () => {
    setSelectedCourse(null);
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {selectedCourse ? (
        <section>
          <h2>Manage Course: {selectedCourse.title}</h2>
          <CourseManager course={selectedCourse} onBack={handleBack} />
        </section>
      ) : (
        <section>
          <h2>Courses</h2>
          {coursesData.length > 0 ? (
            <InstructorCourses
              courses={coursesData}
              onSelectCourse={handleSelectCourse}
              aria-label="List of instructor courses"
            />
          ) : (
            <p>No courses available. Create a new course to get started.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default InstructorCourse;