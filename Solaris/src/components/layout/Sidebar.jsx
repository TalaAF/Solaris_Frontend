import React from "react";
import { NavLink } from "react-router-dom";
import { List } from "@mui/material";
import {
  Home,
  Book,
  Calendar,
  FileText,
  MessageSquare,
  Stethoscope,
  BarChart2,
  Users,
  Headset,
  LayoutDashboard,
  Building2,
  BookOpen,
  FolderOpen,
  Award,
  ShieldCheck,
  Settings,
  Presentation,
  Clipboard,
  GraduationCap,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen }) => {
  // Get user role from auth context
  const { currentUser,logout  } = useAuth();
  const getUserRole = () => {
    if (!currentUser) return "student";

    // When roles is an array of objects with a name property (from backend)
    if (Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
      // Extract the name property and convert to lowercase for comparison
      return currentUser.roles[0].name?.toLowerCase() || "student";
    }

    // Fallback if role is directly on the user object
    if (currentUser.role) {
      return currentUser.role.toLowerCase();
    }

    return "student"; // Default fallback
  };

   const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login page or homepage after logout
      // If you're using useNavigate from react-router-dom you would add that here
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };
  const userRole = getUserRole();

  // Add debug logging to verify the role detection
  console.log("Sidebar detected user role:", userRole);

  // Define navigation items for different roles
  const navigationConfig = {
    student: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <Home size={20} />,
        iconClass: "icon-home",
      },
      {
        name: "Courses",
        path: "/courses",
        icon: <Book size={20} />,
        iconClass: "icon-book",
      },
      {
        name: "Calendar",
        path: "/calendar",
        icon: <Calendar size={20} />,
        iconClass: "icon-calendar",
      },
      {
        name: "VR Lab",
        path: "/vr-lab",
        icon: <Headset size={20} />,
        iconClass: "icon-vr",
      },
      {
        name: "Messages",
        path: "/messages",
        icon: <MessageSquare size={20} />,
        iconClass: "icon-message-square",
      },
      {
        name: "Clinical Skills",
        path: "/clinical-skills",
        icon: <Stethoscope size={20} />,
        iconClass: "icon-stethoscope",
      },
      {
        name: "Progress",
        path: "/progress",
        icon: <BarChart2 size={20} />,
        iconClass: "icon-bar-chart-2",
      },
      {
        name: "Community",
        path: "/community",
        icon: <Users size={20} />,
        iconClass: "icon-users",
      },
    ],

    admin: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <LayoutDashboard size={20} />,
        iconClass: "icon-dashboard",
      },
      {
        name: "User Management",
        path: "/admin/users",
        icon: <Users size={20} />,
        iconClass: "icon-users",
      },
      {
        name: "Department Management",
        path: "/admin/departments",
        icon: <Building2 size={20} />,
        iconClass: "icon-building",
      },
      {
        name: "Course Management",
        path: "/admin/courses",
        icon: <BookOpen size={20} />,
        iconClass: "icon-book-open",
       },
      // {
      //   name: "Content Management",
      //   path: "/admin/content",
      //   icon: <FolderOpen size={20} />,
      //   iconClass: "icon-folder",
      // },
      // {
      //   name: "Assessment Management",
      //   path: "/admin/assessments",
      //   icon: <FileText size={20} />,
      //   iconClass: "icon-file",
      // },
      {
        name: "Certificate Management",
        path: "/admin/certificates",
        icon: <Award size={20} />,
        iconClass: "icon-award",
      },
      {
        name: "Security Management",
        path: "/admin/security",
        icon: <ShieldCheck size={20} />,
        iconClass: "icon-shield",
      },
      {
        name: "Settings",
        path: "/admin/settings",
        icon: <Settings size={20} />,
        iconClass: "icon-settings",
      },
    ],

    instructor: [
      {
        name: "Dashboard",
        path: "/instructor/dashboard",
        icon: <LayoutDashboard size={20} />,
        iconClass: "icon-dashboard",
      },
      {
        name: "My Courses",
        path: "/instructor/courses",
        icon: <BookOpen size={20} />,
        iconClass: "icon-book-open",
      },
      {
        name: "Content Library",
        path: "/instructor/content",
        icon: <FolderOpen size={20} />,
        iconClass: "icon-folder",
      },
      {
        name: "Student Progress",
        path: "/instructor/student-progress",
        icon: <BarChart2 size={20} />,
        iconClass: "icon-chart",
      },
      {
        name: "Assessments",
        path: "/instructor/assessments",
        icon: <Clipboard size={20} />,
        iconClass: "icon-clipboard",
      },
      {
        name: "Calendar",
        path: "/instructor/calendar",
        icon: <Calendar size={20} />,
        iconClass: "icon-calendar",
      },
      {
        name: "Lectures",
        path: "/instructor/lectures",
        icon: <Presentation size={20} />,
        iconClass: "icon-presentation",
      },
      {
        name: "Student Management",
        path: "/instructor/students",
        icon: <GraduationCap size={20} />,
        iconClass: "icon-graduation",
      },
      {
        name: "Messages",
        path: "/instructor/messages",
        icon: <MessageSquare size={20} />,
        iconClass: "icon-message",
      },
    ],
  };

  // Get navigation items based on user role
  const navigationItems = navigationConfig[userRole] || navigationConfig.student;

  // Check if the current user is an admin
  const isAdmin = userRole === "admin";

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <List className="nav-menu">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <div className={`nav-icon ${item.iconClass}`}>
              {item.icon}
            </div>
            <span className="nav-label">{item.name}</span>
          </NavLink>
        ))}
      </List>

 <div className="logout-container">
      <button 
        className="nav-item logout-button" 
        onClick={handleLogout}
      >
        <div className="nav-icon icon-logout">
          <LogOut size={20} />
        </div>
        <span className="nav-label">Logout</span>
      </button>
    </div>
      {/* Show help section only if not admin and sidebar is open */}
      {isOpen && !isAdmin && (
        <div className="help-section">
          <h3>Need Help?</h3>
          <p>Access our support center or contact technical support.</p>
          <button className="support-button">Get Support →</button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;