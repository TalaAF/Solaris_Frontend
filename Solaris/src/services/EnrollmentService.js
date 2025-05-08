import api from "./api";

class EnrollmentService {
  // Helper for mock responses during development
  async mockDelay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
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
      const response = await api.patch(`/api/enrollments/${enrollmentId}/status`, {
        status
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
      const response = await api.delete(`/api/enrollments/${enrollmentId}`);
      return response.data;
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
}

export default new EnrollmentService();