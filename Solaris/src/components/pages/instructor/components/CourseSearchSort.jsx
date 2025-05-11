import React from 'react';
import { Search, Filter } from 'lucide-react';

const CourseSearchSort = ({ searchQuery, setSearchQuery, sortBy, setSortBy }) => {
  return (
    <div className="search-filter-controls">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="search"
          placeholder="Search courses..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="sort-container">
        <Filter size={18} className="sort-icon" />
        <select 
          className="sort-select" 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Most Recent</option>
          <option value="title">Course Name</option>
          <option value="students">Student Count</option>
          <option value="progress">Progress</option>
        </select>
      </div>
    </div>
  );
};

export default CourseSearchSort;