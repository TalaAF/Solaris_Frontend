import React, { useEffect, useRef, useState } from "react";
import { 
  BookOpen, 
  Users, 
  FileText, 
  MessageSquare, 
  Clock, 
  Calendar, 
  BarChart2, 
  CheckCircle,
  Bell,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  Download,
  Loader,
  X
} from "lucide-react";
import InstructorLayout from "../../layout/InstructorLayout";
import { Chart, LinearScale, CategoryScale, BarController, BarElement, PieController, ArcElement, Legend, Title, Tooltip, LineElement, PointElement, LineController } from "chart.js";
import "./InstructorDashboard.css";

// Register Chart.js components
Chart.register(
  LinearScale, 
  CategoryScale, 
  BarController, 
  BarElement, 
  PieController, 
  ArcElement, 
  Legend, 
  Title, 
  Tooltip, 
  LineElement, 
  PointElement, 
  LineController
);

// Custom Card component for better reusability
const DashboardCard = ({ title, children, className = "", actionButton = null }) => (
  <div className={`dashboard-card ${className}`}>
    <div className="card-header">
      <h2>{title}</h2>
      {actionButton}
    </div>
    <div className="card-content">
      {children}
    </div>
  </div>
);
// Removed unused exportDashboardData function to resolve the error
// Stat Card component
const StatCard = ({ icon, title, value, trend = null }) => {
  const Icon = icon;
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper">
        <Icon size={24} className="stat-icon" />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value-container">
          <div className="stat-value">{value}</div>
          {trend && (
            <div className={`stat-trend ${trend.direction}`}>
              <TrendingUp size={14} />
              <span>{trend.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ClassItem component
const ClassItem = ({ title, time, students, isLive = false }) => (
  <div className={`class-item ${isLive ? 'live' : ''}`}>
    <div className="class-time-icon-wrapper">
      <Clock size={18} className="class-time-icon" />
      {isLive && <span className="live-badge">LIVE</span>}
    </div>
    <div className="class-details">
      <h3>{title}</h3>
      <p>{time}</p>
      <div className="class-students">
        <Users size={14} />
        <span>{students} students</span>
      </div>
    </div>
    <button className="class-action-btn">
      {isLive ? 'Join' : 'View'}
    </button>
  </div>
);

// Leaderboard Item component
const LeaderboardItem = ({ rank, image, name, label, score }) => (
  <div className="leaderboard-item">
    <span className="rank">{rank}</span>
    <img src={image} alt={name} />
    <div className="leaderboard-details">
      <h3>{name}</h3>
      <p>{label}</p>
    </div>
    <span className="score">{score}</span>
  </div>
);

// Fixed Filter Dropdown component
const FilterDropdown = ({ label, options = [], onSelect = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="period-selector" ref={dropdownRef}>
      <div 
        className={`filter-dropdown ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        <ChevronDown size={16} />
      </div>
      
      {isOpen && options.length > 0 && (
        <div className="date-picker">
          <div className="date-picker-header">
            <h3>Select Option</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="date-options">
            {options.map((option, index) => (
              <div
                key={index}
                className={`date-option ${option === label ? 'active' : ''}`}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
const exportDashboardData = () => {
  // Sample data for export - replace with your actual data if needed
  const statsData = [
    { category: 'Active Courses', value: 8, change: '+2' },
    { category: 'Total Students', value: 235, change: '+22' },
    { category: 'Assessments', value: 12, change: '+4' },
    { category: 'Unread Messages', value: 24, change: '+7' }
  ];

  const courseProgressData = [
    { course: 'Anatomy 101', completion: '92%' },
    { course: 'Clinical Diagnosis', completion: '78%' },
    { course: 'Medical Ethics', completion: '65%' },
    { course: 'Pathology', completion: '42%' }
  ];

  // Prepare the CSV content
  let csvContent = 'data:text/csv;charset=utf-8,';
  
  // Add dashboard title and date
  const currentDate = new Date().toLocaleDateString();
  csvContent += `Instructor Dashboard Export - ${currentDate}\n\n`;
  
  // Add stats data
  csvContent += 'DASHBOARD STATISTICS\n';
  csvContent += 'Category,Value,Change\n';
  statsData.forEach(item => {
    csvContent += `${item.category},${item.value},${item.change}\n`;
  });
  csvContent += '\n';
  
  // Add course progress data
  csvContent += 'COURSE COMPLETION\n';
  csvContent += 'Course,Completion Rate\n';
  courseProgressData.forEach(item => {
    csvContent += `${item.course},${item.completion}\n`;
  });
  
  // Create a download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `instructor_dashboard_export_${currentDate.replace(/\//g, '-')}.csv`);
  document.body.appendChild(link);
  
  // Trigger download and remove link
  link.click();
  document.body.removeChild(link);
};

const InstructorDashboard = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('This Week');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [performanceFilter, setPerformanceFilter] = useState('By Course');
  const [topicFilter, setTopicFilter] = useState('Anatomy 101');
  const [timeRangeFilter, setTimeRangeFilter] = useState('Last 6 Months');

  // Date range options
  const dateRangeOptions = [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
    'This Month',
    'Last Month',
    'This Quarter',
    'Custom Range'
  ];

  // Course filter options
  const courseFilterOptions = [
    'All Courses',
    'Anatomy 101',
    'Clinical Diagnosis',
    'Medical Ethics',
    'Pathology'
  ];

  // Performance filter options
  const performanceFilterOptions = [
    'By Course',
    'By Student',
    'By Topic',
    'By Assessment'
  ];

  // Topic filter options
  const topicFilterOptions = [
    'Anatomy 101',
    'Clinical Diagnosis',
    'Medical Ethics',
    'Pathology'
  ];

  // Time range filter options
  const timeRangeFilterOptions = [
    'Last Month',
    'Last 3 Months',
    'Last 6 Months',
    'Last Year',
    'All Time'
  ];

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    // Clean up previous charts if they exist
    if (barChartRef.current) {
      barChartRef.current.destroy();
    }
    if (pieChartRef.current) {
      pieChartRef.current.destroy();
    }
    if (lineChartRef.current) {
      lineChartRef.current.destroy();
    }

    // Common chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1f2937',
          bodyColor: '#4b5563',
          borderColor: 'rgba(229, 231, 235, 0.5)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            labelPointStyle: function() {
              return {
                pointStyle: 'circle',
                rotation: 0
              };
            }
          }
        }
      }
    };

    // Bar Chart for Student Performance
    const ctxBar = document.getElementById("studentPerformanceChart").getContext("2d");
    barChartRef.current = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: ["Anatomy 101", "Clinical Diagnosis", "Medical Ethics", "Pathology"],
        datasets: [
          {
            label: "Average Score (%)",
            data: [85, 78, 65, 92],
            backgroundColor: "rgba(249, 115, 22, 0.7)",
            borderColor: "rgba(249, 115, 22, 1)",
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        ...chartOptions,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              display: true,
              color: "rgba(229, 231, 235, 0.5)",
            },
            ticks: {
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: "Score (%)",
              font: {
                size: 14,
                weight: 'normal'
              }
            },
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        },
      },
    });

    // Pie Chart for Topic Distribution
    const ctxPie = document.getElementById("topicDistributionChart").getContext("2d");
    pieChartRef.current = new Chart(ctxPie, {
      type: "pie",
      data: {
        labels: ["Skeletal System", "Muscular System", "Nervous System", "Other"],
        datasets: [
          {
            data: [30, 25, 20, 25],
            backgroundColor: [
              "rgba(249, 115, 22, 0.8)",
              "rgba(34, 197, 94, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(147, 51, 234, 0.8)",
            ],
            borderColor: [
              "rgba(249, 115, 22, 1)",
              "rgba(34, 197, 94, 1)",
              "rgba(59, 130, 246, 1)",
              "rgba(147, 51, 234, 1)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        ...chartOptions,
        cutout: '15%',
      },
    });

    // Line Chart for Student Engagement
    const ctxLine = document.getElementById("engagementChart").getContext("2d");
    lineChartRef.current = new Chart(ctxLine, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Participation",
            data: [75, 82, 68, 85, 88, 92],
            borderColor: "rgba(249, 115, 22, 1)",
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "rgba(249, 115, 22, 1)",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "Assignment Completion",
            data: [65, 75, 70, 80, 85, 90],
            borderColor: "rgba(59, 130, 246, 1)",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        ...chartOptions,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              display: true,
              color: "rgba(229, 231, 235, 0.5)",
            },
            ticks: {
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: "Rate (%)",
              font: {
                size: 14,
                weight: 'normal'
              }
            },
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <InstructorLayout>
        <div className="loading-container">
          <Loader size={40} className="loading-spinner" />
          <p>Loading your dashboard...</p>
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="dashboard-wrapper">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-welcome">
            <h1>Welcome, Saja Shawawra</h1>
            <p>Medical Instructor | Here's your activity overview</p>
          </div>
          <div className="dashboard-actions">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Search courses, students..." />
            </div>
            <FilterDropdown 
              label={dateRange} 
              options={dateRangeOptions}
              onSelect={(option) => setDateRange(option)}
            />
            <button className="export-btn" onClick={exportDashboardData}>
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatCard 
            icon={BookOpen} 
            title="Active Courses" 
            value="8" 
            trend={{ direction: "up", value: "+2" }}
          />
          <StatCard 
            icon={Users} 
            title="Total Students" 
            value="235" 
            trend={{ direction: "up", value: "+22" }}
          />
          <StatCard 
            icon={FileText} 
            title="Assessments" 
            value="12" 
            trend={{ direction: "up", value: "+4" }}
          />
          <StatCard 
            icon={MessageSquare} 
            title="Unread Messages" 
            value="24" 
            trend={{ direction: "up", value: "+7" }}
          />
        </div>

        {/* Dashboard Top Section */}
        <div className="dashboard-section">
          <div className="dashboard-grid-top">
            {/* Student Progress Card */}
            <DashboardCard 
              title="Course Completion" 
              className="progress-card"
              actionButton={
                <FilterDropdown 
                  label={courseFilter} 
                  options={courseFilterOptions}
                  onSelect={(option) => setCourseFilter(option)}
                />
              }
            >
              <div className="course-progress-wrapper">
                <div className="progress-circle">
                  <svg viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" className="progress-bg" />
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="70" 
                      className="progress-fill" 
                      style={{ 
                        strokeDasharray: `${2 * Math.PI * 70}`, 
                        strokeDashoffset: `${2 * Math.PI * 70 * 0.25}` 
                      }} 
                    />
                  </svg>
                  <div className="progress-text">
                    <span>75%</span>
                    <p>Average</p>
                  </div>
                </div>
                <div className="progress-metrics">
                  <div className="metric-item">
                    <div className="metric-icon anatomy">
                      <BookOpen size={16} />
                    </div>
                    <div className="metric-info">
                      <div className="metric-label">
                        <span>Anatomy 101</span>
                        <span>92%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill anatomy" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon clinical">
                      <FileText size={16} />
                    </div>
                    <div className="metric-info">
                      <div className="metric-label">
                        <span>Clinical Diagnosis</span>
                        <span>78%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill clinical" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon ethics">
                      <CheckCircle size={16} />
                    </div>
                    <div className="metric-info">
                      <div className="metric-label">
                        <span>Medical Ethics</span>
                        <span>65%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill ethics" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Student Engagement Chart */}
            <DashboardCard 
              title="Student Engagement" 
              className="engagement-card"
              actionButton={
                <FilterDropdown 
                  label={timeRangeFilter} 
                  options={timeRangeFilterOptions}
                  onSelect={(option) => setTimeRangeFilter(option)}
                />
              }
            >
              <div className="chart-container">
                <canvas id="engagementChart" height="250"></canvas>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Dashboard Middle Section */}
        <div className="dashboard-section">
          <div className="dashboard-grid-middle">
            {/* Upcoming Classes */}
            <DashboardCard 
              title="Upcoming Classes" 
              className="classes-card"
              actionButton={<button className="view-all-btn">View All</button>}
            >
              <div className="class-list">
                <ClassItem 
                  title="Clinical Diagnosis" 
                  time="Today, 9:00 AM" 
                  students="32"
                  isLive={true} 
                />
                <ClassItem 
                  title="Anatomy 101" 
                  time="Tomorrow, 11:00 AM" 
                  students="45" 
                />
                <ClassItem 
                  title="Medical Ethics" 
                  time="Thursday, 2:00 PM" 
                  students="28" 
                />
              </div>
            </DashboardCard>

            {/* Student Performance */}
            <DashboardCard 
              title="Student Performance" 
              className="performance-card"
              actionButton={
                <FilterDropdown 
                  label={performanceFilter} 
                  options={performanceFilterOptions}
                  onSelect={(option) => setPerformanceFilter(option)}
                />
              }
            >
              <div className="chart-container">
                <canvas id="studentPerformanceChart" height="200"></canvas>
              </div>
            </DashboardCard>

            {/* Topic Distribution */}
            <DashboardCard 
              title="Topic Distribution" 
              className="topic-card"
              actionButton={
                <FilterDropdown 
                  label={topicFilter} 
                  options={topicFilterOptions}
                  onSelect={(option) => setTopicFilter(option)}
                />
              }
            >
              <div className="chart-container">
                <canvas id="topicDistributionChart" height="200"></canvas>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Dashboard Bottom Section */}
        <div className="dashboard-section">
          <div className="dashboard-grid-bottom">
            {/* Activity Feed */}
            <DashboardCard 
              title="Activity Feed" 
              className="activity-card"
              actionButton={<button className="view-all-btn">View All</button>}
            >
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon materials">
                    <FileText size={16} />
                  </div>
                  <div className="activity-details">
                    <h3>Updated materials for Anatomy 101</h3>
                    <p>2 hours ago</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon graded">
                    <CheckCircle size={16} />
                  </div>
                  <div className="activity-details">
                    <h3>Graded assessments for Clinical Diagnosis</h3>
                    <p>1 day ago</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon message">
                    <MessageSquare size={16} />
                  </div>
                  <div className="activity-details">
                    <h3>Responded to student questions</h3>
                    <p>2 days ago</p>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Leaderboard */}
            <DashboardCard 
              title="Student Leaderboard" 
              className="leaderboard-card"
              actionButton={<button className="view-all-btn">View All</button>}
            >
              <div className="leaderboard-list">
                <LeaderboardItem 
                  rank="1" 
                  image="https://randomuser.me/api/portraits/women/1.jpg" 
                  name="Anna Smith" 
                  label="Top Performer" 
                  score="95%" 
                />
                <LeaderboardItem 
                  rank="2" 
                  image="https://randomuser.me/api/portraits/men/2.jpg" 
                  name="John Doe" 
                  label="High Achiever" 
                  score="90%" 
                />
                <LeaderboardItem 
                  rank="3" 
                  image="https://randomuser.me/api/portraits/women/3.jpg" 
                  name="Maria Garcia" 
                  label="Fast Learner" 
                  score="88%" 
                />
              </div>
            </DashboardCard>

            {/* Colleagues */}
            <DashboardCard 
              title="Colleagues" 
              className="colleagues-card"
              actionButton={<button className="view-all-btn">View All</button>}
            >
              <div className="colleagues-list">
                <div className="colleague-item">
                  <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="Dr. Emily Brown" />
                  <div className="colleague-info">
                    <h3>Dr. Emily Brown</h3>
                    <p>Cardiology Professor</p>
                  </div>
                  <div className="colleague-status online"></div>
                </div>
                <div className="colleague-item">
                  <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Dr. Michael Lee" />
                  <div className="colleague-info">
                    <h3>Dr. Michael Lee</h3>
                    <p>Neurology Professor</p>
                  </div>
                  <div className="colleague-status offline"></div>
                </div>
                <div className="colleague-item">
                  <img src="https://randomuser.me/api/portraits/women/5.jpg" alt="Dr. Sarah Wilson" />
                  <div className="colleague-info">
                    <h3>Dr. Sarah Wilson</h3>
                    <p>Pediatrics Professor</p>
                  </div>
                  <div className="colleague-status online"></div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorDashboard;