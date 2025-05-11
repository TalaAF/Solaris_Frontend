import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Add this import to App.jsx
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Dashboard from './components/pages/Dashboard';
import Courses from './components/pages/Courses';
import CourseView from './components/courses/CourseView';
import ContentViewer from './components/courses/CourseContent/ContentViewer';
import Calendar from './components/pages/Calendar';
import Assessments from './components/pages/Assessments';
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
import { CourseProvider } from './context/CourseContext';

// Import admin pages
import AdminDashboard from './components/pages/Dashboards/AdminDashboard';
import UserManagement from './components/pages/Admin/Users';
import Departments from './components/pages/Admin/Departments';
import ContentManagement from './components/pages/Admin/ContentManagement'; 
import CertificateManagement from './components/pages/Admin/CertificateManagement';
import CourseManagement from './components/pages/Admin/CourseManagement';
import AssessmentManagement from './components/pages/Admin/AssessmentManagement';
import SecurityManage from './components/pages/Admin/Security';

// Import instructor pages
import InstructorDashboard from './components/pages/Dashboards/InstructorDashboard';
import InstructorCourses from './components/pages/instructor/InstructorCourses';
import InstructorCourseDetail from './components/pages/instructor/InstructorCourseDetail';
import CourseContent from './components/pages/instructor/CourseContent';
import StudentProgress from './components/pages/instructor/StudentProgress';
import StudentProgressDetail from './components/pages/instructor/StudentProgressDetail';

// Import course management components
import CourseDetails from './components/pages/Admin/CourseDetails';
import CourseSettings from './components/pages/Admin/CourseSettings';
import CourseStudents from './components/pages/Admin/CourseStudents';

import './App.css';

// Public Layout (for pages that don't require login but still use the main layout)
const PublicLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CourseProvider>
          <ErrorBoundary>
            <Router>
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
                  },
                  error: {
                    style: {
                      background: '#EF4444',
                    },
                  },
                }}
              />
              
              <Routes>
                {/* Auth routes - public routes outside the main layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/oauth2/success" element={<OAuthHandler />} />
                
                {/* Student routes - protected by authentication */}
                <Route element={<ProtectedRoute requiredRole="student" />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:courseId" element={<CourseView />} />
                  <Route path="/courses/:courseId/content/:moduleId/:itemId" element={<ContentViewer />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/assessments" element={<Assessments />} />
                  <Route path="/vr-lab" element={<VRLab />} />
                  <Route path="/clinical-skills" element={<ClinicalSkills />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/community" element={<Community />} />
                </Route>
                
                {/* Admin routes - protected by admin role */}
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/departments" element={<Departments />} />
                  <Route path="/admin/courses" element={<CourseManagement />} />
                  <Route path="/admin/courses/:id" element={<CourseDetails />} />
                  <Route path="/admin/courses/:id/settings" element={<CourseSettings />} />
                  <Route path="/admin/courses/:id/students" element={<CourseStudents />} />
                  <Route path="/admin/content" element={<ContentManagement />} />
                  <Route path="/admin/assessments" element={<AssessmentManagement />} />
                  <Route path="/admin/certificates" element={<CertificateManagement />} />
                  <Route path="/admin/security" element={<SecurityManage />} />
                </Route>
                
               {/* Instructor routes - protected by instructor role */}
                  <Route element={<ProtectedRoute requiredRole="instructor" />}>
                    <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                    <Route path="/instructor/courses" element={<InstructorCourses />} />
                    <Route path="/instructor/courses/:id" element={<InstructorCourseDetail />} />
                    <Route path="/instructor/courses/:id/content" element={<CourseContent />} />
                    <Route path="/instructor/student-progress" element={<StudentProgress />} />
                    <Route path="/instructor/student-progress/:studentId" element={<StudentProgressDetail />} />
                    <Route path="/instructor/content-management" element={<ContentManagement />} />
                    <Route path="/instructor/assessment-management" element={<AssessmentManagement />} />
                    <Route path="/instructor/calendar" element={<Calendar />} />
                  </Route>

                  {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </ErrorBoundary>
        </CourseProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;