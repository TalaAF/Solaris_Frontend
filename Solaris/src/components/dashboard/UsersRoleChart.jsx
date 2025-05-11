import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { AlertTriangle, RefreshCw } from "lucide-react";
import AdminUserService from "../../services/AdminUserService";
import "./UsersRoleChart.css";

const UsersRoleChart = ({ data: initialData = [], error: initialError }) => {
  const [chartData, setChartData] = useState(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState(initialError);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch role data from backend
  const fetchUserRoleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Define the roles we want to count
      const roles = ["ADMIN", "INSTRUCTOR", "STUDENT"];
      const roleData = [];
      
      // Fetch counts for each role from the service
      for (const role of roles) {
        try {
          const response = await AdminUserService.getUsers({
            role: role
          });
          
          // Get the count from the response - handle different API response formats
          let count = 0;
          
          if (response.data.totalElements !== undefined) {
            count = response.data.totalElements;
          } else if (Array.isArray(response.data)) {
            count = response.data.length;
          } else if (response.data.content && Array.isArray(response.data.content)) {
            count = response.data.content.length;
          }
          
          // Only add to chart data if there are users with this role
          if (count > 0) {
            roleData.push({
              name: role.charAt(0) + role.slice(1).toLowerCase(), // Format: Admin, Student, etc.
              value: count
            });
          }
        } catch (err) {
          console.warn(`Error fetching users with role ${role}:`, err);
        }
      }
      
      if (roleData.length === 0) {
        setError("No user role data available");
      } else {
        setChartData(roleData);
      }
    } catch (err) {
      console.error("Error fetching user roles:", err);
      setError("Failed to load user role distribution");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount or when initialData changes
  useEffect(() => {
    if (initialData.length === 0) {
      fetchUserRoleData();
    } else {
      setChartData(initialData);
    }
  }, [initialData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserRoleData();
  };

  // Solaris theme colors
  const COLORS = ["#E5BF03", "#3C85C3", "#56B870", "#F97316", "#8B5CF6"];
  
  // Calculate total users
  const totalUsers = chartData.reduce((sum, item) => sum + item.value, 0);

  // Handle loading state
  if (loading) {
    return (
      <div className="users-role-chart">
        <div className="chart-header">
          <h2>Users by Role</h2>
        </div>
        <div className="chart-content">
          <div className="chart-loading">
            <div className="spinner"></div>
            <p>Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || chartData.length === 0) {
    return (
      <div className="users-role-chart">
        <div className="chart-header">
          <div className="chart-title-container">
            <h2>Users by Role</h2>
            <button 
              onClick={handleRefresh} 
              className="chart-refresh-button"
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? "refreshing" : ""} />
            </button>
          </div>
        </div>
        <div className="chart-content">
          <div className="chart-error">
            <AlertTriangle size={24} />
            <p>{error || "No user role data available"}</p>
            <button onClick={handleRefresh} className="try-again-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-role-chart">
      <div className="chart-header">
        <div className="chart-title-container">
          <h2>Users by Role</h2>
          <button 
            onClick={handleRefresh} 
            className="chart-refresh-button"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "refreshing" : ""} />
          </button>
        </div>
      </div>
      <div className="chart-content">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-summary">
          <div className="summary-item">
            <span className="summary-label">Total Users:</span>
            <span className="summary-value">{totalUsers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersRoleChart;