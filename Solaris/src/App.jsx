import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
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
      </Routes>
    </Router>
  );
}

export default App;