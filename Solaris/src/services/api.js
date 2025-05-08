import axios from 'axios';

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get user ID from token
const getCurrentUserId = () => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiYTM5NGQwYTEtMDJlNC00OGQ5LTllOTMtZTc3MDA3ZjBjZThhIiwicGVybWlzc2lvbnMiOlsiYWRtaW46YWNjZXNzIiwiY29udGVudDpjcmVhdGUiLCJjb250ZW50OmRlbGV0ZSIsImNvbnRlbnQ6cmVhZCIsImNvbnRlbnQ6dXBkYXRlIiwiY291cnNlOmNyZWF0ZSIsImNvdXJzZTpkZWxldGUiLCJjb3Vyc2U6cmVhZCIsImNvdXJzZTp1cGRhdGUiLCJkZXBhcnRtZW50OmNyZWF0ZSIsImRlcGFydG1lbnQ6ZGVsZXRlIiwiZGVwYXJ0bWVudDpyZWFkIiwiZGVwYXJ0bWVudDp1cGRhdGUiLCJlbnJvbGxtZW50OmNyZWF0ZSIsImVucm9sbG1lbnQ6ZGVsZXRlIiwiZW5yb2xsbWVudDpyZWFkIiwiZW5yb2xsbWVudDp1cGRhdGUiLCJ1c2VyOmNyZWF0ZSIsInVzZXI6ZGVsZXRlIiwidXNlcjpyZWFkIiwidXNlcjp1cGRhdGUiXSwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJpc3N1ZWRBdCI6MTc0NjY3ODA4NzY0MywidHlwZSI6ImFjY2VzcyIsInVzZXJJZCI6MTgsInN1YiI6ImFkbWluQGV4YW1wbGUxLmNvbSIsImlhdCI6MTc0NjY3ODA4NywiZXhwIjoxNzQ2NjgxNjg3LCJpc3MiOiJsbXMtYXBwbGljYXRpb24iLCJqdGkiOiI3ZDZjZmQwNS1lYjZmLTRhZTItODc4My1mMjA5ZjhhNzhiZWEifQ.5t088ZOVWHrH0rdvorKGpXW5hjMm93Nw4rABAdt3Xlo';
    const decodedToken = decodeToken(token);
    return decodedToken?.userId || null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

// Get current student info from enrollment response
const getCurrentStudentInfo = async () => {
  try {
    const response = await api.get('/enrollments/student/7');
    if (response.data && response.data.length > 0) {
      const firstEnrollment = response.data[0];
      return {
        studentId: firstEnrollment.studentId,
        studentName: firstEnrollment.studentName
      };
    }
    throw new Error('No enrollment data found');
  } catch (error) {
    console.error('Error getting student info:', error);
    return null;
  }
};

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiYTM5NGQwYTEtMDJlNC00OGQ5LTllOTMtZTc3MDA3ZjBjZThhIiwicGVybWlzc2lvbnMiOlsiYWRtaW46YWNjZXNzIiwiY29udGVudDpjcmVhdGUiLCJjb250ZW50OmRlbGV0ZSIsImNvbnRlbnQ6cmVhZCIsImNvbnRlbnQ6dXBkYXRlIiwiY291cnNlOmNyZWF0ZSIsImNvdXJzZTpkZWxldGUiLCJjb3Vyc2U6cmVhZCIsImNvdXJzZTp1cGRhdGUiLCJkZXBhcnRtZW50OmNyZWF0ZSIsImRlcGFydG1lbnQ6ZGVsZXRlIiwiZGVwYXJ0bWVudDpyZWFkIiwiZGVwYXJ0bWVudDp1cGRhdGUiLCJlbnJvbGxtZW50OmNyZWF0ZSIsImVucm9sbG1lbnQ6ZGVsZXRlIiwiZW5yb2xsbWVudDpyZWFkIiwiZW5yb2xsbWVudDp1cGRhdGUiLCJ1c2VyOmNyZWF0ZSIsInVzZXI6ZGVsZXRlIiwidXNlcjpyZWFkIiwidXNlcjp1cGRhdGUiXSwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJpc3N1ZWRBdCI6MTc0NjY3ODA4NzY0MywidHlwZSI6ImFjY2VzcyIsInVzZXJJZCI6MTgsInN1YiI6ImFkbWluQGV4YW1wbGUxLmNvbSIsImlhdCI6MTc0NjY3ODA4NywiZXhwIjoxNzQ2NjgxNjg3LCJpc3MiOiJsbXMtYXBwbGljYXRpb24iLCJqdGkiOiI3ZDZjZmQwNS1lYjZmLTRhZTItODc4My1mMjA5ZjhhNzhiZWEifQ.5t088ZOVWHrH0rdvorKGpXW5hjMm93Nw4rABAdt3Xlo'
  }
});

// Add request interceptor to log requests and handle errors
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Received response:', response.status);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Add getCurrentUserId method to api object
api.getCurrentUserId = getCurrentUserId;

// Add getCurrentStudentInfo method to api object
api.getCurrentStudentInfo = getCurrentStudentInfo;

export default api;