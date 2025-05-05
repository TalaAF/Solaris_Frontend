<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Layout.css";
=======
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Layout.css';
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2

const Layout = ({ children, currentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
<<<<<<< HEAD
  const [pageType, setPageType] = useState("default");

  // Determine page type from URL path
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/dashboard")) {
      setPageType("dashboard");
    } else if (path.includes("/courses")) {
      setPageType("courses");
    } else if (path.includes("/assessments")) {
      setPageType("assessments");
    } else {
      setPageType("default");
=======
  const [pageType, setPageType] = useState('default');
  
  // Determine page type from URL path
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/dashboard')) {
      setPageType('dashboard');
    } else if (path.includes('/courses')) {
      setPageType('courses');
    } else if (path.includes('/assessments')) {
      setPageType('assessments');
    } else {
      setPageType('default');
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`layout-wrapper page-${pageType}`}>
      <Header />
      <div className="header-spacer"></div>
<<<<<<< HEAD

      <div className="layout-container">
        <Sidebar isOpen={isSidebarOpen} />

        <main
          className={`layout-main ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}
        >
          <div className="content-scrollable">{children || <Outlet />}</div>
        </main>

        <button
          className={`sidebar-toggle-button ${!isSidebarOpen ? "collapsed" : ""}`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
=======
      
      <div className="layout-container">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`layout-main ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
          <div className="content-scrollable">
            {children || <Outlet />}
          </div>
        </main>
        
        <button 
          className={`sidebar-toggle-button ${!isSidebarOpen ? 'collapsed' : ''}`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        </button>
      </div>
    </div>
  );
};

export default Layout;
