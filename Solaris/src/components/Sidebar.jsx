import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '⬜' },
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/assessments', label: 'Assessments', icon: '📝' },
    { path: '/collaboration', label: 'Collaboration', icon: '👥' },
    { path: '/clinical-skills', label: 'Clinical Skills', icon: '💉' },
    { path: '/progress', label: 'Progress', icon: '📊' },
    { path: '/community', label: 'Community', icon: '🌐' },
  ];

  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo">
          <div className="logo-icon">S</div>
          <span>Solaris</span>
        </div>
      </div>
      
      <div className="nav-menu">
        {menuItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="need-help">
        <div className="help-card">
          <h4>Need Help?</h4>
          <p>Access our support center or contact technical support.</p>
          <button className="support-btn">Get Support →</button>
        </div>
      </div>
      
      <div className="logout">
        <span className="logout-icon">⬅️</span>
        <span>Log out</span>
      </div>
    </div>
  );
};

export default Sidebar;
