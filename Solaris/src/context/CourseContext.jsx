import React, { createContext, useContext, useState } from 'react';

// Create the context
const CourseContext = createContext();

// Create the provider component
export const CourseProvider = ({ children }) => {
  const [courseData, setCourseData] = useState(null);

  const setCurrentCourse = (course) => {
    setCourseData(course);
  };

  const clearCurrentCourse = () => {
    setCourseData(null);
  };

  return (
    <CourseContext.Provider value={{ courseData, setCurrentCourse, clearCurrentCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

// Create the hook for using the context
export const useCourseContext = () => {
  const context = useContext(CourseContext);
  return context;
};

export default CourseContext;