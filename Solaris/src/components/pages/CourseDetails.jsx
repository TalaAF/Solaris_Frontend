// components/pages/CourseDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Remove Sidebar and Header imports
import CourseView from "../courses/CourseView";
import AdminCourseService from "../../services/AdminCourseService";
import { toast } from "react-toastify";
import "./CourseDetails.css";

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Removed userRole state since sidebar is gone

  useEffect(() => {
    // Fetch course data when component mounts or courseId changes
    if (courseId) {
      fetchCourseDetails(courseId);
    } else {
      setError("Course ID is missing");
      setLoading(false);
    }
  }, [courseId]);

  const fetchCourseDetails = async (id) => {
    setLoading(true);
    try {
      // Use AdminCourseService to fetch course details
      const response = await AdminCourseService.getCourse(id);
      console.log("Course details fetched:", response.data);
      setCourse(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching course details:", err);
      setError(
        err.response?.data?.message || "Failed to load course details"
      );
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Remove the app-container div and use a simpler structure
    <div className="content-wrapper">
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading course details...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => fetchCourseDetails(courseId)}
          >
            Try Again
          </button>
          <button
            className="back-button"
            onClick={() => navigate("/courses")}
          >
            Back to Courses
          </button>
        </div>
      ) : course ? (
        <CourseView course={course} />
      ) : (
        <div className="not-found-message">
          <p>Course not found</p>
          <button
            className="back-button"
            onClick={() => navigate("/courses")}
          >
            Back to Courses
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;
