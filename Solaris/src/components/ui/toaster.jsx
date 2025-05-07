import React, { useEffect, useState } from "react";
import { Toaster as SonnerToaster, toast } from "sonner";
import "./toaster.css";

// Simple theme implementation without next-themes dependency
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Check for saved theme preference or use system default
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "system";
    }
    return "system";
  });

  useEffect(() => {
    if (theme !== "system") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return { theme, setTheme };
};

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <SonnerToaster
      theme={theme}
      className="solaris-toaster"
      toastOptions={{
        classNames: {
          toast: "solaris-toast",
          description: "solaris-toast-description",
          actionButton: "solaris-toast-action-button",
          cancelButton: "solaris-toast-cancel-button",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };