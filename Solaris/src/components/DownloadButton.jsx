import React from 'react';
import './styles/DownloadButton.css';

const DownloadButton = ({ profile, courses }) => {
  const handleDownload = () => {
    const report = `
      Student Progress Report
      Name: ${profile.name}
      Email: ${profile.email}
      Semester: ${profile.semester || 'N/A'}
      Status: ${profile.status || 'N/A'}
      Enrolled Courses:
      ${courses.map(course => `${course.name} - Progress: ${course.progress}% (Instructor: ${course.instructor})`).join('\n')}
    `.trim();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name}_Progress_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="download-button-card">
      <h3 className="section-heading">Download Progress Report</h3>
      <p className="section-subtitle">Download a summary of your academic progress</p>
      <button
        onClick={handleDownload}
        className="download-button"
        style={{ width: '100%', marginTop: '1.5rem' }}
      >
        Download Report
      </button>
    </div>
  );
};

export default DownloadButton;