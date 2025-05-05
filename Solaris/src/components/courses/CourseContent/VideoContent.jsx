<<<<<<< HEAD
import React from "react";
import { PlayCircle } from "lucide-react";
import "./VideoContent.css";

/**
 * VideoContent Component
 *
=======
import React from 'react';
import { PlayCircle } from 'lucide-react';
import './VideoContent.css';

/**
 * VideoContent Component
 * 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
 * Displays video content for a course item.
 * In a real application, this would integrate with a video player.
 */
function VideoContent({ item }) {
  if (!item) return null;

  return (
    <div className="video-content">
      <div className="video-player">
        <PlayCircle className="play-icon" />
        <p className="video-placeholder-text">Video: {item.title}</p>
      </div>
      <div className="video-info">
        <h3 className="video-info-title">About this video</h3>
        <p className="video-info-description">
          This video covers key concepts related to {item.title.toLowerCase()}.
<<<<<<< HEAD
          In a real implementation, this would display the actual video
          description and player controls.
        </p>
        <div className="video-actions">
          <button className="video-action-button download">Download</button>
          <button className="video-action-button transcript">
            View Transcript
          </button>
=======
          In a real implementation, this would display the actual video description
          and player controls.
        </p>
        <div className="video-actions">
          <button className="video-action-button download">Download</button>
          <button className="video-action-button transcript">View Transcript</button>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        </div>
      </div>
    </div>
  );
}

export default VideoContent;
