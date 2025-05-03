import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../shared/Header';
import ProfileInfo from './ProfileInfo';
import CourseList from './CourseList';
import DownloadButton from './DownloadButton';
import SecuritySettings from './SecuritySettings';
import AccountSummary from './AccountSummary';
import ProfileForm from './ProfileForm';
import Chatbot from '../shared/Chatbot';
import './styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedProfile = localStorage.getItem('profile');
        let profileData = storedProfile ? JSON.parse(storedProfile) : null;
        if (!profileData) {
          const profileResponse = await fetch('/data/profile.json');
          if (!profileResponse.ok) throw new Error('Failed to fetch profile');
          profileData = await profileResponse.json();
          localStorage.setItem('profile', JSON.stringify(profileData));
        }
        setProfile(profileData);

        const enrollmentsResponse = await fetch('/data/enrollments.json');
        if (!enrollmentsResponse.ok) throw new Error('Failed to fetch enrollments');
        const enrollmentsData = await enrollmentsResponse.json();
        setEnrollments(enrollmentsData);

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
        setCourses(enrichedCourses);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="profile-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#666' }}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#EF4444' }}>Error: {error}. <button onClick={() => window.location.reload()} style={{ color: '#3B82F6', textDecoration: 'underline', background: 'none', border: 'none' }}>Retry</button></p>
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
      <Routes>
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route
          path="/profile/edit"
          element={<ProfileForm profile={profile} onUpdate={handleProfileUpdate} />}
        />
        <Route
          path="/profile"
          element={
            <>
              <Header profile={profile} />
              <main className="profile-main">
                <div className="notification-bar">
                  You have {courses.length} ongoing courses and 1 progress report ready to download.
                </div>
                <div className="profile-grid">
                  <ProfileInfo profile={profile} />
                  <SecuritySettings profile={profile} onUpdate={handleProfileUpdate} />
                  <AccountSummary profile={profile} />
                  <CourseList courses={courses} />
                  <div className="row-3">
                    <DownloadButton profile={profile} courses={courses} />
                  </div>
                </div>
              </main>
              <Chatbot profile={profile} courses={courses} />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default Profile;