import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./UsersRoleChart.css";

const UsersRoleChart = ({ data }) => {
  const chartData = [
    {
      name: "Admin",
      value: data.ADMIN,
    },
    {
      name: "Instructor",
      value: data.INSTRUCTOR,
    },
    {
      name: "Student",
      value: data.STUDENT,
    },
  ];

  return (
    <div className="users-role-chart">
      <div className="chart-header">
        <h2>Users by Role</h2>
      </div>
      <div className="chart-content">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#E5BF03" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UsersRoleChart;