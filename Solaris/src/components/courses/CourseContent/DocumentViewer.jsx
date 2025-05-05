import React from 'react';
import ReactMarkdown from 'react-markdown';

function DocumentViewer({ title, content }) {
  return (
    <div className="document-viewer">
      <div className="document-content">
        {/* Use ReactMarkdown to render the content if it's in markdown format */}
        {content.includes('#') || content.includes('*') ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <div className="plain-text">{content}</div>
        )}
      </div>
    </div>
  );
}

export default DocumentViewer;