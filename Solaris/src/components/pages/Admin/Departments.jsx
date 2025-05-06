import React, { useState } from "react";
import Layout from "../../layout/Layout";
import DepartmentTable from "../../admin/DepartmentTable";
import { departments as initialDepartments } from "../../../mocks/mockDataAdmin";
import "./Departments.css";

const Departments = () => {
  const [departments, setDepartments] = useState(initialDepartments || []);

  const handleDepartmentAdd = (departmentData) => {
    console.log("Adding department:", departmentData);
    alert("Department added successfully");
  };

  const handleDepartmentUpdate = (departmentData) => {
    console.log("Updating department:", departmentData);
    alert("Department updated successfully");
  };

  const handleDepartmentToggleStatus = (departmentId, newStatus) => {
    console.log(`${newStatus ? "Activating" : "Deactivating"} department with ID:`, departmentId);
    alert(`Department ${newStatus ? "activated" : "deactivated"} successfully`);
  };

  return (
    <>
      <div className="admin-departments-page">
        <div className="admin-departments-header">
          <h1 className="admin-title">Department Management</h1>
          <p className="admin-subtitle">Manage all departments in the system</p>
        </div>

        <DepartmentTable 
          departments={departments} 
          onDepartmentAdd={handleDepartmentAdd} 
          onDepartmentUpdate={handleDepartmentUpdate}
          onDepartmentToggleStatus={handleDepartmentToggleStatus}
        />
      </div>
    </>
  );
};

export default Departments;