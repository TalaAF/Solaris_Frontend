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
  const [chartErrors, setChartErrors] = useState({
    usersByRole: null,
    courseEnrollments: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        setChartErrors({
          usersByRole: null,
          courseEnrollments: null
        });
        
        // Fetch users count data
        const usersResponse = await AdminUserService.getUsers({
          page: 0,
          size: 1,
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
          createdAfter: firstDayOfMonth.toISOString().split('T')[0]
        });
        const newUsersThisMonth = newUsersResponse.data.totalElements || 0;
        
        // Fetch courses
        const coursesResponse = await AdminCourseService.getCourses(0, 1);
        const totalCourses = coursesResponse.data.totalElements || 0;
        
        // Fetch departments
        const departmentsResponse = await DepartmentService.getDepartments();
        const totalDepartments = Array.isArray(departmentsResponse.data) 
          ? departmentsResponse.data.length 
          : (departmentsResponse.data.content?.length || 0);
        
        // Fetch user roles and course enrollments in parallel
        const [usersByRoleData, courseEnrollmentsData] = await Promise.allSettled([
          fetchUsersByRole(),
          fetchTopCourseEnrollments()
        ]);
        
        // Handle possible errors in chart data
        const newChartErrors = { ...chartErrors };
        
        let usersByRole = [];
        if (usersByRoleData.status === 'fulfilled') {
          usersByRole = usersByRoleData.value;
        } else {
          console.error("Error fetching users by role:", usersByRoleData.reason);
          newChartErrors.usersByRole = "Could not load role distribution";
        }
        
        let courseEnrollments = [];
        if (courseEnrollmentsData.status === 'fulfilled') {
          courseEnrollments = courseEnrollmentsData.value;
        } else {
          console.error("Error fetching course enrollments:", courseEnrollmentsData.reason);
          newChartErrors.courseEnrollments = "Could not load enrollment data";
        }
        
        setChartErrors(newChartErrors);
        
        setDashboardData({
          totalUsers,
          activeUsers,
          totalCourses,
          totalDepartments,
          newUsersThisMonth,
          usersByRole,
          courseEnrollments
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
  
  // Helper function to fetch users by role for pie chart - UPDATED
  const fetchUsersByRole = async () => {
    try {
      // First try to fetch from a dedicated endpoint if available
      try {
        const response = await fetch('/api/analytics/users-by-role');
        if (response.ok) {
          const data = await response.json();
          // Format data if needed
          return data.map(item => ({
            name: item.role.charAt(0).toUpperCase() + item.role.slice(1).toLowerCase(),
            value: item.count
          }));
        }
      } catch (err) {
        console.warn("No dedicated users-by-role endpoint, falling back to manual counting");
      }
    
      // If no dedicated endpoint, fetch all users and count roles manually
      const allUsersResponse = await AdminUserService.getUsers({ size: 1000 });
      let users = [];
      
      if (allUsersResponse.data.content) {
        users = allUsersResponse.data.content;
      } else if (Array.isArray(allUsersResponse.data)) {
        users = allUsersResponse.data;
      }
      
      // Count users by role
      const roleCountMap = {};
      
      users.forEach(user => {
        if (user.roles && Array.isArray(user.roles)) {
          user.roles.forEach(role => {
            // Handle if role is an object or string
            const roleName = typeof role === 'string' ? role : role.name;
            
            if (!roleName) return;
            
            const formattedRole = roleName.toLowerCase();
            roleCountMap[formattedRole] = (roleCountMap[formattedRole] || 0) + 1;
          });
        } else if (user.role) {
          // Handle if role is a string or object
          const roleName = typeof user.role === 'string' ? user.role : user.role.name;
          
          if (!roleName) return;
          
          const formattedRole = roleName.toLowerCase();
          roleCountMap[formattedRole] = (roleCountMap[formattedRole] || 0) + 1;
        }
      });
      
      // Convert to chart format
      return Object.entries(roleCountMap).map(([role, count]) => ({
        name: role.charAt(0).toUpperCase() + role.slice(1),
        value: count
      }));
    } catch (err) {
      console.error("Error fetching user roles:", err);
      throw err;
    }
  };
  
  // Helper function to fetch top courses by enrollment - UPDATED
  const fetchTopCourseEnrollments = async () => {
    try {
      // First try to fetch from a dedicated endpoint if available
      try {
        const response = await fetch('/api/analytics/course-enrollments');
        if (response.ok) {
          const data = await response.json();
          // Get top 5 courses
          return data.slice(0, 5).map(item => ({
            name: item.courseName || item.title,
            value: item.enrollmentCount
          }));
        }
      } catch (err) {
        console.warn("No dedicated course-enrollments endpoint, falling back to alternative method");
      }
      
      // If no dedicated endpoint, try to get courses with their enrollment counts
      const coursesResponse = await AdminCourseService.getCourses(0, 100, { sort: "enrollmentCount,desc" });
      
      let courses = [];
      if (coursesResponse.data.content) {
        courses = coursesResponse.data.content;
      } else if (Array.isArray(coursesResponse.data)) {
        courses = coursesResponse.data;
      }
      
      // Take the top 5 courses
      const topCourses = courses.slice(0, 5);
      
      // If courses have enrollmentCount property, use it
      if (topCourses.length > 0 && (topCourses[0].enrollmentCount !== undefined || topCourses[0].studentCount !== undefined)) {
        return topCourses.map(course => ({
          name: course.title || "Unknown Course",
          value: course.enrollmentCount || course.studentCount || 0
        }));
      }
      
      // If no enrollment counts are available, fetch them individually
      const courseEnrollmentPromises = topCourses.map(async course => {
        try {
          const enrollmentsResponse = await fetch(`/api/courses/${course.id}/enrollments/count`);
          if (enrollmentsResponse.ok) {
            const count = await enrollmentsResponse.json();
            return {
              name: course.title || "Unknown Course",
              value: count
            };
          }
          return {
            name: course.title || "Unknown Course",
            value: 0
          };
        } catch (err) {
          console.warn(`Error fetching enrollments for course ${course.id}:`, err);
          return {
            name: course.title || "Unknown Course",
            value: 0
          };
        }
      });
      
      return await Promise.all(courseEnrollmentPromises);
    } catch (err) {
      console.error("Error fetching course enrollments:", err);
      throw err;
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
        <EnrollmentChart 
          data={dashboardData.courseEnrollments}
          error={chartErrors.courseEnrollments}
        />
        <UsersRoleChart 
          data={dashboardData.usersByRole}
          error={chartErrors.usersByRole}
        />
      </div>

      <div className="activity-section">
        <ActivityFeed activities={recentActivity} />
      </div>
    </div>
  );
};

export default AdminDashboard;