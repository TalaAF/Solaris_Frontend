import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";
import "./EnrollmentChart.css";

const EnrollmentChart = ({ data = [], error }) => {
  // Handle empty data or error
  if ((Array.isArray(data) && data.length === 0) || error) {
    return (
      <div className="enrollment-chart">
        <div className="chart-header">
          <h2>Course Enrollments</h2>
        </div>
        <div className="chart-content">
          <div className="chart-error">
            <AlertTriangle size={24} />
            <p>{error || "No enrollment data available"}</p>
          </div>
        </div>
      </div>
    );
  }

  // For backend data which is an array of {name, value} objects
  const chartData = Array.isArray(data) ? data : [];
  
  // Calculate total enrollments
  const totalEnrollments = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="enrollment-chart">
      <div className="chart-header">
        <h2>Course Enrollments</h2>
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
        <div className="chart-summary">
          <div className="summary-item">
            <span className="summary-label">Total Enrollments:</span>
            <span className="summary-value">{totalEnrollments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentChart;