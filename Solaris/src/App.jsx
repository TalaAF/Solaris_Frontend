<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Courses from "./components/Courses";
import Calendar from "./components/Calendar";
import Assessments from "./components/Assessments";
import Collaboration from "./components/Collaboration";
import ClinicalSkills from "./components/ClinicalSkills";
import Progress from "./components/ProgressSection";
import Community from "./components/Community";
import { NotificationProvider } from "./components/NotificationContext";
import "./App.css";
=======
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
// Add these two imports
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import OAuthHandler from './components/auth/OAuthHandler';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import './App.css';
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2

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
<<<<<<< HEAD
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/clinical-skills" element={<ClinicalSkills />} />
          <Route path="/progress" element={<Progress progressData={[]} />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </Router>
    </NotificationProvider>
=======
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes - outside the main layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth2/success" element={
     
          <OAuthHandler />
       
      } />
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
          </Route>
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  );
}

export default App;
