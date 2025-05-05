<<<<<<< HEAD
import React from "react";
import ModuleItem from "./ModuleItem";
import "./ModuleList.css"; // Verify this import is working
=======
import React from 'react';
import ModuleItem from './ModuleItem';
import './ModuleList.css'; // Verify this import is working
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2

/**
 * ModuleList Component
 */
<<<<<<< HEAD
function ModuleList({
  modules,
  activeModule,
  setActiveModule,
  activeItem,
  setActiveItem,
=======
function ModuleList({ 
  modules, 
  activeModule, 
  setActiveModule, 
  activeItem, 
  setActiveItem 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
}) {
  if (!modules || modules.length === 0) {
    return (
      <div className="no-modules">
<<<<<<< HEAD
        <p className="no-modules-message">
          No modules available for this course.
        </p>
=======
        <p className="no-modules-message">No modules available for this course.</p>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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
