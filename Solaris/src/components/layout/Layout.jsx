import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout-wrapper">
      <Header />
<div className="header-spacer"></div>
      
      <div className="layout-container">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`layout-main ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
          <div className="content-scrollable">
            {children || <Outlet />}
          </div>
        </main>
        
        {/* Place the toggle button after the main content for correct CSS selector targeting */}
        <button className="sidebar-toggle-button" onClick={toggleSidebar}>
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
};

export default Layout;
