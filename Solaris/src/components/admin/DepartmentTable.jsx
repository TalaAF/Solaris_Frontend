import React, { useState, useEffect } from "react";
import { Building2, Edit, MoreHorizontal, Plus, Search } from "lucide-react";
import DepartmentDialog from "./DepartmentDialog";
import TablePagination from '../ui/TablePagination';
import "./DepartmentTable.css";

const DepartmentTable = ({ 
  departments: initialDepartments, 
  loading = false, // Add loading prop
  onDepartmentAdd, 
  onDepartmentUpdate, 
  onDepartmentToggleStatus,
  pagination,
  onPageChange,
  onPageSizeChange 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState(initialDepartments || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("Add Department");

  // Update local state when props change
  useEffect(() => {
    setDepartments(initialDepartments || []);
  }, [initialDepartments]);
  
  // Filter departments based on search query
  const filteredDepartments = searchQuery 
    ? departments.filter(dept => 
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : departments;

  const handleOpenAddDialog = () => {
    setSelectedDepartment(null);
    setDialogTitle("Add Department");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (department) => {
    setSelectedDepartment(department);
    setDialogTitle("Edit Department");
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (department) => {
    const newStatus = !department.isActive;
    const updatedDepartments = departments.map(d => 
      d.id === department.id ? { ...d, isActive: newStatus } : d
    );
    setDepartments(updatedDepartments);
    
    if (onDepartmentToggleStatus) {
      onDepartmentToggleStatus(department.id, newStatus);
    }
    alert(`Department ${newStatus ? "activated" : "deactivated"} successfully`);
  };

  const handleSubmitDepartment = (formData) => {
    if (formData.id) {
      // Update existing department
      const updatedDepartments = departments.map(d => 
        d.id === formData.id ? { ...formData } : d
      );
      setDepartments(updatedDepartments);
      
      if (onDepartmentUpdate) {
        onDepartmentUpdate(formData);
      }
    } else {
      // Add new department
      const newDepartment = {
        ...formData,
        id: Math.max(...departments.map(d => d.id), 0) + 1,
        userCount: 0
      };
      setDepartments([...departments, newDepartment]);
      
      if (onDepartmentAdd) {
        onDepartmentAdd(newDepartment);
      }
    }
    setIsDialogOpen(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="department-table-container">
      <div className="department-table-header">
        <h2>Departments</h2>
        <div className="department-table-actions">
          {/* Add search box */}
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search departments..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <button className="add-button" onClick={handleOpenAddDialog}>
            <Plus size={16} />
            <span>Add Department</span>
          </button>
        </div>
      </div>
      
      <div className="department-table-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading departments...</p>
          </div>
        ) : (
          <table className="department-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Code</th>
                <th>Specialty Area</th>
                <th>Head of Department</th>
                <th>Users</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Use filteredDepartments instead of departments */}
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <tr key={department.id}>
                    <td>
                      <div className="department-info">
                        <div className="department-icon">
                          <Building2 size={16} />
                        </div>
                        <div className="department-details">
                          <div className="department-name">{department.name}</div>
                          <div className="department-description">{department.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>{department.code}</td>
                    <td>{department.specialtyArea}</td>
                    <td>{department.headOfDepartment}</td>
                    <td>{department.userCount}</td>
                    <td>
                      <span className={`status-badge ${department.isActive ? "active" : "inactive"}`}>
                        {department.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="action-cell">
                      <div className="dropdown">
                        <button className="dropdown-trigger">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="dropdown-menu">
                          <div className="dropdown-header">Actions</div>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item" onClick={() => handleOpenEditDialog(department)}>
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button 
                            className={`dropdown-item ${department.isActive ? "deactivate" : "activate"}`}
                            onClick={() => handleToggleStatus(department)}
                          >
                            <span>{department.isActive ? "Deactivate" : "Activate"}</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    {searchQuery 
                      ? "No departments match your search" 
                      : "No departments found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add pagination controls at the bottom */}
      {!loading && (
        <TablePagination
          totalItems={pagination.totalElements}
          currentPage={pagination.page}
          pageSize={pagination.size}
          itemName="departments"
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}

      <DepartmentDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmitDepartment}
        department={selectedDepartment}
        title={dialogTitle}
      />
    </div>
  );
};

export default DepartmentTable;