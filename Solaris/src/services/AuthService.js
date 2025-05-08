import api from "./api";

class AuthService {
  // Login with email and password
  async login(email, password) {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        // Set token in axios default headers
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      }
      
      return response;
    } catch (error) {
      console.error("Login error details:", error);
      throw this.handleError(error);
    }
  }
  
  // Register a new user
  async register(userData) {
    try {
      const response = await api.post("/api/auth/register", userData);
      
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        // Set token in axios default headers
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        // Set token in header for this request
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await api.post("/api/auth/logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage and auth header
      localStorage.removeItem("auth_token");
      delete api.defaults.headers.common["Authorization"];
    }
  }
  
  // Get current user info
  async getCurrentUser() {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        return null;
      }
      
      // Set token in header for this request
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      const response = await api.get("/api/auth/me");
      return response;
    } catch (error) {
      console.error("Get current user error:", error);
      
      // If token is invalid, clear it
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("auth_token");
        delete api.defaults.headers.common["Authorization"];
      }
      throw error;
    }
  }
  
  // Request password reset
  async requestPasswordReset(email) {
    try {
      return await api.post("/api/auth/forgot-password", { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Reset password with token
  async resetPassword(token, password) {
    try {
      return await api.post("/api/auth/reset-password", { token, password });
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Handle OAuth login
  async handleOAuthLogin(token) {
    try {
      if (!token) {
        throw new Error("No OAuth token provided");
      }
      
      // Store the JWT token
      localStorage.setItem("auth_token", token);
      
      // Set token in axios default headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Get user info with the token
      const response = await api.get("/api/auth/me");
      
      return { data: { user: response.data, token } };
    } catch (error) {
      // If OAuth authentication fails, clean up
      localStorage.removeItem("auth_token");
      delete api.defaults.headers.common["Authorization"];
      console.error("OAuth login error:", error);
      throw this.handleError(error);
    }
  }
  
  // Error handler
  handleError(error) {
    let errorMessage = "An unexpected error occurred";
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        errorMessage = "Invalid credentials";
      } else if (status === 403) {
        errorMessage = "Access denied";
      } else if (status === 404) {
        errorMessage = "Resource not found";
      } else if (data && data.message) {
        errorMessage = data.message;
      }
    } else if (error.request) {
      // Request made but no response received
      errorMessage = "No response from server. Please check your connection.";
    }
    
    return new Error(errorMessage);
  }
}

export default new AuthService();