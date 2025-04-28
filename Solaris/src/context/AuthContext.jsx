import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/AuthService';

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
  
  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
      setCurrentUser(null);
      localStorage.removeItem('auth_token');
    } catch (err) {
      console.error("Logout error:", err);
      // Still remove user from context even if API fails
      setCurrentUser(null);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const hasRole = (role) => {
    return currentUser?.roles?.includes(role) || false;
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
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