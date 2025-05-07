import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Search } from "lucide-react";

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

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <CardTitle>Audit Logs</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={actionFilter}
            onValueChange={setActionFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">Export Logs</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.userEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No logs found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLog;