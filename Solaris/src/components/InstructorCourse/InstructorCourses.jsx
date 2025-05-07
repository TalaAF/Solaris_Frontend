import React, { useState, useMemo } from 'react';
import { Button, TextField, FormControl, Select, MenuItem, LinearProgress, Box } from '@mui/material';
import { Users } from 'lucide-react';
import { css } from '@emotion/react';
import './InstructorCourses.css';

// Theme constants for reusable styles
const theme = {
  colors: {
    solarisYellow: '#e6b400',
    solarisYellowDark: '#c49000',
    slate50: '#f8fafc',
    slate900: '#0f172a',
    slate700: '#334155',
    slate500: '#64748b',
    green100: '#d1fae5',
    green600: '#059669',
    gray200: '#e2e8f0',
    blue300: '#93c5fd',
  },
  shadows: {
    card: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    default: '0.5rem',
  },
};

// Emotion styles
const containerStyle = css`
  padding: 2rem;
  background-color: ${theme.colors.slate50};
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const titleStyle = css`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.slate900};
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const cardStyle = css`
  border-radius: ${theme.borderRadius.default};
  box-shadow: ${theme.shadows.card};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s ease, opacity 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
  &:hover {
    transform: translateY(-4px);
  }
  &[tabindex='0']:focus {
    outline: 2px solid ${theme.colors.solarisYellow};
  }
  @keyframes fadeIn {
    to { opacity: 1; }
  }
`;

const headerStyle = css`
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  padding: 1rem;
  border-radius: ${theme.borderRadius.default} ${theme.borderRadius.default} 0 0;
  margin: -1.5rem -1.5rem 0 -1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
`;

const codeStyle = css`
  background-color: ${theme.colors.solarisYellow};
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const statusBadgeStyle = css`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const statusActiveStyle = css`
  ${statusBadgeStyle};
  background-color: ${theme.colors.green100};
  color: ${theme.colors.green600};
`;

const statusCompletedStyle = css`
  ${statusBadgeStyle};
  background-color: ${theme.colors.gray200};
  color: ${theme.colors.slate500};
`;

const courseTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.colors.slate900};
  margin: 0;
`;

const metaStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${theme.colors.slate900};
`;

const descriptionStyle = css`
  font-size: 0.875rem;
  color: ${theme.colors.slate900};
  line-height: 1.5;
  margin: 0;
`;

const footerStyle = css`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: ${theme.colors.slate900};
`;

const CourseCard = React.memo(({ course, onSelectCourse }) => {
  const handleSelect = () => {
    if (!course?.id || !course?.title) {
      alert('Invalid course data');
      return;
    }
    console.log('Navigating to manage course:', { id: course.id, title: course.title });
    onSelectCourse({
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      semester: course.semester,
      credits: course.credits,
      studentCount: course.studentCount,
      status: course.status || 'Unknown',
      completionRate: course.completionRate || 0,
    });
  };

  return (
    <div
      css={cardStyle}
      className="course-card"
      data-id={course.id}
      tabIndex={0}
      role="article"
      aria-labelledby={`course-${course.id}`}
    >
      <div css={headerStyle}>
        <span css={codeStyle}>{course.id}</span>
        <span css={course.status === 'Active' ? statusActiveStyle : statusCompletedStyle}>
          {course.status || 'Unknown'}
        </span>
      </div>
      <h2 css={courseTitleStyle} id={`course-${course.id}`}>{course.title}</h2>
      <LinearProgress
        variant="determinate"
        value={(course.completionRate || 0) * 100}
        sx={{ margin: '0.5rem 0' }}
      />
      <div css={metaStyle}>
        <span className="course-instructor">{course.instructor}</span>
        <div className="course-stats">
          <Users className="stats-icon" aria-hidden="true" />
          <span>{course.studentCount}</span>
        </div>
      </div>
      <p css={descriptionStyle}>{course.description}</p>
      <div css={footerStyle}>
        <span className="course-semester">{course.semester}</span>
        <span className="course-credits">{course.credits} Credits</span>
      </div>
      <Button
        className="manage-button"
        onClick={handleSelect}
        aria-label={`Manage ${course.title} course`}
        sx={{
          backgroundColor: theme.colors.solarisYellow,
          color: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: 500,
          '&:hover': { backgroundColor: theme.colors.solarisYellowDark },
        }}
      >
        Manage Course
      </Button>
    </div>
  );
});

function InstructorCourses({ onSelectCourse }) {
  // Mock data (to be replaced with API fetch)
  const courses = [
    {
      id: 'AWT101',
      title: 'Advanced Web Technologies',
      description: 'This course covers advanced topics in web development, including modern frameworks, APIs, and best practices.',
      instructor: 'Dr. Jane Doe',
      semester: 'Spring 2025',
      credits: 3,
      studentCount: 30,
      status: 'Active',
      completionRate: 0.67,
    },
    {
      id: 'MED201',
      title: 'Human Anatomy & Physiology',
      description: 'A comprehensive course on human anatomy and physiology covering body systems, structures...',
      instructor: 'Dr. Jane Doe',
      semester: 'Spring 2025',
      credits: 3,
      studentCount: 25,
      status: 'Active',
      completionRate: 0.82,
    },
    {
      id: 'CHEM301',
      title: 'Intro to Biochemistry',
      description: 'Explore the chemical processes within and related to living organisms, with focus on protein...',
      instructor: 'Dr. Jane Doe',
      semester: 'Spring 2025',
      credits: 3,
      studentCount: 20,
      status: 'Completed',
      completionRate: 1.0,
    },
  ];

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Placeholder for backend integration
  // Replace with your backend link when ready, e.g.:
  // useEffect(() => {
  //   fetch('YOUR_BACKEND_API_URL/courses')
  //     .then(res => res.json())
  //     .then(data => setCourses(data))
  //     .catch(err => console.error('Failed to fetch courses:', err));
  // }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'all' || course.semester === filter)
    );
  }, [search, filter, courses]);

  return (
    <div css={containerStyle} className="instructor-courses">
      <h1 css={titleStyle}>My Courses</h1>
      <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <TextField
          label="Search Courses"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          variant="outlined"
          InputProps={{ 'aria-label': 'Search courses by title' }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            aria-label="Filter by semester"
          >
            <MenuItem value="all">All Semesters</MenuItem>
            <MenuItem value="Spring 2025">Spring 2025</MenuItem>
            {/* Add more semesters dynamically when fetching from backend */}
          </Select>
        </FormControl>
      </Box>
      <div css={gridStyle} className="courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
          ))
        ) : (
          <Box sx={{ color: theme.colors.slate700, textAlign: 'center' }}>
            No courses found.
          </Box>
        )}
      </div>
    </div>
  );
}

export default InstructorCourses;