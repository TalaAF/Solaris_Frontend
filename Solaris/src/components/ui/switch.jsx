import React from "react";
import "./switch.css";

const Switch = React.forwardRef(({ className = "", checked, onCheckedChange, ...props }, ref) => {
  return (
    <label className={`solaris-switch ${className}`}>
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        className="solaris-switch-input"
        {...props}
      />
      <span 
        className="solaris-switch-slider" 
        data-state={checked ? "checked" : "unchecked"}
      ></span>
    </label>
  );
});

Switch.displayName = "Switch";

export { Switch };