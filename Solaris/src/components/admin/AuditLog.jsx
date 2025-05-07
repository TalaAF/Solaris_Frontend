import React, { useState } from "react";
import { Search } from "lucide-react";
import "./AuditLog.css";

// Mock audit log data
const mockAuditLogs = [
  {
    id: 1,
    action: "Login",
    userId: 101,
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    timestamp: "2025-05-06T08:30:45.000Z",
    ipAddress: "192.168.1.100",
    details: "Successful login from Chrome on Windows",
  },
  {
    id: 2,
    action: "Password Change",
    userId: 101,
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    timestamp: "2025-05-06T09:12:23.000Z",
    ipAddress: "192.168.1.100",
    details: "User changed password",
  },
  {
    id: 3,
    action: "User Created",
    userId: 102,
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    timestamp: "2025-05-06T10:05:11.000Z",
    ipAddress: "10.0.0.15",
    details: "Admin created new user account",
  },
  {
    id: 4,
    action: "Role Modified",
    userId: 102,
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    timestamp: "2025-05-06T10:08:32.000Z",
    ipAddress: "10.0.0.15",
    details: "User role changed from STUDENT to INSTRUCTOR",
  },
  {
    id: 5,
    action: "Login Failed",
    userId: 103,
    userName: "Michael Brown",
    userEmail: "m.brown@example.com",
    timestamp: "2025-05-06T11:45:09.000Z",
    ipAddress: "172.16.0.55",
    details: "Failed login attempt (invalid password)",
  },
  {
    id: 6,
    action: "Content Created",
    userId: 101,
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    timestamp: "2025-05-06T14:22:18.000Z",
    ipAddress: "192.168.1.100",
    details: "Created new lesson content",
  },
  {
    id: 7,
    action: "Settings Changed",
    userId: 100,
    userName: "Admin User",
    userEmail: "admin@example.com",
    timestamp: "2025-05-06T16:10:05.000Z",
    ipAddress: "10.0.0.1",
    details: "Modified system security settings",
  },
];

const AuditLog = () => {
  const [logs, setLogs] = useState(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;
  };

  return (
    <div className="audit-log-container">
      <div className="audit-log-header">
        <h2 className="audit-log-title">Audit Logs</h2>
        <div className="audit-log-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="search"
              placeholder="Search logs..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="select-container">
            <select
              className="filter-select"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
            <div className="select-arrow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <button className="export-button">
            Export Logs
          </button>
        </div>
      </div>

      {/* Table container content */}
      <div className="audit-log-table-container">
        <table className="audit-log-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>User</th>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.action}</td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{log.userName}</div>
                      <div className="user-email">{log.userEmail}</div>
                    </div>
                  </td>
                  <td>{formatDate(log.timestamp)}</td>
                  <td>{log.ipAddress}</td>
                  <td>{log.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty-table">No logs found matching your filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;