
import React from "react";
import { PlayCircle } from "lucide-react";
import "./VideoContent.css";

/**
 * VideoContent Component
 *

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

          In a real implementation, this would display the actual video
          description and player controls.
        </p>
        <div className="video-actions">
          <button className="video-action-button download">Download</button>
          <button className="video-action-button transcript">
            View Transcript
          </button>

        </div>
      </div>
    </div>
  );
}

export default VideoContent;
