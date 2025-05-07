import React, { useState, useEffect } from 'react';
import './ProgressSection.css';
import { mapCourseVisualizationData, formatProgressValue, getProgressColor } from '../../utils/ProgressMapper';
import ProgressService from '../../services/ProgressService'; // Direct import instead of using barrel file

const ProgressSection = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        
        // Get the auth token from localStorage
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Authentication token missing. Please log in again.");
        }
        
        // Get current user ID, fallback to 17 for testing if needed
        const userData = localStorage.getItem("user_data");
        const studentId = userData ? JSON.parse(userData).id : 17;
        
        console.log("Fetching data for student ID:", studentId);
        
        // Use ProgressService instead of direct fetch
        const rawData = await ProgressService.getCourseProgressVisualization(studentId);
        console.log("Raw API response data:", rawData);
        
        // Map the data using our mapper utility
        const mappedData = mapCourseVisualizationData(rawData);
        console.log("Mapped data:", mappedData);
        
        // Update state with the mapped data
        setOverallProgress(formatProgressValue(mappedData.overall.percentage));
        setProgressData(mappedData.courses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        // Display more specific error message if available
        const errorMessage = err.response?.data?.message || err.message || 
                            "Failed to load progress data. Please try again later.";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="progress-section">
        <h2>Course Progress</h2>
        <div className="progress-loading">Loading your progress...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="progress-section">
        <h2>Course Progress</h2>
        <div className="progress-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="progress-section">
      <h2>Course Progress</h2>
      
      {/* Overall Progress */}
      <div className="overall-progress">
        <div className="progress-bar-container">
          <div className="progress-bar-label">
            <span>Overall Completion</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="progress-bar-wrapper">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${overallProgress}%`,
                backgroundColor: getProgressColor(overallProgress)
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Course-specific Progress */}
      <div className="course-progress">
        {progressData.length === 0 ? (
          <div className="no-courses-message">
            You are not enrolled in any courses yet.
          </div>
        ) : (
          progressData.map((course, index) => (
            <div key={index} className="progress-bar-container">
              <div className="progress-bar-label">
                <span>{course.name}</span>
                <span>{Math.round(formatProgressValue(course.percentage))}%</span>
              </div>
              <div className="progress-bar-wrapper">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${formatProgressValue(course.percentage)}%`,
                    backgroundColor: getProgressColor(course.percentage)
                  }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgressSection;