import React from "react";
import "./input.css";

const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={`solaris-input ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      className={`solaris-textarea ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

const Label = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <label
      className={`solaris-label ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Label.displayName = "Label";

export { Input, Textarea, Label };