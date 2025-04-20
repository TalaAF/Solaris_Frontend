import React from 'react';
import { Navigate } from 'react-router-dom';
import CoursesList from '../components/courses/CoursesList';
import CourseView from '../components/courses/CourseView';
import ContentViewer from '../components/courses/CourseContent/ContentViewer';

const routes = [
  {
    path: '/courses',
    element: <CoursesList />,
  },
  {
    path: '/courses/:courseId',
    element: <CourseView />,
  },
  {
    path: '/courses/:courseId/content/:moduleId/:itemId',
    element: <ContentViewer />,
  },
  // Add redirect from /courses path to courses list
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;