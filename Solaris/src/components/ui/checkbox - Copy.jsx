import * as React from "react";
import { cn } from "../../lib/utils";

const Checkbox = React.forwardRef(
  ({ className, checked, onChange, id, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false);

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleChange = (e) => {
      const newChecked = e.target.checked;
      setIsChecked(newChecked);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={handleChange}
          className="absolute h-4 w-4 opacity-0"
          {...props}
        />
        <div
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isChecked ? "bg-primary text-primary-foreground" : "bg-background",
            className,
          )}
        >
          {isChecked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
