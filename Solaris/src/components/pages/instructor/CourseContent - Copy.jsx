import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Plus, Pencil, Trash2, Layout, Eye, FileText, 
  Video, FileQuestion, Book, Award, CheckCircle, Settings 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import CourseService from '../../../services/CourseService';
import ContentService from '../../../services/ContentService';
import QuizService from '../../../services/QuizService';
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
  const [quizzes, setQuizzes] = useState([]);
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

  // Fetch quizzes for the course
 // Updated fetchQuizzes function for CourseContent.jsx

const fetchQuizzes = async () => {
  try {
    console.log(`Fetching quizzes for course ID: ${courseId}...`);
    
    // Add a mock quiz to test UI rendering without API
    const mockQuiz = {
      id: 999,
      title: "Test Quiz (Mocked)",
      description: "This is a test quiz to verify UI rendering",
      timeLimit: 30,
      passingScore: 70,
      published: true,
      questionCount: 5
    };
    
    try {
      // First try showing a mock quiz to test the UI
      console.log("Setting mock quiz for testing UI...");
      setQuizzes([mockQuiz]);
      
      // Then fetch actual quizzes from API
      console.log("Making actual API call for quizzes...");
      const quizzesResponse = await QuizService.getQuizzesByCourse(courseId);
      
      console.log("Raw API response:", quizzesResponse);
      
      if (!quizzesResponse) {
        console.error("Quiz response is null or undefined!");
        return; // Keep using the mock quiz
      }
      
      // Check the structure of the response
      if (Array.isArray(quizzesResponse)) {
        console.log("API returned an array of quizzes:", quizzesResponse);
        setQuizzes(quizzesResponse);
      } else if (quizzesResponse.data && Array.isArray(quizzesResponse.data)) {
        console.log("API returned an object with data array:", quizzesResponse.data);
        setQuizzes(quizzesResponse.data);
      } else if (typeof quizzesResponse === 'object') {
        console.log("API returned a non-array object:", quizzesResponse);
        
        // Check if it might be a single quiz object instead of an array
        if (quizzesResponse.id) {
          console.log("Appears to be a single quiz object, converting to array");
          setQuizzes([quizzesResponse]);
        } else {
          console.error("Unexpected response format:", quizzesResponse);
          // Keep the mock quiz to show something
        }
      } else {
        console.error("Completely unexpected response type:", typeof quizzesResponse);
        // Keep the mock quiz to show something
      }
      
    } catch (apiError) {
      console.error("Error during API call:", apiError);
      console.log("Using mock quiz data for display");
      // Keep the mock quiz showing since the API call failed
    }
  } catch (err) {
    console.error("Fatal error in fetchQuizzes:", err);
    toast.error("Failed to load quizzes");
  }
};
  
  // Update the useEffect hook that fetches initial data
  useEffect(() => {
    // Only fetch if we have a valid courseId
    if (courseId) {
      fetchCourseAndModules();
      fetchQuizzes();
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
  
  // Add or modify handleAddContent function to properly set the module ID
  const handleAddContent = (moduleId) => {
    // Store the target module ID for the content being added
    setCurrentModuleForContent(moduleId);
    // Open the modal
    setIsAddContentModalOpen(true);
  };

  // Update handleAddContentSubmit to use the correct module ID
  const handleAddContentSubmit = async (contentData) => {
    try {
      setLoading(true);
      
      // Use currentModuleForContent instead of activeModule to ensure correct module ID
      const moduleId = currentModuleForContent; 
      
      console.log(`Creating content for module ID: ${moduleId}`);
      
      // Create an object with only the fields needed by the API
      const dataToSend = {
        title: contentData.title,
        description: contentData.description || "",
        type: contentData.type.toUpperCase(), // Backend likely expects uppercase enum values
        content: contentData.type === 'document' ? contentData.content : "",
        videoUrl: contentData.type === 'video' ? contentData.videoUrl : "",
        duration: contentData.duration || null,
        order: parseInt(contentData.order || 0)
      };
      
      // Create the content using the module ID
      const response = await ContentService.createContent(moduleId, dataToSend);
      
      if (response) {
        toast.success(`${contentData.type.charAt(0).toUpperCase() + contentData.type.slice(1)} added successfully`);
        // Update the modules with the new content
        await refreshContent();
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
  
  // Preview content
  const handlePreviewContent = async (item) => {
    try {
      setLoading(true);
      
      // Use the item data we already have if fetching fails
      let contentData = item;
      
      try {
        // Try to get more detailed content data
        const contentResponse = await ContentService.getContentById(item.id);
        if (contentResponse && contentResponse.data) {
          contentData = contentResponse.data;
        }
      } catch (err) {
        console.warn("Could not fetch detailed content data, using available data");
        // Continue with what we have
      }
      
      setCurrentItem(contentData);
      setIsPreviewModalOpen(true);
    } catch (err) {
      console.error("Error preparing content preview:", err);
      toast.error("Failed to prepare content preview");
    } finally {
      setLoading(false);
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
  
  // Add this function to your component
  const refreshContent = async () => {
    try {
      setLoading(true);
      await fetchModules();
      await fetchQuizzes();
      setLoading(false);
    } catch (error) {
      console.error("Error refreshing content:", error);
      toast.error("Failed to refresh content");
      setLoading(false);
    }
  };

  // Navigate to create quiz page
  const handleNavigateToCreateQuiz = () => {
    navigate(`/instructor/courses/${courseId}/create-quiz`);
  };

  // Navigate to quiz details page
  const handleNavigateToQuizDetails = (quizId) => {
    navigate(`/instructor/quizzes/${quizId}`);
  };

  // Handle publish/unpublish quiz
  const handlePublishQuiz = async (quiz) => {
    try {
      let response;
      
      if (quiz.published) {
        response = await QuizService.unpublishQuiz(quiz.id);
        toast.success("Quiz unpublished successfully");
      } else {
        response = await QuizService.publishQuiz(quiz.id);
        toast.success("Quiz published successfully");
      }
      
      if (response) {
        await fetchQuizzes(); // Refresh quiz list with updated published status
      }
    } catch (err) {
      console.error("Error updating quiz publish status:", err);
      toast.error("Failed to update quiz status");
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!confirm("Are you sure you want to delete this quiz? This will also delete all questions and student attempts.")) {
      return;
    }
    
    try {
      await QuizService.deleteQuiz(quizId);
      toast.success("Quiz deleted successfully");
      await fetchQuizzes(); // Refresh quiz list
    } catch (err) {
      console.error("Error deleting quiz:", err);
      toast.error("Failed to delete quiz");
    }
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
          <div className="content-actions">
            <button 
              className="solaris-button secondary-button"
              onClick={() => refreshContent()}
              title="Refresh Content"
            >
              Refresh Content
            </button>
          </div>
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
            )}
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
      
      {/* Quizzes Section */}
      <div className="quizzes-section">
        <div className="quizzes-header">
          <h2>
            <FileQuestion size={20} />
            Quizzes & Assessments
          </h2>
          <button 
            className="solaris-button primary-button"
            onClick={handleNavigateToCreateQuiz}
          >
            <Plus size={16} />
            Create New Quiz
          </button>
        </div>
        
        {quizzes.length === 0 ? (
          <div className="empty-quizzes">
            <p>No quizzes have been created for this course yet.</p>
            <button 
              className="solaris-button primary-button"
              onClick={handleNavigateToCreateQuiz}
            >
              <Plus size={16} />
              Create First Quiz
            </button>
          </div>
        ) : (
          <div className="quiz-cards">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="quiz-card">
                <div className="quiz-card-header">
                  <FileQuestion size={20} />
                  {quiz.published ? (
                    <span className="status-badge published">
                      <CheckCircle size={14} />
                      Published
                    </span>
                  ) : (
                    <span className="status-badge draft">Draft</span>
                  )}
                </div>
                
                <div className="quiz-card-content">
                  <h3 className="quiz-title">{quiz.title}</h3>
                  <p className="quiz-description">{quiz.description || "No description provided."}</p>
                  
                  <div className="quiz-meta">
                    <div>
                      <strong>Questions:</strong> {quiz.questionCount || 0}
                    </div>
                    <div>
                      <strong>Time Limit:</strong> {quiz.timeLimit} min
                    </div>
                    <div>
                      <strong>Passing Score:</strong> {quiz.passingScore}%
                    </div>
                  </div>
                </div>
                
                <div className="quiz-card-actions">
                  <button 
                    className="solaris-button secondary-button"
                    onClick={() => handleNavigateToQuizDetails(quiz.id)}
                  >
                    <Settings size={16} />
                    Manage
                  </button>
                  
                  <button 
                    className={`solaris-button ${quiz.published ? 'warning-button' : 'success-button'}`}
                    onClick={() => handlePublishQuiz(quiz)}
                  >
                    {quiz.published ? 'Unpublish' : 'Publish'}
                  </button>
                  
                  <button 
                    className="solaris-button danger-button"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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