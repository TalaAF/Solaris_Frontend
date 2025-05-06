import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Import instructor pages
import InstructorDashboard from './components/pages/Dashboards/InstructorDashboard';

import './App.css';

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