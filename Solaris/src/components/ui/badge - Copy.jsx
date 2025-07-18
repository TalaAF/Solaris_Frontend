import React from "react";
import "./badge.css";

const Badge = React.forwardRef(({ className = "", variant = "default", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`solaris-badge ${variant} ${className}`}
    {...props}
  >
    {children}
  </div>
));

Badge.displayName = "Badge";

export { Badge };