import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StudentDashboard from './Dashboards/StudentDashboard';
import AdminDashboard from './Dashboards/AdminDashboard';
import InstructorDashboard from './Dashboards/InstructorDashboard';

const Dashboard = () => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();
  
  // Route to the appropriate dashboard based on role
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};

export default Dashboard;