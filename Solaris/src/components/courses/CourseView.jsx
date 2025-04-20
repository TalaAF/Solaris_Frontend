import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';

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
 * 1. Fetching course data
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

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an actual API endpoint
        // const response = await fetch(`/api/courses/${courseId}`);
        
        // For demo purposes, using mock data with a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockCourse = mockCourseData;
        
        setCourseData(mockCourse);
        
        // Set the first module as active by default
        if (mockCourse.modules && mockCourse.modules.length > 0) {
          setActiveModule(mockCourse.modules[0].id);
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
          <Button variant="outline" size="sm">
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
            setActiveItem={setActiveItem}
          />
          
          <InstructorCard instructor={courseData.instructor} />
        </div>
        
        {/* Main content area */}
        <div className="course-view-content">
          {activeItem ? (
            <ContentViewer 
              module={currentModule}
              itemId={activeItem}
              onNavigate={(direction) => {
                // Handle navigation between items
                const items = currentModule.items;
                const currentIndex = items.findIndex(item => item.id === activeItem);
                
                if (direction === 'prev' && currentIndex > 0) {
                  setActiveItem(items[currentIndex - 1].id);
                } else if (direction === 'next' && currentIndex < items.length - 1) {
                  setActiveItem(items[currentIndex + 1].id);
                }
              }}
            />
          ) : (
            <div className="course-tabs">
              <ul className="tab-list">
                <li className="tab-item active">Overview</li>
                <li className="tab-item">Syllabus</li>
                <li className="tab-item">Assessments</li>
                <li className="tab-item">Resources</li>
              </ul>
              
              <div className="tab-content">
                <CourseOverview 
                  courseData={courseData} 
                />
                {/* Other tab content would be conditionally rendered based on active tab */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock course data for demonstration purposes
const mockCourseData = {
  id: 1,
  title: 'Human Anatomy & Physiology',
  code: 'MED201',
  description: 'A comprehensive study of human anatomy and physiology covering body systems, tissues, and organs.',
  instructor: {
    name: 'Dr. Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
    title: 'Professor of Anatomy'
  },
  progress: 65,
  modules: [
    {
      id: 1,
      title: 'Introduction to Anatomy',
      status: 'completed',
      items: [
        { id: 1, title: 'Course Overview', type: 'document', status: 'completed', duration: '10 min' },
        { id: 2, title: 'Anatomical Terminology', type: 'video', status: 'completed', duration: '25 min' },
        { id: 3, title: 'Body Planes and Sections', type: 'quiz', status: 'completed', duration: '15 min' }
      ]
    },
    // Additional modules would be here
  ],
  // Additional course data would be here
};

export default CourseView;
