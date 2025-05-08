import React, { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/AuthService";
import { toast } from "react-hot-toast"; // Import toast for notifications

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
        // Check if token exists
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }
        
        const response = await AuthService.getCurrentUser();
        if (response && response.data) {
          setCurrentUser(response.data);
        } else {
          // If no valid user data, clear token
          localStorage.removeItem('auth_token');
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        localStorage.removeItem('auth_token');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  const login = async (email, password) => {
    setIsLoggingIn(true);
    setError(null);
    
    try {
      const response = await AuthService.login(email, password);
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        
        // Get user data
        const userResponse = await AuthService.getCurrentUser();
        if (userResponse && userResponse.data) {
          setCurrentUser(userResponse.data);
          toast.success("Login successful!");
          return userResponse.data;
        }
      }
      
      throw new Error("Invalid response from server");
    } catch (err) {
      const errorMessage = err.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const register = async (userData) => {
    setIsRegistering(true);
    setError(null);
    
    try {
      const response = await AuthService.register(userData);
      
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        
        // Get user data
        const userResponse = await AuthService.getCurrentUser();
        if (userResponse && userResponse.data) {
          // Log the user data to see its structure
          console.log("User data after registration:", userResponse.data);
          
          // Set current user
          setCurrentUser(userResponse.data);
          toast.success("Registration successful!");
          return userResponse.data;
        }
      }
      
      throw new Error("Invalid response from server");
    } catch (err) {
      const errorMessage = err.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };
  
  const setOAuthUser = (userData) => {
    if (userData) {
      setCurrentUser(userData);
      setError(null);
      toast.success("OAuth login successful!");
    }
  };
  
  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
      setCurrentUser(null);
      localStorage.removeItem('auth_token');
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      // Still remove user from context even if API fails
      setCurrentUser(null);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  // Update the hasRole function to handle both arrays and single role
  const hasRole = (role) => {
    if (!currentUser || !currentUser.role) return false;
    
    // If roles is an array in the user object
    if (Array.isArray(currentUser.roles)) {
      return currentUser.roles.includes(role);
    }
    
    // If role is stored as a single string property
    return currentUser.role === role;
  };
  
  // Update the getUserRole function to handle complex role objects
  const getUserRole = () => {
    if (!currentUser) return null;
    
    // When roles is an array of objects with a name property
    if (Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
      console.log("Found roles array:", currentUser.roles);
      // Extract the name property from the role object
      if (currentUser.roles[0].name) {
        return currentUser.roles[0].name;
      }
      return currentUser.roles[0]; // Fallback
    }
    
    // Check for direct role property
    if (currentUser.role) {
      return currentUser.role;
    }
    
    return 'STUDENT'; // Default fallback
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    setOAuthUser,
    hasRole,
    getUserRole, 
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