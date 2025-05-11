import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Pencil, Trash2, Layout, Eye, FileText, Video, FileQuestion } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CourseService from '../../../services/CourseService';
import ContentService from '../../../services/ContentService';
import { useCourseContext } from '../../../context/CourseContext';
import './CourseContent.css';

// Add these missing imports
import AddModuleModal from './components/AddModuleModal';
import AddContentModal from './components/AddContentModal';
import ContentPreviewModal from './components/ContentPreviewModal';

const CourseContent = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  
  // Get course data from context safely with fallback
  const courseContext = useCourseContext();
  const contextCourse = courseContext?.courseData || null;
  const setCurrentCourse = courseContext?.setCurrentCourse || (() => {});
  
  const [course, setCourse] = useState(contextCourse || null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  
  // Modal states
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentModuleForContent, setCurrentModuleForContent] = useState(null);
  
  // Add proper fetchModules function - place this near the start of your component
  const fetchModules = async () => {
    try {
      setLoading(true);
      console.log(`Fetching modules for course ${courseId}...`);
      
      const modulesResponse = await CourseService.getCourseModules(courseId);
      
      // Log the response to help debug
      console.log("Modules response:", modulesResponse);
      
      if (modulesResponse && modulesResponse.data) {
        // Make sure we have an array
        const moduleData = Array.isArray(modulesResponse.data) 
          ? modulesResponse.data 
          : [];
        
        console.log("Setting modules state with:", moduleData);
        setModules(moduleData);
        
        // If we have modules but none selected, select the first one
        if (moduleData.length > 0 && !activeModule) {
          setActiveModule(moduleData[0].id);
        }
        
        toast.success("Content refreshed successfully");
      } else {
        console.log("No modules data returned");
        setModules([]);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
      toast.error("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };
  
  // Update the useEffect hook that fetches initial data
  useEffect(() => {
    // Only fetch if we have a valid courseId
    if (courseId) {
      fetchCourseAndModules();
    }
  }, [courseId]);
  
  // Define or update the fetchCourseAndModules function
  const fetchCourseAndModules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching course with ID: ${courseId}`);
      const courseResponse = await CourseService.getCourseById(courseId);
      
      if (!courseResponse || !courseResponse.data) {
        throw new Error("Failed to load course details");
      }
      
      // Update course state
      setCourse(courseResponse.data);
      
      // Fetch modules
      await fetchModules();
    } catch (err) {
      console.error("Error fetching course and modules:", err);
      setError(err.message || "Failed to load course content");
      toast.error(err.message || "Failed to load course content");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle module selection
  const handleModuleSelect = (moduleId) => {
    setActiveModule(moduleId);
  };
  
  // Add new module
  const handleAddModule = async (moduleData) => {
    try {
      const formattedData = {
        ...moduleData,
        courseId: parseInt(courseId, 10)
      };
      
      const response = await CourseService.createModule(formattedData);
      const newModule = {
        ...response.data,
        items: []
      };
      
      setModules([...modules, newModule]);
      toast.success("Module added successfully");
      setIsAddModuleModalOpen(false);
    } catch (err) {
      console.error("Error adding module:", err);
      toast.error("Failed to add module");
    }
  };
  
  // Edit module
  const handleEditModule = async (moduleId, moduleData) => {
    try {
      const response = await CourseService.updateModule(moduleId, moduleData);
      
      // Update state with the updated module
      const updatedModules = modules.map(mod => 
        mod.id === moduleId ? { ...mod, ...response.data } : mod
      );
      
      setModules(updatedModules);
      toast.success("Module updated successfully");
      setIsEditModuleModalOpen(false);
    } catch (err) {
      console.error("Error updating module:", err);
      toast.error("Failed to update module");
    }
  };
  
  // Delete module
  const handleDeleteModule = async (moduleId) => {
    if (!confirm("Are you sure you want to delete this module? This will also delete all content items within the module.")) {
      return;
    }
    
    try {
      await CourseService.deleteModule(moduleId);
      
      // Update state
      const updatedModules = modules.filter(mod => mod.id !== moduleId);
      setModules(updatedModules);
      
      // If the deleted module was active, select another module
      if (activeModule === moduleId) {
        setActiveModule(updatedModules.length > 0 ? updatedModules[0].id : null);
      }
      
      toast.success("Module deleted successfully");
    } catch (err) {
      console.error("Error deleting module:", err);
      toast.error("Failed to delete module");
    }
  };
  
  // Updated handleAddContentSubmit function for CourseContent.jsx

const handleAddContentSubmit = async (contentData) => {
  try {
    setLoading(true);
    
    // Add moduleId to the data
    const dataToSend = {
      ...contentData,
      moduleId: activeModule
    };
    
    console.log("Submitting content data:", dataToSend);
    
    // Create the content
    const response = await ContentService.createContent(courseId, dataToSend);
    
    if (response && response.data) {
      // Update UI with the new content
      await fetchModules();
      toast.success(`${contentData.type.charAt(0).toUpperCase() + contentData.type.slice(1)} added successfully`);
    }
    
    setIsAddContentModalOpen(false);
  } catch (err) {
    console.error("Error adding content:", err);
    toast.error(`Failed to add content: ${err.message || "Unknown error"}`);
  } finally {
    setLoading(false);
  }
};
  
  // Helper function to update modules with new content
  const updateModulesWithNewContent = (newItem) => {
    const updatedModules = modules.map(mod => {
      if (mod.id === currentModuleForContent) {
        return {
          ...mod,
          items: [...(mod.items || []), newItem]
        };
      }
      return mod;
    });
    
    setModules(updatedModules);
  };
  
  // Delete content item
  const handleDeleteContent = async (moduleId, contentId) => {
    if (!confirm("Are you sure you want to delete this content item?")) {
      return;
    }
    
    try {
      await ContentService.deleteContent(contentId);
      
      // Update the modules state
      const updatedModules = modules.map(mod => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            items: (mod.items || []).filter(item => item.id !== contentId)
          };
        }
        return mod;
      });
      
      setModules(updatedModules);
      toast.success("Content deleted successfully");
    } catch (err) {
      console.error("Error deleting content:", err);
      toast.error("Failed to delete content");
    }
  };
  
  // Add new content item
  const handleAddContent = (moduleId) => {
    setCurrentModuleForContent(moduleId);
    setIsAddContentModalOpen(true);
  };
  
  // Preview content
  const handlePreviewContent = async (item) => {
    try {
      // Fetch complete content data if needed
      const contentResponse = await ContentService.getContentById(item.id);
      setCurrentItem(contentResponse.data);
      setIsPreviewModalOpen(true);
    } catch (err) {
      console.error("Error fetching content details:", err);
      toast.error("Failed to load content preview");
    }
  };
  
  // Get content icon based on type
  const getContentIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText size={16} />;
      case 'video':
        return <Video size={16} />;
      case 'quiz':
        return <FileQuestion size={16} />;
      default:
        return <FileText size={16} />;
    }
  };
  
  // Get active module
  const getActiveModuleData = () => {
    const module = modules.find(mod => mod.id === activeModule);
    console.log("Active module:", activeModule);
    console.log("Found module data:", module);
    return module || null;
  };
  
  if (loading) {
    return (
      <div className="course-content-page loading">
        <div className="spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="course-content-page error">
        <h2>Error Loading Content</h2>
        <p>{error}</p>
        <button 
          className="solaris-button primary-button"
          onClick={() => navigate(`/instructor/courses/${courseId}`)}
        >
          Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="course-content-page">
      <div className="content-header">
        <button 
          className="back-button" 
          onClick={() => navigate(`/instructor/courses/${courseId}`)}
        >
          <ChevronLeft size={16} />
          Back to Course
        </button>
        
        <div className="content-title-container">
          <h1 className="content-title">Course Content: {course?.title}</h1>
          <button 
            className="solaris-button secondary-button"
            onClick={() => fetchModules()}
            title="Refresh Content"
          >
            Refresh Content
          </button>
        </div>
      </div>
      
      <div className="content-management-container">
        {/* Modules sidebar */}
        <div className="modules-sidebar">
          <div className="modules-header">
            <h2>Modules</h2>
            <button 
              className="solaris-button .add-module-button"
              onClick={() => setIsAddModuleModalOpen(true)}
              title="Add Module"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="modules-list">
            {modules.length === 0 ? (
              <div className="empty-modules">
                <p>No modules yet</p>
                <button 
                  className="solaris-button primary-button"
                  onClick={() => setIsAddModuleModalOpen(true)}
                >
                  <Plus size={16} />
                  Create First Module
                </button>
              </div>
            ) : (
              modules.map(module => (
                <div 
                  key={module.id} 
                  className={`module-item ${activeModule === module.id ? 'active' : ''}`}
                  onClick={() => handleModuleSelect(module.id)}
                >
                  <div className="module-details">
                    <Layout size={16} className="module-icon" />
                    <span className="module-name">{module.title}</span>
                    <span className="module-count">
                      {module.items?.length || 0} {(module.items?.length || 0) === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  
                  <div className="module-actions">
                    <button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentItem(module);
                        setIsEditModuleModalOpen(true);
                      }}
                      title="Edit Module"
                    >
                      <Pencil size={14} />
                    </button>
                    
                    <button
                      className="action-button delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteModule(module.id);
                      }}
                      title="Delete Module"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
           ) }
          </div>
        </div>
        
        {/* Content area */}
        <div className="content-area">
          {activeModule ? (
            <>
              <div className="content-area-header">
                <h2>{getActiveModuleData()?.title}</h2>
                <button 
                  className="solaris-button primary-button"
                  onClick={() => handleAddContent(activeModule)}
                >
                  <Plus size={16} />
                  Add Content
                </button>
              </div>
              
              <div className="content-items-list">
                {!getActiveModuleData()?.items?.length ? (
                  <div className="empty-content">
                    <p>No content items in this module</p>
                    <button 
                      className="solaris-button primary-button"
                      onClick={() => handleAddContent(activeModule)}
                    >
                      <Plus size={16} />
                      Add Content Item
                    </button>
                  </div>
                ) : (
                  <div className="content-items">
                    {getActiveModuleData()?.items?.map(item => (
                      <div key={item.id} className="content-item">
                        <div className="content-item-details">
                          <div className="content-type-icon">
                            {getContentIcon(item.type)}
                          </div>
                          <div className="content-info">
                            <h3 className="content-item-title">{item.title}</h3>
                            <div className="content-meta">
                              <span className="content-type">{item.type}</span>
                              {item.duration && (
                                <span className="content-duration">{item.duration}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="content-item-actions">
                          <button 
                            className="action-button"
                            onClick={() => handlePreviewContent(item)}
                            title="Preview"
                          >
                            <Eye size={16} />
                          </button>
                          
                          <button 
                            className="action-button"
                            onClick={() => {
                              setCurrentItem(item);
                              // Open edit content modal - not implemented in this example
                            }}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          
                          <button 
                            className="action-button delete"
                            onClick={() => handleDeleteContent(activeModule, item.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-module-selected">
              <h3>No module selected</h3>
              <p>Select a module from the sidebar or create a new module to get started.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      {isAddModuleModalOpen && (
        <AddModuleModal
          onClose={() => setIsAddModuleModalOpen(false)}
          onSubmit={handleAddModule}
        />
      )}
      
      {isEditModuleModalOpen && (
        <AddModuleModal
          module={currentItem}
          isEditing={true}
          onClose={() => setIsEditModuleModalOpen(false)}
          onSubmit={(data) => handleEditModule(currentItem.id, data)}
        />
      )}
      
      {isAddContentModalOpen && (
        <AddContentModal
          onClose={() => setIsAddContentModalOpen(false)}
          onSubmit={handleAddContentSubmit}
        />
      )}
      
      {isPreviewModalOpen && (
        <ContentPreviewModal
          item={currentItem}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CourseContent;