import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, Users, BadgeCheck } from 'lucide-react';
import './CourseList.css';

/**
 * CourseList Component
 * 
 * Displays a list of courses the student is enrolled in
 * and allows filtering and searching through them.
 * 
 * @param {string} searchTerm - Search term from parent component
 * @param {string} departmentFilter - Department filter from parent component
 * @param {string} semesterFilter - Semester filter from parent component
 */
function CourseList({ searchTerm = '', departmentFilter = 'all', semesterFilter = 'all' }) {
  // State for course data
  const [activeCourses, setActiveCourses] = useState([]);
  const [archivedCourses, setArchivedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  
  // Fetch courses from API or use mock data
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // In a real app, these would be actual API endpoints
        // const activeResponse = await fetch('/api/courses/active');
        // const archivedResponse = await fetch('/api/courses/archived');
        
        // For demo purposes, using mock data
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setActiveCourses(mockActiveCourses);
        setArchivedCourses(mockArchivedCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter active courses based on search term and filters
  const filteredActiveCourses = activeCourses.filter(course => {
    return (
      (searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (departmentFilter === 'all' || course.department === departmentFilter) &&
      (semesterFilter === 'all' || course.semester === semesterFilter)
    );
  });
  
  // Filter archived courses based on search term and filters
  const filteredArchivedCourses = archivedCourses.filter(course => {
    return (
      (searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (departmentFilter === 'all' || course.department === departmentFilter) &&
      (semesterFilter === 'all' || course.semester === semesterFilter)
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
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Courses
        </button>
        <button 
          className={`tab-button ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
        >
          Completed Courses
        </button>
      </div>
      
      {/* Active Courses Tab */}
      {activeTab === 'active' && (
        <>
          {filteredActiveCourses.length === 0 ? (
            <div className="empty-courses">
              <div className="empty-icon">
                <BookOpen />
              </div>
              <h3 className="empty-title">No courses found</h3>
              <p className="empty-message">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="course-grid">
              {filteredActiveCourses.map(course => (
                <Link to={`/courses/${course.id}`} key={course.id} className="course-card-link">
                  <div className="course-card">
                    <div 
                      className="course-image" 
                      style={{ backgroundImage: `url(${course.imageUrl})` }}
                    >
                      <div className="course-image-overlay">
                        <span className="course-code">{course.code}</span>
                        <h3 className="course-title">{course.title}</h3>
                      </div>
                    </div>
                    <div className="course-content">
                      <div className="course-info">
                        <div>
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
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="progress-text">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                        </div>
                      )}
                      
                      <p className="course-description">
                        {course.description}
                      </p>
                      
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
                      
                      <button className="course-action">
                        {course.status === 'in-progress' ? 'Continue Learning' : 
                         course.status === 'upcoming' ? 'View Details' : 'Review Course'}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Archived Courses Tab */}
      {activeTab === 'archived' && (
        <>
          {filteredArchivedCourses.length === 0 ? (
            <div className="empty-courses">
              <div className="empty-icon">
                <BookOpen />
              </div>
              <h3 className="empty-title">No completed courses found</h3>
              <p className="empty-message">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="course-grid">
              {filteredArchivedCourses.map(course => (
                <Link to={`/courses/${course.id}`} key={course.id} className="course-card-link">
                  <div className="course-card archived">
                    <div 
                      className="course-image grayscale" 
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
                          <div className="course-department">{course.department}</div>
                          <div className="course-instructor">{course.instructor}</div>
                        </div>
                        {course.grade && (
                          <div className="course-grade">
                            Grade: {course.grade}
                          </div>
                        )}
                      </div>
                      
                      <p className="course-description">
                        {course.description}
                      </p>
                      
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

// Mock data for demonstration purposes
const mockActiveCourses = [
  {
    id: 1,
    title: 'Human Anatomy & Physiology',
    code: 'MED201',
    department: 'Anatomy',
    semester: 'Fall 2025',
    credits: 4,
    description: 'A comprehensive study of human anatomy and physiology covering body systems, tissues, and organs.',
    instructor: 'Dr. Jane Smith',
    enrolled: 68,
    progress: 65,
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1000&auto=format&fit=crop',
    status: 'in-progress',
  },
  {
    id: 2,
    title: 'Biochemistry Fundamentals',
    code: 'MED202',
    department: 'Biochemistry',
    semester: 'Fall 2025',
    credits: 3,
    description: 'Study of chemical processes within and related to living organisms, focusing on proteins, enzymes, and metabolism.',
    instructor: 'Dr. Robert Johnson',
    enrolled: 72,
    progress: 80,
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1000&auto=format&fit=crop',
    status: 'in-progress',
  },
  {
    id: 3,
    title: 'Pathology',
    code: 'MED301',
    department: 'Pathology',
    semester: 'Fall 2025',
    credits: 4,
    description: 'The study of disease processes and their effects on the human body, focusing on causes, mechanisms, and resulting changes.',
    instructor: 'Dr. Maria Garcia',
    enrolled: 65,
    progress: 45,
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop',
    status: 'in-progress',
  },
  {
    id: 4,
    title: 'Pharmacology',
    code: 'MED302',
    department: 'Pharmacology',
    semester: 'Fall 2025',
    credits: 3,
    description: 'Study of drug action and effects on biological systems, including mechanisms, applications, and therapeutic uses.',
    instructor: 'Dr. David Chen',
    enrolled: 70,
    progress: 30,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1000&auto=format&fit=crop',
    status: 'in-progress',
  },
  {
    id: 5,
    title: 'Medical Ethics',
    code: 'MED203',
    department: 'Medical Humanities',
    semester: 'Spring 2026',
    credits: 2,
    description: 'Ethical principles and decision-making frameworks in healthcare, including patient autonomy, beneficence, and justice.',
    instructor: 'Dr. Sarah Williams',
    enrolled: 85,
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop',
    status: 'upcoming',
  },
  {
    id: 6,
    title: 'Clinical Medicine Introduction',
    code: 'MED401',
    department: 'Clinical Sciences',
    semester: 'Spring 2026',
    credits: 5,
    description: 'Introduction to clinical practice, including history-taking, physical examination, and clinical reasoning.',
    instructor: 'Dr. Michael Brown',
    enrolled: 60,
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=1000&auto=format&fit=crop',
    status: 'upcoming',
  },
];

// Mock archived/completed courses
const mockArchivedCourses = [
  {
    id: 7,
    title: 'Medical Terminology',
    code: 'MED101',
    department: 'Medical Foundation',
    semester: 'Spring 2025',
    credits: 2,
    description: 'Introduction to the language of medicine, including prefixes, suffixes, roots, and common medical abbreviations.',
    instructor: 'Dr. Emily Taylor',
    enrolled: 90,
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
    status: 'completed',
    grade: 'A'
  },
  {
    id: 8,
    title: 'Cell Biology',
    code: 'MED102',
    department: 'Biology',
    semester: 'Spring 2025',
    credits: 3,
    description: 'Study of cellular structure and function, including cell organelles, membrane transport, and cell division.',
    instructor: 'Dr. Thomas White',
    enrolled: 75,
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=1000&auto=format&fit=crop',
    status: 'completed',
    grade: 'B+'
  },
  {
    id: 9,
    title: 'Histology',
    code: 'MED103',
    department: 'Anatomy',
    semester: 'Fall 2024',
    credits: 3,
    description: 'Microscopic study of tissues and organs, focusing on cell organization, tissue types, and organ structure.',
    instructor: 'Dr. Lisa Martinez',
    enrolled: 70,
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1514998528874-95269bd9c38d?q=80&w=1000&auto=format&fit=crop',
    status: 'completed',
    grade: 'A-'
  },
];

export default CourseList;