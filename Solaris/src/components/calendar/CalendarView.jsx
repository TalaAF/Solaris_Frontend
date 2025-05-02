import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'react-feather';
import './CalendarView.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function CalendarView({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  
  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());
  
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };
  
  // Generate days for week view
  const generateWeekDays = () => {
    const days = [];
    const day = new Date(currentDate);
    
    // Set to the start of the week (Sunday)
    day.setDate(day.getDate() - day.getDay());
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    
    return days;
  };
  
  const weekDays = generateWeekDays();
  
  // Filter events for the week
  const weekEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const startOfWeek = new Date(weekDays[0]);
    const endOfWeek = new Date(weekDays[6]);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });
  
  // Group events by day
  const eventsByDay = weekDays.map(day => {
    return {
      date: day,
      events: weekEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === day.toDateString();
      }).sort((a, b) => a.startTime.localeCompare(b.startTime))
    };
  });
  
  // Get event styling based on type
  const getEventClassName = (type) => {
    const baseClasses = "calendar-event-base";
    
    switch(type) {
      case 'lecture':
        return `${baseClasses} calendar-event-lecture`;
      case 'lab':
        return `${baseClasses} calendar-event-lab`;
      case 'seminar':
        return `${baseClasses} calendar-event-seminar`;
      case 'meeting':
        return `${baseClasses} calendar-event-meeting`;
      case 'exam':
        return `${baseClasses} calendar-event-exam`;
      case 'assignment':
        return `${baseClasses} calendar-event-assignment`;
      default:
        return `${baseClasses} calendar-event-default`;
    }
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  return (
    <Card className="calendar-container">
      <div className="calendar-toolbar">
        <div className="calendar-navigation">
          <button 
            onClick={goToToday}
            className="calendar-today-button"
          >
            Today
          </button>
          <div className="calendar-nav-buttons">
            <button 
              className="calendar-nav-btn"
              onClick={goToPrevious}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="calendar-nav-btn"
              onClick={goToNext}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <h2 className="calendar-date-heading">
            {view === 'month' 
              ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : view === 'week' 
                ? `${MONTHS[weekDays[0].getMonth()]} ${weekDays[0].getDate()} - ${
                    weekDays[6].getMonth() !== weekDays[0].getMonth() ? MONTHS[weekDays[6].getMonth()] + ' ' : ''
                  }${weekDays[6].getDate()}, ${weekDays[6].getFullYear()}`
                : `${MONTHS[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`
            }
          </h2>
        </div>
        
        <div className="calendar-view-selector">
          <button 
            className={`calendar-view-btn ${view === 'month' ? 'calendar-view-btn-active' : ''}`}
            onClick={() => setView('month')}
          >
            Month
          </button>
          <button 
            className={`calendar-view-btn ${view === 'week' ? 'calendar-view-btn-active' : ''}`}
            onClick={() => setView('week')}
          >
            Week
          </button>
          <button 
            className={`calendar-view-btn ${view === 'day' ? 'calendar-view-btn-active' : ''}`}
            onClick={() => setView('day')}
          >
            Day
          </button>
        </div>
      </div>
      
      <div className="calendar-view-transition">
        {view === 'week' && (
          <div className="calendar-grid">
            {/* Day headers */}
            {eventsByDay.map((dayData, index) => (
              <div key={`header-${index}`} className="calendar-day-column">
                <div className={`calendar-day-header ${isToday(dayData.date) ? 'calendar-day-today' : ''}`}>
                  <div className="calendar-day-name">{DAYS[dayData.date.getDay()]}</div>
                  <div className="calendar-day-number">{dayData.date.getDate()}</div>
                </div>
                
                <div className="calendar-day-events">
                  {dayData.events.length > 0 ? (
                    <div className="calendar-events-container">
                      {dayData.events.map(event => (
                        <div 
                          key={event.id} 
                          className={getEventClassName(event.type)}
                        >
                          <div className="calendar-event-title">{event.title}</div>
                          <div className="calendar-event-time">
                            <Clock size={12} className="calendar-event-icon" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          {event.location && (
                            <div className="calendar-event-location">
                              <MapPin size={12} className="calendar-event-icon" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="calendar-no-events">No events</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Month view placeholder - to be implemented */}
        {view === 'month' && (
          <div className="calendar-placeholder">Month view will be implemented soon</div>
        )}
        
        {/* Day view placeholder - to be implemented */}
        {view === 'day' && (
          <div className="calendar-placeholder">Day view will be implemented soon</div>
        )}
      </div>
    </Card>
  );
}

export default CalendarView;