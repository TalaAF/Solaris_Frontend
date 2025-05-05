import api from "./api";

class AuthService {
  // Login with email and password
  async login(email, password) {
    try {
      // Add /api prefix to the endpoint if your backend expects it
      const response = await api.post("/auth/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
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
      const response = await api.post("/auth/register", userData);

      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout user
  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage regardless of API success
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    }
  }

  // Get current user info
  async getCurrentUser() {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        return null;
      }

      // Ensure token is set in headers for this request
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await api.get("/auth/me");
        return response; // Return the full response
      } catch (firstError) {
        // Check if token expired
        if (firstError.response && firstError.response.status === 401) {
          // Try to refresh the token and retry
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry with new token
            const retryResponse = await api.get("/auth/me");
            return retryResponse;
          }
        }
        throw firstError; // Re-throw if it wasn't an auth error or refresh failed
      }
    } catch (error) {
      console.error("Get current user error:", error);
      // If token is invalid, clear it
      if (
        error.response &&
        (error.response.status === 401 ||
          error.response.status === 403 ||
          error.response.status === 500)
      ) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        delete api.defaults.headers.common["Authorization"]; // Also remove from headers
      }
      return null;
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      return await api.post("/auth/forgot-password", { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Reset password with token
  async resetPassword(token, password) {
    try {
      return await api.post("/auth/reset-password", { token, password });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle OAuth login with token
  async handleOAuthLogin(token) {
    try {
      if (!token) {
        throw new Error("No OAuth token provided");
      }

      // Store the JWT token
      localStorage.setItem("auth_token", token);

      // Configure API header with the new token
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        // Get user info with the token
        const response = await api.get("/auth/me");

        // Store user data
        if (response.data) {
          localStorage.setItem("user_data", JSON.stringify(response.data));
        }

        return { data: { user: response.data, token } };
      } catch (error) {
        // Check if token expired immediately (server time mismatch)
        if (error.response && error.response.status === 401) {
          // Try to refresh the token
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry with new token
            const retryResponse = await api.get("/auth/me");
            if (retryResponse.data) {
              localStorage.setItem(
                "user_data",
                JSON.stringify(retryResponse.data),
              );
            }
            return {
              data: {
                user: retryResponse.data,
                token: localStorage.getItem("auth_token"),
              },
            };
          }
        }
        throw error;
      }
    } catch (error) {
      // If OAuth authentication fails, clean up
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      delete api.defaults.headers.common["Authorization"]; // Clear header if authentication fails
      console.error("OAuth login error:", error);
      throw this.handleError(error);
    }
  }

  // Validate OAuth token
  async validateOAuthToken(token) {
    try {
      return await api.post("/auth/validate-oauth-token", { token });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("auth_token");
  }

  // Initialize auth state - call this when your app starts
  initAuth() {
    const token = localStorage.getItem("auth_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return this.isAuthenticated();
  }

  // Add a refresh token method
  async refreshToken() {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("No token available to refresh");
      }

      // Set the current token in the request
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Call refresh token endpoint
      const response = await api.post("/auth/refresh-token");

      // Update token in localStorage and API headers
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        api.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.token}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, log user out
      this.logout();
      return false;
    }
  }

  // Add a proper handleError method
  handleError(error) {
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      if (status === 401) {
        errorMessage = data.message || "Invalid credentials";
      } else if (status === 403) {
        errorMessage = data.message || "Access denied";
      } else if (status === 404) {
        errorMessage = data.message || "Resource not found";
      } else if (status === 422 || status === 400) {
        errorMessage = data.message || "Invalid input data";
      } else {
        errorMessage = data.message || `Error: ${status}`;
      }
    } else if (error.request) {
      // Request made but no response
      errorMessage = "No response from server. Please check your connection.";
    } else {
      // Something else happened
      errorMessage = error.message || errorMessage;
    }

    return new Error(errorMessage);
  }
}

export default new AuthService();
