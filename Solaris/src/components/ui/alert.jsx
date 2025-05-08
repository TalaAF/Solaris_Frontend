import React from "react";
import "./alert.css";

const Alert = React.forwardRef(({ className = "", variant = "default", children, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={`solaris-alert ${variant} ${className}`}
    {...props}
  >
    {children}
  </div>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <h5
    ref={ref}
    className={`solaris-alert-title ${className}`}
    {...props}
  >
    {children}
  </h5>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`solaris-alert-description ${className}`}
    {...props}
  >
    {children}
  </div>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };