import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "../../ui/toaster";
import { Card } from "../../ui/card";
import CourseService from "../../../services/CourseService";
import EnrollmentService from "../../../services/EnrollmentService";
import CourseStudentTable from "../../admin/CourseStudentTable";
import AddStudentDialog from "../../admin/AddStudentDialog";
import "./CourseStudents.css";

const CourseStudents = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // Add this to access route state
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    // Debug logs
    console.log("CourseStudents - Location State:", location.state);
    console.log("CourseStudents - Current Course:", course);
    
    // Function to handle back button navigation
    const handleBackNavigation = () => {
        // Check if we have returnPath in state
        if (location.state?.returnPath) {
            console.log("Navigating to return path:", location.state.returnPath);
            // Before navigating, make sure we're passing the course data back
            navigate(location.state.returnPath, {
                state: { courseData: course } // This ensures we maintain the course data
            });
        } else {
            // If no return path, navigate to course details with current course data
            console.log("No return path specified, returning to course details");
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
                console.log("Using course data from router state:", location.state.courseData);
                setCourse(location.state.courseData);
                
                // Still fetch enrolled students as usual
                const enrollmentsResponse = await EnrollmentService.getEnrollmentsByCourse(courseId);
                setStudents(enrollmentsResponse.data || enrollmentsResponse);
                
                setIsLoading(false);
                return;
            }
            
            // If no state is available, proceed with normal fetch operation
            console.log("No router state available, fetching course data from API");
            const courseResponse = await CourseService.getCourseById(courseId);
            console.log("API response for course:", courseResponse);
            setCourse(courseResponse.data);
            
            // Fetch enrolled students
            const enrollmentsResponse = await EnrollmentService.getEnrollmentsByCourse(courseId);
            setStudents(enrollmentsResponse.data || enrollmentsResponse);
            
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching course data:", error);
            setError("Failed to load course data. Please try again.");
            toast.error("Failed to load course data");
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCourseData();
    }, [id, location.state]); // Add location.state as a dependency
    
    const handleAddStudent = async (studentId) => {
        try {
            // Call API to enroll a single student
            const response = await EnrollmentService.enrollStudent(
                parseInt(id),
                parseInt(studentId)
            );
            
            // Update UI with new enrollment
            setStudents(prevStudents => [...prevStudents, response.data || response]);
            
            // Close dialog after successful enrollment
            setIsAddDialogOpen(false);
            
            // Update enrolled students count in the course
            setCourse(prevCourse => ({
                ...prevCourse,
                enrolledStudents: (prevCourse.enrolledStudents || 0) + 1
            }));
            
            // Call the API to update the course's enrollment count
            try {
                await CourseService.updateCourseEnrollmentCount(parseInt(id));
            } catch (updateError) {
                console.error("Failed to update enrollment count:", updateError);
                // No need to show error to user as the enrollment still worked
            }
            
            toast.success("Student successfully added to course");
        } catch (error) {
            console.error("Error adding student:", error);
            toast.error("Failed to add student to the course");
        }
    };
    
    const handleRemoveStudent = async (enrollmentId) => {
        try {
            // Find the student to remove for the success message
            const enrollmentToRemove = students.find(s => s.id === enrollmentId);
            if (!enrollmentToRemove) return;
            
            // Call API to unenroll student
            await EnrollmentService.unenrollStudent(enrollmentId);
            
            // Update UI after successful unenrollment
            setStudents(students.filter(s => s.id !== enrollmentId));
            
            // Update enrolled students count in the course
            setCourse(prevCourse => ({
                ...prevCourse,
                enrolledStudents: Math.max(0, (prevCourse.enrolledStudents || 1) - 1)
            }));
            
            toast.success(`Student removed from course`);
        } catch (error) {
            console.error("Error removing student:", error);
            toast.error("Failed to remove student from the course");
        }
    };
    
    const handleToggleStudentStatus = async (enrollmentId) => {
        try {
            // Find current student and status
            const currentStudent = students.find(s => s.id === enrollmentId);
            if (!currentStudent) return;
            
            const newStatus = currentStudent.status === "active" ? "inactive" : "active";
            
            // Call API to update status
            const updatedEnrollment = await EnrollmentService.updateEnrollmentStatus(
                enrollmentId, 
                newStatus
            );
            
            // Update UI after successful status update
            setStudents(
                students.map(student => {
                    if (student.id === enrollmentId) {
                        return { ...student, status: updatedEnrollment.status || newStatus };
                    }
                    return student;
                })
            );
            
            toast.success(`Student status changed to ${newStatus}`);
        } catch (error) {
            console.error("Error updating student status:", error);
            toast.error("Failed to update student status");
        }
    };
    
    if (isLoading && !course) {
        return (
            <div className="page-loading-spinner">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }
    
    if (!course && !isLoading) {
        return (
            <div className="course-not-found">
                <Button variant="outline" onClick={() => navigate('/admin/courses')}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                </Button>
                <Card className="mt-6 p-10 text-center">
                    <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
                    <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => navigate('/admin/courses')}>Return to Course List</Button>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="course-students-container">
            <div className="course-header">
                {/* Update your back button to use the new navigation handler */}
                <Button variant="outline" onClick={handleBackNavigation}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {location.state?.returnPath === '/admin/courses' ? 'Back to Course List' : 'Back'}
                </Button>
                <h1 className="course-header-title">
                    Students - {course?.title || 'Loading...'}
                </h1>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Students
                </Button>
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