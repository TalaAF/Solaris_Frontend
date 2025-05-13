import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../layout/Layout';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role requirements
 * 
 * @param {String} requiredRole - The role required to access this route
 */
const ProtectedRoute = ({ requiredRole }) => {
  const { currentUser, loading, getUserRole } = useAuth();
  const location = useLocation();
  const role = getUserRole();
  
  console.log("ProtectedRoute - Required role:", requiredRole);
  console.log("ProtectedRoute - User role:", role);
  console.log("ProtectedRoute - Current user:", currentUser);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has required role
  if (requiredRole) {
    const roleStr = String(role).toLowerCase();
    const requiredRoleStr = String(requiredRole).toLowerCase();
    
    console.log(`Checking if ${roleStr} includes ${requiredRoleStr}`);
    
    if (!roleStr.includes(requiredRoleStr)) {
      console.log("User doesn't have required role, redirecting to appropriate dashboard");
      
      // Redirect to appropriate dashboard based on actual role
      if (roleStr.includes('instructor')) {
        return <Navigate to="/instructor/dashboard" replace />;
      } else if (roleStr.includes('admin')) {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  // If authenticated and has required role, render the route with layout
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;