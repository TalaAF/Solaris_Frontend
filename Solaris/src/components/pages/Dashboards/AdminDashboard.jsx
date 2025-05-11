import React, { useState, useEffect } from "react";
import StatCard from "../../dashboard/StatCard";
import ActivityFeed from "../../dashboard/ActivityFeed";
import EnrollmentChart from "../../dashboard/EnrollmentChart";
import UsersRoleChart from "../../dashboard/UsersRoleChart";
import {
  BookOpen,
  Building2,
  Users,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import AdminUserService from "../../../services/AdminUserService";
import AdminCourseService from "../../../services/AdminCourseService";
import DepartmentService from "../../../services/DepartmentService";
import { recentActivity } from "../../../mocks/mockDataAdmin";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    totalDepartments: 0,
    newUsersThisMonth: 0,
    usersByRole: [],
    courseEnrollments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch users count data
        const usersResponse = await AdminUserService.getUsers({
          page: 0,
          size: 1, // We only need the total count from pagination
        });
        
        const totalUsers = usersResponse.data.totalElements || 0;
        
        // Fetch active users
        const activeUsersResponse = await AdminUserService.getUsers({
          page: 0, 
          size: 1,
          isActive: true
        });
        const activeUsers = activeUsersResponse.data.totalElements || 0;
        
        // Fetch new users this month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const newUsersResponse = await AdminUserService.getUsers({
          page: 0,
          size: 1,
          createdAfter: firstDayOfMonth.toISOString()
        });
        const newUsersThisMonth = newUsersResponse.data.totalElements || 0;
        
        // Fetch courses
        const coursesResponse = await AdminCourseService.getCourses(0, 1);
        const totalCourses = coursesResponse.data.totalElements || 0;
        
        // Fetch departments
        const departmentsResponse = await DepartmentService.getDepartments();
        const totalDepartments = departmentsResponse.data.length;
        
        // Fetch user roles for pie chart
        const rolesResponse = await fetchUsersByRole();
        
        // Fetch course enrollments for bar chart
        const enrollmentsResponse = await fetchTopCourseEnrollments();
        
        setDashboardData({
          totalUsers,
          activeUsers,
          totalCourses,
          totalDepartments,
          newUsersThisMonth,
          usersByRole: rolesResponse,
          courseEnrollments: enrollmentsResponse
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Helper function to fetch users by role for pie chart
  const fetchUsersByRole = async () => {
    try {
      // This endpoint might not exist, so we'll simulate it
      // In a real app, you'd have a dedicated endpoint
      const roles = ["ADMIN", "INSTRUCTOR", "STUDENT"];
      const roleData = [];
      
      // Fetch count for each role
      for (const role of roles) {
        try {
          const response = await AdminUserService.getUsers({
            page: 0,
            size: 1,
            role: role
          });
          
          roleData.push({
            name: role.charAt(0) + role.slice(1).toLowerCase(),
            value: response.data.totalElements || 0
          });
        } catch (err) {
          console.warn(`Error fetching users with role ${role}:`, err);
        }
      }
      
      return roleData;
    } catch (err) {
      console.error("Error fetching user roles:", err);
      return [];
    }
  };
  
  // Helper function to fetch top courses by enrollment
  const fetchTopCourseEnrollments = async () => {
    try {
      // In a real app, you'd have a dedicated endpoint for this
      // For now, we'll fetch a few courses and simulate enrollment data
      const coursesResponse = await AdminCourseService.getCourses(0, 5);
      const courses = coursesResponse.data.content || [];
      
      return courses.map(course => ({
        name: course.title || "Unknown Course",
        value: Math.floor(Math.random() * 50) + 10 // Simulate enrollment numbers
      }));
    } catch (err) {
      console.error("Error fetching course enrollments:", err);
      return [];
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  if (loading && !refreshing) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertTriangle size={32} color="#e53e3e" />
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={handleRefresh} className="refresh-button">
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Overview of your learning platform</p>
        </div>
        <button 
          onClick={handleRefresh} 
          className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
          disabled={refreshing}
        >
          <RefreshCw size={16} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={<Users size={24} />}
          trend={{ value: 3, positive: true }}
        />
        <StatCard
          title="Active Users"
          value={dashboardData.activeUsers}
          icon={<UserCheck size={24} />}
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title="Total Courses"
          value={dashboardData.totalCourses}
          icon={<BookOpen size={24} />}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Total Departments"
          value={dashboardData.totalDepartments}
          icon={<Building2 size={24} />}
        />
      </div>

      <div className="stats-grid">
        <StatCard
          title="New Users This Month"
          value={dashboardData.newUsersThisMonth}
          icon={<TrendingUp size={24} />}
          trend={{ value: 12, positive: true }}
          className="highlight-card"
        />
      </div>

      <div className="charts-grid">
        <EnrollmentChart data={dashboardData.courseEnrollments} />
        <UsersRoleChart data={dashboardData.usersByRole} />
      </div>

      <div className="activity-section">
        <ActivityFeed activities={recentActivity} />
      </div>
    </div>
  );
};

export default AdminDashboard;