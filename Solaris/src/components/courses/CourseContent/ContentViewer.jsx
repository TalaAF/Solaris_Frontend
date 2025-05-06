import React from "react";
import { Button } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

// Import different content type components
import DocumentViewer from "./DocumentViewer";
import VideoViewer from "./VideoViewer";
import QuizViewer from "./QuizViewer";
import AssignmentViewer from "./AssignmentViewer";

import "./ContentViewer.css"; // Add appropriate styling

/**
 * ContentViewer Component
 *
 * Displays the content of a selected course module item.
 * It renders different content types (video, document, quiz, interactive)
 * using specialized components.
 */
function ContentViewer({ module, itemId, onNavigate, contentData, quizData }) {
  // Find the current item from the module
  const currentItem = module.items.find((item) => item.id === itemId);

  if (!currentItem) {
    return <div className="content-error">Content not found</div>;
  }

  // Determine content display based on type
  const renderContent = () => {
    switch (currentItem.type) {
      case "document":
        return (
          <DocumentViewer
            title={currentItem.title}
            content={
              contentData?.content ||
              `This is a placeholder for the document content: ${currentItem.title}. When connected to the backend, this will display actual document content.`
            }
          />
        );

      case "video":
        return (
          <VideoViewer
            title={currentItem.title}
            videoUrl={
              contentData?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"
            } // Placeholder video
            transcript={
              contentData?.transcript ||
              "Transcript will be available when connected to the backend."
            }
          />
        );

      case "quiz":
        return (
          <QuizViewer
            title={currentItem.title}
            quizData={
              quizData || {
                title: currentItem.title,
                questions: [
                  {
                    question:
                      "This is a placeholder quiz question. Real questions will load when connected to the backend.",
                    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                    correctAnswer: "Option 1",
                  },
                ],
              }
            }
          />
        );

      case "assignment":
        return (
          <AssignmentViewer
            title={currentItem.title}
            assignment={
              contentData || {
                title: currentItem.title,
                description:
                  "This is a placeholder assignment. Real assignment details will load when connected to the backend.",
                dueDate: "2025-05-15",
                submissionStatus: "not-submitted",
              }
            }
          />
        );

      default:
        return <div>Unsupported content type</div>;
    }
  };

  // Find the current item's index to determine if we can navigate prev/next
  const items = module.items;
  const currentIndex = items.findIndex((item) => item.id === itemId);
  const isPrevAvailable = currentIndex > 0;
  const isNextAvailable = currentIndex < items.length - 1;

  return (
    <div className="content-viewer">
      <div className="content-header">
        <h2>{currentItem.title}</h2>
        <div className="content-info">
          <span className="content-type">{currentItem.type}</span>
          <span className="content-duration">{currentItem.duration}</span>
        </div>
      </div>

      <div className="content-body">{renderContent()}</div>

      <div className="content-navigation">
        <Button
          variant="contained"
          disabled={!isPrevAvailable}
          onClick={() => onNavigate("prev")}
          startIcon={<NavigateBeforeIcon />}
          sx={{
            mr: 1,
            backgroundColor: isPrevAvailable ? "#0f172a" : "#e5e7eb",
            "&:hover": { backgroundColor: "#1e293b" },
          }}
        >
          Previous
        </Button>

        <Button
          variant="contained"
          disabled={!isNextAvailable}
          onClick={() => onNavigate("next")}
          endIcon={<NavigateNextIcon />}
          sx={{
            backgroundColor: isNextAvailable ? "#0f172a" : "#e5e7eb",
            "&:hover": { backgroundColor: "#1e293b" },
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default ContentViewer;
