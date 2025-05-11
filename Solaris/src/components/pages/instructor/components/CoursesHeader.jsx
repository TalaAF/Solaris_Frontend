import React from 'react';
import { Plus } from 'lucide-react';

const CoursesHeader = ({ onCreateCourse }) => {
  return (
    <div className="instructor-dashboard-header">
      <div>
        <h1 className="instructor-title">My Courses</h1>
        <p className="instructor-subtitle">Manage and organize your courses</p>
      </div>
      <button className="solaris-button primary-button" onClick={onCreateCourse}>
        <Plus size={18} />
        <span>Create Course</span>
      </button>
    </div>
  );
};

export default CoursesHeader;