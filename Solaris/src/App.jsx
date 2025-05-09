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
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import OAuthHandler from './components/auth/OAuthHandler';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './components/NotificationContext';
import InstructorDashboard from './components/pages/instructor/InstructorDashboard.jsx';
import Students from "./components/pages/instructor/Students";
import InstructorCourse from "./components/pages/instructor/InstructorCourse";
import InstructProfilePage from './components/pages/instructor/InstructProfilePage';
import './App.css';

// Temporarily bypass authentication for development
const RequireAuth = ({ children }) => {
  // Simply return children without checking authentication
  return children;
  
  /* Original code - comment it out for now
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
  */
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/oauth2/success" element={<OAuthHandler />} />
            
            {/* Protected routes - with layout */}
            <Route element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }>
              {/* Main pages */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Courses section with nested routes */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseView />} />
              <Route path="/courses/:courseId/content/:moduleId/:itemId" element={<ContentViewer />} />
              
              {/* Other pages */}
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/collaboration" element={<Collaboration />} />
              <Route path="/clinical-skills" element={<ClinicalSkills />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/community" element={<Community />} />
              

              <Route
  path="/instructor/dashboard"
  element={
    <RequireAuth>
      <Layout />
    </RequireAuth>
  }
>
  {/* Default Dashboard Page */}
  <Route index element={<InstructorDashboard />} />

  {/* Nested Instructor Pages */}
  <Route path="students" element={<Students />} />
  <Route path="Instructorcourse" element={<InstructorCourse />} />
  <Route path="InstructProfilePage" element={<InstructProfilePage />} />  
  {/* Add more nested routes as needed */}  
</Route>
            <Route path="/oauth" element={<OAuthHandler />} />


            {/* Instructor routes */}
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/students" element={<Students />} />
            <Route path="/InstructorCourse" element={<InstructorCourse />} />

            {/* Other routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseView />} />
            <Route path="/courses/:courseId/content/:moduleId/:itemId" element={<ContentViewer />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/collaboration" element={<Collaboration />} />
            <Route path="/clinical-skills" element={<ClinicalSkills />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/community" element={<Community />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;