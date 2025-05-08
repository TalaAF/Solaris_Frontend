import React, { useState, useRef, useEffect } from "react";
import "./select.css";

const Select = ({ 
  value, 
  onValueChange,
  children,
  className = "",
  ...props 
}) => {
  const [selectValue, setSelectValue] = useState(value);
  
  useEffect(() => {
    setSelectValue(value);
  }, [value]);
  
  const handleValueChange = (newValue) => {
    setSelectValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };
  
  return (
    <div className={`solaris-select-container ${className}`}>
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            value: selectValue,
            onValueChange: handleValueChange,
            ...props
          });
        }
        
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            value: selectValue,
            onValueChange: handleValueChange
          });
        }
        
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ 
  value, 
  className = "", 
  children,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  
  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div className={`solaris-select-trigger ${className}`} ref={triggerRef} onClick={handleTriggerClick}>
      {children || <SelectValue value={value} placeholder={props.placeholder} />}
      <div className="solaris-select-icon">
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          xmlns="http://www.w3.org/2000/svg"
          className={`solaris-select-chevron ${isOpen ? 'open' : ''}`}
        >
          <path 
            fill="none" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="M3 5l3 3 3-3"
          />
        </svg>
      </div>
      
      {isOpen && (
        <div className="solaris-select-dropdown">
          {React.Children.map(props.children, child => {
            if (child.type === SelectContent) {
              return child;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

const SelectValue = ({ value, placeholder }) => {
  return (
    <div className="solaris-select-value">
      {value || placeholder || "Select an option"}
    </div>
  );
};

const SelectContent = ({ children, value, onValueChange }) => {
  return (
    <div className="solaris-select-content">
      {React.Children.map(children, child => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, {
            isSelected: child.props.value === value,
            onSelect: () => onValueChange(child.props.value)
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectItem = ({ value, children, isSelected, onSelect }) => {
  return (
    <div 
      className={`solaris-select-item ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      {children}
      {isSelected && (
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="solaris-select-check"
        >
          <path 
            d="M13.3333 4L6 11.3333L2.66667 8" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };