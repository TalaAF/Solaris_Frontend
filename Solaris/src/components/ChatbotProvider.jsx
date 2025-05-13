import React from 'react';
import { useAuth } from '../context/AuthContext';
import Chatbot from './Chatbot';

const ChatbotProvider = () => {
  const { currentUser, getUserRole } = useAuth();
  const userRole = getUserRole();
  
  console.log("ChatbotProvider rendering with role:", userRole); // Add debugging
  
  // TEMPORARILY COMMENT OUT THE ROLE CHECK FOR TESTING
  // if (userRole !== 'student' && userRole !== 'instructor') {
  //   return null;
  // }
  
  // User profile information
  const profile = {
    name: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Test User'
  };
  
  // Course information based on role
  const courses = userRole === 'student' 
    ? ['Anatomy 101', 'Clinical Skills', 'Biochemistry', 'Medical Ethics'] 
    : ['Advanced Clinical Practice', 'Medical Research Methods'];
  
  return <Chatbot profile={profile} courses={courses} />;
};

export default ChatbotProvider;