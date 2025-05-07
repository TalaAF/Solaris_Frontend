import api from "./api";

class EnrollmentService {
  /**
   * Get all enrollments for a course
   * @param {number} courseId - Course ID
   * @returns {Promise} Promise object with enrollments data
   */
  async getEnrollmentsForCourse(courseId) {
    try {
      const response = await api.get(`/api/enrollments/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course enrollments:', error);
      throw error;
    }
  }

  /**
   * Get specific enrollment
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @returns {Promise} Promise object with enrollment data
   */
  async getEnrollment(studentId, courseId) {
    try {
      const response = await api.get(`/api/enrollments/${studentId}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      throw error;
    }
  }

  /**
   * Enroll a student in a course
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @returns {Promise} Promise object with enrollment data
   */
  async enrollStudent(studentId, courseId) {
    try {
      const response = await api.post(`/api/enrollments/enroll`, null, {
        params: { studentId, courseId }
      });
      return response.data;
    } catch (error) {
      console.error('Error enrolling student:', error);
      throw error;
    }
  }

  /**
   * Update enrollment progress
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @param {number} progress - Progress percentage (0-100)
   * @returns {Promise} Promise object with updated enrollment data
   */
  async updateProgress(studentId, courseId, progress) {
    try {
      const response = await api.patch(`/api/enrollments/${studentId}/${courseId}/progress`, null, {
        params: { progress }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  /**
   * Complete a course enrollment
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @returns {Promise} Promise object with completed enrollment data
   */
  async completeCourse(studentId, courseId) {
    try {
      const response = await api.post(`/api/enrollments/${studentId}/${courseId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error completing course:', error);
      throw error;
    }
  }

  /**
   * Unenroll a student from a course
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @returns {Promise} Promise object
   */
  async unenrollStudent(studentId, courseId) {
    try {
      await api.delete(`/api/enrollments/${studentId}/${courseId}`);
      return true;
    } catch (error) {
      console.error('Error unenrolling student:', error);
      throw error;
    }
  }
}

export default new EnrollmentService();