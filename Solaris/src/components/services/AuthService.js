// AuthService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const USE_MOCK = true; // Set to false when backend is ready

// Mock data
const MOCK_USERS = [
  {
    id: '1',
    name: 'Student User',
    email: 'student@example.com',
    roles: ['student'],
    profileImage: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Instructor User',
    email: 'instructor@example.com',
    roles: ['instructor'],
    profileImage: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    roles: ['admin', 'instructor'],
    profileImage: 'https://i.pravatar.cc/150?img=3'
  }
];

class AuthService {
  async mockDelay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(email, password) {
    if (USE_MOCK) {
      await this.mockDelay(800);
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) throw new Error("User not found");
      return { data: { user, token: "mock-token-123" } };
    }
    
    try {
      return await axios.post(`${API_URL}/auth/login`, { email, password });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(userData) {
    if (USE_MOCK) {
      await this.mockDelay(1000);
      // Mock validation
      if (!userData.email || !userData.password) {
        throw new Error("Email and password are required");
      }
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error("User already exists");
      }
      
      // Create new user
      const newUser = {
        id: 'mock-' + Math.random().toString(36).substr(2, 9),
        name: userData.name || 'New User',
        email: userData.email,
        roles: ['student'], // Default role for new users
        profileImage: 'https://i.pravatar.cc/150?img=7'
      };
      
      MOCK_USERS.push(newUser);
      return { data: { user: newUser, token: "mock-token-" + newUser.id } };
    }
    
    try {
      return await axios.post(`${API_URL}/auth/register`, userData);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    if (USE_MOCK) {
      await this.mockDelay();
      const userJson = localStorage.getItem('mock_user');
      return userJson ? { data: JSON.parse(userJson) } : null;
    }
    
    try {
      return await axios.get(`${API_URL}/auth/me`);
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  }

  async logout() {
    if (USE_MOCK) {
      await this.mockDelay();
      localStorage.removeItem('mock_user');
      return { data: { success: true } };
    }
    
    try {
      return await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  // Helper to get stored token
  getToken() {
    return localStorage.getItem('auth_token');
  }

  // Helper to check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();