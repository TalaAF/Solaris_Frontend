// File: src/components/Dashboard.js
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Dashboard = () => {
  // Get current date
  const today = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  
  // Sample progress data
  const progressData = [
    { subject: 'Anatomy/Physiology', progress: 70 },
    { subject: 'Clinical Pathology', progress: 45 },
    { subject: 'Pharmacology', progress: 60 },
    { subject: 'Medical Ethics', progress: 80 }
  ];
  
  // Sample schedule data
  const scheduleData = [
    {
      id: 1,
      title: 'Cardiovascular System Lecture',
      location: 'Medical Building, Room 1205',
      time: '08:30 - 10:00',
      type: 'cardiovascular'
    },
    {
      id: 2,
      title: 'Clinical Pathology Lab Session',
      location: 'Science Lab Wing, Room 1235',
      time: '11:00 - 13:00',
      type: 'pathology'
    },
    {
      id: 3,
      title: 'Study Group - Pharmacology',
      location: 'Library, Small Room 3',
      time: '14:30 - 16:00',
      type: 'pharmacology'
    },
    {
      id: 4,
      title: 'Medical Ethics Seminar',
      location: 'Medical Building, Auditorium',
      time: '16:30 - 18:00',
      type: 'ethics'
    }
  ];
  
  // Sample deadlines data
  const deadlinesData = [
    {
      id: 1,
      title: 'Cardiovascular System Quiz',
      subject: 'Anatomy and Physiology',
      date: 'Tomorrow, 14:30'
    },
    {
      id: 2,
      title: 'Ethics Case Study Discussion',
      subject: 'Medical Ethics',
      date: '20 Apr'
    },
    {
      id: 3,
      title: 'Lab Report Submission',
      subject: 'Clinical Pathology',
      date: '20 Apr'
    },
    {
      id: 4,
      title: 'Drug Interactions Presentation',
      subject: 'Pharmacology',
      date: '22 Apr'
    },
    {
      id: 5,
      title: 'Midterm Examination',
      subject: 'Anatomy and Physiology',
      date: '25 Apr'
    }
  ];
  
  // Sample support tickets
  const ticketsData = [
    { email: 'jessica.smith123@example.com', issue: 'Login Issue', status: 'Open' },
    { email: 'david.jones456@gmail.com', issue: 'Billing Inquiry', status: 'Pending' },
    { email: 'emily.wilson783@ecollege.net', issue: 'Product Malfunction', status: 'Closed' },
    { email: 'andrew.johnson226@university.org', issue: 'Feature Request', status: 'Open' }
  ];
  
  // Function to determine color for progress bars
  const getProgressColor = (progress) => {
    if (progress >= 80) return '#4CAF50';
    if (progress >= 60) return '#2196F3';
    if (progress >= 40) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="App">
      <Sidebar />
      
      <div className="main-content">
        <Header />
        
        {/* Welcome Section */}
        <div className="welcome-card">
          <h2 className="welcome-title">Good evening, Dr. Johnson</h2>
          <p className="welcome-date">{formattedDate}</p>
          <div className="day-glance">
            <p>You have 5 upcoming classes and 2 assignments due today.</p>
          </div>
        </div>
        
        {/* Metrics Row */}
        <div className="metrics-row">
          <div className="metric-card">
            <div className="metric-title">Current MRR</div>
            <div className="metric-value">$12.4k</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-title">Current Customers</div>
            <div className="metric-value">16,601</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-title">Active Customers</div>
            <div className="metric-value">33%</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-title">Churn Rate</div>
            <div className="metric-value">2%</div>
          </div>
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Today's Schedule */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div className="card-header">
              <h3 className="card-title">Today's Schedule</h3>
              <div className="card-dropdown">{formattedDate}</div>
            </div>
            
            <div className="schedule-items">
              {scheduleData.map(item => (
                <div key={item.id} className={`schedule-item ${item.type}`}>
                  <div className="schedule-info">
                    <h4>{item.title}</h4>
                    <div className="schedule-location">{item.location}</div>
                  </div>
                  <div className="schedule-time">⏱️ {item.time}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Deadlines */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Upcoming Deadlines</h3>
            </div>
            
            <div className="deadline-items">
              {deadlinesData.map(item => (
                <div key={item.id} className="deadline-item">
                  <div className="deadline-dot" style={{ backgroundColor: getProgressColor(Math.random() * 100) }}></div>
                  <div className="deadline-info">
                    <h4>{item.title}</h4>
                    <div className="deadline-subject">{item.subject}</div>
                  </div>
                  <div className="deadline-date">📅 {item.date}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Course Progress */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div className="card-header">
              <h3 className="card-title">Course Progress</h3>
              <div className="card-dropdown">Overall Completion: <strong>93%</strong></div>
            </div>
            
            {progressData.map(item => (
              <div key={item.subject} className="progress-item">
                <div className="progress-header">
                  <span>{item.subject}</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${item.progress}%`,
                      backgroundColor: getProgressColor(item.progress)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Revenue Trend */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div className="card-header">
              <h3 className="card-title">Trend</h3>
              <div className="card-dropdown">This year ▼</div>
            </div>
            <div className="tab-group">
              <div className="tab active">New</div>
              <div className="tab">Renewals</div>
              <div className="tab">Churned</div>
            </div>
            <div className="chart-container">
              <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                [Bar Chart Visualization]
              </p>
            </div>
          </div>
          
          {/* Sales */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Sales</h3>
              <div className="card-dropdown">This year ▼</div>
            </div>
            <div className="chart-container" style={{ height: '200px' }}>
              <div style={{ 
                textAlign: 'center', 
                height: '150px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: '10px solid #e6eeff', 
                borderRadius: '50%', 
                width: '150px', 
                margin: '0 auto' 
              }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>342</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>SALES</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Support Tickets */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div className="card-header">
              <h3 className="card-title">Support Tickets</h3>
              <div className="card-dropdown">This week ▼</div>
            </div>
            <div className="tab-group">
              <div className="tab active">All</div>
              <div className="tab">Open</div>
              <div className="tab">Pending</div>
              <div className="tab">Closed</div>
            </div>
            <div className="tickets-list">
              {ticketsData.map((ticket, index) => (
                <div key={index} className="ticket-item">
                  <div className="ticket-email">{ticket.email}</div>
                  <div className="ticket-issue">{ticket.issue}</div>
                  <div className="ticket-status">{ticket.status}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Customer Demographics */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Customer Demographic</h3>
              <div className="tab-group" style={{ marginBottom: 0 }}>
                <div className="tab active" style={{ padding: '4px 8px', fontSize: '12px' }}>Active</div>
                <div className="tab" style={{ padding: '4px 8px', fontSize: '12px' }}>Inactive</div>
              </div>
            </div>
            <div className="map-container">
              <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                [World Map Visualization]
              </p>
            </div>
          </div>
          
          {/* Transactions List */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Transactions</h3>
            </div>
            <div style={{ margin: '15px 0' }}>
              <div className="transaction-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>S. Evergreen</div>
                <div style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>$950</div>
              </div>
              <div className="transaction-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>R. Sterling</div>
                <div style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>$1,345</div>
              </div>
              <div className="transaction-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>C. Meadows</div>
                <div style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>$715</div>
              </div>
              <div className="transaction-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>H. Hawthorne</div>
                <div style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>$4,219</div>
              </div>
            </div>
            <button style={{ 
              width: '100%', 
              padding: '8px', 
              backgroundColor: '#e6eeff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              View all transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;