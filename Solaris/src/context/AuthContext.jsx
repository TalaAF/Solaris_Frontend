import React, { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/AuthService";

// Create auth context
const AuthContext = createContext();

// Hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load user data on app start
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      
      try {
        const response = await AuthService.getCurrentUser();
        if (response && response.data) {
          setCurrentUser(response.data);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        // Don't set error here, just log it
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  const login = async (email, password) => {
    setIsLoggingIn(true);
    try {
      const response = await AuthService.login(email, password);
      setCurrentUser(response.data.user);
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      setError(null);
      return response.data.user;
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const register = async (userData) => {
    setIsRegistering(true);
    try {
      const response = await AuthService.register(userData);
      setCurrentUser(response.data.user);
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      setError(null);
      return response.data.user;
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };
  
  const setOAuthUser = (userData) => {
    if (userData) {
      setCurrentUser(userData);
      setError(null);
    }
  };
  
  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
      setCurrentUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    } catch (err) {
      console.error("Logout error:", err);
      // Still remove user from context even if API fails
      setCurrentUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  // Update the hasRole function to handle both arrays and single role
  const hasRole = (role) => {
    if (!currentUser || !currentUser.roles) return false;
    
    // If roles is an array in the user object
    if (Array.isArray(currentUser.roles)) {
      return currentUser.roles.includes(role);
    }
    
    // If role is stored as a single string property
    return currentUser.role === role;
  };
  
  // Get user's role - update this function to default to admin
const getUserRole = () => {
  // FOR DEVELOPMENT: Always return 'admin' to work on admin pages
  return 'admin';
  
  // ORIGINAL CODE (comment out for now)
  /*
  if (!currentUser) return 'admin'; // Default role
  
  // If roles is an array, return the first one (primary role)
  if (Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
    return currentUser.roles[0];
  }
  
  // If role is stored as a string
  return currentUser.role || 'admin'; // Default to 'student' if no role found
  */
};
  // Make sure it's included in your context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    setOAuthUser,
    hasRole,
    getUserRole, // Add this new function to the context
    isAuthenticated: !!currentUser,
    isLoggingIn,
    isRegistering,
    isLoggingOut
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;