import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  BarChart2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell
} from "lucide-react";
import "./InstructorLayout.css";

const InstructorLayout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { path: "/instructor/dashboard", label: "Dashboard", icon: <BarChart2 size={20} /> },
    { path: "/instructor/courses", label: "My Courses", icon: <BookOpen size={20} /> },
    { path: "/instructor/students", label: "Students", icon: <Users size={20} /> },
    { path: "/instructor/assessments", label: "Assessments", icon: <FileText size={20} /> },
    { path: "/instructor/calendar", label: "Calendar", icon: <Calendar size={20} /> },
    { path: "/instructor/messages", label: "Messages", icon: <MessageSquare size={20} /> },
    { path: "/instructor/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="instructor-layout light-theme">
      <header className="instructor-header">
        <div className="header-left">
          <div className="logo">Solaris</div>
        </div>
        <div className="header-right">
          <div className="notifications">
            <div className="notification-icon">
              <Bell size={20} />
              <span className="notification-badge">2</span>
            </div>
          </div>
          <div className="user-profile">
            <div className="profile-circle">S</div>
          </div>
        </div>
      </header>

      <aside className={`instructor-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-content">
          <nav className="instructor-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {isSidebarOpen && <span className="nav-label">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {isSidebarOpen && (
            <div className="instructor-profile">
              <div className="profile-avatar">
                <img src="/avatar-placeholder.png" alt="Instructor" />
              </div>
              <div className="profile-info">
                <p className="profile-name">instructor@medilearn.com</p>
              </div>
              <button className="sign-out-btn">Sign out</button>
            </div>
          )}
        </div>
      </aside>
      
      <button 
        className={`sidebar-toggle-button ${!isSidebarOpen ? "closed" : ""}`} 
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      
      <main className={`instructor-main ${!isSidebarOpen ? "expanded" : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default InstructorLayout;