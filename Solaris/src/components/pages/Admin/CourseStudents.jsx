import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "../../ui/toaster";
import { Card } from "../../ui/card"; // Add missing import
import CourseService from "../../../services/CourseService";
import EnrollmentService from "../../../services/EnrollmentService";
import CourseStudentTable from "../../admin/CourseStudentTable";
import AddStudentDialog from "../../admin/AddStudentDialog";
import "./CourseStudents.css";

const CourseStudents = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [course, setCourse] = useState(null);
	const [students, setStudents] = useState([]);
	const [availableStudents, setAvailableStudents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	
	const fetchCourseData = async () => {
		try {
			const courseId = parseInt(id);
			
			// Fetch course details
			const courseResponse = await CourseService.getCourseById(courseId);
			setCourse(courseResponse.data);
			
			// Fetch enrolled students
			const enrollmentsResponse = await EnrollmentService.getEnrollmentsByCourse(courseId);
			setStudents(enrollmentsResponse);
			
			// Fetch available students (not enrolled)
			const availableResponse = await EnrollmentService.getAvailableStudentsForCourse(courseId);
			setAvailableStudents(availableResponse);
			
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching course data:", error);
			toast.error("Failed to load course data");
			setIsLoading(false);
		}
	};
	
	useEffect(() => {
		fetchCourseData();
	}, [id]);
	
	const handleAddStudents = async (selectedStudentIds) => {
		if (selectedStudentIds.length === 0) {
			toast.error("Please select at least one student");
			return;
		}
		
		try {
			setIsAddDialogOpen(false); // Close dialog first to improve perceived performance
			
			// Call API to enroll students
			const response = await EnrollmentService.enrollMultipleStudents(
				parseInt(id),
				selectedStudentIds.map(id => parseInt(id))
			);
			
			// Update UI with new enrollments
			setStudents(prevStudents => [...prevStudents, ...response]);
			
			// Update available students list
			const newAvailableStudents = availableStudents.filter(
				student => !selectedStudentIds.includes(student.id.toString())
			);
			setAvailableStudents(newAvailableStudents);
			
			// Update enrolled students count in the course
			setCourse(prevCourse => ({
				...prevCourse,
				enrolledStudents: prevCourse.enrolledStudents + selectedStudentIds.length
			}));
			
			toast.success(`Added ${selectedStudentIds.length} student${selectedStudentIds.length > 1 ? 's' : ''} to the course`);
		} catch (error) {
			console.error("Error adding students:", error);
			toast.error("Failed to add students to the course");
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
			
			// Add back to available students
			if (enrollmentToRemove.user) {
				setAvailableStudents(prev => [...prev, enrollmentToRemove.user]);
			}
			
			// Update enrolled students count in the course
			setCourse({
				...course,
				enrolledStudents: course.enrolledStudents - 1
			});
			
			toast.success(`Removed ${enrollmentToRemove.user?.fullName || "student"} from the course`);
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
						return { ...student, status: updatedEnrollment.status };
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
	
	if (isLoading) {
		return (
			<div className="page-loading-spinner">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}
	
	if (!course) {
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
				<Button variant="outline" onClick={() => navigate(`/admin/courses/${id}`)}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to Course Details
				</Button>
				<h1 className="course-header-title">
					Students - {course.title}
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
			/>
			
			<AddStudentDialog 
				open={isAddDialogOpen}
				onClose={() => setIsAddDialogOpen(false)}
				onAddStudents={handleAddStudents}
				availableStudents={availableStudents}
			/>
		</div>
	);
};

export default CourseStudents;