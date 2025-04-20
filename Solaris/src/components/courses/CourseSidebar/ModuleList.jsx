import React from 'react';
import ModuleItem from './ModuleItem';
import './ModuleList.css';

/**
 * ModuleList Component
 * 
 * Displays a list of course modules with their items.
 * Uses ModuleItem for individual module rendering.
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
