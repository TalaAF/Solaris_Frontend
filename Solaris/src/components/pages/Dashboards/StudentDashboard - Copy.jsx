import React from 'react';
import StatCard from "../../dashboard/StatCard";
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock,
  AlertCircle
} from "lucide-react";
import './StudentDashboard.css';
import { useAuth } from '../../../context/AuthContext';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  
  // Get student name from the authenticated user
  const studentName = currentUser?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || "Student";
  
  // Get current date
  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  
  // Determine time of day for greeting
  const hours = today.getHours();
  let greeting = "Good morning";
  
  if (hours >= 12 && hours < 17) {
    greeting = "Good afternoon";
  } else if (hours >= 17) {
    greeting = "Good evening";
  }

  // Today's schedule data
  const scheduleItems = [
    {
      title: "Cardiovascular System Lecture",
      location: "Medical Building, Room A102",
      time: "08:30 - 10:00",
      color: "orange"
    },
    {
      title: "Clinical Pathology Lab Session",
      location: "Science Lab Wing, Room L205",
      time: "11:00 - 13:00",
      color: "blue"
    },
    {
      title: "Study Group - Pharmacology",
      location: "Library, Study Room 3",
      time: "14:30 - 16:00",
      color: "green"
    },
    {
      title: "Medical Ethics Seminar",
      location: "Medical Building, Auditorium",
      time: "16:30 - 18:00",
      color: "pink"
    }
  ];

  // Upcoming deadlines
  const deadlines = [
    {
      title: "Cardiovascular System Quiz",
      course: "Anatomy and Physiology",
      due: "Tomorrow, 14:30",
      color: "blue"
    },
    {
      title: "Ethics Case Study Discussion",
      course: "Medical Ethics",
      due: "20 Apr",
      color: "blue"
    },
    {
      title: "Lab Report Submission",
      course: "Clinical Pathology",
      due: "20 Apr",
      color: "orange"
    },
    {
      title: "Drug Interactions Presentation",
      course: "Pharmacology",
      due: "22 Apr",
      color: "orange"
    },
    {
      title: "Midterm Examination",
      course: "Anatomy and Physiology",
      due: "25 Apr",
      color: "blue"
    }
  ];

  // Sample progress data
  const progressData = [
    { subject: "Anatomy and Physiology", progress: 75 },
    { subject: "Clinical Pathology", progress: 45 },
    { subject: "Pharmacology", progress: 60 },
    { subject: "Medical Ethics", progress: 0 }
  ];

  return (
    <div className="student-dashboard">
      <div className="student-dashboard-header">
        <div>
          <h1 className="student-title">{greeting}, {studentName}</h1>
          <p className="student-subtitle">{formattedDate}</p>
        </div>
      </div>

      {/* Stats Grid - Similar to Admin/Instructor dashboard */}
      <div className="stats-grid">
        <StatCard
          title="Enrolled Courses"
          value={4}
          icon={<BookOpen size={24} />}
        />
        <StatCard
          title="Today's Classes"
          value={scheduleItems.length}
          icon={<Calendar size={24} />}
        />
        <StatCard
          title="Upcoming Deadlines"
          value={deadlines.length}
          icon={<AlertCircle size={24} />}
          trend={{ value: 2, positive: false }}
        />
        <StatCard
          title="Average Progress"
          value={`${Math.round(progressData.reduce((acc, course) => acc + course.progress, 0) / progressData.length)}%`}
          icon={<CheckCircle size={24} />}
          trend={{ value: 5, positive: true }}
        />
      </div>

      {/* Dashboard content grid - Similar to Instructor dashboard */}
      <div className="dashboard-content-grid">
        {/* Today's Schedule Section */}
        <div className="dashboard-card schedule-section">
          <div className="dashboard-card-header">
            <h2>Today's Schedule</h2>
            <button className="view-all-button">View Calendar</button>
          </div>
          <div className="dashboard-card-content">
            <div className="schedule-list">
              {scheduleItems.map((item, index) => (
                <div key={index} className="schedule-item">
                  <div className={`color-indicator ${item.color}`}></div>
                  <div className="schedule-details">
                    <h3 className="schedule-title">{item.title}</h3>
                    <p className="schedule-location">{item.location}</p>
                  </div>
                  <div className="schedule-time">
                    <Clock size={14} />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="dashboard-card deadlines-section">
          <div className="dashboard-card-header">
            <h2>Upcoming Deadlines</h2>
            <button className="view-all-button">View All</button>
          </div>
          <div className="dashboard-card-content">
            <div className="deadline-list">
              {deadlines.slice(0, 4).map((deadline, index) => (
                <div key={index} className="deadline-item">
                  <div className={`deadline-priority ${deadline.color}`}></div>
                  <div className="deadline-details">
                    <h3 className="deadline-title">{deadline.title}</h3>
                    <p className="deadline-course">{deadline.course}</p>
                  </div>
                  <div className="deadline-due">
                    <span>{deadline.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="dashboard-card-header">
          <h2>Course Progress</h2>
        </div>
        <div className="progress-grid">
          {progressData.map((course, index) => (
            <div key={index} className="course-progress-card">
              <h3>{course.subject}</h3>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="progress-info">

                <span className="progress-status">
                  {course.progress < 30 ? 'Just Started' : 
                   course.progress < 70 ? 'In Progress' : 'Almost Complete'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="quick-links-section">
        <h2>Quick Links</h2>
        <div className="quick-links-grid">
          <button className="quick-link-btn">
            <BookOpen size={24} />
            <span>My Courses</span>
          </button>
          <button className="quick-link-btn">
            <AlertCircle size={24} />
            <span>Assessments</span>
          </button>
          <button className="quick-link-btn">
            <Calendar size={24} />
            <span>Calendar</span>
          </button>
          <button className="quick-link-btn">
            <CheckCircle size={24} />
            <span>Grades</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;