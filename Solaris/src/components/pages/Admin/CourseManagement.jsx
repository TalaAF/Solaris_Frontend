import React, { useState, useEffect } from "react";
import CourseTable from "../../admin/CourseTable";
import AdminCourseService from "../../../services/AdminCourseService";
import { toast } from "../../../components/ui/toaster";
import "./CourseManagement.css";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchCourses();
  }, [pagination.page, pagination.size, filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await AdminCourseService.getCourses(
        pagination.page,
        pagination.size,
        filters
      );
      
      // Adapt the response to match our expected structure
      // The backend might wrap the data in a content field for pagination
      if (response.data && response.data.content) {
        setCourses(response.data.content);
        setPagination(prev => ({
          ...prev,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 1
        }));
      } else {
        // If the API returns a simple array without pagination
        setCourses(Array.isArray(response.data) ? response.data : []);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: newSize, page: 0 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page when filters change
  };

  const handleCourseAdd = async (courseData) => {
    try {
      setLoading(true);
      await AdminCourseService.createCourse(courseData);
      toast.success("Course created successfully");
      fetchCourses(); // Refresh the list
    } catch (err) {
      console.error("Error adding course:", err);
      toast.error(err.response?.data?.message || "Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseUpdate = async (courseId, courseData) => {
    try {
      setLoading(true);
      await AdminCourseService.updateCourse(courseId, courseData);
      toast.success("Course updated successfully");
      fetchCourses(); // Refresh the list
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error(err.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseToggleStatus = async (courseId, isCurrentlyActive) => {
    try {
      setLoading(true);
      if (isCurrentlyActive) {
        // Currently active, so unpublish it
        await AdminCourseService.unpublishCourse(courseId);
        toast.success("Course unpublished successfully");
      } else {
        // Currently inactive, so publish it
        await AdminCourseService.publishCourse(courseId);
        toast.success("Course published successfully");
      }
      fetchCourses(); // Refresh the list
    } catch (err) {
      console.error("Error toggling course status:", err);
      toast.error(err.response?.data?.message || "Failed to update course status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-course-page">
        <div className="admin-course-header">
          <h1 className="admin-title">Course Management</h1>
          <p className="admin-subtitle">Manage all courses in the system</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <CourseTable 
          courses={courses}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterChange={handleFilterChange}
          onCourseAdd={handleCourseAdd} 
          onCourseUpdate={handleCourseUpdate}
          onCourseToggleStatus={handleCourseToggleStatus}
        />
      </div>
    </>
  );
};

export default CourseManagement;