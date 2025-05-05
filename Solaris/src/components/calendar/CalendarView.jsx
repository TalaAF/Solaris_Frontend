import React, { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
} from "react-feather";
import "./CalendarView.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Time slots for day view
const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

function CalendarView({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // Set default to month view
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentDate, view]);

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === "week") {
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
  const weekEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const startOfWeek = new Date(weekDays[0]);
    const endOfWeek = new Date(weekDays[6]);
    endOfWeek.setHours(23, 59, 59, 999);

    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });

  // Filter events for specific day (for day view)
  const dayEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === currentDate.toDateString();
    })
    .sort((a, b) => {
      // Sort by start time
      return a.startTime.localeCompare(b.startTime);
    });

  // Group events by day for week view
  const eventsByDay = weekDays.map((day) => {
    return {
      date: day,
      events: weekEvents
        .filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === day.toDateString();
        })
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    };
  });

  // Function to convert 24h time to 12h time format
  const formatTime = (time24) => {
    const [hour, minute] = time24.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Get event styling based on type
  const getEventClassName = (type) => {
    const baseClasses = "calendar-event-base";

    switch (type) {
      case "lecture":
        return `${baseClasses} calendar-event-lecture`;
      case "lab":
        return `${baseClasses} calendar-event-lab`;
      case "seminar":
        return `${baseClasses} calendar-event-seminar`;
      case "meeting":
        return `${baseClasses} calendar-event-meeting`;
      case "exam":
        return `${baseClasses} calendar-event-exam`;
      case "assignment":
        return `${baseClasses} calendar-event-assignment`;
      default:
        return `${baseClasses} calendar-event-default`;
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Generate month calendar grid - OPTIMIZED IMPLEMENTATION
  const generateMonthCalendar = () => {
    // Get the first day of the month
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const daysInMonth = lastDay.getDate();

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startDay = firstDay.getDay();

    // Create array of days in the month
    const days = [];

    // Add previous month's days
    const prevMonthDays = startDay;
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0,
    );
    const prevMonthLastDay = prevMonth.getDate();

    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const dayNumber = prevMonthLastDay - i;
      const dayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        dayNumber,
      );
      days.push({
        day: dayNumber,
        isCurrentMonth: false,
        date: dayDate,
        events: getEventsForDate(dayDate),
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i,
      );
      days.push({
        day: i,
        isCurrentMonth: true,
        date: dayDate,
        events: getEventsForDate(dayDate),
      });
    }

    // Add next month's days to complete the grid (maximum 6 rows of 7 days = 42 cells)
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - days.length;

    for (let i = 1; i <= nextMonthDays; i++) {
      const dayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        i,
      );
      days.push({
        day: i,
        isCurrentMonth: false,
        date: dayDate,
        events: getEventsForDate(dayDate),
      });
    }

    // Split into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  // Get events for a specific date (used in month view)
  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Get event dot color based on event type
  const getEventDotColor = (type) => {
    switch (type) {
      case "lecture":
        return "#ed8936";
      case "lab":
        return "#4299e1";
      case "seminar":
        return "#805ad5";
      case "meeting":
        return "#38b2ac";
      case "exam":
        return "#e53e3e";
      case "assignment":
        return "#dd6b20";
      default:
        return "#718096";
    }
  };

  // Generate time blocks for day view
  const generateDayTimeBlocks = () => {
    return TIME_SLOTS.map((timeSlot, index) => {
      return {
        time: timeSlot,
        events: dayEvents.filter((event) => {
          // Check if event falls within this time slot
          const hour = parseInt(timeSlot.split(":")[0]);
          const isPM = timeSlot.includes("PM");
          let timeHour = isPM && hour !== 12 ? hour + 12 : hour;
          if (!isPM && hour === 12) timeHour = 0;

          const eventStartHour = parseInt(event.startTime.split(":")[0]);
          const eventEndHour = parseInt(event.endTime.split(":")[0]);

          return eventStartHour <= timeHour && eventEndHour >= timeHour;
        }),
      };
    });
  };

  // Improved function to parse time strings
  const parseTimeString = (timeStr) => {
    if (!timeStr) return { hour: 0, minute: 0 };

    let hour = 0;
    let minute = 0;

    // Handle formats like "14:30" or "2:30 PM"
    if (timeStr.includes(":")) {
      const isPM = timeStr.toLowerCase().includes("pm");
      const isAM = timeStr.toLowerCase().includes("am");
      const timeParts = timeStr.replace(/\s?(am|pm)/i, "").split(":");

      hour = parseInt(timeParts[0], 10);
      minute = parseInt(timeParts[1], 10);

      // Convert to 24-hour format if needed
      if (isPM && hour < 12) hour += 12;
      if (isAM && hour === 12) hour = 0;
    }

    return { hour, minute };
  };

  // Simplified version of parseTimeSlot that returns time components
  const parseTimeSlot = (timeSlot) => {
    const [hourStr, minuteStr] = timeSlot.split(":");
    let hour = parseInt(hourStr);
    const isPM = timeSlot.includes("PM");
    const minutes = minuteStr ? parseInt(minuteStr) : 0;

    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    return [hour, minutes];
  };

  // Check if an event occurs within a given time slot
  const eventOccursDuringTimeSlot = (event, slotTime) => {
    const eventStart = parseTimeString(event.startTime);
    const eventEnd = parseTimeString(event.endTime);
    const slot = parseTimeString(slotTime);

    // Convert everything to minutes since midnight for easier comparison
    const eventStartMinutes = eventStart.hour * 60 + eventStart.minute;
    const eventEndMinutes = eventEnd.hour * 60 + eventEnd.minute;
    const slotStartMinutes = slot.hour * 60 + slot.minute;
    const slotEndMinutes = slotStartMinutes + 59; // End of the hour

    // Check if the event overlaps with this time slot
    return (
      (eventStartMinutes <= slotStartMinutes &&
        eventEndMinutes > slotStartMinutes) || // Event starts before and ends during/after slot
      (eventStartMinutes >= slotStartMinutes &&
        eventStartMinutes < slotEndMinutes) // Event starts during slot
    );
  };

  // Function to get current time position for the indicator
  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Calculate percentage through the hour
    const percentageOfHour = (currentMinute / 60) * 100;
    return { hour: currentHour, percentage: percentageOfHour };
  };

  // Check if current time is in a given time slot
  const isCurrentTimeInSlot = (timeSlot) => {
    const now = new Date();
    const currentHour = now.getHours();
    const [slotHour, slotMinutes] = parseTimeSlot(timeSlot);

    return currentHour === slotHour;
  };

  // Format date for day view header
  const formatDayViewDate = (date) => {
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <Card className="calendar-container">
      <div className="calendar-toolbar">
        <div className="calendar-navigation">
          <button onClick={goToToday} className="calendar-today-button">
            Today
          </button>
          <div className="calendar-nav-buttons">
            <button
              className="calendar-nav-btn"
              onClick={goToPrevious}
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="calendar-nav-btn"
              onClick={goToNext}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <h2 className="calendar-date-heading">
            {view === "month"
              ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : view === "week"
                ? `${MONTHS[weekDays[0].getMonth()]} ${weekDays[0].getDate()} - ${
                    weekDays[6].getMonth() !== weekDays[0].getMonth()
                      ? MONTHS[weekDays[6].getMonth()] + " "
                      : ""
                  }${weekDays[6].getDate()}, ${weekDays[6].getFullYear()}`
                : `${MONTHS[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
          </h2>
        </div>

        <div className="calendar-view-selector">
          <button
            className={`calendar-view-btn ${view === "month" ? "calendar-view-btn-active" : ""}`}
            onClick={() => setView("month")}
          >
            Month
          </button>
          <button
            className={`calendar-view-btn ${view === "week" ? "calendar-view-btn-active" : ""}`}
            onClick={() => setView("week")}
          >
            Week
          </button>
          <button
            className={`calendar-view-btn ${view === "day" ? "calendar-view-btn-active" : ""}`}
            onClick={() => setView("day")}
          >
            Day
          </button>
        </div>
      </div>

      <div
        className={`calendar-view-transition ${isLoading ? "calendar-loading" : ""}`}
      >
        {/* Month View */}
        {view === "month" && !isLoading && (
          <div className="calendar-month-view">
            <div className="calendar-month-header">
              {DAYS.map((day, index) => (
                <div
                  key={`month-header-${index}`}
                  className="calendar-month-weekday"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-month-grid">
              {generateMonthCalendar().map((week, weekIndex) => (
                <div key={`week-${weekIndex}`} className="calendar-month-week">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`day-${weekIndex}-${dayIndex}`}
                      className={`calendar-month-day ${!day.isCurrentMonth ? "calendar-month-day-inactive" : ""} ${isToday(day.date) ? "calendar-day-today" : ""}`}
                      onClick={() => {
                        setCurrentDate(day.date);
                        setView("day");
                      }}
                    >
                      <div className="calendar-month-day-number">{day.day}</div>
                      <div className="calendar-month-day-events">
                        {day.events.slice(0, 3).map((event, idx) => (
                          <div
                            key={`month-event-${event.id}-${idx}`}
                            className="calendar-month-event"
                            style={{
                              borderLeftColor: getEventDotColor(event.type),
                            }}
                            title={event.title}
                          >
                            <div className="calendar-month-event-time">
                              {formatTime(event.startTime)}
                            </div>
                            <div className="calendar-month-event-title">
                              {event.title.length > 18
                                ? event.title.substring(0, 18) + "..."
                                : event.title}
                            </div>
                          </div>
                        ))}
                        {day.events.length > 3 && (
                          <div className="calendar-month-more-events">
                            +{day.events.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Week View */}
        {view === "week" && !isLoading && (
          <div className="calendar-grid">
            {eventsByDay.map((dayData, index) => (
              <div key={`day-column-${index}`} className="calendar-day-column">
                <div
                  className={`calendar-day-header ${isToday(dayData.date) ? "calendar-day-today" : ""}`}
                >
                  <div className="calendar-day-name">
                    {DAYS[dayData.date.getDay()]}
                  </div>
                  <div className="calendar-day-number">
                    {dayData.date.getDate()}
                  </div>
                </div>

                <div className="calendar-day-events">
                  {dayData.events.length > 0 ? (
                    <div className="calendar-events-container">
                      {dayData.events.map((event) => (
                        <div
                          key={`week-event-${event.id}`}
                          className={getEventClassName(event.type)}
                        >
                          <div className="calendar-event-title">
                            {event.title}
                          </div>
                          <div className="calendar-event-time">
                            <Clock size={12} className="calendar-event-icon" />
                            <span>
                              {formatTime(event.startTime)} -{" "}
                              {formatTime(event.endTime)}
                            </span>
                          </div>
                          {event.location && (
                            <div className="calendar-event-location">
                              <MapPin
                                size={12}
                                className="calendar-event-icon"
                              />
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

        {/* Day View - Combined approach from both implementations */}
        {view === "day" && !isLoading && (
          <div className="calendar-day-view">
            {/* Day view header - taking the more detailed one */}
            <div className={`calendar-day-view-header ${isToday(currentDate) ? "calendar-day-today" : ""}`}>
              <div className="calendar-day-view-title">
                <div className="calendar-day-view-weekday">{DAYS[currentDate.getDay()]}</div>
                <div className="calendar-day-view-date">{formatDayViewDate(currentDate)}</div>
              </div>
            </div>
            
            {/* All-day events section */}
            <div className="calendar-all-day-section">
              <div className="calendar-all-day-label">All day</div>
              <div className="calendar-all-day-events">
                {dayEvents
                  .filter((event) => event.allDay)
                  .map((event) => (
                    <div
                      key={`all-day-event-${event.id}`}
                      className="calendar-all-day-event"
                      style={{ borderLeftColor: getEventDotColor(event.type) }}
                    >
                      {event.title}
                    </div>
                  ))}
                {dayEvents.filter((event) => event.allDay).length === 0 && (
                  <div className="calendar-all-day-empty">
                    No all-day events
                  </div>
                )}
              </div>
            </div>

            <div className="calendar-day-view-content">
              {TIME_SLOTS.map((timeSlot, index) => {
                // Find events that occur during this time slot
                const eventsInTimeSlot = dayEvents.filter(
                  (event) =>
                    !event.allDay && eventOccursDuringTimeSlot(event, timeSlot),
                );

                // Determine if current time is in this slot
                const currentTime = getCurrentTimePosition();
                const slotHour = parseTimeString(timeSlot).hour;
                const isCurrentTimeInSlot = currentTime.hour === slotHour;

                return (
                  <div key={`time-${index}`} className="calendar-time-block">
                    <div className="calendar-time-block-label">{timeSlot}</div>
                    <div className="calendar-time-block-content">
                      {isCurrentTimeInSlot && (
                        <div
                          className="calendar-current-time-indicator"
                          style={{ top: `${currentTime.percentage}%` }}
                        ></div>
                      )}

                      {eventsInTimeSlot.length > 0 ? (
                        eventsInTimeSlot.map((event) => (
                          <div
                            key={`day-event-${event.id}`}
                            className={getEventClassName(event.type)}
                            style={{ borderLeftColor: getEventDotColor(event.type) }}
                          >
                            <div className="calendar-event-title">
                              {event.title}
                            </div>
                            <div className="calendar-event-time">
                              <Clock
                                size={12}
                                className="calendar-event-icon"
                              />
                              <span>
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </span>
                            </div>
                            {event.location && (
                              <div className="calendar-event-location">
                                <MapPin
                                  size={12}
                                  className="calendar-event-icon"
                                />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="calendar-time-block-empty"></div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Only show empty state when there are no events for the day */}
              {dayEvents.filter(event => !event.allDay).length === 0 && (
                <div className="calendar-day-no-events">
                  <div className="calendar-empty-state">
                    <CalendarIcon size={48} className="calendar-empty-icon" />
                    <p className="calendar-empty-text">
                      No events scheduled for this day
                    </p>
                    <p className="calendar-empty-subtext">
                      Click the "Add Event" button to create a new event
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="calendar-loading-indicator">
            <div className="calendar-spinner"></div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default CalendarView;