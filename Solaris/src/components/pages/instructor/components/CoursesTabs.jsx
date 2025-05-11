import React from 'react';

const CoursesTabs = ({ activeTab, setActiveTab, courseCounts }) => {
  return (
    <div className="courses-tabs">
      <button 
        className={`tab-button ${activeTab === 'all' ? 'active' : ''}`} 
        onClick={() => setActiveTab('all')}
      >
        All Courses 
        <span className="tab-count">{courseCounts.all}</span>
      </button>
      <button 
        className={`tab-button ${activeTab === 'active' ? 'active' : ''}`} 
        onClick={() => setActiveTab('active')}
      >
        Active 
        <span className="tab-count">{courseCounts.active}</span>
      </button>
      <button 
        className={`tab-button ${activeTab === 'draft' ? 'active' : ''}`} 
        onClick={() => setActiveTab('draft')}
      >
        Draft 
        <span className="tab-count">{courseCounts.draft}</span>
      </button>
      <button 
        className={`tab-button ${activeTab === 'archived' ? 'active' : ''}`} 
        onClick={() => setActiveTab('archived')}
      >
        Archived 
        <span className="tab-count">{courseCounts.archived}</span>
      </button>
    </div>
  );
};

export default CoursesTabs;