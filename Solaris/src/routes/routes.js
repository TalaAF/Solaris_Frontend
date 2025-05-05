<<<<<<< HEAD
import React from "react";
import { Navigate } from "react-router-dom";

// Auth components
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import OAuthHandler from "../components/auth/OAuthHandler";
=======
import React from 'react';
import { Navigate } from 'react-router-dom';

// Auth components
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import OAuthHandler from '../components/auth/OAuthHandler';
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2

// Other components and route definitions...

const routes = [
  // Public routes
  {
<<<<<<< HEAD
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/oauth2/success",
=======
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/oauth2/success',
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    element: <OAuthHandler />,
  },
  // Other routes...
];

<<<<<<< HEAD
export default routes;
=======
export default routes;
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
