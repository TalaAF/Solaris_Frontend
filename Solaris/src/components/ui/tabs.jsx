import * as React from "react";
import { cn } from "../../lib/utils";

const TabsContext = React.createContext(null);

const Tabs = React.forwardRef(
  ({ value, defaultValue, onValueChange, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(
      value || defaultValue || "",
    );

    React.useEffect(() => {
      if (value !== undefined && value !== activeTab) {
        setActiveTab(value);
      }
    }, [value]);

    const handleTabChange = (newValue) => {
      setActiveTab(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    return (
      <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange }}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className,
    )}
    role="tablist"
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab, onTabChange } = React.useContext(TabsContext);
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-background text-foreground shadow",
          className,
        )}
        onClick={() => onTabChange(value)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab } = React.useContext(TabsContext);
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
