import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';

// Import API service
import CourseService from '../services/CourseService';

// Import our smaller components
import CourseHeader from './CourseHeader';
import { ModuleList, InstructorCard } from './CourseSidebar';
import ContentViewer from './CourseContent/ContentViewer';
import { 
  CourseOverview, 
  CourseSyllabus, 
  CourseAssessments, 
  CourseResources 
} from './CourseTabs';

import './CourseView.css'; // Component-specific CSS

/**
 * CourseView Component (Container Component)
 * 
 * This component is responsible for:
 * 1. Fetching course data from the API
 * 2. Managing the state of the active module and item
 * 3. Rendering the overall layout with sidebar and content area
 */
function CourseView() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // Default tab

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // Fetch course details from API
        const response = await CourseService.getCourseById(courseId);
        
        // Transform the backend data to match the frontend structure
        const backendCourse = response.data;
        
        // Get completion requirements for this course
        const completionResponse = await CourseService.getCompletionRequirements(courseId);
        const completionRequirements = completionResponse.data || [];
        
        // Get course statistics (for progress data)
        const statsResponse = await CourseService.getCourseStatistics(courseId);
        const statistics = statsResponse.data;
        
        // Map backend data to frontend structure
        const courseData = transformCourseData(backendCourse, completionRequirements, statistics);
        
        setCourseData(courseData);
        
        // Set the first module as active by default
        if (courseData.modules && courseData.modules.length > 0) {
          setActiveModule(courseData.modules[0].id);
        }
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Transform backend data to frontend structure
  const transformCourseData = (backendCourse, completionRequirements, statistics) => {
    // Map instructor data
    const instructor = {
      name: backendCourse.instructorEmail || 'Unknown Instructor',
      avatar: null, // Backend doesn't provide this
      title: 'Instructor' // Backend doesn't provide this
    };
    
    // Currently, our backend doesn't provide modules directly
    // In a real implementation, you would need additional API endpoints for this
    // For now, we'll create mock modules based on the course data
    
    const mockModules = [
      {
        id: 1,
        title: 'Introduction to ' + backendCourse.title,
        status: 'completed',
        items: [
          { id: 1, title: 'Course Overview', type: 'document', status: 'completed', duration: '10 min' },
          { id: 2, title: 'Key Concepts', type: 'video', status: 'completed', duration: '15 min' },
          { id: 3, title: 'Quiz: Introduction', type: 'quiz', status: 'completed', duration: '10 min' }
        ]
      },
      {
        id: 2,
        title: 'Core Content',
        status: 'in-progress',
        items: [
          { id: 4, title: 'Main Topic 1', type: 'video', status: 'completed', duration: '20 min' },
          { id: 5, title: 'Main Topic 2', type: 'document', status: 'in-progress', duration: '25 min' },
          { id: 6, title: 'Assessment', type: 'quiz', status: 'not-started', duration: '15 min' }
        ]
      }
    ];
    
    // Mock resources data
    const resources = [
      {
        id: 1,
        title: 'Course Textbook',
        type: 'book',
        url: '#'
      },
      {
        id: 2,
        title: 'Supplementary Materials',
        type: 'document',
        url: '#'
      },
      {
        id: 3,
        title: 'Interactive Diagrams',
        type: 'interactive',
        url: '#'
      }
    ];
    
    // Mock assessments data
    const assessments = [
      {
        id: 1,
        title: 'Midterm Exam',
        type: 'exam',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Weekly Quiz',
        type: 'quiz',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        status: 'pending'
      }
    ];
    
    // Calculate progress based on statistics if available
    const progress = statistics && statistics.averageCompletionPercentage 
      ? Math.round(statistics.averageCompletionPercentage) 
      : (backendCourse.progress || 0);
    
    // Form the transformed course data
    return {
      id: backendCourse.id,
      title: backendCourse.title,
      code: `CODE${backendCourse.id}`, // Generate a code if backend doesn't provide one
      description: backendCourse.description,
      instructor: instructor,
      progress: progress,
      modules: mockModules, // In a real implementation, this would come from an API
      resources: resources, // In a real implementation, this would come from an API
      assessments: assessments, // In a real implementation, this would come from an API
      completionRequirements: completionRequirements
    };
  };

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // If switching to content tab and no item is selected, select first item of active module
    if (tab === 'content' && !activeItem && activeModule) {
      const currentModule = courseData.modules.find(module => module.id === activeModule);
      if (currentModule?.items?.length > 0) {
        setActiveItem(currentModule.items[0].id);
      }
    }
  };

  // Handle navigation between items
  const handleNavigate = (direction) => {
    const currentModule = courseData.modules.find(module => module.id === activeModule);
    if (!currentModule) return;
    
    const items = currentModule.items;
    const currentIndex = items.findIndex(item => item.id === activeItem);
    
    if (direction === 'prev' && currentIndex > 0) {
      setActiveItem(items[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < items.length - 1) {
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

  const currentModule = courseData.modules.find(module => module.id === activeModule);

  return (
    <div className="course-view">
      <div className="course-view-breadcrumb">
        <Link to="/courses">
          <Button 
            variant="outlined" 
            size="small"
            className="back-to-courses-button"
            sx={{
              color: '#0f172a',
              borderColor: '#e2e8f0',
              '&:hover': {
                backgroundColor: 'rgba(230, 180, 0, 0.08)',
                borderColor: '#e6b400',
                color: '#e6b400'
              }
            }}
          >
            <ChevronLeftIcon className="chevron-icon" />
            Back to Courses
          </Button>
        </Link>
        <div className="breadcrumb-path">
          / {courseData.code} / {currentModule?.title || 'Overview'}
        </div>
      </div>
      
      {/* Course Header with title and description */}
      <CourseHeader courseData={courseData} />
      
      <div className="course-view-container">
        {/* Sidebar with modules and instructor info */}
        <div className="course-view-sidebar">
          <ModuleList 
            modules={courseData.modules} 
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            activeItem={activeItem}
            setActiveItem={(itemId) => {
              setActiveItem(itemId);
              // When selecting an item, switch to content tab
              if (itemId) {
                setActiveTab('content');
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
                className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`} 
                onClick={() => handleTabClick('overview')}
              >
                Overview
              </li>
              <li 
                className={`tab-item ${activeTab === 'syllabus' ? 'active' : ''}`} 
                onClick={() => handleTabClick('syllabus')}
              >
                Syllabus
              </li>
              <li 
                className={`tab-item ${activeTab === 'content' ? 'active' : ''}`} 
                onClick={() => handleTabClick('content')}
              >
                Course Content
              </li>
              <li 
                className={`tab-item ${activeTab === 'assessments' ? 'active' : ''}`} 
                onClick={() => handleTabClick('assessments')}
              >
                Assessments
              </li>
              <li 
                className={`tab-item ${activeTab === 'resources' ? 'active' : ''}`} 
                onClick={() => handleTabClick('resources')}
              >
                Resources
              </li>
              
            </ul>
            
            <div className="tab-content">
              {activeTab === 'overview' && (
                <CourseOverview courseData={courseData} />
              )}
              {activeTab === 'syllabus' && (
                <CourseSyllabus courseData={courseData} />
              )}
              {activeTab === 'assessments' && (
                <CourseAssessments courseData={courseData} />
              )}
              {activeTab === 'resources' && (
                <CourseResources courseData={courseData} />
              )}
              {activeTab === 'content' && activeItem && currentModule && (
                <ContentViewer 
                  module={currentModule}
                  itemId={activeItem}
                  onNavigate={handleNavigate}
                />
              )}
              {activeTab === 'content' && (!activeItem || !currentModule) && (
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