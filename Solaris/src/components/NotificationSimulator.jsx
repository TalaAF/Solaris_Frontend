import React from "react";
import { useNotifications } from "./NotificationContext";
import "./NotificationSimulator.css";

// Note: In a real application, you would likely implement this differently or not at all
// This component is just for demonstration/testing purposes
const NotificationSimulator = () => {
  const { fetchNotifications } = useNotifications();

  // These simulations don't directly create notifications - 
  // they would trigger backend events that create notifications,
  // which we then fetch from the server.
  
  const simulateAcademicNotification = () => {
    // In a real app, you might have an admin API to simulate events
    // For demonstration, we'll just refresh notifications after a delay
    // to simulate a new notification appearing after a server event
    setTimeout(() => {
      fetchNotifications();
    }, 1000);
  };

  const simulateReminderNotification = () => {
    setTimeout(() => {
      fetchNotifications();
    }, 1000);
  };

  const simulateAnnouncementNotification = () => {
    setTimeout(() => {
      fetchNotifications();
    }, 1000);
  };

  return (
    <div className="notification-simulator">
      <h3>Simulation Tools</h3>
      <p>
        The buttons below would typically trigger backend events that create notifications.
        In this demo, we'll just refresh the notification list to simulate new events.
      </p>

      <div className="simulator-buttons">
        <button
          className="simulator-button academic-button"
          onClick={simulateAcademicNotification}
        >
          Simulate Midterm Cheat Sheet Change
        </button>

        <button
          className="simulator-button reminder-button"
          onClick={simulateReminderNotification}
        >
          Simulate Project Due Reminder
        </button>

        <button
          className="simulator-button announcement-button"
          onClick={simulateAnnouncementNotification}
        >
          Simulate New Content Added
        </button>
      </div>
    </div>
  );
};

export default NotificationSimulator;