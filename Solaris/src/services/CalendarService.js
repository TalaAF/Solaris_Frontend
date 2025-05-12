// src/services/CalendarService.js
import api from './api';

class CalendarService {
  /**
   * Get events for the specified date range
   * @param {Date} startDate - Start date for the range
   * @param {Date} endDate - End date for the range
   * @param {string} type - Event type filter (optional)
   * @returns {Promise} - Promise with the events
   */
  async getEvents(startDate, endDate, type = null) {
    const formattedStart = startDate.toISOString().split('T')[0];
    const formattedEnd = endDate.toISOString().split('T')[0];
    
    let url = `/api/calendar/events?startDate=${formattedStart}&endDate=${formattedEnd}`;
    if (type) {
      url += `&type=${type.toUpperCase()}`;
    }
    
    try {
      const response = await api.get(url);
      return this.transformEventsFromApi(response.data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  /**
   * Get a specific event by ID
   * @param {number} eventId - The event ID
   * @returns {Promise} - Promise with the event
   */
  async getEventById(eventId) {
    try {
      const response = await api.get(`/api/calendar/events/${eventId}`);
      return this.transformEventFromApi(response.data);
    } catch (error) {
      console.error('Error fetching calendar event:', error);
      throw error;
    }
  }

  /**
   * Get events for a specific date
   * @param {Date} date - The date to get events for
   * @returns {Promise} - Promise with the events
   */
  async getEventsByDate(date) {
    const formattedDate = date.toISOString().split('T')[0];
    
    try {
      const response = await api.get(`/api/calendar/events/date/${formattedDate}`);
      // Extract content from EntityModels
      return this.transformEventsFromApi(response.data.map(item => item.content));
    } catch (error) {
      console.error('Error fetching calendar events by date:', error);
      throw error;
    }
  }

  /**
   * Create a new calendar event
   * @param {Object} event - The event data
   * @returns {Promise} - Promise with the created event
   */
  async createEvent(event) {
    try {
      const eventData = this.transformEventForApi(event);
      const response = await api.post('/api/calendar/events', eventData);
      return this.transformEventFromApi(response.data);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Update an existing calendar event
   * @param {number} eventId - The event ID
   * @param {Object} event - The updated event data
   * @returns {Promise} - Promise with the updated event
   */
  async updateEvent(eventId, event) {
    try {
      const eventData = this.transformEventForApi(event);
      const response = await api.put(`/api/calendar/events/${eventId}`, eventData);
      return this.transformEventFromApi(response.data);
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  /**
   * Delete a calendar event
   * @param {number} eventId - The event ID
   * @returns {Promise} - Promise with the result
   */
  async deleteEvent(eventId) {
    try {
      await api.delete(`/api/calendar/events/${eventId}`);
      return true; 
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  /**
   * Get user's calendar settings
   * @returns {Promise} - Promise with the settings
   */
  async getSettings() {
    try {
      const response = await api.get('/api/calendar/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar settings:', error);
      throw error;
    }
  }

  /**
   * Update user's calendar settings
   * @param {Object} settings - The settings data
   * @returns {Promise} - Promise with the updated settings
   */
  async updateSettings(settings) {
    try {
      const response = await api.put('/api/calendar/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating calendar settings:', error);
      throw error;
    }
  }

  /**
   * Connect to external calendar
   * @param {string} calendarType - The calendar type (GOOGLE, OUTLOOK, etc.)
   * @param {string} authCode - The auth code from OAuth flow
   * @returns {Promise} - Promise with the result
   */
  async connectExternalCalendar(calendarType, authCode) {
    try {
      await api.post(`/api/calendar/connect?calendarType=${calendarType}&authCode=${authCode}`);
      return true;
    } catch (error) {
      console.error('Error connecting external calendar:', error);
      throw error;
    }
  }

  /**
   * Manually trigger a sync with external calendar
   * @returns {Promise} - Promise with the result
   */
  async syncCalendar() {
    try {
      await api.post('/api/calendar/sync');
      return true;
    } catch (error) {
      console.error('Error syncing calendar:', error);
      throw error;
    }
  }

  /**
   * Transform events data from API format to frontend format
   * @param {Array} events - Events array from API
   * @returns {Array} - Transformed events
   */
  transformEventsFromApi(events) {
    if (!events) return [];
    return events.map(event => this.transformEventFromApi(event));
  }

  /**
   * Transform a single event from API format to frontend format
   * @param {Object} event - Event from API
   * @returns {Object} - Transformed event
   */
  transformEventFromApi(event) {
    if (!event) return null;
    
    // Parse date string to Date object
    const date = event.date ? new Date(event.date) : null;
    
    return {
      id: event.id,
      title: event.title,
      date: date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      description: event.description,
      type: event.type ? event.type.toLowerCase() : null, // Convert to lowercase for frontend
      userId: event.userId,
      userName: event.userName,
      shared: event.shared,
      audience: event.audience,
      externalEventId: event.externalEventId
    };
  }

  /**
   * Transform event data from frontend format to API format
   * @param {Object} event - Event from frontend
   * @returns {Object} - Transformed event
   */
  transformEventForApi(event) {
    if (!event) return null;
    
    // Format date as ISO string (YYYY-MM-DD)
    const date = event.date instanceof Date 
      ? event.date.toISOString().split('T')[0]
      : event.date;
      
    return {
      id: event.id,
      title: event.title,
      date: date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      description: event.description,
      type: event.type ? event.type.toUpperCase() : null, // API expects uppercase enum values
      userId: event.userId,
      shared: event.shared,
      audience: event.audience,
      externalEventId: event.externalEventId
    };
  }

  /**
   * Format a date range for display
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {string} - Formatted date range
   */
  formatDateRange(startDate, endDate) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const start = startDate.toLocaleDateString(undefined, options);
    const end = endDate.toLocaleDateString(undefined, options);
    
    if (start === end) {
      return start;
    }
    
    return `${start} - ${end}`;
  }

  /**
   * Format a time range for display
   * @param {string} startTime - Start time (HH:MM)
   * @param {string} endTime - End time (HH:MM)
   * @returns {string} - Formatted time range
   */
  formatTimeRange(startTime, endTime) {
    // Convert 24h to 12h format
    const formatTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours, 10);
      const period = h >= 12 ? 'PM' : 'AM';
      const hour = h % 12 || 12;
      return `${hour}:${minutes} ${period}`;
    };
    
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }

  /**
   * Get color for event type
   * @param {string} type - Event type
   * @returns {string} - CSS color class
   */
  getEventTypeColor(type) {
    const colorMap = {
      lecture: 'event-color-orange',
      lab: 'event-color-blue',
      seminar: 'event-color-green',
      meeting: 'event-color-purple',
      exam: 'event-color-red',
      assignment: 'event-color-yellow',
      personal: 'event-color-teal'
    };
    
    return colorMap[type] || 'event-color-gray';
  }

  /**
   * Get readable name for event audience
   * @param {string} audience - Audience enum value
   * @returns {string} - Readable audience name
   */
  getAudienceName(audience) {
    const audienceMap = {
      ALL: 'Everyone',
      STUDENTS: 'Students Only',
      TEACHERS: 'Teachers Only',
      ADMINISTRATORS: 'Administrators Only'
    };
    
    return audienceMap[audience] || 'Unknown';
  }

  /**
   * Check if two events overlap in time
   * @param {Object} event1 - First event
   * @param {Object} event2 - Second event
   * @returns {boolean} - True if events overlap
   */
  eventsOverlap(event1, event2) {
    // Check if events are on the same day
    const date1 = event1.date instanceof Date ? event1.date : new Date(event1.date);
    const date2 = event2.date instanceof Date ? event2.date : new Date(event2.date);
    
    if (date1.getFullYear() !== date2.getFullYear() ||
        date1.getMonth() !== date2.getMonth() ||
        date1.getDate() !== date2.getDate()) {
      return false;
    }
    
    // Convert times to minutes for easier comparison
    const getMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const start1 = getMinutes(event1.startTime);
    const end1 = getMinutes(event1.endTime);
    const start2 = getMinutes(event2.startTime);
    const end2 = getMinutes(event2.endTime);
    
    // Events overlap if one starts before the other ends
    return Math.max(start1, start2) < Math.min(end1, end2);
  }

  /**
   * Get events grouped by date
   * @param {Array} events - Array of event objects
   * @returns {Object} - Events grouped by date string
   */
  groupEventsByDate(events) {
    const grouped = {};
    
    events.forEach(event => {
      const date = event.date instanceof Date 
        ? event.date.toISOString().split('T')[0]
        : event.date;
        
      if (!grouped[date]) {
        grouped[date] = [];
      }
      
      grouped[date].push(event);
    });
    
    // Sort events by start time within each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        const timeA = a.startTime;
        const timeB = b.startTime;
        return timeA.localeCompare(timeB);
      });
    });
    
    return grouped;
  }
}

export default new CalendarService();