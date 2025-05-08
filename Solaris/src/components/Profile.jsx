import React, { useState, useEffect } from 'react';
import ProfileInfo from './ProfileInfo';
import CourseList from './CourseList';
import DownloadButton from './DownloadButton';
import SecuritySettings from './SecuritySettings';
import ProfileForm from './ProfileForm';
import { FaUser } from 'react-icons/fa';
import './styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Starting data fetch...');
      try {
        setLoading(true);
        setError(null);

        const storedProfile = localStorage.getItem('profile');
        let profileData = storedProfile ? JSON.parse(storedProfile) : null;
        if (!profileData) {
          console.log('Fetching profile data...');
          const profileResponse = await fetch('/data/profile.json');
          if (!profileResponse.ok) throw new Error('Failed to fetch profile');
          profileData = await profileResponse.json();
          localStorage.setItem('profile', JSON.stringify(profileData));
        }
        console.log('Profile data:', profileData);
        setProfile(profileData);

        console.log('Fetching enrollments data...');
        const enrollmentsResponse = await fetch('/data/enrollments.json');
        if (!enrollmentsResponse.ok) throw new Error('Failed to fetch enrollments');
        const enrollmentsData = await enrollmentsResponse.json();
        console.log('Enrollments data:', enrollmentsData);
        setEnrollments(enrollmentsData);

        console.log('Fetching courses data...');
        const coursesResponse = await fetch('/data/courses.json');
        if (!coursesResponse.ok) throw new Error('Failed to fetch courses');
        const coursesData = await coursesResponse.json();
        const enrichedCourses = coursesData.map(course => {
          const enrollment = enrollmentsData.find(e => e.courseId === course.id && e.userId === profileData.id);
          return {
            ...course,
            progress: enrollment ? enrollment.progress || course.progress : course.progress,
            enrolledAt: enrollment ? enrollment.enrolledAt : null
          };
        });
        console.log('Courses data:', enrichedCourses);
        setCourses(enrichedCourses);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log('Fetch completed. Loading:', false, 'Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleEdit = () => {
    console.log('Edit button clicked, setting isEditing to true');
    if (activeTab !== 'profile') setActiveTab('profile');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="profile-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#4B5563' }}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#EF4444' }}>
          Error: {error}.{' '}
          <button
            onClick={() => window.location.reload()}
            style={{ color: '#3B82F6', textDecoration: 'underline', background: 'none', border: 'none' }}
          >
            Retry
          </button>
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#EF4444' }}>Profile data unavailable. Please check your data files.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-layout">
        <div className="left-column">
          <div className="profile-header-card">
            <img
              src={profile.image || 'https://via.placeholder.com/150'}
              alt="Profile"
              style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
            />
            <div style={{ marginTop: 'auto' }}>
              <p className="profile-name">{profile.name || 'N/A'}</p>
              <p className="profile-role">Student</p>
            </div>
          </div>
        </div>
        <div className="right-column">
          <div className="tab-navigation">
            <div
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setIsEditing(false); }}
            >
              Profile Information
            </div>
            <div
              className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => { setActiveTab('courses'); setIsEditing(false); }}
            >
              Course List
            </div>
            <div
              className={`tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => { setActiveTab('security'); setIsEditing(false); }}
            >
              Security Settings
            </div>
          </div>
          <div className="tab-content">
            {activeTab === 'profile' && (
              <div className="profile-card">
                {!isEditing ? (
                  <ProfileInfo profile={profile} onUpdate={handleProfileUpdate} onEdit={handleEdit} />
                ) : (
                  <ProfileForm profile={profile} onUpdate={handleProfileUpdate} onCancel={handleCancelEdit} />
                )}
              </div>
            )}
            {activeTab === 'courses' && (
              <div className="course-section">
                <CourseList courses={courses} />
                <DownloadButton profile={profile} courses={courses} />
              </div>
            )}
            {activeTab === 'security' && (
              <div className="security-section">
                <SecuritySettings profile={profile} onUpdate={handleProfileUpdate} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;