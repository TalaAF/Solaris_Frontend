import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { currentUser, getUserRole } = useAuth();
  
  // Use both methods to determine the role for better reliability
  const role = getUserRole();
  
  const handleNavigateBack = () => {
    // Add debugging to see what roles are detected
    console.log("Current user:", currentUser);
    console.log("Detected role:", role);
    
    // Convert role to lowercase and check using includes for more flexibility
    const roleStr = String(role).toLowerCase();
    
    if (roleStr.includes('instructor')) {
      console.log("Navigating to instructor dashboard");
      navigate('/instructor/dashboard');
    } else if (roleStr.includes('admin')) {
      console.log("Navigating to admin dashboard");
      navigate('/admin/dashboard');
    } else {
      console.log("Navigating to student dashboard");
      navigate('/dashboard');
    }
  };

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or is still under development.</p>
        <button 
          className="solaris-button primary-button"
          onClick={handleNavigateBack}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;