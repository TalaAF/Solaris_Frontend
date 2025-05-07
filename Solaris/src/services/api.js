import axios from "axios";

// Use Vite's environment variable format instead of process.env
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Rest of your interceptors code remains the same

// Add request interceptor to set authentication token
api.interceptors.request.use(
  (config) => {
    console.log(
      "API Request:",
      config.method.toUpperCase(),
      config.baseURL + config.url
    );
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration globally
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is not 401 or request already tried after refresh, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // Fix: Handle circular dependency properly
      // Dynamically import AuthService only when needed
      const AuthService = (await import('./AuthService')).default;
      const refreshed = await AuthService.refreshToken();
      
      if (refreshed) {
        const newToken = localStorage.getItem("auth_token");
        processQueue(null, newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        processQueue(error, null);
        return Promise.reject(error);
      }
    } catch (refreshError) {
      console.error("Token refresh error:", refreshError);
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Debug method to verify API is properly configured
api.testConnection = async () => {
  try {
    console.log("Testing API connection...");
    const response = await api.get("/progress-visualization/health-check");
    console.log("API connection successful:", response.data);
    return true;
  } catch (error) {
    console.error("API connection failed:", error);
    return false;
  }
};

export default api;