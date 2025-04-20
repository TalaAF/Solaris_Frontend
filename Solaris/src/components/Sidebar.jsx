import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/assessments', label: 'Assessments', icon: '📝' },
    { path: '/collaboration', label: 'Collaboration', icon: '💬' },
    { path: '/clinical-skills', label: 'Clinical Skills', icon: '💉' },
    { path: '/progress', label: 'Progress', icon: '📈' },
    { path: '/community', label: 'Community', icon: '👥' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-icon">S</div>
        <div className="logo-text">
          <span className="logo-title">Solaris</span>
          <span className="logo-subtitle">Medical LMS</span>
        </div>
      </div>
      
      <nav className="nav-menu">
        {menuItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="help-section">
        <h3>Need Help?</h3>
        <p>Access our support center or contact technical support.</p>
        <button className="support-button">Get Support →</button>
      </div>
    </div>
  );
};

export default Sidebar;