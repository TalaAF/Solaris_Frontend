import * as React from "react";
import { cn } from "../../lib/utils";

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid gap-2", className)}
      role="radiogroup"
      {...props}
    />
  );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(
  (
    { className, id, value, name, checked, onChange, children, ...props },
    ref,
  ) => {
    return (
      <span
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary relative flex items-center justify-center",
          className,
        )}
      >
        <input
          ref={ref}
          type="radio"
          id={id}
          value={value}
          name={name}
          checked={checked}
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          {...props}
        />
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-current" />}
      </span>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
