/**
 * Format a date object or string to a human-readable string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "N/A";
  
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", { ...defaultOptions, ...options }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

/**
 * Format a date for HTML datetime-local input
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string (YYYY-MM-DDThh:mm)
 */
export const formatDateForInput = (date) => {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Format: YYYY-MM-DDThh:mm
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};

/**
 * Calculate time remaining from now until a future date
 * @param {Date|string} endDate - Future date
 * @returns {Object} Object with days, hours, minutes properties
 */
export const getTimeRemaining = (endDate) => {
  if (!endDate) return { days: 0, hours: 0, minutes: 0 };
  
  try {
    const endDateObj = typeof endDate === "string" ? new Date(endDate) : endDate;
    const now = new Date();
    const diffMs = endDateObj - now;
    
    if (diffMs <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  } catch (error) {
    console.error("Error calculating time remaining:", error);
    return { days: 0, hours: 0, minutes: 0 };
  }
};