import React from 'react';
import ModuleItem from './ModuleItem';
import './ModuleList.css'; // Verify this import is working

/**
 * ModuleList Component
 */
function ModuleList({ 
  modules, 
  activeModule, 
  setActiveModule, 
  activeItem, 
  setActiveItem 
}) {
  if (!modules || modules.length === 0) {
    return (
      <div className="no-modules">
        <p className="no-modules-message">No modules available for this course.</p>
      </div>
    );
  }

  return (
    <div className="modules-list">
      <h3 className="modules-heading">Course Content</h3>
      {modules.map((module) => (
        <ModuleItem
          key={module.id}
          module={module}
          isActive={module.id === activeModule}
          setActiveModule={setActiveModule}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
      ))}
    </div>
  );
}

export default ModuleList;
