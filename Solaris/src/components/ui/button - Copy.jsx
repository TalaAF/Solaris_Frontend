import React from "react";
import "./button.css";

const Button = React.forwardRef(({ 
  className = "", 
  variant = "default", 
  size = "default", 
  ...props 
}, ref) => {
  return (
    <button
      className={`solaris-button solaris-button-${variant} solaris-button-${size} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };