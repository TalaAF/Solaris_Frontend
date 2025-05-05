<<<<<<< HEAD
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // This will be forwarded to your server with a proxy
  headers: {
    "Content-Type": "application/json",
=======
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // This will be forwarded to your server with a proxy
  headers: {
    'Content-Type': 'application/json',
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  },
});

// Add request interceptor to set authentication token
api.interceptors.request.use(
  (config) => {
<<<<<<< HEAD
    console.log(
      "API Request:",
      config.method.toUpperCase(),
      config.baseURL + config.url,
    );
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
=======
    console.log('API Request:', config.method.toUpperCase(), config.baseURL + config.url);
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
<<<<<<< HEAD
  },
=======
  }
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
);

// Add a response interceptor to handle token expiration globally
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
<<<<<<< HEAD
  failedQueue.forEach((prom) => {
=======
  failedQueue.forEach(prom => {
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
<<<<<<< HEAD

=======
  
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  failedQueue = [];
};

api.interceptors.response.use(
<<<<<<< HEAD
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

=======
  response => response,
  async error => {
    const originalRequest = error.config;
    
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    // If error is not 401 or request already tried after refresh, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
<<<<<<< HEAD

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
      // Import needed here to avoid circular dependency
      const AuthService = require("./AuthService").default;
      const refreshed = await AuthService.refreshToken();

      if (refreshed) {
        const newToken = localStorage.getItem("auth_token");
        processQueue(null, newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
=======
    
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // Import needed here to avoid circular dependency
      const AuthService = require('./AuthService').default;
      const refreshed = await AuthService.refreshToken();
      
      if (refreshed) {
        const newToken = localStorage.getItem('auth_token');
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        return api(originalRequest);
      } else {
        processQueue(error, null);
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
<<<<<<< HEAD
  },
);

export default api;
=======
  }
);

export default api;
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
