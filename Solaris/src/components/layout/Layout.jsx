import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const [pageType, setPageType] = useState("default");
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

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
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  console.log("Layout rendering with role:", userRole);

  return (
    <div className={`layout-wrapper page-${pageType}`}>
      <Header />
      <div className="header-spacer"></div>

      <div className="layout-container">
        <Sidebar isOpen={isSidebarOpen} userRole={userRole} />

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
        </button>
      </div>
    </div>
  );
};

export default Layout;