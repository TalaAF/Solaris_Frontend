import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Avatar, Button, Modal, TextField, Select, MenuItem, CircularProgress, LinearProgress, IconButton, InputAdornment } from '@mui/material';
import { Edit, Upload, Save, Close, Visibility, VisibilityOff } from '@mui/icons-material';
import Chart from 'chart.js/auto';
import instructorData from './instructorData.json'; // Source for password
import instructorProfileData from './instructor.json'; // Source for profile data
import './InstructorProfile.css';

const InstructorProfile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [instructor, setInstructor] = useState(() => {
    const savedInstructor = localStorage.getItem('instructor');
    return savedInstructor ? JSON.parse(savedInstructor) : {
      ...instructorProfileData.instructor,
      password: instructorData.instructor.password || '', // Fetch password from instructorData.json
      firstName: instructorProfileData.instructor.fullName.split(' ').slice(0, -1).join(' ') || '',
      lastName: instructorProfileData.instructor.fullName.split(' ').slice(-1)[0] || '',
      photo: instructorProfileData.instructor.image,
    };
  });
  const [formData, setFormData] = useState(() => {
    const savedInstructor = localStorage.getItem('instructor');
    return savedInstructor ? JSON.parse(savedInstructor) : {
      ...instructorProfileData.instructor,
      password: instructorData.instructor.password || '',
      firstName: instructorProfileData.instructor.fullName.split(' ').slice(0, -1).join(' ') || '',
      lastName: instructorProfileData.instructor.fullName.split(' ').slice(-1)[0] || '',
      email: instructorProfileData.instructor.email,
      universityNumber: instructorProfileData.instructor.universityNumber,
      country: instructorProfileData.instructor.country,
      timezone: instructorProfileData.instructor.timezone,
      photo: instructorProfileData.instructor.image,
    };
  });
  const [passwordForm, setPasswordForm] = useState({
    current: instructorData.instructor.password || '', // Initialize directly from JSON
    new: '',
    confirm: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const monthlyActivityChartRef = useRef(null);
  const attendanceChartRef = useRef(null);
  const gradesChartRef = useRef(null);

  const [monthlyActivityChart, setMonthlyActivityChart] = useState(null);
  const [attendanceChart, setAttendanceChart] = useState(null);
  const [gradesChart, setGradesChart] = useState(null);

  const saveInstructorData = (data) => {
    localStorage.setItem('instructor', JSON.stringify(data));
    console.log('Updated instructor data saved:', data);
  };

  useEffect(() => {
    setFormData(instructor);
  }, [instructor]);

  useEffect(() => {
    saveInstructorData(instructor);
  }, [instructor]);

  useEffect(() => {
    if (activeTab === 'statistics') {
      if (monthlyActivityChartRef.current && !monthlyActivityChart) {
        const ctx = monthlyActivityChartRef.current.getContext('2d');
        setMonthlyActivityChart(new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Activity Hours',
              data: [10, 15, 20, 25, 30, 35],
              backgroundColor: '#fb923c',
              borderColor: '#ea580c',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, title: { display: true, text: 'Hours' } },
              x: { title: { display: true, text: 'Month' } },
            },
            plugins: { legend: { display: false } },
          },
        }));
      }

      if (attendanceChartRef.current && !attendanceChart) {
        const ctx = attendanceChartRef.current.getContext('2d');
        setAttendanceChart(new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Present', 'Absent', 'Late'],
            datasets: [{
              data: [80, 15, 5],
              backgroundColor: ['#fb923c', '#fed7aa', '#ea580c'],
              borderColor: '#fff',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            plugins: { legend: { display: false } },
          },
        }));
      }

      if (gradesChartRef.current && !gradesChart) {
        const ctx = gradesChartRef.current.getContext('2d');
        setGradesChart(new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['AN101', 'PH201'],
            datasets: [
              { label: 'A', data: [20, 15], backgroundColor: '#fb923c' },
              { label: 'B', data: [15, 10], backgroundColor: '#fed7aa' },
              { label: 'C', data: [10, 5], backgroundColor: '#ea580c' },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, title: { display: true, text: 'Number of Students' } },
              x: { title: { display: true, text: 'Course' } },
            },
            plugins: { legend: { display: false } },
          },
        }));
      }
    } else {
      if (monthlyActivityChart) monthlyActivityChart.destroy();
      if (attendanceChart) attendanceChart.destroy();
      if (gradesChart) gradesChart.destroy();
      setMonthlyActivityChart(null);
      setAttendanceChart(null);
      setGradesChart(null);
    }
  }, [activeTab]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setPasswordForm({
      current: instructor.password || '',
      new: '',
      confirm: '',
      showCurrent: false,
      showNew: false,
      showConfirm: false,
    });
  };

  const handleOpenEditProfile = () => setEditProfileModal(true);
  const handleCloseEditProfile = () => setEditProfileModal(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoURL = URL.createObjectURL(file);
      setFormData({ ...formData, photo: photoURL });
    }
  };

  const handleSaveProfile = () => {
    setInstructor(formData);
    handleCloseEditProfile();
    console.log('Profile updated and saved:', formData);
  };

  const handlePasswordUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Entered current password:', passwordForm.current);
      console.log('Stored password:', instructor.password);
      console.log('Types:', typeof passwordForm.current, typeof instructor.password);

      const enteredPassword = String(passwordForm.current).trim();
      const storedPassword = String(instructor.password).trim();

      if (enteredPassword === storedPassword) {
        if (passwordForm.new === passwordForm.confirm && passwordForm.new) {
          setInstructor({ ...instructor, password: passwordForm.new });
          alert('✅ Password Updated Successfully');
          handleCloseModal();
        } else {
          alert('⚠️ New passwords do not match or are empty');
        }
      } else {
        alert('❌ Incorrect current password');
      }
    }, 1000);
  };

  const handleClickShowPassword = (field) => (event) => {
    event.preventDefault();
    setPasswordForm({ ...passwordForm, [`show${field.charAt(0).toUpperCase() + field.slice(1)}`]: !passwordForm[`show${field.charAt(0).toUpperCase() + field.slice(1)}`] });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const renderGeneralInformation = () => (
    <div className="profile-card">
      <div className="profile-info-card">
        <div className="card-header">
          <h2 className="section-heading">General Information</h2>
        </div>
        <p className="section-subtitle">Your personal details</p>
        <div className="info-list">
          <div className="info-item">
            <span className="label">Full Name:</span>
            <span className="value">{instructor.firstName} {instructor.lastName}</span>
          </div>
          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{instructor.email}</span>
          </div>
          <div className="info-item">
            <span className="label">University Number:</span>
            <span className="value">{instructor.universityNumber}</span>
          </div>
          <div className="info-item">
            <span className="label">Country:</span>
            <span className="value">{instructor.country}</span>
          </div>
          <div className="info-item">
            <span className="label">Timezone:</span>
            <span className="value">{instructor.timezone}</span>
          </div>
        </div>
        <div className="edit-profile-button-container">
          <Button onClick={handleOpenEditProfile} className="edit-profile-button">
            <Edit /> Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMyCourses = () => (
    <div className="course-section">
      <h2 className="section-heading">My Courses</h2>
      <div className="my-courses-grid">
        {instructorProfileData.courses.map(course => (
          <div key={course.code} className="course-card">
            <Typography variant="h6" sx={{ textTransform: 'uppercase', mb: 0.5 }}>{course.name}</Typography>
            <Typography variant="body2" sx={{ color: '#606770' }}>{course.code}</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: '#606770' }}>{course.semester}</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: '#606770' }}>Students: {course.students}</Typography>
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress variant="determinate" value={course.progress} sx={{ height: 8, borderRadius: 5 }} />
            </Box>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="course-section">
      <h2 className="section-heading">Performance Overview</h2>
      <div className="stats-charts">
        <div className="stat-box">
          <Typography variant="h6">{instructorProfileData.statistics.courses}</Typography>
          <Typography variant="body2" sx={{ color: '#606770' }}>Number of Courses</Typography>
        </div>
        <div className="stat-box">
          <Typography variant="h6">{instructorProfileData.statistics.students}</Typography>
          <Typography variant="body2" sx={{ color: '#606770' }}>Total Students</Typography>
        </div>
        <div className="stat-box">
          <Typography variant="h6">{instructorProfileData.statistics.assessments}</Typography>
          <Typography variant="body2" sx={{ color: '#606770' }}>Assessments Added</Typography>
        </div>
        <div className="stat-box">
          <Typography variant="h6">{instructorProfileData.statistics.teachingHours}</Typography>
          <Typography variant="body2" sx={{ color: '#606770' }}>Teaching Hours</Typography>
        </div>
      </div>
      <div className="charts-section">
        <h3 className="section-heading">Charts</h3>
        <div className="charts-grid">
          <div className="chart-container">
            <h4 className="chart-title">Monthly Activity</h4>
            <canvas ref={monthlyActivityChartRef} className="chart-canvas"></canvas>
          </div>
          <div className="chart-container">
            <h4 className="chart-title">Total Attendance Rate</h4>
            <canvas ref={attendanceChartRef} className="chart-canvas"></canvas>
            <div className="chart-legend">
              <span style={{ color: '#fb923c' }}>■ Present</span>
              <span style={{ color: '#fed7aa' }}>■ Absent</span>
              <span style={{ color: '#ea580c' }}>■ Late</span>
            </div>
          </div>
          <div className="chart-container">
            <h4 className="chart-title">Distribution of Grades by Course</h4>
            <canvas ref={gradesChartRef} className="chart-canvas"></canvas>
            <div className="chart-legend">
              <span style={{ color: '#fb923c' }}>■ A</span>
              <span style={{ color: '#fed7aa' }}>■ B</span>
              <span style={{ color: '#ea580c' }}>■ C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="security-section">
      <h2 className="section-heading">Change Password</h2>
      <div className="settings-form">
        <div className="settings-field">
          <label className="settings-label">Enter Current Password</label>
          <TextField
            type={passwordForm.showCurrent ? 'text' : 'password'}
            value={passwordForm.current}
            onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
            fullWidth
            error={passwordForm.current && passwordForm.current !== instructor.password}
            helperText={passwordForm.current && passwordForm.current !== instructor.password ? '❌ Incorrect Password' : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword('current')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {passwordForm.showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="settings-field">
          <label className="settings-label">Enter New Password</label>
          <TextField
            type={passwordForm.showNew ? 'text' : 'password'}
            value={passwordForm.new}
            onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
            fullWidth
            helperText={passwordForm.new ? (passwordForm.new.length < 6 ? 'Weak' : passwordForm.new.length < 10 ? 'Medium' : 'Strong') : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword('new')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {passwordForm.showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="settings-field">
          <label className="settings-label">Re-enter New Password</label>
          <TextField
            type={passwordForm.showConfirm ? 'text' : 'password'}
            value={passwordForm.confirm}
            onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
            fullWidth
            error={passwordForm.confirm && passwordForm.new !== passwordForm.confirm}
            helperText={passwordForm.confirm && passwordForm.new !== passwordForm.confirm ? '⚠️ Password Does Not Match' : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword('confirm')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {passwordForm.showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#606770' }}>
          🛡️ We recommend using a password with uppercase, lowercase, numbers, and symbols.
        </Typography>
        <div className="edit-profile-actions">
          <Button onClick={handlePasswordUpdate} className="save-button" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Update Password'}
          </Button>
          <Button onClick={handleCloseModal} className="cancel-button">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAcademicProfile = () => (
    <div className="course-section">
      <h2 className="section-heading">Academic Experience</h2>
      <ul className="academic-list">
        {instructorProfileData.academicProfile.education.map((exp, index) => (
          <li key={index} className="academic-item">
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{exp.institution}</Typography>
            <Typography variant="body2" sx={{ color: '#606770' }}>{exp.degree}</Typography>
            <Typography variant="body2" sx={{ color: '#606770' }}>{exp.specialization}</Typography>
            <Typography variant="body2" sx={{ color: '#606770' }}>{exp.period}</Typography>
          </li>
        ))}
      </ul>
      <h2 className="section-heading" style={{ marginTop: '1.5rem' }}>Certificates and Courses</h2>
      <ul className="academic-list">
        {instructorProfileData.academicProfile.certificates.map((cert, index) => (
          <li key={index} className="academic-item">
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{cert.institution}</Typography>
            <Typography variant="body2" sx={{ color: '#606770' }}>{cert.name}</Typography>
            <Typography variant="body2" sx={{ color: '#606770' }}>{cert.period}</Typography>
          </li>
        ))}
      </ul>
    </div>
  );

  const tabContent = {
    general: renderGeneralInformation(),
    courses: renderMyCourses(),
    statistics: renderStatistics(),
    settings: renderSettings(),
    academic: renderAcademicProfile(),
  };

  const tabLabels = {
    general: 'General Information',
    courses: 'My Courses',
    statistics: 'Statistics',
    settings: 'Settings',
    academic: 'Academic Profile',
  };

  return (
    <div className="profile-container">
      <div className="profile-layout">
        <div className="left-column">
          <div className="profile-header">
            <Avatar src={instructor.photo} sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }} />
            <p className="profile-name">{instructor.firstName} {instructor.lastName}</p>
            <p className="profile-role">Instructor</p>
          </div>
        </div>
        <div className="right-column">
          <div className="tab-navigation">
            {Object.keys(tabContent).map(tab => (
              <div
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]}
              </div>
            ))}
          </div>
          <div className="tab-content">
            {tabContent[activeTab]}
          </div>
        </div>
      </div>

      <Modal open={openModal} onClose={handleCloseModal} sx={{ zIndex: 1000 }}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: '#ffffff',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          p: 2,
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Change Password</Typography>
          <div className="settings-form">
            <div className="settings-field">
              <label className="settings-label">Enter Current Password</label>
              <TextField
                type={passwordForm.showCurrent ? 'text' : 'password'}
                value={passwordForm.current}
                onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                fullWidth
                error={passwordForm.current && passwordForm.current !== instructor.password}
                helperText={passwordForm.current && passwordForm.current !== instructor.password ? '❌ Incorrect Password' : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword('current')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {passwordForm.showCurrent ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Enter New Password</label>
              <TextField
                type={passwordForm.showNew ? 'text' : 'password'}
                value={passwordForm.new}
                onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                fullWidth
                helperText={passwordForm.new ? (passwordForm.new.length < 6 ? 'Weak' : passwordForm.new.length < 10 ? 'Medium' : 'Strong') : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword('new')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {passwordForm.showNew ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Re-enter New Password</label>
              <TextField
                type={passwordForm.showConfirm ? 'text' : 'password'}
                value={passwordForm.confirm}
                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                fullWidth
                error={passwordForm.confirm && passwordForm.new !== passwordForm.confirm}
                helperText={passwordForm.confirm && passwordForm.new !== passwordForm.confirm ? '⚠️ Password Does Not Match' : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword('confirm')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {passwordForm.showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#606770' }}>
              🛡️ We recommend using a password with uppercase, lowercase, numbers, and symbols.
            </Typography>
            <div className="edit-profile-actions">
              <Button onClick={handlePasswordUpdate} className="save-button" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Update Password'}
              </Button>
              <Button onClick={handleCloseModal} className="cancel-button">
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal open={editProfileModal} onClose={handleCloseEditProfile} sx={{ zIndex: 1000 }}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: '#ffffff',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          p: 2,
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
        }}>
          <div style={{ flex: '0 0 40%', textAlign: 'center' }}>
            <label className="settings-label">Profile Image</label>
            <Avatar src={formData.photo} sx={{ width: 150, height: 150, mx: 'auto', mt: '0.5rem' }} />
            <Button startIcon={<Upload />} component="label" className="change-image-button" sx={{ mt: '1rem', display: 'block', mx: 'auto' }}>
              Change Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Button>
          </div>
          <div className="edit-profile-form" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1.5rem'  }}>
            <div className="settings-field">
              <label className="settings-label">First Name</label>
              <TextField
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                fullWidth
                size="small"
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Last Name</label>
              <TextField
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                fullWidth
                size="small"
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">University Email</label>
              <TextField
                value={formData.email}
                disabled
                fullWidth
                size="small"
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">University Number</label>
              <TextField
                value={formData.universityNumber}
                disabled
                fullWidth
                size="small"
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Country</label>
              <Select
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                fullWidth
                size="small"
              >
                <MenuItem value="United States">🇺🇸 United States</MenuItem>
                <MenuItem value="United Kingdom">🇬🇧 United Kingdom</MenuItem>
                <MenuItem value="Canada">🇨🇦 Canada</MenuItem>
                <MenuItem value="Palestine">🇵🇸 Palestine</MenuItem>
              </Select>
            </div>
            <div className="settings-field">
              <label className="settings-label">Timezone</label>
              <Select
                value={formData.timezone}
                onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                fullWidth
                size="small"
              >
                <MenuItem value="UTC-5">UTC-5</MenuItem>
                <MenuItem value="UTC+0">UTC+0</MenuItem>
                <MenuItem value="UTC+1">UTC+1</MenuItem>
                <MenuItem value="Asia/Gaza">Asia/Gaza</MenuItem>
              </Select>
            </div>
            <div className="edit-profile-actions">
              <Button onClick={handleSaveProfile} className="save-button" startIcon={<Save />}>
                Save
              </Button>
              <Button onClick={handleCloseEditProfile} className="cancel-button" startIcon={<Close />}>
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default InstructorProfile;