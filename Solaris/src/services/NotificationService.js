import api from "./api";

class NotificationService {
  // Get all notifications for current user (paginated)
  async getNotifications(page = 0, size = 20) {
    try {
      const response = await api.get(`/notifications?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Get unread notifications
  async getUnreadNotifications() {
    try {
      const response = await api.get('/notifications/unread');
      return response.data;
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      throw error;
    }
  }

  // Get notifications by category
  async getNotificationsByCategory(category) {
    try {
      const response = await api.get(`/notifications/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notifications for category ${category}:`, error);
      throw error;
    }
  }

  // Get unread notification count
  async getUnreadCount() {
    try {
      const response = await api.get('/notifications/unread/count');
      return response.data;
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      throw error;
    }
  }

  // Get unread notification count by category
  async getUnreadCountByCategory(category) {
    try {
      const response = await api.get(`/notifications/unread/count/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching unread count for category ${category}:`, error);
      throw error;
    }
  }

  // Mark a notification as read
  async markAsRead(notificationId) {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      await api.patch('/notifications/read-all');
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  // Mark all notifications as read in a category
  async markAllAsReadInCategory(category) {
    try {
      await api.patch(`/notifications/read-all/category/${category}`);
      return true;
    } catch (error) {
      console.error(`Error marking all notifications as read in category ${category}:`, error);
      throw error;
    }
  }

  // Delete a notification
  async deleteNotification(notificationId) {
    try {
      await api.delete(`/notifications/${notificationId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  }

  // Get notification preferences
  async getPreferences() {
    try {
      const response = await api.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      throw error;
    }
  }

  // Update a notification preference
  async updatePreference(type, emailEnabled, inAppEnabled) {
    try {
      const response = await api.put(
        `/notifications/preferences/${type}?emailEnabled=${emailEnabled}&inAppEnabled=${inAppEnabled}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating preference for ${type}:`, error);
      throw error;
    }
  }

  // Update multiple notification preferences
  async updatePreferences(types, emailEnabled, inAppEnabled) {
    try {
      const typesParam = types.join(',');
      const response = await api.put(
        `/notifications/preferences/batch?types=${typesParam}&emailEnabled=${emailEnabled}&inAppEnabled=${inAppEnabled}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating multiple preferences:", error);
      throw error;
    }
  }
}

export default new NotificationService();