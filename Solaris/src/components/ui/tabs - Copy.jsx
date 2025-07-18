import React, { createContext, useContext, useState } from "react";
import "./tabs.css";

const TabsContext = createContext({
  value: "",
  onValueChange: () => {},
});

const Tabs = ({ value, onValueChange, defaultValue, children, className = "" }) => {
  const [tabValue, setTabValue] = useState(defaultValue || value);

  const handleValueChange = (newValue) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setTabValue(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ value: value || tabValue, onValueChange: handleValueChange }}>
      <div className={`solaris-tabs ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`solaris-tabs-list ${className}`}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className = "", value, children, ...props }, ref) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isActive = selectedValue === value;

  return (
    <button
      ref={ref}
      type="button"
      className={`solaris-tabs-trigger ${isActive ? 'active' : ''} ${className}`}
      onClick={() => onValueChange(value)}
      data-state={isActive ? "active" : "inactive"}
      {...props}
    >
      {children}
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className = "", value, children, ...props }, ref) => {
  const { value: selectedValue } = useContext(TabsContext);
  const isActive = selectedValue === value;

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      className={`solaris-tabs-content ${className}`}
      data-state={isActive ? "active" : "inactive"}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };