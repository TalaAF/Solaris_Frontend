import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link } from "react-router-dom";

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

// Import mock data instead of API services
import mockCourseData from "../../mocks/courseData";
import mockModuleData from "../../mocks/moduleData";
import mockContentData from "../../mocks/contentData";
import mockQuizData from "../../mocks/quizData";
import mockAssignmentData from "../../mocks/assignmentData";

import "./CourseView.css"; // Component-specific CSS

/**
 * CourseView Component (Container Component)
 * 
 * Using mock data for frontend development
 */
function CourseView() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // Default tab

  // Load mock data with simulated API delay
  useEffect(() => {
    const loadMockData = async () => {
      setLoading(true);
      
      try {
        // Wait a bit to simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set course data from mock
        setCourseData(mockCourseData);
        
        // Set modules data from mock
        setModules(mockModuleData);
        
        // Set first module as active by default
        if (mockModuleData.length > 0) {
          setActiveModule(mockModuleData[0].id);
        }
      } catch (error) {
        console.error("Error loading mock data:", error);
        setError("Failed to load course data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadMockData();
  }, [courseId]);

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

  // Get content data for a specific item
  const getContentForItem = (itemId) => {
    // Find matching content in mock data
    return mockContentData.find(item => item.id === itemId) || null;
  };

  // Get quiz data for a specific item
  const getQuizForItem = (itemId) => {
    // For demo purpose, just return the first quiz if the item is of quiz type
    const item = modules.flatMap(m => m.items).find(i => i.id === itemId);
    if (item?.type === 'quiz') {
      return mockQuizData[0]; // Return first quiz as example
    }
    return null;
  };

  if (loading) {
    return <div className="course-loading">Loading course...</div>;
  }

  if (error) {
    return <div className="course-error">{error}</div>;
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
                  assignments={mockAssignmentData}
                  quizzes={mockQuizData}
                />
              )}
              {activeTab === "resources" && (
                <CourseResources courseData={courseData} />
              )}
              {activeTab === "content" && activeItem && currentModule && (
                <ContentViewer 
                  module={currentModule}
                  itemId={activeItem}
                  onNavigate={handleNavigate}
                  contentData={getContentForItem(activeItem)}
                  quizData={getQuizForItem(activeItem)}
                />
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