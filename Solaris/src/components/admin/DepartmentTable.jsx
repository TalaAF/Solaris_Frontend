import React, { useState, useEffect } from "react";
import { Building2, Edit, MoreHorizontal, Plus, Search, Filter } from "lucide-react";
import DepartmentDialog from "./DepartmentDialog";
import TablePagination from '../ui/TablePagination';
import "./DepartmentTable.css";
import DepartmentService from "../../services/DepartmentService";
import { toast } from "../../components/ui/toaster";
import AdminUserService from "../../services/AdminUserService";

const DepartmentTable = ({ 
  departments: initialDepartments, 
  loading = false,
  onDepartmentAdd, 
  onDepartmentUpdate, 
  onDepartmentToggleStatus,
  pagination,
  onPageChange,
  onPageSizeChange,
  onFilterChange
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState(initialDepartments || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("Add Department");
   const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    specialtyArea: "",
    status: ""
  });
  const [specialtyAreas, setSpecialtyAreas] = useState([]);
  const [instructors, setInstructors] = useState([]);

  // Update local state when props change
  useEffect(() => {
    setDepartments(initialDepartments || []);
  }, [initialDepartments]);

   useEffect(() => {
    // Extract unique specialty areas from departments
    if (initialDepartments && initialDepartments.length > 0) {
      const areas = [...new Set(initialDepartments
        .filter(dept => dept.specialtyArea)
        .map(dept => dept.specialtyArea))]
        .sort();
      setSpecialtyAreas(areas);
    }
       // Load instructors for head filter
    const fetchInstructors = async () => {
      try {
        const response = await AdminUserService.getUsers({ role: 'INSTRUCTOR' });
        setInstructors(response.data.content || response.data || []);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    
    fetchInstructors();
  }, [initialDepartments]);
  // Filter departments based on search query
   const filteredDepartments = searchQuery || filters.specialtyArea || filters.status !== "" 
    ? departments.filter(dept => {
        // Search filter
        const matchesSearch = searchQuery === "" ||
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Specialty area filter
        const matchesSpecialty = filters.specialtyArea === "" ||
          dept.specialtyArea === filters.specialtyArea;
        
        // Status filter
        const isActive = dept.active || dept.isActive;
        const matchesStatus = filters.status === "" ||
          (filters.status === "true" && isActive) ||
          (filters.status === "false" && !isActive);
        
        return matchesSearch && matchesSpecialty && matchesStatus;
      })
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

  const handleToggleStatus = async (department) => {
    try {
      const isActive = department.active || department.isActive;
      await DepartmentService.toggleDepartmentStatus(department.id, !isActive);
      
      if (onDepartmentToggleStatus) {
        onDepartmentToggleStatus(department.id, !isActive);
      }
    } catch (error) {
      console.error("Error toggling department status:", error);
      toast.error("Failed to update department status");
    }
  };

  const handleSubmitDepartment = (formData) => {
    if (formData.id) {
      // For updates, don't update local state - let parent handle it after API call
      if (onDepartmentUpdate) {
        onDepartmentUpdate(formData);
      }
    } else {
      // For new departments, also let parent handle state after API call
      if (onDepartmentAdd) {
        onDepartmentAdd(formData);
      }
    }
    setIsDialogOpen(false);
  };

   // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
    // If backend search is enabled, update filters after a delay
    if (onFilterChange) {
      const timer = setTimeout(() => {
        onFilterChange({
          ...filters,
          search: e.target.value
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  };

  // Apply filters to backend
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        search: searchQuery
      });
    }
  };

  // Update a single filter value
  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    
    // For server-side filtering, wait for the Apply button click
    if (onFilterChange && !document.querySelector('.apply-filters')) {
      // If there's no Apply button, apply filters immediately
      onFilterChange({
        ...updatedFilters,
        search: searchQuery
      });
    }
  };

  // Reset filters
  const resetFilters = () => {
    const emptyFilters = {
      specialtyArea: "",
      status: ""
    };
    
    setFilters(emptyFilters);
    
    if (onFilterChange) {
      onFilterChange({
        ...emptyFilters,
        search: searchQuery
      });
    }
  };

  return (
    <div className="department-table-container">
      <div className="department-table-header">
        <h2>Departments</h2>
        <div className="department-table-actions">
          {/* Add search box with filter button */}
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search departments..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyUp={(e) => e.key === 'Enter' && applyFilters()}
            />
            <button 
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <Filter size={18} />
            </button>
          </div>
          
          <button className="add-button" onClick={handleOpenAddDialog}>
            <Plus size={16} />
            <span>Add Department</span>
          </button>
        </div>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Specialty Area</label>
            <select 
              value={filters.specialtyArea}
              onChange={(e) => handleFilterChange('specialtyArea', e.target.value)}
            >
              <option value="">All Specialty Areas</option>
              {specialtyAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="filter-actions">
            {onFilterChange && (
              <button className="apply-filters" onClick={applyFilters}>Apply Filters</button>
            )}
            <button className="reset-filters" onClick={resetFilters}>Reset</button>
          </div>
        </div>
      )}

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
                    <td>{department.head ? department.head.fullName : '-'}</td>
                    <td className="user-count-cell">
                      {/* Handle all possible property names for user count */}
                      {department.userCount !== undefined ? department.userCount : 0
                      }
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge ${department.active || department.isActive ? 'active' : 'inactive'}`}>
                        {department.active || department.isActive ? 'Active' : 'Inactive'}
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
                          <div className="dropdown-item" onClick={() => handleToggleStatus(department)}>
                            {department.active || department.isActive ? (
                              <>
                                <span className="icon-deactivate"></span>
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <span className="icon-activate"></span>
                                <span>Activate</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    {searchQuery || filters.specialtyArea || filters.status !== ""
                      ? "No departments match your filters" 
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