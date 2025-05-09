import React from 'react';
import './styles/AdminPermissions.css';

const AdminPermissions = ({ permissions }) => {
  return (
    <div className="admin-permissions-card">
      <h2 className="section-heading">Permissions</h2>
      <p className="section-subtitle">Your administrative privileges</p>
      <table className="permissions-table">
        <thead>
          <tr>
            <th>Permission</th>
            <th>Is Allowed?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Manage Users</td>
            <td>{permissions.manageUsers ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Delete Courses</td>
            <td>{permissions.deleteCourses ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Modify System Settings</td>
            <td>{permissions.modifySettings ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Access Login</td>
            <td>{permissions.accessLogin ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>View Teacher Evaluations</td>
            <td>{permissions.viewEvaluations ? '✅' : '❌'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminPermissions;