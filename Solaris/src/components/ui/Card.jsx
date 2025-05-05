<<<<<<< HEAD
import React from "react";
=======
import React from 'react';
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
<<<<<<< HEAD
    className={`rounded-lg border bg-white shadow-sm ${className || ""}`}
=======
    className={`rounded-lg border bg-white shadow-sm ${className || ''}`}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
<<<<<<< HEAD
    className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}
=======
    className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
<<<<<<< HEAD
    className={`text-2xl font-semibold leading-none tracking-tight ${className || ""}`}
=======
    className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
<<<<<<< HEAD
    className={`text-sm text-gray-500 ${className || ""}`}
=======
    className={`text-sm text-gray-500 ${className || ''}`}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
<<<<<<< HEAD
  <div ref={ref} className={`p-6 pt-0 ${className || ""}`} {...props} />
=======
  <div ref={ref} className={`p-6 pt-0 ${className || ''}`} {...props} />
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
<<<<<<< HEAD
    className={`flex items-center p-6 pt-0 ${className || ""}`}
=======
    className={`flex items-center p-6 pt-0 ${className || ''}`}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

<<<<<<< HEAD
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
=======
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
