<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, Clock, Users, BadgeCheck } from "lucide-react";
import CourseService from "../../services/CourseService";
import "./CourseList.css";

/**
 * CourseList Component
 *
 * Displays a list of courses the student is enrolled in
 * and allows filtering and searching through them.
 *
=======
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, Users, BadgeCheck } from 'lucide-react';
import CourseService from '../../services/CourseService';
import './CourseList.css';

/**
 * CourseList Component
 * 
 * Displays a list of courses the student is enrolled in
 * and allows filtering and searching through them.
 * 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
 * @param {string} searchTerm - Search term from parent component
 * @param {string} departmentFilter - Department filter from parent component
 * @param {string} semesterFilter - Semester filter from parent component
 */
<<<<<<< HEAD
function CourseList({
  searchTerm = "",
  departmentFilter = "all",
  semesterFilter = "all",
}) {
=======
function CourseList({ searchTerm = '', departmentFilter = 'all', semesterFilter = 'all' }) {
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  // State for course data
  const [activeCourses, setActiveCourses] = useState([]);
  const [archivedCourses, setArchivedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState("active");

=======
  const [activeTab, setActiveTab] = useState('active');
  
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  // Get current user ID (in a real app, this would come from auth context)
  const currentUserId = 1; // Example user ID

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Get all courses
        const response = await CourseService.getAllCourses();
        console.log("Courses response:", response);
<<<<<<< HEAD

        // Process and categorize courses
        if (response.data) {
          // Handle both mock data and backend API formats
          const allCourses = Array.isArray(response.data)
            ? response.data // Direct array (from mock data)
            : response.data._embedded?.entityModelList || []; // From Spring HATEOAS format

          console.log("All courses:", allCourses);

          // Transform backend data to match frontend structure if needed
          const transformedCourses = allCourses.map((course) => ({
=======
        
        // Process and categorize courses
        if (response.data) {
          // Handle both mock data and backend API formats
          const allCourses = Array.isArray(response.data) 
            ? response.data  // Direct array (from mock data)
            : response.data._embedded?.entityModelList || []; // From Spring HATEOAS format
          
          console.log("All courses:", allCourses);
          
          // Transform backend data to match frontend structure if needed
          const transformedCourses = allCourses.map(course => ({
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
            id: course.id,
            title: course.title,
            code: course.code || `CODE${course.id}`, // Use provided code or generate one
            description: course.description,
<<<<<<< HEAD
            department: course.department || course.departmentName || "General",
            semester: course.semester || determineSemester(course),
            credits: course.credits || 3, // Default if not provided
            instructor:
              course.instructor?.name ||
              course.instructorEmail ||
              "Unknown Instructor",
=======
            department: course.department || course.departmentName || 'General',
            semester: course.semester || determineSemester(course),
            credits: course.credits || 3, // Default if not provided
            instructor: course.instructor?.name || course.instructorEmail || 'Unknown Instructor',
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
            enrolled: course.enrolled || course.currentEnrollment || 0,
            progress: course.progress || calculateProgress(course),
            imageUrl: course.imageUrl || getPlaceholderImage(course),
            status: course.status || determineStatus(course),
<<<<<<< HEAD
            grade:
              course.grade ||
              (course.averageRating
                ? convertToLetterGrade(course.averageRating)
                : null),
            isArchived: course.isArchived || course.status === "completed",
          }));

          console.log("Transformed courses:", transformedCourses);

          // Separate active and archived courses
          setActiveCourses(
            transformedCourses.filter((course) => !course.isArchived),
          );
          setArchivedCourses(
            transformedCourses.filter((course) => course.isArchived),
          );
=======
            grade: course.grade || (course.averageRating ? convertToLetterGrade(course.averageRating) : null),
            isArchived: course.isArchived || course.status === 'completed'
          }));
          
          console.log("Transformed courses:", transformedCourses);
          
          // Separate active and archived courses
          setActiveCourses(transformedCourses.filter(course => !course.isArchived));
          setArchivedCourses(transformedCourses.filter(course => course.isArchived));
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        } else {
          console.warn("No data found in response");
          setActiveCourses([]);
          setArchivedCourses([]);
        }
      } catch (err) {
<<<<<<< HEAD
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
=======
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Helper function to determine semester based on dates
  const determineSemester = (course) => {
<<<<<<< HEAD
    if (!course.startDate) return "Spring 2025";

    const startDate = new Date(course.startDate);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();

=======
    if (!course.startDate) return 'Spring 2025';
    
    const startDate = new Date(course.startDate);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    if (month >= 0 && month <= 4) return `Spring ${year}`;
    if (month >= 5 && month <= 7) return `Summer ${year}`;
    return `Fall ${year}`;
  };

  // Helper function to calculate progress
  const calculateProgress = (course) => {
    // In a real implementation, this would use actual progress data
    return Math.floor(Math.random() * 100); // Placeholder random progress
  };

  // Helper function to get placeholder image
  const getPlaceholderImage = (course) => {
    // In a real implementation, this would use actual course images
<<<<<<< HEAD
    return `https://source.unsplash.com/random/300x200?${encodeURIComponent(course.title || "education")}`;
=======
    return `https://source.unsplash.com/random/300x200?${encodeURIComponent(course.title || 'education')}`;
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  };

  // Helper function to determine course status
  const determineStatus = (course) => {
    // In a real implementation, this would use actual course status
<<<<<<< HEAD
    if (course.isArchived) return "completed";

    const progress = course.progress || calculateProgress(course);
    if (progress > 0) return "in-progress";
    return "upcoming";
=======
    if (course.isArchived) return 'completed';
    
    const progress = course.progress || calculateProgress(course);
    if (progress > 0) return 'in-progress';
    return 'upcoming';
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  };

  // Helper function to convert numerical grade to letter grade
  const convertToLetterGrade = (grade) => {
<<<<<<< HEAD
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };

  // Filter active courses based on search term and filters
  const filteredActiveCourses = activeCourses.filter((course) => {
    const titleMatch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const codeMatch =
      course.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const instructorMatch =
      typeof course.instructor === "string"
        ? course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
        : false;

    return (
      (searchTerm === "" || titleMatch || codeMatch || instructorMatch) &&
      (departmentFilter === "all" || course.department === departmentFilter) &&
      (semesterFilter === "all" || course.semester === semesterFilter)
    );
  });

  // Filter archived courses based on search term and filters
  const filteredArchivedCourses = archivedCourses.filter((course) => {
    const titleMatch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const codeMatch =
      course.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const instructorMatch =
      typeof course.instructor === "string"
        ? course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
        : false;

    return (
      (searchTerm === "" || titleMatch || codeMatch || instructorMatch) &&
      (departmentFilter === "all" || course.department === departmentFilter) &&
      (semesterFilter === "all" || course.semester === semesterFilter)
=======
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  // Filter active courses based on search term and filters
  const filteredActiveCourses = activeCourses.filter(course => {
    const titleMatch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const codeMatch = course.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const instructorMatch = typeof course.instructor === 'string' ? 
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    
    return (
      (searchTerm === '' || titleMatch || codeMatch || instructorMatch) &&
      (departmentFilter === 'all' || course.department === departmentFilter) &&
      (semesterFilter === 'all' || course.semester === semesterFilter)
    );
  });
  
  // Filter archived courses based on search term and filters
  const filteredArchivedCourses = archivedCourses.filter(course => {
    const titleMatch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const codeMatch = course.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const instructorMatch = typeof course.instructor === 'string' ? 
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    
    return (
      (searchTerm === '' || titleMatch || codeMatch || instructorMatch) &&
      (departmentFilter === 'all' || course.department === departmentFilter) &&
      (semesterFilter === 'all' || course.semester === semesterFilter)
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
    );
  });

  if (loading) {
    return <div className="courses-loading">Loading courses...</div>;
  }

  if (error) {
    return <div className="courses-error">{error}</div>;
  }

  return (
    <div className="courses-container">
      {/* Tabs */}
      <div className="courses-tabs">
<<<<<<< HEAD
        <button
          className={`tab-button ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active Courses
        </button>
        <button
          className={`tab-button ${activeTab === "archived" ? "active" : ""}`}
          onClick={() => setActiveTab("archived")}
=======
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Courses
        </button>
        <button 
          className={`tab-button ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        >
          Completed Courses
        </button>
      </div>
<<<<<<< HEAD

      {/* Active Courses Tab */}
      {activeTab === "active" && (
=======
      
      {/* Active Courses Tab */}
      {activeTab === 'active' && (
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        <>
          {filteredActiveCourses.length === 0 ? (
            <div className="empty-courses">
              <div className="empty-icon">
                <BookOpen />
              </div>
              <h3 className="empty-title">No courses found</h3>
<<<<<<< HEAD
              <p className="empty-message">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="course-grid">
              {filteredActiveCourses.map((course) => (
                <Link
                  to={`/courses/${course.id}`}
                  key={course.id}
                  className="course-card-link"
                >
                  <div className="course-card">
                    <div
                      className="course-image"
=======
              <p className="empty-message">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="course-grid">
              {filteredActiveCourses.map(course => (
                <Link to={`/courses/${course.id}`} key={course.id} className="course-card-link">
                  <div className="course-card">
                    <div 
                      className="course-image" 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                      style={{ backgroundImage: `url(${course.imageUrl})` }}
                    >
                      <div className="course-image-overlay">
                        <span className="course-code">{course.code}</span>
                        <h5 className="course-title">{course.title}</h5>
                      </div>
                    </div>
                    <div className="course-content">
                      <div className="course-info">
                        <div>
<<<<<<< HEAD
                          <div className="course-department">
                            {course.department}
                          </div>
                          <div className="course-instructor">
                            {course.instructor}
                          </div>
                        </div>
                        <div
                          className={`course-status status-${course.status}`}
                        >
                          {course.status === "in-progress"
                            ? "In Progress"
                            : course.status === "upcoming"
                              ? "Upcoming"
                              : "Completed"}
                        </div>
                      </div>

                      {course.status === "in-progress" && (
                        <div className="course-progress">
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar"
=======
                          <div className="course-department">{course.department}</div>
                          <div className="course-instructor">{course.instructor}</div>
                        </div>
                        <div className={`course-status status-${course.status}`}>
                          {course.status === 'in-progress' ? 'In Progress' : 
                           course.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </div>
                      </div>
                      
                      {course.status === 'in-progress' && (
                        <div className="course-progress">
                          <div className="progress-bar-container">
                            <div 
                              className="progress-bar" 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="progress-text">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                        </div>
                      )}
<<<<<<< HEAD

                      <p className="course-description">{course.description}</p>

=======
                      
                      <p className="course-description">
                        {course.description}
                      </p>
                      
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                      <div className="course-meta">
                        <div className="meta-item">
                          <Calendar className="meta-icon" />
                          <span>{course.semester}</span>
                        </div>
                        <div className="meta-item">
                          <Clock className="meta-icon" />
                          <span>{course.credits} Credits</span>
                        </div>
                        <div className="meta-item">
                          <Users className="meta-icon" />
                          <span>{course.enrolled}</span>
                        </div>
                      </div>
<<<<<<< HEAD

                      <button className="course-action">
                        {course.status === "in-progress"
                          ? "Continue Learning"
                          : course.status === "upcoming"
                            ? "View Details"
                            : "Review Course"}
=======
                      
                      <button className="course-action">
                        {course.status === 'in-progress' ? 'Continue Learning' : 
                         course.status === 'upcoming' ? 'View Details' : 'Review Course'}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
<<<<<<< HEAD

      {/* Archived Courses Tab */}
      {activeTab === "archived" && (
=======
      
      {/* Archived Courses Tab */}
      {activeTab === 'archived' && (
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        <>
          {filteredArchivedCourses.length === 0 ? (
            <div className="empty-courses">
              <div className="empty-icon">
                <BookOpen />
              </div>
              <h3 className="empty-title">No completed courses found</h3>
<<<<<<< HEAD
              <p className="empty-message">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="course-grid">
              {filteredArchivedCourses.map((course) => (
                <Link
                  to={`/courses/${course.id}`}
                  key={course.id}
                  className="course-card-link"
                >
                  <div className="course-card archived">
                    <div
                      className="course-image grayscale"
=======
              <p className="empty-message">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="course-grid">
              {filteredArchivedCourses.map(course => (
                <Link to={`/courses/${course.id}`} key={course.id} className="course-card-link">
                  <div className="course-card archived">
                    <div 
                      className="course-image grayscale" 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                      style={{ backgroundImage: `url(${course.imageUrl})` }}
                    >
                      <div className="course-image-overlay">
                        <span className="course-code">{course.code}</span>
                        <h3 className="course-title">{course.title}</h3>
                      </div>
                      <div className="completed-badge">
                        <BadgeCheck className="completed-icon" />
                        <span>Completed</span>
                      </div>
                    </div>
                    <div className="course-content">
                      <div className="course-info">
                        <div>
<<<<<<< HEAD
                          <div className="course-department">
                            {course.department}
                          </div>
                          <div className="course-instructor">
                            {course.instructor}
                          </div>
=======
                          <div className="course-department">{course.department}</div>
                          <div className="course-instructor">{course.instructor}</div>
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                        </div>
                        {course.grade && (
                          <div className="course-grade">
                            Grade: {course.grade}
                          </div>
                        )}
                      </div>
<<<<<<< HEAD

                      <p className="course-description">{course.description}</p>

=======
                      
                      <p className="course-description">
                        {course.description}
                      </p>
                      
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                      <div className="course-meta">
                        <div className="meta-item">
                          <Calendar className="meta-icon" />
                          <span>{course.semester}</span>
                        </div>
                        <div className="meta-item">
                          <Clock className="meta-icon" />
                          <span>{course.credits} Credits</span>
                        </div>
                      </div>
<<<<<<< HEAD

=======
                      
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                      <button className="course-action secondary">
                        View Course
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

<<<<<<< HEAD
export default CourseList;
=======
export default CourseList;
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
