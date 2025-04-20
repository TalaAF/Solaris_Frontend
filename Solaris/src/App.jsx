import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import Calendar from './components/Calendar';
import Assessments from './components/Assessments';
import Collaboration from './components/Collaboration';
import ClinicalSkills from './components/ClinicalSkills';
import Progress from './components/Progress';
import Community from './components/Community';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/clinical-skills" element={<ClinicalSkills />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
