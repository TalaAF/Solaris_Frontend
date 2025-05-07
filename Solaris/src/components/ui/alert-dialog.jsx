import React, { useEffect, useState, useRef } from "react";
import "./alert-dialog.css";

const AlertDialogContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const AlertDialog = ({ children, open: controlledOpen, onOpenChange }) => {
  const [open, setLocalOpen] = useState(controlledOpen || false);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setLocalOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleOpenChange = (newOpen) => {
    setLocalOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <AlertDialogContext.Provider value={{ open, setOpen: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

const AlertDialogTrigger = React.forwardRef(({ children, className = "", ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext);

  return (
    <button
      ref={ref}
      onClick={() => setOpen(true)}
      className={`solaris-alert-dialog-trigger ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";

const AlertDialogPortal = ({ children }) => {
  return children;
};

const AlertDialogOverlay = React.forwardRef(({ className = "", ...props }, ref) => {
  const { open } = React.useContext(AlertDialogContext);
  
  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`solaris-alert-dialog-overlay ${open ? 'open' : ''} ${className}`}
      {...props}
    />
  );
});
AlertDialogOverlay.displayName = "AlertDialogOverlay";

const AlertDialogContent = React.forwardRef(({ className = "", children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(AlertDialogContext);
  const contentRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setOpen(false);
        }
      };
      
      const handleOutsideClick = (e) => {
        if (contentRef.current && !contentRef.current.contains(e.target)) {
          setOpen(false);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleOutsideClick);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="solaris-alert-dialog-container">
      <AlertDialogOverlay />
      <div
        ref={(node) => {
          // Merge refs
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          contentRef.current = node;
        }}
        role="alertdialog"
        aria-modal={true}
        className={`solaris-alert-dialog-content ${open ? 'open' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({ className = "", ...props }) => (
  <div className={`solaris-alert-dialog-header ${className}`} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className = "", ...props }) => (
  <div className={`solaris-alert-dialog-footer ${className}`} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h2 ref={ref} className={`solaris-alert-dialog-title ${className}`} {...props} />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`solaris-alert-dialog-description ${className}`} {...props} />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogAction = React.forwardRef(({ className = "", ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext);
  
  return (
    <button
      ref={ref}
      className={`solaris-button solaris-alert-dialog-action ${className}`}
      onClick={(e) => {
        props.onClick?.(e);
        if (!e.defaultPrevented) {
          setOpen(false);
        }
      }}
      {...props}
    />
  );
});
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef(({ className = "", ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext);
  
  return (
    <button
      ref={ref}
      className={`solaris-button solaris-alert-dialog-cancel ${className}`}
      onClick={(e) => {
        props.onClick?.(e);
        if (!e.defaultPrevented) {
          setOpen(false);
        }
      }}
      {...props}
    />
  );
});
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};