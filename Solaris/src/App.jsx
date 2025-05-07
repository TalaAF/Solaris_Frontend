import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Add this import
import Layout from './components/layout/Layout';
import Dashboard from './components/pages/Dashboard';
import Courses from './components/pages/Courses';
import CourseView from './components/courses/CourseView';
import ContentViewer from './components/courses/CourseContent/ContentViewer';
import Calendar from './components/pages/Calendar';
import Assessments from './components/pages/Assessments';
import Collaboration from './components/pages/Collaboration';
import ClinicalSkills from './components/pages/ClinicalSkills';
import Progress from './components/pages/ProgressSection';
import Community from './components/pages/Community';
import VRLab from './components/pages/VRLab';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import OAuthHandler from './components/auth/OAuthHandler';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './components/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';

// Import admin pages
import AdminDashboard from './components/pages/Dashboards/AdminDashboard';
import UserManagement from './components/pages/Admin/Users';
import Departments from './components/pages/Admin/Departments'; // New import
import ContentManagement from './components/pages/Admin/ContentManagement'; 
import CertificateManagement from './components/pages/Admin/CertificateManagement'; // New import
import CourseManagement from './components/pages/Admin/CourseManagement'; // New import
import AssessmentManagement from './components/pages/Admin/AssessmentManagement'; // New import
import SecurityManage from './components/pages/Admin/Security'; // New import

// Import instructor pages
import InstructorDashboard from './components/pages/Dashboards/InstructorDashboard';

// Import course management components
import CourseDetails from './components/pages/Admin/CourseDetails';
import CourseSettings from './components/pages/Admin/CourseSettings';
import CourseStudents from './components/pages/Admin/CourseStudents';

import './App.css';
import { Security } from '@mui/icons-material';

// Simple Layout wrapper (no auth check)
const SimpleLayout = ({ children }) => {
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ErrorBoundary>
          <Router>
            {/* Add Toaster component here */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '12px 20px',
                },
                success: {
                  style: {
                    background: '#10B981',
                  },
                  iconTheme: {
                    primary: 'white',
                    secondary: '#10B981',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                  },
                  iconTheme: {
                    primary: 'white',
                    secondary: '#EF4444',
                  },
                },
              }}
            />
            
            <Routes>
              {/* Auth routes - outside the main layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/oauth2/success" element={<OAuthHandler />} />
              
              {/* Student routes */}
              <Route element={<SimpleLayout />}>
                {/* Main pages */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:courseId" element={<CourseView />} />
                <Route path="/courses/:courseId/content/:moduleId/:itemId" element={<ContentViewer />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/vr-lab" element={<VRLab />} />
                <Route path="/clinical-skills" element={<ClinicalSkills />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/community" element={<Community />} />
              </Route>
              
              {/* Admin routes - no auth check for now */}
              <Route element={<SimpleLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/departments" element={<Departments />} />
                <Route path="/admin/courses" element={<CourseManagement />} />
                
                {/* New course management routes */}
                <Route path="/admin/courses/:id" element={<CourseDetails />} />
                <Route path="/admin/courses/:id/settings" element={<CourseSettings />} />
                <Route path="/admin/courses/:id/students" element={<CourseStudents />} />
                
                <Route path="/admin/content" element={<ContentManagement />} />
                <Route path="/admin/assessments" element={<AssessmentManagement />} />
                <Route path="/admin/certificates" element={<CertificateManagement />} />
                <Route path="/admin/security" element={<SecurityManage />} />
                {/* Add more admin routes as you implement them */}
              </Route>
              
              {/* Instructor routes - no auth check for now */}
              <Route element={<SimpleLayout />}>
                <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                {/* Add more instructor routes as you implement them */}
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </ErrorBoundary>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;