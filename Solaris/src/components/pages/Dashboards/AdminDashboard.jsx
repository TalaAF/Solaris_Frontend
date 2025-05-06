import React from "react";
import Layout from "../../layout/Layout";
import StatCard from "../../dashboard/StatCard";
import ActivityFeed from "../../dashboard/ActivityFeed";
import EnrollmentChart from "../../dashboard/EnrollmentChart";
import UsersRoleChart from "../../dashboard/UsersRoleChart";
import {
  BookOpen,
  Building2,
  Users,
  UserCheck,
  TrendingUp
} from "lucide-react";
import { dashboardStats, recentActivity } from "../../../mocks/mockDataAdmin";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <>
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Overview of your medical learning platform</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Users"
            value={dashboardStats.totalUsers}
            icon={<Users size={24} />}
            trend={{ value: 3, positive: true }}
          />
          <StatCard
            title="Active Users"
            value={dashboardStats.activeUsers}
            icon={<UserCheck size={24} />}
            trend={{ value: 5, positive: true }}
          />
          <StatCard
            title="Total Courses"
            value={dashboardStats.totalCourses}
            icon={<BookOpen size={24} />}
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            title="Total Departments"
            value={dashboardStats.totalDepartments}
            icon={<Building2 size={24} />}
          />
        </div>

        <div className="stats-grid">
          <StatCard
            title="New Users"
            value={dashboardStats.newUsersThisMonth}
            icon={<TrendingUp size={24} />}
            trend={{ value: 12, positive: true }}
            className="highlight-card"
          />
        </div>

        <div className="charts-grid">
          <EnrollmentChart data={dashboardStats.courseEnrollments} />
          <UsersRoleChart data={dashboardStats.usersByRole} />
        </div>

        <div className="activity-section">
          <ActivityFeed activities={recentActivity} />
        </div>
      </div>
      </>
  );
};

export default AdminDashboard;