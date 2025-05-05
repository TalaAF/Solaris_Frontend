import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link } from "react-router-dom";

// Import API services
import CourseService from "../../services/CourseService";
import ModuleService from "../../services/ModuleService";
import ContentService from "../../services/ContentService";

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

import "./CourseView.css"; // Component-specific CSS

/**
 * CourseView Component (Container Component)
 *
 * This component is responsible for:
 * 1. Fetching course data from the API
 * 2. Fetching module and content data from the API
 * 3. Managing the state of the active module and item
 * 4. Rendering the overall layout with sidebar and content area
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

  // Get current user ID (in a real app, this would come from auth context)
  const currentUserId = 1; // Example user ID

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // Fetch course details from API
        const courseResponse = await CourseService.getCourseById(courseId);
        const course = courseResponse.data;
        // Fetch modules data - in a real app, you would fetch from your module API
        // Since existing ModuleController returns a flat list, we need to fetch and then transform
        try {
          const modulesResponse = await ModuleService.getAllModules();
          const allModules = modulesResponse.data || [];

          // Filter modules for this course and map to frontend structure
          const courseModules = await processModulesData(allModules);
          setModules(courseModules);

          // Set the first module as active by default if available
          if (courseModules.length > 0) {
            setActiveModule(courseModules[0].id);
          }
        } catch (moduleError) {
          console.error("Error fetching modules:", moduleError);
          // Fallback to empty modules array
          setModules([]);
        }

        // Get completion requirements for this course
        const completionResponse =
          await CourseService.getCompletionRequirements(courseId);
        const completionRequirements = completionResponse.data || [];

        // Get course statistics (for progress data)
        const statsResponse = await CourseService.getCourseStatistics(courseId);
        const statistics = statsResponse.data;

        // Transform course data
        const transformedCourse = {
          id: course.id,
          title: course.title,
          code: `CODE${course.id}`, // Generate a code if backend doesn't provide one
          description: course.description,
          instructor: {
            name: course.instructorEmail || "Unknown Instructor",
            avatar: null, // Backend doesn't provide this
            title: "Instructor", // Backend doesn't provide this
          },
          progress: statistics
            ? Math.round(statistics.averageCompletionPercentage)
            : 0,
          completionRequirements: completionRequirements,
        };

        setCourseData(transformedCourse);
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Failed to load course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  /**
   * Process modules data from the backend
   * Fetch content items for each module and map to frontend structure
   */
  const processModulesData = async (modules) => {
    // Filter modules for this course
    const courseModules = modules.filter(
      (module) => module.course && module.course.id == courseId,
    );

    // For each module, fetch its content items
    const modulePromises = courseModules.map(async (module) => {
      try {
        // Fetch content items for this module
        const contentsResponse = await ModuleService.getContentsOrder(
          module.id,
        );
        const contents = contentsResponse.data || [];

        // Map content items to frontend structure
        const items = contents.map((content) => ({
          id: content.id,
          title: content.title,
          type: mapContentTypeToItemType(content.type || content.fileType),
          status: content.status || "not-started",
          duration: formatDuration(
            content.duration || estimateDuration(content),
          ),
        }));

        // Calculate module status based on item statuses
        const moduleStatus = calculateModuleStatus(items);

        // Return transformed module
        return {
          id: module.id,
          title: module.title,
          description: module.description,
          number: module.sequence,
          status: moduleStatus,
          items: items,
        };
      } catch (error) {
        console.error(
          `Error fetching contents for module ${module.id}:`,
          error,
        );
        return {
          id: module.id,
          title: module.title,
          description: module.description,
          number: module.sequence,
          status: "not-started",
          items: [],
        };
      }
    });

    // Wait for all module promises to resolve
    return Promise.all(modulePromises);
  };

  /**
   * Map content type from backend to frontend item type
   */
  const mapContentTypeToItemType = (contentType) => {
    if (!contentType) return "document";

    const type = contentType.toLowerCase();
    if (type.includes("video") || type.includes("mp4")) return "video";
    if (type.includes("quiz")) return "quiz";
    if (type.includes("interactive")) return "interactive";
    return "document";
  };

  /**
   * Estimate duration based on content type and size
   */
  const estimateDuration = (content) => {
    // Default durations based on content type
    if (!content) return 10;

    const type = (content.type || content.fileType || "").toLowerCase();
    if (type.includes("video")) return 15;
    if (type.includes("quiz")) return 10;
    if (type.includes("interactive")) return 20;

    // For documents, estimate based on file size if available
    if (content.fileSize) {
      // Rough estimate: 1 minute per 50KB for text documents
      return Math.max(5, Math.round(content.fileSize / (50 * 1024)));
    }
    return 10; // Default duration
  };

  /**
   * Format duration in minutes
   */
  const formatDuration = (minutes) => {
    if (!minutes) return "10 min";
    return `${minutes} min`;
  };

  /**
   * Calculate module status based on item statuses
   */
  const calculateModuleStatus = (items) => {
    if (!items || items.length === 0) return "not-started";

    const completedCount = items.filter(
      (item) => item.status === "completed",
    ).length;
    const inProgressCount = items.filter(
      (item) => item.status === "in-progress",
    ).length;

    if (completedCount === items.length) return "completed";
    if (completedCount > 0 || inProgressCount > 0) return "in-progress";
    return "not-started";
  };

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // If switching to content tab and no item is selected, select first item of active module
    if (tab === "content" && !activeItem && activeModule) {
      const currentModule = modules.find(
        (module) => module.id === activeModule,
      );
      if (currentModule?.items?.length > 0) {
        setActiveItem(currentModule.items[0].id);
      }
    }
  };

  // Handle navigation between items
  const handleNavigate = (direction) => {
    const currentModule = modules.find((module) => module.id === activeModule);
    if (!currentModule) return;

    const items = currentModule.items;
    const currentIndex = items.findIndex((item) => item.id === activeItem);

    if (direction === "prev" && currentIndex > 0) {
      setActiveItem(items[currentIndex - 1].id);
    } else if (direction === "next" && currentIndex < items.length - 1) {
      setActiveItem(items[currentIndex + 1].id);
    }
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

  const currentModule = modules.find((module) => module.id === activeModule);

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
                color: "#e6b400",
              },
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
                <CourseOverview courseData={{ ...courseData, modules }} />
              )}
              {activeTab === "syllabus" && (
                <CourseSyllabus courseData={{ ...courseData, modules }} />
              )}
              {activeTab === "assessments" && (
                <CourseAssessments courseData={courseData} />
              )}
              {activeTab === "resources" && (
                <CourseResources courseData={courseData} />
              )}
              {activeTab === "content" && activeItem && currentModule && (
                <ContentViewer
                  module={currentModule}
                  itemId={activeItem}
                  onNavigate={handleNavigate}
                />
              )}
              {activeTab === "content" && (!activeItem || !currentModule) && (
                <div className="content-select-prompt">
                  <p>
                    Please select a module item from the sidebar to view its
                    content.
                  </p>
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
