import React, { useState, useEffect } from 'react';
import { Typography, Box, Container } from '@mui/material';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header'; // Assuming you have a Header component
import CoursesList from '../courses/CourseList';
import './Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch courses data
    const fetchCourses = async () => {
      try {
        // If you don't have a real API yet, use mockCourses below
        // const coursesData = await getCourses();
        const coursesData = mockCourses;
        setCourses(coursesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Mock data for development
  const mockCourses = [
    {
      id: 'med-101',
      title: 'Introduction to Medical Sciences',
      description: 'A foundational course covering the basics of medical sciences and healthcare.',
      image: 'https://placehold.co/300x200?text=Medical+Sciences',
      instructor: 'Dr. Jane Smith',
      duration: '12 weeks',
      level: 'Beginner',
      enrollmentStatus: 'In Progress',
      completed: 35,
      modules: [
        {
          id: 'mod-1',
          title: 'Medical Terminology',
          description: 'Learn the basic terminology used in healthcare.',
          items: [
            { id: 'item-1', title: 'Introduction to Medical Terms', type: 'video', duration: '10 min' },
            { id: 'item-2', title: 'Anatomy Terms', type: 'document', duration: '15 min' },
            { id: 'item-3', title: 'Quiz: Medical Terminology', type: 'quiz', duration: '20 min' }
          ]
        },
        {
          id: 'mod-2',
          title: 'Human Anatomy',
          description: 'Explore the human body systems.',
          items: [
            { id: 'item-4', title: 'Cardiovascular System', type: 'video', duration: '15 min' },
            { id: 'item-5', title: 'Respiratory System', type: 'document', duration: '12 min' },
            { id: 'item-6', title: 'Interactive Body Explorer', type: 'interactive', duration: '25 min' }
          ]
        }
      ]
    },
    {
      id: 'surg-202',
      title: 'Surgical Techniques',
      description: 'Advanced course on modern surgical techniques and procedures.',
      image: 'https://placehold.co/300x200?text=Surgical+Techniques',
      instructor: 'Prof. Robert Chen',
      duration: '16 weeks',
      level: 'Advanced',
      enrollmentStatus: 'Not Started',
      completed: 0,
      modules: [
        {
          id: 'mod-1',
          title: 'Surgical Basics',
          description: 'Fundamentals of surgical procedures.',
          items: [
            { id: 'item-1', title: 'Surgical Safety', type: 'video', duration: '20 min' },
            { id: 'item-2', title: 'Sterilization Techniques', type: 'document', duration: '15 min' }
          ]
        }
      ]
    },
    {
      id: 'pharm-301',
      title: 'Clinical Pharmacology',
      description: 'Understanding the principles of drug action and clinical applications.',
      image: 'https://placehold.co/300x200?text=Pharmacology',
      instructor: 'Dr. Maria Garcia',
      duration: '10 weeks',
      level: 'Intermediate',
      enrollmentStatus: 'Completed',
      completed: 100,
      modules: [
        {
          id: 'mod-1',
          title: 'Pharmacokinetics',
          description: 'How drugs move through the body.',
          items: [
            { id: 'item-1', title: 'Absorption and Distribution', type: 'video', duration: '18 min' },
            { id: 'item-2', title: 'Metabolism and Excretion', type: 'quiz', duration: '15 min' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="app-container">
      <main className="main-content">
        <Header title="Courses" />
        <div className="content-wrapper">
          <Container maxWidth="lg">
            <Box sx={{ paddingTop: 3, paddingBottom: 5 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                My Courses
              </Typography>
              
              {loading && <Typography>Loading courses...</Typography>}
              {error && <Typography color="error">{error}</Typography>}
              {!loading && !error && <CoursesList courses={courses} />}
            </Box>
          </Container>
        </div>
      </main>
    </div>
  );
}

export default Courses;
