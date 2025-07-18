/**
 * Utility functions for user management
 */

/**
 * Get the current user ID from various storage locations
 * @returns {string|null} User ID if found, null otherwise
 */
export const getCurrentUserId = () => {
  // Try localStorage
  const userId = localStorage.getItem('userId') || 
                 localStorage.getItem('user_id');
  if (userId) return userId;
  
  // Try sessionStorage
  const sessionUserId = sessionStorage.getItem('userId') || 
                        sessionStorage.getItem('user_id');
  if (sessionUserId) return sessionUserId;
  
  // Try user object in localStorage
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && (user.id || user.userId || user._id)) {
        return user.id || user.userId || user._id;
      }
    }
  } catch (e) {
    console.warn('Error parsing user from localStorage', e);
  }
  
  return null;
};

/**
 * Store user ID in localStorage for consistent access
 * @param {string} userId - User ID to store
 */
export const storeUserId = (userId) => {
  if (userId) {
    localStorage.setItem('userId', userId);
  }
};

/**
 * Clear stored user ID on logout
 */
export const clearUserId = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('user_id');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('user_id');
};