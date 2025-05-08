import React, { useEffect } from "react";
import "./dialog.css";
import { X } from "lucide-react";

const Dialog = React.forwardRef(({ open, onOpenChange, children, ...props }, ref) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="solaris-dialog-overlay" onClick={() => onOpenChange && onOpenChange(false)}>
      <div 
        ref={ref}
        className="solaris-dialog"
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

Dialog.displayName = "Dialog";

const DialogContent = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div 
    ref={ref}
    className={`solaris-dialog-content ${className}`} 
    {...props}
  >
    <button 
      className="solaris-dialog-close"
      onClick={() => {
        const dialogElement = ref.current?.closest('.solaris-dialog-overlay');
        const dialogComponent = React.Children.toArray(dialogElement?.__reactProps$?.children)
          .find(child => child?.type?.displayName === "Dialog");
        dialogComponent?.props?.onOpenChange?.(false);
      }}
    >
      <X className="h-4 w-4" />
    </button>
    {children}
  </div>
));

DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div 
    ref={ref}
    className={`solaris-dialog-header ${className}`}
    {...props}
  >
    {children}
  </div>
));

DialogHeader.displayName = "DialogHeader";

const DialogFooter = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div 
    ref={ref}
    className={`solaris-dialog-footer ${className}`}
    {...props}
  >
    {children}
  </div>
));

DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <h2 
    ref={ref}
    className={`solaris-dialog-title ${className}`}
    {...props}
  >
    {children}
  </h2>
));

DialogTitle.displayName = "DialogTitle";

export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle };