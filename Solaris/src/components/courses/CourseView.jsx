import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

// Import our smaller components
import CourseHeader from "./CourseHeader";
import { ModuleList, InstructorCard } from "./CourseSidebar";
import ContentViewer from "./CourseContent/ContentViewer";
import {
  CourseOverview,
  CourseSyllabus,
  CourseAssessments,
  CourseResources,
} from "./CourseTabs";

// Import API services
import CourseService from "../../services/CourseService";
import ContentService from "../../services/ContentService";

// Import mock data as fallbacks if needed
import mockAssignmentData from "../../mocks/assignmentData";
import mockQuizData from "../../mocks/quizData";

import { getCurrentUserId } from '../../utils/userUtils';
import { useAuth } from "../../context/AuthContext";

import "./CourseView.css"; // Component-specific CSS

/**
 * CourseView Component (Container Component)
 * 
 * Now using real API data instead of mocks
 */
function CourseView({ course }) {
  const { courseId } = useParams();
  // Get auth information from context
  const { currentUser, isAuthenticated } = useAuth();
  
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // Default tab
  const [currentContent, setCurrentContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);

  // Load real data from the API
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. Fetch course details
        console.log(`Fetching data for course ID: ${courseId}`);
        const courseResponse = await CourseService.getCourseById(courseId);
        
        if (!courseResponse || !courseResponse.data) {
          throw new Error("Failed to fetch course data");
        }
        
        setCourseData(courseResponse.data);
        
        // 2. Fetch course modules with their content items
        const modulesResponse = await CourseService.getCourseModules(courseId);
        
        if (!modulesResponse || !modulesResponse.data) {
          throw new Error("Failed to fetch course modules");
        }
        
        // Process and sort modules
        const fetchedModules = Array.isArray(modulesResponse.data) 
          ? modulesResponse.data 
          : [];
        
        // Sort modules by order if available
        const sortedModules = fetchedModules.sort((a, b) => 
          (a.order || 0) - (b.order || 0)
        );
        
        console.log("Fetched modules:", sortedModules);
        setModules(sortedModules);
        
        // Set first module as active by default if available
        if (sortedModules.length > 0) {
          setActiveModule(sortedModules[0].id);
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        toast.error("Failed to load course data. Please try again.");
        setError("Failed to load course data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // Fetch content when an item is selected
  useEffect(() => {
    const fetchContentData = async () => {
      if (!activeItem) {
        setCurrentContent(null);
        return;
      }
      
      setContentLoading(true);
      
      try {
        const contentResponse = await ContentService.getContentById(activeItem);
        
        if (contentResponse && contentResponse.data) {
          console.log("Fetched content:", contentResponse.data);
          setCurrentContent(contentResponse.data);
          
          // Check if we have a logged-in user and access their ID
          if (currentUser && isAuthenticated) {
            // Log the user object to see available properties
            console.log("Current authenticated user:", currentUser);
            
            // Get the ID from the user object
            const userId = currentUser.id || 
                          currentUser._id || 
                          currentUser.userId;
            
            if (userId) {
              try {
                await ContentService.markContentAsViewed(activeItem, userId);
                console.log(`Content ${activeItem} marked as viewed by user ${userId}`);
              } catch (viewErr) {
                console.warn("Could not mark content as viewed:", viewErr);
              }
            } else {
              console.warn("User is authenticated but ID not found in user object", currentUser);
            }
          } else {
            console.log("User not authenticated, content view not tracked");
          }
        } else {
          setCurrentContent(null);
          toast.error("Could not load content data");
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        toast.error("Failed to load content");
        setCurrentContent(null);
      } finally {
        setContentLoading(false);
      }
    };
    
    fetchContentData();
  }, [activeItem]);

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // If switching to content tab and no item is selected, select first item of active module
    if (tab === "content" && !activeItem && activeModule) {
      const currentModule = modules.find(module => module.id === activeModule);
      if (currentModule?.items?.length > 0) {
        setActiveItem(currentModule.items[0].id);
      }
    }
  };

  // Handle navigation between items
  const handleNavigate = (direction) => {
    const currentModule = modules.find(module => module.id === activeModule);
    if (!currentModule) return;
    
    const items = currentModule.items;
    const currentIndex = items.findIndex(item => item.id === activeItem);
    
    if (direction === "prev" && currentIndex > 0) {
      setActiveItem(items[currentIndex - 1].id);
    } else if (direction === "next" && currentIndex < items.length - 1) {
      setActiveItem(items[currentIndex + 1].id);
    }
  };

  // Get quiz data for a specific item - still using mock data for now
  const getQuizForItem = (itemId) => {
    // For demo purpose, just return the first quiz if the item is of quiz type
    const item = modules.flatMap(m => m.items).find(i => i.id === itemId);
    if (item?.type === 'quiz') {
      return mockQuizData[0]; // Return first quiz as example
    }
    return null;
  };

  // Add this inside your component, just after the useAuth() call
  useEffect(() => {
    if (currentUser) {
      console.log("Auth context user object structure:", {
        id: currentUser.id,
        _id: currentUser._id,
        userId: currentUser.userId,
        email: currentUser.email,
        hasRoles: !!currentUser.roles,
        rolesType: typeof currentUser.roles,
        fullObject: currentUser
      });
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="course-loading">
        <div className="spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!courseData) {
    return <div className="course-not-found">Course not found</div>;
  }

  const currentModule = modules.find(module => module.id === activeModule);

  return (
    <div className="course-view">
      <div className="course-view-breadcrumb">
        <Link to="/courses">
          <Button 
            variant="outlined" 
            size="small"
            className="back-to-courses-button"
            sx={{
              color: "#0f172a",
              borderColor: "#e2e8f0",
              "&:hover": {
                backgroundColor: "rgba(230, 180, 0, 0.08)",
                borderColor: "#e6b400",
                color: "#e6b400"
              }
            }}
          >
            <ChevronLeftIcon className="chevron-icon" />
            Back to Courses
          </Button>
        </Link>
        <div className="breadcrumb-path">
          / {courseData.code} / {currentModule?.title || "Overview"}
        </div>
      </div>
      
      {/* Course Header with title and description */}
      <CourseHeader courseData={courseData} />
      
      <div className="course-view-container">
        {/* Sidebar with modules and instructor info */}
        <div className="course-view-sidebar">
          <ModuleList 
            modules={modules} 
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            activeItem={activeItem}
            setActiveItem={(itemId) => {
              setActiveItem(itemId);
              // When selecting an item, switch to content tab
              if (itemId) {
                setActiveTab("content");
              }
            }}
          />
          
          <InstructorCard instructor={courseData.instructor} />
        </div>
        
        {/* Main content area */}
        <div className="course-view-content">
          <div className="course-tabs">
            <ul className="tab-list">
              <li 
                className={`tab-item ${activeTab === "overview" ? "active" : ""}`} 
                onClick={() => handleTabClick("overview")}
              >
                Overview
              </li>
              <li 
                className={`tab-item ${activeTab === "syllabus" ? "active" : ""}`} 
                onClick={() => handleTabClick("syllabus")}
              >
                Syllabus
              </li>
              <li 
                className={`tab-item ${activeTab === "content" ? "active" : ""}`} 
                onClick={() => handleTabClick("content")}
              >
                Course Content
              </li>
              <li 
                className={`tab-item ${activeTab === "assessments" ? "active" : ""}`} 
                onClick={() => handleTabClick("assessments")}
              >
                Assessments
              </li>
              <li 
                className={`tab-item ${activeTab === "resources" ? "active" : ""}`} 
                onClick={() => handleTabClick("resources")}
              >
                Resources
              </li>
            </ul>
            
            <div className="tab-content">
              {activeTab === "overview" && (
                <CourseOverview courseData={{
                  ...courseData,
                  modules: modules || [] // Ensure modules is never undefined
                }} />
              )}
              {activeTab === "syllabus" && (
                <CourseSyllabus courseData={{...courseData, modules}} />
              )}
              {activeTab === "assessments" && (
                <CourseAssessments 
                  courseData={courseData} 
                  assignments={mockAssignmentData} // Still using mocks for now
                  quizzes={mockQuizData}
                />
              )}
              {activeTab === "resources" && (
                <CourseResources courseData={courseData} />
              )}
              {activeTab === "content" && activeItem && currentModule && (
                contentLoading ? (
                  <div className="content-loading">
                    <div className="spinner spinner-sm"></div>
                    <p>Loading content...</p>
                  </div>
                ) : (
                  <ContentViewer 
                    module={currentModule}
                    itemId={activeItem}
                    onNavigate={handleNavigate}
                    contentData={currentContent}
                    quizData={getQuizForItem(activeItem)}
                  />
                )
              )}
              {activeTab === "content" && (!activeItem || !currentModule) && (
                <div className="content-select-prompt">
                  <p>Please select a module item from the sidebar to view its content.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseView;