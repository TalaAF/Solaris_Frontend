<<<<<<< HEAD
import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { Button } from "@mui/material";
import { Chip as Badge } from "@mui/material";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import VideoContent from "./VideoContent";
import DocumentContent from "./DocumentContent";
import QuizContent from "./QuizContent";
// import InteractiveContent from './InteractiveContent';
import "./ContentViewer.css";

/**
 * ContentViewer Component
 *
=======
import React from 'react';
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { Button } from "@mui/material";
import { Chip as Badge } from "@mui/material";
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import VideoContent from './VideoContent';
import DocumentContent from './DocumentContent';
import QuizContent from './QuizContent';
// import InteractiveContent from './InteractiveContent';
import './ContentViewer.css';

/**
 * ContentViewer Component
 * 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
 * Displays the content of a selected course module item.
 * It renders different content types (video, document, quiz, interactive)
 * using specialized components.
 */
function ContentViewer({ module, itemId, onNavigate }) {
  if (!module || !itemId) return null;
<<<<<<< HEAD

  const item = module.items.find((item) => item.id === itemId);

=======
  
  const item = module.items.find(item => item.id === itemId);
  
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  if (!item) {
    return (
      <Card className="content-not-found">
        <CardContent>
          <p>Content item not found.</p>
        </CardContent>
      </Card>
    );
  }
<<<<<<< HEAD

=======
  
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  return (
    <Card className="content-viewer">
      <CardHeader className="content-header">
        <div className="content-navigation">
<<<<<<< HEAD
          <Typography className="content-title">{item.title}</Typography>
          <div className="navigation-buttons">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("prev")}
=======
          <Typography className="content-title">
            {item.title}
          </Typography>
          <div className="navigation-buttons">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('prev')}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
              className="nav-button"
            >
              <ChevronLeft className="nav-icon" />
              <span className="nav-text">Previous</span>
            </Button>
<<<<<<< HEAD
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("next")}
=======
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('next')}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
              className="nav-button"
            >
              <span className="nav-text">Next</span>
              <ChevronRight className="nav-icon" />
            </Button>
          </div>
        </div>
        <div className="content-meta">
          <span className="module-name">{module.title}</span>
          <span className="meta-separator">•</span>
          <Badge variant="outline" className="content-type">
            {item.type}
          </Badge>
          <span className="meta-separator">•</span>
          <div className="content-duration">
            <Clock className="duration-icon" />
            <span>{item.duration}</span>
          </div>
        </div>
      </CardHeader>
<<<<<<< HEAD
      <CardContent className="content-body">{renderContent(item)}</CardContent>
=======
      <CardContent className="content-body">
        {renderContent(item)}
      </CardContent>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    </Card>
  );
}

// Helper function to render the appropriate content based on type
function renderContent(item) {
  switch (item.type) {
<<<<<<< HEAD
    case "video":
      return <VideoContent item={item} />;
    case "document":
      return <DocumentContent item={item} />;
    case "quiz":
      return <QuizContent item={item} />;
    case "interactive":
      return (
        <div className="interactive-content-placeholder">
          Interactive content is currently unavailable
        </div>
      );
=======
    case 'video':
      return <VideoContent item={item} />;
    case 'document':
      return <DocumentContent item={item} />;
    case 'quiz':
      return <QuizContent item={item} />;
    case 'interactive':
      return <div className="interactive-content-placeholder">Interactive content is currently unavailable</div>;
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    default:
      return (
        <div className="unknown-content">
          <p>Unknown content type: {item.type}</p>
        </div>
      );
  }
}

export default ContentViewer;
