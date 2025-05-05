import React from 'react';
import './Dashboard.css';
import WelcomeSection from './WelcomeSection';
import QuickAccessSection from './QuickAccessSection';
import ScheduleSection from './ScheduleSection';
import ProgressSection from './ProgressSection';
import DeadlinesSection from './DeadlinesSection';

const Dashboard = () => {
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

  // Quick access items
  const quickAccessItems = [
    { 
      icon: "📚", 
      title: "Courses", 
      description: "Access your enrolled courses" 
    },
    { 
      icon: "📝", 
      title: "Assessments", 
      description: "Take quizzes and exams" 
    },
    { 
      icon: "📅", 
      title: "Calendar", 
      description: "View your schedule" 
    },
    { 
      icon: "💬", 
      title: "Discussions", 
      description: "Join course discussions" 
    },
    { 
      icon: "💉", 
      title: "Clinical Skills", 
      description: "Practice simulations" 
    },
    { 
      icon: "👥", 
      title: "Study Groups", 
      description: "Collaborate with peers" 
    }
  ];

  // Sample progress data
  const progressData = [
    { subject: "Anatomy and Physiology", progress: 75 },
    { subject: "Clinical Pathology", progress: 45 },
    { subject: "Pharmacology", progress: 60 },
    { subject: "Medical Ethics", progress: 30 }
  ];

  return (
    <div className="main-content">
      {/* Welcome Section - Full width */}
      <WelcomeSection />
      
      <div className="content-grid">
        {/* Left column - Wider (65%) */}
        <div className="content-column left-column">
          {/* Quick Access */}
          <QuickAccessSection quickAccessItems={quickAccessItems} />
          
          {/* Today's Schedule */}
          <ScheduleSection scheduleItems={scheduleItems} />
        </div>
        
        {/* Right column - Narrower (35%) */}
        <div className="content-column right-column">
          {/* Course Progress */}
          <ProgressSection progressData={progressData} />
          
          {/* Upcoming Deadlines */}
          <DeadlinesSection deadlines={deadlines} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;