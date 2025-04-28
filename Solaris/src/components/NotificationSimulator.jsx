import React from 'react';
import { useNotifications } from './NotificationContext';
import './NotificationSimulator.css';

// This component can be added to the Dashboard or any other page for testing
const NotificationSimulator = () => {
  const { addNotification } = useNotifications();

  const simulateAcademicNotification = () => {
    addNotification({
      type: 'academic',
      title: 'Midterm Exam Cheat Sheet',
      message: 'The cheat sheet for your Midterm Exam has been changed in SWER354 - ADVANCED WEB TECHNOLOGIES.',
      time: 'Just now',
      course: 'SWER354 - ADVANCED WEB TECHNOLOGIES',
      links: [
        { title: 'View Cheat Sheet', url: '/courses/swer354/resources/cheat-sheet' },
        { title: 'Course Homepage', url: '/courses/swer354' }
      ],
      actionButtons: [
        { label: 'View Changes', primary: true, action: () => window.location.href = '/courses/swer354/resources/cheat-sheet' }
      ]
    });
  };

  const simulateReminderNotification = () => {
    addNotification({
      type: 'reminder',
      title: 'Due: Docker Project Report',
      message: 'The Docker Project Report for SWER354 is due today at 11:59 PM.',
      time: 'Just now',
      course: 'SWER354 - ADVANCED WEB TECHNOLOGIES',
      links: [
        { title: 'Submit Report', url: '/courses/swer354/assignments/docker-project' },
        { title: 'Project Guidelines', url: '/courses/swer354/assignments/guidelines' }
      ],
      actionButtons: [
        { label: 'Submit Now', primary: true, action: () => window.location.href = '/courses/swer354/assignments/docker-project' }
      ]
    });
  };

  const simulateAnnouncementNotification = () => {
    addNotification({
      type: 'announcement',
      title: 'New Content Added',
      message: 'New content has been added to SWER354 - ADVANCED WEB TECHNOLOGIES.',
      time: 'Just now',
      course: 'SWER354 - ADVANCED WEB TECHNOLOGIES',
      links: [
        { title: 'View New Content', url: '/courses/swer354/content' }
      ],
      actionButtons: [
        { label: 'Explore Content', primary: true, action: () => window.location.href = '/courses/swer354/content' }
      ]
    });
  };

  return (
    <div className="notification-simulator">
      <h3>Simulation Tools</h3>
      <p>Click the buttons below to simulate receiving different types of notifications.</p>
      
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