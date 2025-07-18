import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import EnrollmentService from "../../../services/EnrollmentService";
import AdminCourseService from "../../../services/AdminCourseService";
import CourseStudentTable from "../../admin/CourseStudentTable";
import AddStudentDialog from "../../admin/AddStudentDialog";
import "./CourseStudents.css";

const CourseStudents = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    // Function to handle back button navigation
    const handleBackNavigation = () => {
        // Check if we have returnPath in state
        if (location.state?.returnPath) {
            // Before navigating, make sure we're passing the course data back
            navigate(location.state.returnPath, {
                state: { courseData: course } // This ensures we maintain the course data
            });
        } else {
            // If no return path, navigate to course details with current course data
            navigate(`/admin/courses/${id}`, {
                state: { courseData: course }
            });
        }
    };
    
    const fetchCourseData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const courseId = parseInt(id);
            
            // Check if we already have the course data from router state
            if (location.state?.courseData) {
                setCourse(location.state.courseData);
                
                // Fetch enrolled students
                const enrollmentsResponse = await EnrollmentService.getEnrollmentsByCourse(courseId);
                setStudents(enrollmentsResponse);
                
                setIsLoading(false);
                return;
            }
            
            // If no state is available, proceed with normal fetch operation
            const courseResponse = await AdminCourseService.getCourseById(courseId);
            setCourse(courseResponse.data || courseResponse);
            
            // Fetch enrolled students
            const enrollmentsResponse = await EnrollmentService.getEnrollmentsByCourse(courseId);
            setStudents(enrollmentsResponse);
            
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching course data:", error);
            setError("Failed to load course data. Please try again.");
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCourseData();
    }, [id]);
    
    const handleAddStudent = async (studentId) => {
        try {
            // Call API to enroll a single student
            const response = await EnrollmentService.enrollStudent(
                parseInt(id),
                parseInt(studentId)
            );
            
            // Update UI with new enrollment
            setStudents(prevStudents => [...prevStudents, response]);
            
            // Close dialog after successful enrollment
            setIsAddDialogOpen(false);
            
            // Update enrolled students count in the course
            setCourse(prevCourse => ({
                ...prevCourse,
                enrolledStudents: (prevCourse.enrolledStudents || 0) + 1
            }));
            
            // Use the new method to get updated enrollment count
            try {
                const countResponse = await AdminCourseService.getEnrollmentCount(parseInt(id));
                const updatedCount = countResponse.data || countResponse;
                
                // Update the course with accurate count from server
                setCourse(prevCourse => ({
                    ...prevCourse,
                    enrolledStudents: updatedCount
                }));
            } catch (updateError) {
                console.error("Failed to get enrollment count:", updateError);
                // No need to show error to user as the enrollment still worked
            }
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to add student to the course");
        }
    };
    
    const handleRemoveStudent = async (enrollmentId) => {
        if (!confirm("Are you sure you want to remove this student from the course? This action cannot be undone.")) {
            return;
        }
        
        try {
            // Find the student to be removed (for UI update)
            const studentToRemove = students.find(s => s.id === enrollmentId);
            if (!studentToRemove) return;
            
            console.log(`Removing student with enrollment ID: ${enrollmentId}`);
            
            // Call API to completely unenroll student - using the new method
            await EnrollmentService.unenrollStudentById(enrollmentId);
            
            // Update UI by removing the student from the list
            setStudents(prevStudents => prevStudents.filter(s => s.id !== enrollmentId));
            
            // Update enrolled students count in the course
            setCourse(prevCourse => ({
                ...prevCourse,
                enrolledStudents: Math.max(0, (prevCourse.enrolledStudents || 1) - 1)
            }));
            
            // Use the new method to get updated enrollment count
            try {
                const countResponse = await AdminCourseService.getEnrollmentCount(parseInt(id));
                const updatedCount = countResponse.data || countResponse;
                
                // Update the course with accurate count from server
                setCourse(prevCourse => ({
                    ...prevCourse,
                    enrolledStudents: updatedCount
                }));
            } catch (updateError) {
                console.error("Failed to get enrollment count:", updateError);
            }
            
            // Show success message
            alert(`Student successfully removed from ${course?.title || 'the course'}`);
        } catch (error) {
            console.error("Error removing student:", error);
            alert("Failed to remove student from the course");
        }
    };
    
    const handleToggleStudentStatus = async (enrollmentId) => {
        try {
            // Find current student and status
            const currentStudent = students.find(s => s.id === enrollmentId);
            if (!currentStudent) return;
            
            let currentStatus = currentStudent.status;
            
            // Determine the new status based on current status
            // The backend expects "active" or "inactive" in StatusUpdateRequest
            let newStatus;
            
            // Handle both string statuses and enum values
            if (currentStatus === "active" || 
                currentStatus === "APPROVED" || 
                currentStatus === "IN_PROGRESS") {
                newStatus = "inactive";
            } else {
                newStatus = "active";
            }
            
            console.log(`Toggling status from ${currentStatus} to ${newStatus} for enrollment ${enrollmentId}`);
            
            // Call API to update status
            await EnrollmentService.updateEnrollmentStatus(
                enrollmentId, 
                newStatus
            );
            
            // Update UI after successful status update
            setStudents(
                students.map(student => {
                    if (student.id === enrollmentId) {
                        return { ...student, status: newStatus };
                    }
                    return student;
                })
            );
        } catch (error) {
            console.error("Error updating student status:", error);
            alert("Failed to update student status");
        }
    };
    
    if (isLoading && !course) {
        return (
            <div className="page-loading-spinner">
                <div className="spinner"></div>
                <p>Loading course data...</p>
            </div>
        );
    }
    
    if (!course && !isLoading) {
        return (
            <div className="course-not-found">
                <button className="back-button" onClick={() => navigate('/admin/courses')}>
                    <ChevronLeft className="back-icon" />
                    Back to Courses
                </button>
                <div className="error-card">
                    <h2>Course Not Found</h2>
                    <p>The course you're looking for doesn't exist or has been removed.</p>
                    <button className="primary-button" onClick={() => navigate('/admin/courses')}>
                        Return to Course List
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="course-students-container">
            <div className="course-header">
                <button className="back-button" onClick={handleBackNavigation}>
                    <ChevronLeft className="back-icon" />
                    {location.state?.returnPath === '/admin/courses' ? 'Back to Course List' : 'Back'}
                </button>
                <h1 className="course-title">
                    {course?.title || 'Loading...'} - Students
                </h1>
                <button className="add-button" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="add-icon" />
                    Add Students
                </button>
            </div>
            
            <CourseStudentTable 
                students={students}
                onToggleStatus={handleToggleStudentStatus}
                onRemoveStudent={handleRemoveStudent}
                loading={isLoading}
                error={error}
                courseTitle={course?.title}
            />
            
            <AddStudentDialog 
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSubmit={handleAddStudent}
                courseId={parseInt(id)}
                currentStudents={students}
            />
        </div>
    );
};

export default CourseStudents;