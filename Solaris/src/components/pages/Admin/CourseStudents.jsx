import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "../../ui/toaster";
import { courses as initialCourses } from "../../../mocks/mockDataAdmin";
import CourseStudentTable from "../../admin/CourseStudentTable";
import AddStudentDialog from "../../admin/AddStudentDialog";
import "./CourseStudents.css";

// Sample users data (would come from API in real app)
const allUsers = [
	{ id: 1, fullName: "John Smith", email: "john@example.com", roleNames: ["STUDENT"] },
	{ id: 2, fullName: "Jane Doe", email: "jane@example.com", roleNames: ["STUDENT"] },
	{ id: 3, fullName: "Alex Johnson", email: "alex@example.com", roleNames: ["STUDENT"] },
	{ id: 4, fullName: "Sarah Williams", email: "sarah@example.com", roleNames: ["STUDENT"] },
	{ id: 5, fullName: "Michael Brown", email: "michael@example.com", roleNames: ["STUDENT"] }
];

// Sample enrolled students data (would come from API in real app)
const sampleEnrolledStudents = [
	{
		id: 1,
		userId: 1,
		courseId: 1,
		enrollmentDate: "2023-09-01T00:00:00Z",
		status: "active",
		progress: 45,
		grade: "B",
	},
	{
		id: 2,
		userId: 2,
		courseId: 1,
		enrollmentDate: "2023-09-02T00:00:00Z",
		status: "active",
		progress: 30,
		grade: "C+",
	},
	{
		id: 3,
		userId: 3,
		courseId: 1,
		enrollmentDate: "2023-09-03T00:00:00Z",
		status: "inactive",
		progress: 10,
		grade: "Incomplete",
	}
];

const CourseStudents = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [course, setCourse] = useState(null);
	const [students, setStudents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	
	// Get non-enrolled students for the add dialog
	const nonEnrolledStudents = allUsers.filter(user => 
		user.roleNames.includes("STUDENT") && 
		!students.find(s => s.user?.id === user.id)
	);
	
	useEffect(() => {
		// Simulate API call to fetch course and enrolled students
		const courseId = parseInt(id);
		const foundCourse = initialCourses.find(c => c.id === courseId);
		
		if (foundCourse) {
			setTimeout(() => {
				setCourse(foundCourse);
				
				// Get enrolled students and map to user data
				const enrolledStudentsWithUserData = sampleEnrolledStudents
					.filter(enrollment => enrollment.courseId === courseId)
					.map(enrollment => {
						const user = allUsers.find(u => u.id === enrollment.userId);
						return {
							...enrollment,
							user: user || {
								fullName: `Unknown User (ID: ${enrollment.userId})`,
								email: "unknown@example.com"
							}
						};
					});
				
				setStudents(enrolledStudentsWithUserData);
				setIsLoading(false);
			}, 500);
		} else {
			setIsLoading(false);
		}
	}, [id]);
	
	const handleAddStudents = (selectedStudentIds) => {
		if (selectedStudentIds.length === 0) {
			toast.error("Please select at least one student");
			return;
		}

		// Create new enrollment records
		const newEnrollments = selectedStudentIds.map((userId, index) => {
			const user = allUsers.find(u => u.id === parseInt(userId));
			return {
				id: Math.max(0, ...students.map(s => s.id)) + index + 1,
				userId: parseInt(userId),
				courseId: parseInt(id),
				enrollmentDate: new Date().toISOString(),
				status: "active",
				progress: 0,
				grade: "Not graded",
				user
			};
		});
		
		setStudents([...students, ...newEnrollments]);
		
		// Update enrolled students count in the course
		setCourse({
			...course,
			enrolledStudents: course.enrolledStudents + newEnrollments.length
		});
		
		toast.success(`Added ${newEnrollments.length} student${newEnrollments.length > 1 ? 's' : ''} to the course`);
		setIsAddDialogOpen(false);
	};
	
	const handleRemoveStudent = (enrollmentId) => {
		const enrollmentToRemove = students.find(s => s.id === enrollmentId);
		if (!enrollmentToRemove) return;
		
		setStudents(students.filter(s => s.id !== enrollmentId));
		
		// Update enrolled students count in the course
		setCourse({
			...course,
			enrolledStudents: course.enrolledStudents - 1
		});
		
		toast.success(`Removed ${enrollmentToRemove.user?.fullName || "student"} from the course`);
	};
	
	const handleToggleStudentStatus = (enrollmentId) => {
		setStudents(
			students.map(student => {
				if (student.id === enrollmentId) {
					const newStatus = student.status === "active" ? "inactive" : "active";
					toast.success(`Student status changed to ${newStatus}`);
					return { ...student, status: newStatus };
				}
				return student;
			})
		);
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
				availableStudents={nonEnrolledStudents}
			/>
		</div>
	);
};

export default CourseStudents;