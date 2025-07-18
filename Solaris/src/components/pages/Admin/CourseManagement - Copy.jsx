import React, { useState, useEffect } from "react";
import AdminCourseService from "../../../services/AdminCourseService";
import CourseTable from "../../admin/CourseTable";
import "./CourseManagement.css";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({});
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await AdminCourseService.getCourses(
        pagination.page,
        pagination.size,
        filters
      );
      
      console.log("Courses response:", response.data);
      
      if (response.data.content) {
        setCourses(response.data.content);
        setPagination({
          page: response.data.number || 0,
          size: response.data.size || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      showNotification("Error loading courses", "error");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [pagination.page, pagination.size, filters]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({
      ...prev,
      page: 0,
      size: newSize
    }));
  };

  const handleFilterChange = (newFilters) => {
    console.log("Applying filters:", newFilters);
    setFilters(newFilters);
    setPagination(prev => ({
      ...prev,
      page: 0
    }));
  };

  return (
    <>
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="admin-course-page">
        <div className="admin-course-header">
          <h1 className="admin-title">Course Management</h1>
          <p className="admin-subtitle">Manage all courses in the system</p>
        </div>

        <CourseTable 
          courses={courses}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterChange={handleFilterChange}
        />
      </div>
    </>
  );
};

export default CourseManagement;