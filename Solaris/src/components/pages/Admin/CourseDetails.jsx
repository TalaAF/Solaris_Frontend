import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Grid, Typography, Box, Chip, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminCourseService from "../../../services/AdminCourseService";
import CourseDialog from "../../admin/CourseDialog";
import { toast } from "../../../components/ui/toaster";
import "./CourseDetails.css";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Fetch course details when component mounts
  useEffect(() => {
    if (id) {
      fetchCourseDetails(id);
      // Comment out this line until the endpoint is fixed
      // fetchEnrolledStudents(id);
    }
  }, [id]);

  const fetchCourseDetails = async (courseId) => {
    setLoading(true);
    try {
      const response = await AdminCourseService.getCourse(courseId);
      console.log("Course details:", response.data);
      setCourse(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching course details:", err);
      setError(err.response?.data?.message || "Failed to load course details");
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  // Temporarily commented out due to 500 error
  /*
  const fetchEnrolledStudents = async (courseId) => {
    setLoadingStudents(true);
    try {
      const response = await AdminCourseService.getCourseStudents(courseId);
      console.log("Enrolled students:", response.data);
      setStudents(response.data || []);
    } catch (err) {
      console.error("Error fetching enrolled students:", err);
      // Initialize with empty array to prevent undefined errors
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };
  */

  const handleCourseUpdate = async (courseData) => {
    try {
      await AdminCourseService.updateCourse(id, courseData);
      toast.success("Course updated successfully");
      fetchCourseDetails(id); // Refresh course data
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error(err.response?.data?.message || "Failed to update course");
    }
  };

  const handleCourseDelete = async () => {
    try {
      await AdminCourseService.deleteCourse(id);
      toast.success("Course deleted successfully");
      navigate("/admin/courses");
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error(err.response?.data?.message || "Failed to delete course");
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="content-wrapper">
        <div className="error-message">
          <p>{error || "Course not found"}</p>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/courses")}
          >
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper admin-course-details">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/courses")}
        >
          Back to Courses
        </Button>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={() => setIsEditDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            Edit Course
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Course
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Course Details Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Course Information</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{course.title}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Course Code</Typography>
                <Typography variant="body1">{course.code || "N/A"}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                <Typography variant="body1">
                  {course.departmentName || "Not assigned"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Instructor</Typography>
                <Typography variant="body1">
                  {course.instructorName || "Not assigned"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Credits</Typography>
                <Typography variant="body1">{course.credits || "N/A"}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                <Typography variant="body1">{formatDate(course.startDate)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                <Typography variant="body1">{formatDate(course.endDate)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Semester</Typography>
                <Typography variant="body1">{course.semester || "Not specified"}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={course.isPublished ? "Published" : "Unpublished"}
                  color={course.isPublished ? "success" : "default"}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1">{course.description || "No description provided"}</Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Course Dialog */}
      <CourseDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleCourseUpdate}
        course={course}
        title="Edit Course"
      />

      {/* We've temporarily removed AddStudentDialog and ConfirmDialog imports and components */}
    </div>
  );
};

export default CourseDetails;