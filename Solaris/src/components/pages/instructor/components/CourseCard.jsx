import React from 'react';
import { Users, Clock } from 'lucide-react';

const CourseCard = ({ course, onClick }) => {
  return (
    <div 
      className="course-card" 
      onClick={() => onClick(course.id)}
    >
      <div className="course-image-container">
        <img 
          src={course.coverImage} 
          alt={course.title} 
          className="course-image" 
        />
        <div className={`course-status ${course.status}`}>
          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
        </div>
      </div>
      
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        
        <div className="course-meta">
          <div className="course-stats">
            <div className="course-stat">
              <Users size={16} />
              <span>{course.students} students</span>
            </div>
            <div className="course-stat">
              <Clock size={16} />
              <span>{course.lastUpdated}</span>
            </div>
          </div>
          
          <div className="course-progress">
            <div className="progress-text">{course.progress}% completed</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;