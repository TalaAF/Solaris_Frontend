/**
 * Utility functions to map progress data from backend to frontend format
 */

/**
 * Maps the course visualization data from the backend format to the frontend format
 * @param {Object} backendData - The data received from the backend API
 * @returns {Object} Formatted data for the frontend
 */
export const mapCourseVisualizationData = (backendData) => {
    if (!backendData) {
      return {
        overall: { name: "Overall Completion", percentage: 0 },
        courses: []
      };
    }
  
    // Map the overall data
    const overall = {
      name: backendData.overall?.name || "Overall Completion",
      percentage: backendData.overall?.percentage || 0
    };
  
    // Map the courses data
    const courses = Array.isArray(backendData.courses) 
      ? backendData.courses.map(course => ({
          name: course.name || "Unknown Course",
          percentage: course.percentage || 0
        }))
      : [];
  
    return {
      overall,
      courses
    };
  };
  
  /**
   * Safely formats the progress percentage value
   * @param {number|string} value - Progress percentage to format
   * @returns {number} Formatted progress value (0-100)
   */
  export const formatProgressValue = (value) => {
    if (value === null || value === undefined) return 0;
    
    const numValue = Number(value);
    if (isNaN(numValue)) return 0;
    
    // Ensure the value is between 0 and 100
    return Math.min(Math.max(numValue, 0), 100);
  };
  
  /**
   * Gets color for progress bar based on percentage
   * @param {number} percentage - Progress percentage
   * @returns {string} HEX color code
   */
  export const getProgressColor = (percentage) => {
    if (percentage < 25) return '#FF6B6B'; // Red for low progress
    if (percentage < 50) return '#FFD166'; // Yellow for moderate progress
    if (percentage < 75) return '#06D6A0'; // Green for good progress
    return '#118AB2'; // Blue for excellent progress
  };