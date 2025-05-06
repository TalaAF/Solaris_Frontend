import React from "react";
import Layout from "../../layout/Layout";
import StatCard from "../../dashboard/StatCard";
import { 
  BookOpen, 
  GraduationCap, 
  ClipboardList, 
  Clock,
  Presentation
} from "lucide-react";
import "./InstructorDashboard.css";

// Mock data for instructor dashboard
const instructorStats = {
  activeCourses: 4,
  totalStudents: 215,
  pendingAssessments: 12,
  upcomingLectures: 3,
  completionRate: "87%"
};

const upcomingClasses = [
  {
    id: 1,
    title: "Advanced Cardiac Assessment",
    date: "May 8, 2025",
    time: "10:00 AM - 11:30 AM",
    students: 45,
    location: "Virtual Room 3"
  },
  {
    id: 2,
    title: "Clinical Pathology Lab",
    date: "May 10, 2025",
    time: "2:00 PM - 4:00 PM",
    students: 32,
    location: "Lab Room 2B"
  },
  {
    id: 3,
    title: "Emergency Medicine Seminar",
    date: "May 12, 2025",
    time: "9:00 AM - 12:00 PM",
    students: 28,
    location: "Lecture Hall A"
  }
];

const recentSubmissions = [
  {
    id: 1,
    title: "Midterm Exam",
    course: "Medical Imaging",
    submissions: 28,
    pending: 10,
    dueDate: "May 7, 2025"
  },
  {
    id: 2,
    title: "Clinical Case Study",
    course: "Diagnostic Medicine",
    submissions: 35,
    pending: 2,
    dueDate: "May 4, 2025"
  },
  {
    id: 3,
    title: "Research Proposal",
    course: "Evidence-based Practice",
    submissions: 18,
    pending: 0,
    dueDate: "April 30, 2025"
  }
];

const InstructorDashboard = () => {
  return (
    <Layout>
      <div className="instructor-dashboard">
        <div className="instructor-dashboard-header">
          <h1 className="instructor-title">Instructor Dashboard</h1>
          <p className="instructor-subtitle">Manage your courses, students, and assessments</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Active Courses"
            value={instructorStats.activeCourses}
            icon={<BookOpen size={24} />}
          />
          <StatCard
            title="Total Students"
            value={instructorStats.totalStudents}
            icon={<GraduationCap size={24} />}
            trend={{ value: 5, positive: true }}
          />
          <StatCard
            title="Pending Assessments"
            value={instructorStats.pendingAssessments}
            icon={<ClipboardList size={24} />}
          />
          <StatCard
            title="Upcoming Lectures"
            value={instructorStats.upcomingLectures}
            icon={<Presentation size={24} />}
          />
        </div>

        <div className="dashboard-content-grid">
          {/* Upcoming Classes Section */}
          <div className="dashboard-card upcoming-classes">
            <div className="dashboard-card-header">
              <h2>Upcoming Classes</h2>
              <button className="view-all-button">View Calendar</button>
            </div>
            <div className="dashboard-card-content">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Date & Time</th>
                    <th>Students</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingClasses.map((classItem) => (
                    <tr key={classItem.id}>
                      <td className="class-title">{classItem.title}</td>
                      <td>
                        <div>{classItem.date}</div>
                        <div className="muted-text">{classItem.time}</div>
                      </td>
                      <td>{classItem.students}</td>
                      <td>{classItem.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="dashboard-card recent-submissions">
            <div className="dashboard-card-header">
              <h2>Recent Submissions</h2>
              <button className="view-all-button">View All</button>
            </div>
            <div className="dashboard-card-content">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Course</th>
                    <th>Submissions</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="submission-title">{submission.title}</td>
                      <td>{submission.course}</td>
                      <td>
                        <div className="submission-count">
                          <span>{submission.submissions}</span>
                          {submission.pending > 0 && (
                            <span className="pending-badge">{submission.pending} pending</span>
                          )}
                        </div>
                      </td>
                      <td>{submission.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <Presentation size={24} />
              <span>Create Lecture</span>
            </button>
            <button className="quick-action-btn">
              <ClipboardList size={24} />
              <span>New Assessment</span>
            </button>
            <button className="quick-action-btn">
              <BookOpen size={24} />
              <span>Course Materials</span>
            </button>
            <button className="quick-action-btn">
              <Clock size={24} />
              <span>Office Hours</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InstructorDashboard;