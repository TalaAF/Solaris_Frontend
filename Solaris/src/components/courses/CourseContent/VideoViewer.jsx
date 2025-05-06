import React from 'react';

function VideoViewer({ title, videoUrl, transcript }) {
  return (
    <div className="video-viewer">
      <div className="video-container">
        <iframe 
          src={videoUrl} 
          title={title}
          allowFullScreen
          width="100%"
          height="450"
          frameBorder="0"
        ></iframe>
      </div>
      {transcript && (
        <div className="video-transcript">
          <h3>Transcript</h3>
          <div className="transcript-content">
            {transcript}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoViewer;