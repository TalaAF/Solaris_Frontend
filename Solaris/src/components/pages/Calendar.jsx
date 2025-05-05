import React, { useState } from 'react';
import CalendarView from '../calendar/CalendarView';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Plus, Calendar as CalendarIcon, ChevronDown } from 'react-feather';
import './calendar.css';

// Define event types
const CalendarEvent = {
  // These are sample events for the calendar
  events: [
    {
      id: '1',
      title: 'Anatomy Lecture: Cardiovascular System',
      startTime: '08:30',
      endTime: '10:00',
      location: 'Medical Building, Room A102',
      type: 'lecture',
      date: new Date(2025, 3, 14)
    },
    {
      id: '2',
      title: 'Clinical Pathology Lab',
      startTime: '11:00',
      endTime: '13:00',
      location: 'Science Lab Wing, Room L205',
      type: 'lab',
      date: new Date(2025, 3, 14)
    },
    {
      id: '3',
      title: 'Pharmacology Study Group',
      startTime: '14:30',
      endTime: '16:00',
      location: 'Library, Study Room 3',
      type: 'meeting',
      date: new Date(2025, 3, 14)
    },
    {
      id: '4',
      title: 'Medical Ethics Seminar',
      startTime: '16:30',
      endTime: '18:00',
      location: 'Medical Building, Auditorium',
      type: 'seminar',
      date: new Date(2025, 3, 14)
    },
    {
      id: '5',
      title: 'Physiology Lecture: Respiratory System',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Medical Building, Room A104',
      type: 'lecture',
      date: new Date(2025, 3, 15)
    },
    {
      id: '6',
      title: 'Anatomy Lab: Heart Dissection',
      startTime: '13:00',
      endTime: '15:00',
      location: 'Anatomy Lab, Room A001',
      type: 'lab',
      date: new Date(2025, 3, 15)
    },
    {
      id: '7',
      title: 'Midterm Exam: Cardiovascular System',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Examination Hall, Building E',
      type: 'exam',
      date: new Date(2025, 3, 16)
    },
    {
      id: '8',
      title: 'Patient Case Presentation',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Medical Building, Conference Room 3',
      type: 'meeting',
      date: new Date(2025, 3, 16)
    },
    {
      id: '9',
      title: 'Pharmacology Assignment Due',
      startTime: '23:59',
      endTime: '23:59',
      location: 'Online Submission',
      type: 'assignment',
      date: new Date(2025, 3, 17)
    },
    {
      id: '10',
      title: 'Medical Imaging Lecture',
      startTime: '11:00',
      endTime: '12:30',
      location: 'Medical Building, Room B201',
      type: 'lecture',
      date: new Date(2025, 3, 17)
    },
    {
      id: '11',
      title: 'Clinical Skills Practice',
      startTime: '13:30',
      endTime: '15:30',
      location: 'Simulation Lab, Building S',
      type: 'lab',
      date: new Date(2025, 3, 17)
    },
    {
      id: '12',
      title: 'Research Methods Seminar',
      startTime: '15:00',
      endTime: '16:30',
      location: 'Research Center, Room 102',
      type: 'seminar',
      date: new Date(2025, 3, 18)
    }
  ]
};

function Calendar() {
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCalendars, setActiveCalendars] = useState({
    courses: true,
    clinical: true,
    exams: true,
    personal: true
  });
  
  // Filter events based on selection
  const filterEvents = () => {
    if (filter === 'all') return CalendarEvent.events;
    return CalendarEvent.events.filter(event => event.type === filter);
  };
  
  const filteredEvents = filterEvents();
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const handleCalendarToggle = (calendarType) => {
    setActiveCalendars(prev => ({
      ...prev,
      [calendarType]: !prev[calendarType]
    }));
  };

  const handleAddEvent = () => {
    setIsModalOpen(true);
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
            <CalendarView events={filteredEvents} />
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
                
                <button className="calendar-sync-button">
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
                  {CalendarEvent.events
                    .filter(event => event.type === 'assignment' || event.type === 'exam')
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
                <h2 className="calendar-modal-title">Add New Event</h2>
                <button 
                  className="calendar-modal-close" 
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <div className="calendar-modal-content">
                {/* Modal content remains the same */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
