import React from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
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
    <Card className="download-button-card">
      <h3 className="section-heading">Download Progress Report</h3>
      <p className="section-subtitle">Download a summary of your academic progress</p>
      <Button onClick={handleDownload} className="download-button">
        Download Report
      </Button>
    </Card>
  );
};

export default DownloadButton;