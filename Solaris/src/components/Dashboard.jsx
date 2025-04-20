import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Dashboard.css';

const Dashboard = () => {
  // Get current date
  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const FORMATTED_DATE = today.toLocaleDateString('en-US', options);
  
  // Sample progress data
  const progressData = [
    { subject: 'Anatomy/Physiology', progress: 70 },
    { subject: 'Clinical Pathology', progress: 45 },
    { subject: 'Pharmacology', progress: 60 },
    { subject: 'Medical Ethics', progress: 80 }
  ];
  
  // Sample schedule data
  const scheduleData = [
    {
      id: 1,
      title: 'Cardiovascular System Lecture',
      location: 'Medical Building, Room 1205',
      time: '08:30 - 10:00',
      type: 'schedule-orange'
    },
    {
      id: 2,
      title: 'Clinical Pathology Lab Session',
      location: 'Science Lab Wing, Room 1235',
      time: '11:00 - 13:00',
      type: 'schedule-blue'
    },
    {
      id: 3,
      title: 'Study Group - Pharmacology',
      location: 'Library, Small Room 3',
      time: '14:30 - 16:00',
      type: 'schedule-green'
    },
    {
      id: 4,
      title: 'Medical Ethics Seminar',
      location: 'Medical Building, Auditorium',
      time: '16:30 - 18:00',
      type: 'schedule-pink'
    }
  ];
  
  // Sample deadlines data
  const deadlinesData = [
    {
      id: 1,
      title: 'Cardiovascular System Quiz',
      subject: 'Anatomy and Physiology',
      date: 'Tomorrow, 14:30'
    },
    {
      id: 2,
      title: 'Ethics Case Study Discussion',
      subject: 'Medical Ethics',
      date: '20 Apr'
    },
    {
      id: 3,
      title: 'Lab Report Submission',
      subject: 'Clinical Pathology',
      date: '20 Apr'
    },
    {
      id: 4,
      title: 'Drug Interactions Presentation',
      subject: 'Pharmacology',
      date: '22 Apr'
    },
    {
      id: 5,
      title: 'Midterm Examination',
      subject: 'Anatomy and Physiology',
      date: '25 Apr'
    }
  ];
  
  // Quick access items
  const quickAccessItems = [
    { icon: "📚", title: "Courses", description: "Access your enrolled courses" },
    { icon: "📅", title: "Calendar", description: "View your schedule" },
    { icon: "📝", title: "Assessments", description: "Take quizzes and exams" },
    { icon: "💬", title: "Discussions", description: "Participate in discussions" },
    { icon: "💉", title: "Clinical Skills", description: "Practice simulations" },
    { icon: "👥", title: "Study Groups", description: "Collaborate with peers" }
  ];

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="welcome-section">
          <h2>Good evening, Dr. Johnson</h2>
          <p className="date">Friday, April 19, 2025</p>
          <div className="day-glance">
            <span className="glance-icon">📅</span>
            <span>Your day at a glance</span>
          </div>
          <p>You have 5 upcoming classes and 2 assignments due today.</p>
        </div>
        
        <div className="dashboard-grid">
          {/* Quick Access */}
          <div className="dashboard-card">
            <h3 className="card-title">Quick Access</h3>
            <div className="quick-access-grid">
              {quickAccessItems.map((item, index) => (
                <div key={index} className="quick-access-item">
                  <div className="quick-access-icon">{item.icon}</div>
                  <div className="quick-access-text">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Course Progress */}
          <div className="dashboard-card wide-card">
            <div className="card-header">
              <h3 className="card-title">Course Progress</h3>
              <div className="completion-text">
                Overall Completion: <strong>93%</strong>
              </div>
            </div>
            
            <div className="progress-list">
              {progressData.map(item => (
                <div key={item.subject} className="progress-item">
                  <div className="progress-header">
                    <span>{item.subject}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill progress-${item.progress >= 80 ? 'green' : 
                        item.progress >= 60 ? 'blue' : 
                        item.progress >= 40 ? 'yellow' : 'red'}`} 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Today's Schedule */}
          <div className="dashboard-card wide-card">
            <div className="card-header">
              <h3 className="card-title">Today's Schedule</h3>
              <div className="date-text">Friday, Apr 19</div>
            </div>
            
            <div className="schedule-list">
              {scheduleData.map(item => (
                <div key={item.id} className={`schedule-item ${item.type}`}>
                  <div className="schedule-info">
                    <h4>{item.title}</h4>
                    <div className="schedule-location">{item.location}</div>
                  </div>
                  <div className="schedule-time">
                    <span className="time-icon">⏱️</span> {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Deadlines */}
          <div className="dashboard-card">
            <h3 className="card-title">Upcoming Deadlines</h3>
            
            <div className="deadlines-list">
              {deadlinesData.map(item => (
                <div key={item.id} className="deadline-item">
                  <div className="deadline-indicator">•</div>
                  <div className="deadline-info">
                    <h4>{item.title}</h4>
                    <div className="deadline-subject">{item.subject}</div>
                  </div>
                  <div className="deadline-date">
                    <span className="date-icon">📅</span> {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;