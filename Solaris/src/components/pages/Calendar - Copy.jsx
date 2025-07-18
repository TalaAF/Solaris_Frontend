// src/components/Calendar.jsx
import React, { useState, useEffect } from 'react';
import CalendarView from '../calendar/CalendarView';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Plus, Calendar as CalendarIcon, ChevronDown } from 'react-feather';
import CalendarService from '../../services/CalendarService';
import CalendarEventForm from './CalendarEventForm'; // This would be a form component for events
import './calendar.css';

function Calendar() {
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeCalendars, setActiveCalendars] = useState({
    courses: true,
    clinical: true,
    exams: true,
    personal: true
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch calendar events and settings on component mount
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true);
        
        // Calculate date range (current month)
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 2, 0); // Include next month
        
        // Fetch events
        const eventsData = await CalendarService.getEvents(firstDay, lastDay);
        setEvents(eventsData);
        
        // Fetch settings
        const settings = await CalendarService.getSettings();
        setActiveCalendars({
          courses: settings.showCourses,
          clinical: settings.showClinical,
          exams: settings.showExams,
          personal: settings.showPersonal
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setIsLoading(false);
      }
    };
    
    fetchCalendarData();
  }, []);
  
  // Filter events based on selection and active calendars
  const filterEvents = () => {
    if (!events || events.length === 0) return [];
    
    let filtered = [...events];
    
    // Filter by event type
    if (filter !== 'all') {
      filtered = filtered.filter(event => event.type === filter);
    }
    
    // Filter by active calendars
    if (!activeCalendars.courses) {
      filtered = filtered.filter(event => event.type !== 'lecture' && event.type !== 'seminar');
    }
    
    if (!activeCalendars.clinical) {
      filtered = filtered.filter(event => event.type !== 'lab');
    }
    
    if (!activeCalendars.exams) {
      filtered = filtered.filter(event => event.type !== 'exam' && event.type !== 'assignment');
    }
    
    if (!activeCalendars.personal) {
      filtered = filtered.filter(event => event.type !== 'personal' && event.type !== 'meeting');
    }
    
    return filtered;
  };
  
  const filteredEvents = filterEvents();
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const handleCalendarToggle = async (calendarType) => {
    const newActiveCalendars = {
      ...activeCalendars,
      [calendarType]: !activeCalendars[calendarType]
    };
    
    setActiveCalendars(newActiveCalendars);
    
    // Update calendar settings
    try {
      await CalendarService.updateSettings({
        showCourses: newActiveCalendars.courses,
        showClinical: newActiveCalendars.clinical,
        showExams: newActiveCalendars.exams,
        showPersonal: newActiveCalendars.personal
      });
    } catch (error) {
      console.error('Error updating calendar settings:', error);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await CalendarService.deleteEvent(eventId);
      // Refresh events
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      let savedEvent;
      
      if (selectedEvent) {
        // Update existing event
        savedEvent = await CalendarService.updateEvent(selectedEvent.id, eventData);
        // Update in local state
        setEvents(events.map(event => 
          event.id === savedEvent.id ? savedEvent : event
        ));
      } else {
        // Create new event
        savedEvent = await CalendarService.createEvent(eventData);
        // Add to local state
        setEvents([...events, savedEvent]);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };
  
  const handleSyncCalendar = async () => {
    try {
      await CalendarService.syncCalendar();
      // Refresh events after sync
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      const eventsData = await CalendarService.getEvents(firstDay, lastDay);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error syncing calendar:', error);
    }
  };
  
  return (
    <div className="content-scrollable">
      <div className="calendar-page">
        <div className="calendar-header-container">
          <div className="calendar-header-left">
            <h1 className="calendar-title">Calendar</h1>
            <p className="calendar-subtitle">Manage your academic and clinical schedule</p>
          </div>
          
          <div className="calendar-header-right">
            <div className="calendar-filter-container">
              <select 
                className="calendar-filter"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="all">All Events</option>
                <option value="lecture">Lectures</option>
                <option value="lab">Labs</option>
                <option value="seminar">Seminars</option>
                <option value="meeting">Meetings</option>
                <option value="exam">Exams</option>
                <option value="assignment">Assignments</option>
              </select>
              <ChevronDown className="calendar-select-icon" size={16} />
            </div>
            
            <button className="calendar-add-button" onClick={handleAddEvent}>
              <Plus size={18} />
              Add Event
            </button>
          </div>
        </div>
        
        <div className="calendar-layout">
          <div className="calendar-main">
            {isLoading ? (
              <div className="calendar-loading">Loading calendar...</div>
            ) : (
              <CalendarView 
                events={filteredEvents} 
                onEventClick={handleEditEvent}
                onEventDelete={handleDeleteEvent}
              />
            )}
          </div>
          
          <div className="calendar-sidebar">
            <Card className="calendar-card">
              <CardHeader className="calendar-card-header">
                <CardTitle className="calendar-card-title">Your Calendars</CardTitle>
              </CardHeader>
              <CardContent className="calendar-card-content">
                <div className="calendar-list">
                  <div className="calendar-list-item">
                    <input 
                      type="checkbox" 
                      id="cal-courses" 
                      className="calendar-checkbox" 
                      checked={activeCalendars.courses}
                      onChange={() => handleCalendarToggle('courses')}
                    />
                    <label htmlFor="cal-courses" className="calendar-label">
                      <span className="calendar-color-dot orange"></span>
                      Course Schedule
                    </label>
                  </div>
                  <div className="calendar-list-item">
                    <input 
                      type="checkbox" 
                      id="cal-clinical" 
                      className="calendar-checkbox" 
                      checked={activeCalendars.clinical}
                      onChange={() => handleCalendarToggle('clinical')}
                    />
                    <label htmlFor="cal-clinical" className="calendar-label">
                      <span className="calendar-color-dot blue"></span>
                      Clinical Rotations
                    </label>
                  </div>
                  <div className="calendar-list-item">
                    <input 
                      type="checkbox" 
                      id="cal-exams" 
                      className="calendar-checkbox" 
                      checked={activeCalendars.exams}
                      onChange={() => handleCalendarToggle('exams')}
                    />
                    <label htmlFor="cal-exams" className="calendar-label">
                      <span className="calendar-color-dot red"></span>
                      Exams & Assessments
                    </label>
                  </div>
                  <div className="calendar-list-item">
                    <input 
                      type="checkbox" 
                      id="cal-personal" 
                      className="calendar-checkbox" 
                      checked={activeCalendars.personal}
                      onChange={() => handleCalendarToggle('personal')}
                    />
                    <label htmlFor="cal-personal" className="calendar-label">
                      <span className="calendar-color-dot purple"></span>
                      Personal
                    </label>
                  </div>
                </div>
                
                <div className="divider"></div>
                
                <button className="calendar-sync-button" onClick={handleSyncCalendar}>
                  <CalendarIcon size={16} />
                  Sync with External Calendar
                </button>
              </CardContent>
            </Card>
            
            <Card className="calendar-card mt-4">
              <CardHeader className="calendar-card-header">
                <CardTitle className="calendar-card-title">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="calendar-card-content">
                <div className="deadline-list">
                  {filteredEvents
                    .filter(event => event.type === 'assignment' || event.type === 'exam')
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 5)
                    .map(event => (
                      <div key={event.id} className="deadline-card">
                        <div className="deadline-title">{event.title}</div>
                        <div className="deadline-date">
                          <span className="deadline-dot"></span>
                          {new Date(event.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {event.startTime}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {isModalOpen && (
          <div className="calendar-modal-overlay">
            <div className="calendar-modal">
              <div className="calendar-modal-header">
                <h2 className="calendar-modal-title">
                  {selectedEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button 
                  className="calendar-modal-close" 
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <div className="calendar-modal-content">
                <CalendarEventForm 
                  event={selectedEvent}
                  onSave={handleSaveEvent}
                  onCancel={() => setIsModalOpen(false)}
                  onDelete={handleDeleteEvent} // Add this line to pass the delete handler
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;