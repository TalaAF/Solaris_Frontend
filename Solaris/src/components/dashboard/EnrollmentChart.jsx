import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import "./EnrollmentChart.css";

const EnrollmentChart = ({ data }) => {
  const chartData = [
    { name: "Completed", value: data.completedCourses },
    { name: "In Progress", value: data.inProgress },
    { name: "Not Started", value: data.notStarted },
  ];

  // Solaris theme colors
  const COLORS = ["#56B870", "#E5BF03", "#3C85C3"];

  return (
    <div className="enrollment-chart">
      <div className="chart-header">
        <h2>Course Enrollments</h2>
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-summary">
          <div className="summary-item">
            <span className="summary-label">Total Enrollments:</span>
            <span className="summary-value">{data.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentChart;