import * as React from "react";
import { cn } from "../../lib/utils"; // Using relative path for consistency

// Simplified label component that doesn't depend on Radix UI
const Label = React.forwardRef(({ className, htmlFor, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    htmlFor={htmlFor}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };
