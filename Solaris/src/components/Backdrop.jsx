import React from 'react';
import './Backdrop.css';

const Backdrop = ({ isVisible, onClick }) => {
  return (
    <div 
      className={`backdrop ${isVisible ? 'visible' : ''}`} 
      onClick={onClick}
    />
  );
};

export default Backdrop;