import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FileText, Video, FileQuestion } from "lucide-react";
import ContentService from "../../../services/ContentService";
import ProgressService from "../../../services/ProgressService";
import { useAuth } from "../../../context/AuthContext";
import "./ContentViewer.css";

/**
 * ContentViewer Component
 * Displays content based on its type and tracks user progress
 */
const ContentViewer = ({ 
  module, 
  itemId, 
  onNavigate, 
  contentData, 
  quizData,
  onProgressUpdate // NEW: Add callback to notify parent of progress updates
}) => {
  const { currentUser } = useAuth();
  const [progressUpdated, setProgressUpdated] = useState(false);

  // Track user progress when content is viewed
  useEffect(() => {
    const trackContentProgress = async () => {
      if (!contentData || !contentData.id) return;
      
      // Always show progress indicator for better UX
      setProgressUpdated(true);
      
      // Hide progress indicator after 3 seconds
      const hideTimer = setTimeout(() => {
        setProgressUpdated(false);
      }, 3000);
      
      try {
        // Try to mark content as viewed
        const result = await ProgressService.markContentAsViewed(contentData.id);
        
        console.log("Progress tracking result:", result);
        
        // Even if server tracking fails, track progress locally
        if (!result || !result.success) {
          console.log("Using local fallback for progress tracking");
          ProgressService.trackProgressLocally(contentData.id);
        }
        
        // If we have a courseId, fetch updated progress
        if (module && module.courseId) {
          try {
            const progressData = await ProgressService.getDetailedCourseProgress(module.courseId);
            
            if (progressData) {
              console.log("Updated course progress:", progressData);
              
              // Notify parent component about progress update
              if (onProgressUpdate) {
                onProgressUpdate(progressData);
              }
            }
          } catch (progressErr) {
            console.warn("Failed to get updated course progress:", progressErr);
          }
        }
      } catch (error) {
        console.warn("Failed to track content progress:", error);
        // Track locally even if everything else fails
        ProgressService.trackProgressLocally(contentData.id);
      }
      
      return () => clearTimeout(hideTimer);
    };
    
    // Track progress when content changes
    trackContentProgress();
  }, [contentData, module, onProgressUpdate]);

  if (!contentData) {
    return (
      <div className="content-empty">
        <p>Select content to view</p>
      </div>
    );
  }

  // Helper function to render content based on type
  const renderContent = () => {
    switch (contentData.type?.toLowerCase()) {
      case "document":
        return (
          <div className="document-content">
            <div className="content-icon-header">
              <FileText size={24} />
              <h3>{contentData.title}</h3>
            </div>
            <div 
              className="document-text"
              dangerouslySetInnerHTML={{ __html: contentData.content }}
            />
          </div>
        );
        
      case "video":
        return (
          <div className="video-content">
            <div className="content-icon-header">
              <Video size={24} />
              <h3>{contentData.title}</h3>
            </div>
            <div className="video-container">
              {contentData.videoUrl ? (
                <iframe
                  src={contentData.videoUrl}
                  title={contentData.title}
                  width="100%"
                  height="500"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="video-placeholder">Video URL not available</div>
              )}
            </div>
          </div>
        );
        
      case "quiz":
        return (
          <div className="quiz-content">
            <div className="content-icon-header">
              <FileQuestion size={24} />
              <h3>{contentData.title}</h3>
            </div>
            {quizData ? (
              <div className="quiz-container">
                <p className="quiz-description">{contentData.description}</p>
                <div className="quiz-details">
                  <div className="quiz-info">
                    <span>Questions: {quizData.questions?.length || 0}</span>
                    <span>Time Limit: {quizData.timeLimit || "None"}</span>
                    <span>Passing Score: {quizData.passingScore || 70}%</span>
                  </div>
                </div>
                <button className="start-quiz-button">
                  Start Quiz
                </button>
              </div>
            ) : (
              <div className="quiz-placeholder">Quiz data not available</div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="unknown-content">
            <h3>{contentData.title}</h3>
            <p>{contentData.description || "No description available"}</p>
            <div className="content-message">
              <p>This content type cannot be displayed.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="content-viewer">
      <div className="content-header">
        <div className="content-breadcrumb">
          <span className="module-name">{module?.title || "Module"}</span>
          <span className="separator">›</span>
          <span className="content-name">{contentData.title}</span>
        </div>
        
        <div className="navigation-buttons">
          <button
            className="nav-button prev"
            onClick={() => onNavigate("prev")}
          >
            Previous
          </button>
          <button
            className="nav-button next"
            onClick={() => onNavigate("next")}
          >
            Next
          </button>
        </div>
        
        {/* Add progress indicator */}
        {progressUpdated && (
          <div className="progress-updated">
            <span>Progress updated</span>
            <div className="checkmark"></div>
          </div>
        )}
      </div>
      
      <div className="content-body">
        {renderContent()}
      </div>
    </div>
  );
};

export default ContentViewer;
