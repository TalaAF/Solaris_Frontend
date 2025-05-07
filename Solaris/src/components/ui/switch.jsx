import React from "react";
import "./switch.css";

const Switch = React.forwardRef(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
  const handleChange = (e) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <label className={`solaris-switch-wrapper ${className || ""} ${disabled ? "disabled" : ""}`}>
      <input
        type="checkbox"
        className="solaris-switch-input"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        ref={ref}
        {...props}
      />
      <span className="solaris-switch-slider"></span>
    </label>
  );
});

Switch.displayName = "Switch";

export { Switch };