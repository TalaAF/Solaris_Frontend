<<<<<<< HEAD
import React, { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/AuthService";
=======
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/AuthService';
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2

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
<<<<<<< HEAD

=======
      
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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
<<<<<<< HEAD

    loadUser();
  }, []);

=======
    
    loadUser();
  }, []);
  
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  const login = async (email, password) => {
    setIsLoggingIn(true);
    try {
      const response = await AuthService.login(email, password);
      setCurrentUser(response.data.user);
<<<<<<< HEAD

      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }

=======
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
      setError(null);
      return response.data.user;
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  };
<<<<<<< HEAD

=======
  
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  const register = async (userData) => {
    setIsRegistering(true);
    try {
      const response = await AuthService.register(userData);
      setCurrentUser(response.data.user);
<<<<<<< HEAD

      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }

=======
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
      setError(null);
      return response.data.user;
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };
<<<<<<< HEAD

=======
  
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  // Add this method to your AuthProvider if it's missing
  const setOAuthUser = (userData) => {
    if (userData) {
      setCurrentUser(userData);
      setError(null);
    }
  };
<<<<<<< HEAD

=======
  
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
      setCurrentUser(null);
<<<<<<< HEAD
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
=======
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    } catch (err) {
      console.error("Logout error:", err);
      // Still remove user from context even if API fails
      setCurrentUser(null);
<<<<<<< HEAD
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
=======
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    } finally {
      setIsLoggingOut(false);
    }
  };
<<<<<<< HEAD

  const hasRole = (role) => {
    return currentUser?.roles?.includes(role) || false;
  };

=======
  
  const hasRole = (role) => {
    return currentUser?.roles?.includes(role) || false;
  };
  
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  // Make sure it's included in your context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    setOAuthUser, // Must include this
    hasRole,
    isAuthenticated: !!currentUser,
    isLoggingIn,
    isRegistering,
<<<<<<< HEAD
    isLoggingOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
=======
    isLoggingOut
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
