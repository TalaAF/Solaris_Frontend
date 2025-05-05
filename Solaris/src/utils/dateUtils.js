/**
 * Formats a date string to a more readable format (MM/DD/YYYY)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return 'No date specified';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

/**
 * Formats a date string to include time (MM/DD/YYYY, hh:mm AM/PM)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date with time
 */
export function formatDateTime(dateString) {
  if (!dateString) return 'No date specified';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Returns a relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export function getRelativeTime(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays > 0) {
    return `In ${diffDays} days`;
  } else {
    return `${Math.abs(diffDays)} days ago`;
  }
}

/**
 * Checks if a date is in the past
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is in the past
 */
export function isDatePast(dateString) {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
}

/**
 * Calculates time remaining until a date in days, hours, minutes
 * @param {string} dateString - ISO date string 
 * @returns {Object} Object containing days, hours, minutes
 */
export function getTimeRemaining(dateString) {
  if (!dateString) return { days: 0, hours: 0, minutes: 0 };
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (date < now) {
    return { days: 0, hours: 0, minutes: 0 };
  }
  
  const diffTime = date - now;
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
}