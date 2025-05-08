// src/services/UserService.js
import api from './api';

const UserService = {
  /**
   * Get user profile information
   * @param {number} userId - User ID
   * @returns {Promise} Promise with user data
   */
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user profile for ID ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get current authenticated user
   * @returns {Promise} Promise with user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
  
  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Promise with updated user data
   */
  updateUserProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user profile for ID ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get user academic information and statistics
   * @param {number} userId - User ID
   * @returns {Promise} Promise with academic data
   */
  getUserAcademicInfo: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/academic-info`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching academic info for user ${userId}:`, error);
      throw error;
    }
  }
};

export default UserService;