// Improved EnrollmentService.js

import api from "./api";

class EnrollmentService {
  // Get all enrolled students for a course
  async getEnrollmentsByCourse(courseId) {
    try {
      const response = await api.get(`/api/enrollments/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollments for course ${courseId}:`, error);
      throw error;
    }
  }
  
  // Enroll a single student in a course
  async enrollStudent(courseId, userId) {
    try {
      const response = await api.post(`/api/enrollments`, {
        courseId,
        userId
      });
      return response.data;
    } catch (error) {
      console.error(`Error enrolling student ${userId} in course ${courseId}:`, error);
      throw error;
    }
  }
  
  // Enroll multiple students in a course (batch enrollment)
  async enrollMultipleStudents(courseId, userIds) {
    try {
      const response = await api.post(`/api/enrollments/batch`, {
        courseId,
        userIds
      });
      return response.data;
    } catch (error) {
      console.error(`Error batch enrolling students in course ${courseId}:`, error);
      throw error;
    }
  }
  
  // Update enrollment status (active/inactive)
  async updateEnrollmentStatus(enrollmentId, status) {
    try {
      // Map frontend status to backend expected format
      // The backend StatusUpdateRequest expects status as a string "active" or "inactive"
      console.log(`Updating enrollment ${enrollmentId} status to: ${status}`);
      
      const response = await api.patch(`/api/enrollments/${enrollmentId}/status`, {
        status: status // Send status as-is, backend handles conversion
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating enrollment status for enrollment ${enrollmentId}:`, error);
      throw error;
    }
  }
  
  // Remove student from course (delete enrollment)
  async unenrollStudent(enrollmentId) {
    try {
      console.log(`Removing student enrollment with ID: ${enrollmentId}`);
      
      // This will completely delete the enrollment record in the database
      await api.delete(`/api/enrollments/${enrollmentId}`);
      
      // Return true since the backend returns 204 No Content
      return true;
    } catch (error) {
      console.error(`Error removing enrollment ${enrollmentId}:`, error);
      throw error;
    }
  }
  
  // Get all students that are not enrolled in the course
  async getAvailableStudentsForCourse(courseId) {
    try {
      const response = await api.get(`/api/students/available/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching available students for course ${courseId}:`, error);
      throw error;
    }
  }
  
  // Update student's progress or grade
  async updateStudentProgress(enrollmentId, progress, grade = null) {
    try {
      const data = { progress };
      if (grade) data.grade = grade;
      
      const response = await api.patch(`/api/enrollments/${enrollmentId}/progress`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating progress for enrollment ${enrollmentId}:`, error);
      throw error;
    }
  }
  
  // Get a specific enrollment by student and course IDs
  async getEnrollment(studentId, courseId) {
    try {
      const response = await api.get(`/api/enrollments/${studentId}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollment for student ${studentId} in course ${courseId}:`, error);
      throw error;
    }
  }
  
  // Complete a course enrollment
  async completeCourse(studentId, courseId) {
    try {
      const response = await api.post(`/api/enrollments/${studentId}/${courseId}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error completing course ${courseId} for student ${studentId}:`, error);
      throw error;
    }
  }

  // Delete enrollment by ID
  async deleteEnrollment(enrollmentId) {
    try {
      const response = await api.delete(`/api/enrollments/${enrollmentId}`);
      return response;
    } catch (error) {
      console.error(`Error deleting enrollment ${enrollmentId}:`, error);
      throw error;
    }
  }

  // Unenroll a student from a course using student and course IDs
  async unenrollStudentByCourseIds(studentId, courseId) {
    try {
      const response = await api.delete(`/api/enrollments/student/${studentId}/course/${courseId}`);
      return response;
    } catch (error) {
      console.error(`Error unenrolling student ${studentId} from course ${courseId}:`, error);
      throw error;
    }
  }

  // Unenroll a student using enrollment ID
  async unenrollStudentById(enrollmentId) {
    try {
      const response = await api.delete(`/api/enrollments/${enrollmentId}`);
      return response;
    } catch (error) {
      console.error(`Error unenrolling student with enrollment ID ${enrollmentId}:`, error);
      throw error;
    }
  }
}

export default new EnrollmentService();