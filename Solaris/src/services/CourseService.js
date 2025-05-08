// CourseService.js
// Service to handle API calls to the course backend with fallback to mock data

import axios from "axios";

const API_URL = "http://localhost:8080/api";
const USE_MOCK = false; // Toggle this when your backend is ready

// Mock data
const mockCourses = [
  {
    id: 1,
    title: "Human Anatomy & Physiology",
    code: "MED201",
    description: "A comprehensive course on human anatomy and physiology covering body systems, structures, and functions.",
    instructor: {
      id: 1,
      name: "Dr. Sarah Smith",
      title: "Professor of Anatomy",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    progress: 35,
    modules: [
      { id: 1, title: "Introduction to Anatomy", status: "completed" },
      { id: 2, title: "Cell Structure and Function", status: "in-progress" },
      { id: 3, title: "Tissues and Organs", status: "not-started" }
    ]
  },
  {
    id: 2,
    title: "Introduction to Biochemistry",
    code: "CHEM301",
    description: "Explore the chemical processes within and related to living organisms, with focus on protein structure, enzyme function, and cellular metabolism.",
    instructor: {
      id: 2,
      name: "Dr. Robert Johnson",
      title: "Associate Professor of Biochemistry",
      avatar: "https://i.pravatar.cc/150?img=8"
    },
    progress: 12,
    modules: [
      { id: 4, title: "Introduction to Biochemistry", status: "in-progress" },
      { id: 5, title: "Protein Structure and Function", status: "not-started" },
      { id: 6, title: "Enzymes and Metabolism", status: "not-started" }
    ]
  },
  {
    id: 3,
    title: "Clinical Pathophysiology",
    code: "MED405",
    description: "Advanced examination of disease processes and the pathological basis of clinical symptoms, focusing on organ system dysfunction and therapeutic approaches.",
    instructor: {
      id: 1,
      name: "Dr. Sarah Smith",
      title: "Professor of Anatomy",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    progress: 0,
    modules: [
      { id: 7, title: "Cardiovascular Pathophysiology", status: "not-started" },
      { id: 8, title: "Respiratory System Disorders", status: "not-started" },
      { id: 9, title: "Neurological Diseases", status: "not-started" }
    ]
  }
];

const mockRequirements = [
  { id: 1, courseId: 1, type: "quiz", minScore: 70, title: "Final Exam" },
  { id: 2, courseId: 1, type: "assignment", title: "Research Paper" }
];

const mockStatistics = {
  averageCompletionPercentage: 35,
  studentsEnrolled: 125,
  averageRating: 4.7
};

class CourseService {
  // Helper for mock responses
  async mockDelay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Get all courses
  async getAllCourses() {
    if (USE_MOCK) {
      await this.mockDelay();
      return { data: mockCourses };
    }
    
    try {
      return await axios.get(`${API_URL}/courses`);
    } catch (error) {
      console.error("Error fetching courses:", error);
      await this.mockDelay();
      return { data: mockCourses };
    }
  }

  // Get course by ID
  async getCourseById(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      const course = mockCourses.find(c => c.id == id);
      if (!course) throw new Error("Course not found");
      return { data: course };
    }
    
    try {
      return await axios.get(`${API_URL}/courses/${id}`);
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      await this.mockDelay();
      const course = mockCourses.find(c => c.id == id);
      if (!course) throw new Error("Course not found");
      return { data: course };
    }
  }

  // Get courses by department
  async getCoursesByDepartment(departmentId) {
    if (USE_MOCK) {
      await this.mockDelay();
      return { data: mockCourses }; // Mock implementation returns all courses
    }
    
    try {
      return await axios.get(`${API_URL}/courses/department/${departmentId}`);
    } catch (error) {
      console.error(`Error fetching courses for department ${departmentId}:`, error);
      await this.mockDelay();
      return { data: mockCourses };
    }
  }

  // Get courses by instructor
  async getCoursesByInstructor(instructorId) {
    if (USE_MOCK) {
      await this.mockDelay();
      const filtered = mockCourses.filter(c => c.instructor?.id == instructorId);
      return { data: filtered };
    }
    
    try {
      return await axios.get(`${API_URL}/courses/instructor/${instructorId}`);
    } catch (error) {
      console.error(`Error fetching courses for instructor ${instructorId}:`, error);
      await this.mockDelay();
      const filtered = mockCourses.filter(c => c.instructor?.id == instructorId);
      return { data: filtered };
    }
  }

  // Create a new course
  async createCourse(courseData) {
    if (USE_MOCK) {
      await this.mockDelay();
      const newCourse = { ...courseData, id: mockCourses.length + 1 };
      mockCourses.push(newCourse);
      return { data: newCourse };
    }
    
    try {
      return await axios.post(`${API_URL}/courses`, courseData);
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  }

  // Update a course
  async updateCourse(id, courseData) {
    if (USE_MOCK) {
      await this.mockDelay();
      const index = mockCourses.findIndex(c => c.id == id);
      if (index === -1) throw new Error("Course not found");
      mockCourses[index] = { ...mockCourses[index], ...courseData };
      return { data: mockCourses[index] };
    }
    
    try {
      return await axios.put(`${API_URL}/courses/${id}`, courseData);
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw error;
    }
  }

  // Delete a course
  async deleteCourse(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      const index = mockCourses.findIndex(c => c.id == id);
      if (index === -1) throw new Error("Course not found");
      const deleted = mockCourses.splice(index, 1)[0];
      return { data: deleted };
    }
    
    try {
      return await axios.delete(`${API_URL}/courses/${id}`);
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw error;
    }
  }

  // Enroll student in a course
  async enrollStudent(courseId, studentId) {
    if (USE_MOCK) {
      await this.mockDelay();
      return { data: { success: true } };
    }
    
    try {
      return await axios.post(`${API_URL}/courses/${courseId}/students/${studentId}`);
    } catch (error) {
      console.error(`Error enrolling student ${studentId} in course ${courseId}:`, error);
      throw error;
    }
  }

  // Unenroll student from a course
  async unenrollStudent(courseId, studentId) {
    if (USE_MOCK) {
      await this.mockDelay();
      return { data: { success: true } };
    }
    
    try {
      return await axios.delete(`${API_URL}/courses/${courseId}/students/${studentId}`);
    } catch (error) {
      console.error(`Error unenrolling student ${studentId} from course ${courseId}:`, error);
      throw error;
    }
  }

  // Get course statistics
  async getCourseStatistics(courseId) {
    if (USE_MOCK) {
      await this.mockDelay();
      return { data: mockStatistics };
    }
    
    try {
      return await axios.get(`${API_URL}/courses/${courseId}/statistics`);
    } catch (error) {
      console.error(`Error fetching statistics for course ${courseId}:`, error);
      await this.mockDelay();
      return { data: mockStatistics };
    }
  }

  // Get completion requirements for a course
  async getCompletionRequirements(courseId) {
    if (USE_MOCK) {
      await this.mockDelay();
      const requirements = mockRequirements.filter(r => r.courseId == courseId);
      return { data: requirements };
    }
    
    try {
      return await axios.get(`${API_URL}/completion-requirements/course/${courseId}`);
    } catch (error) {
      console.error(`Error fetching completion requirements for course ${courseId}:`, error);
      await this.mockDelay();
      const requirements = mockRequirements.filter(r => r.courseId == courseId);
      return { data: requirements };
    }
  }

  // Create completion requirement
  async createCompletionRequirement(courseId, requirementData) {
    if (USE_MOCK) {
      await this.mockDelay();
      const newRequirement = {
        ...requirementData,
        id: mockRequirements.length + 1,
        courseId
      };
      mockRequirements.push(newRequirement);
      return { data: newRequirement };
    }
    
    try {
      return await axios.post(`${API_URL}/completion-requirements/course/${courseId}`, requirementData);
    } catch (error) {
      console.error(`Error creating completion requirement for course ${courseId}:`, error);
      throw error;
    }
  }

  // Verify course completion for a student
  async verifyCompletion(studentId, courseId) {
    if (USE_MOCK) {
      await this.mockDelay();
      // Mock implementation - always return incomplete for demo
      return { data: { completed: false, missingRequirements: [1, 2] } };
    }
    
    try {
      return await axios.get(`${API_URL}/completion-requirements/verify/${studentId}/${courseId}`);
    } catch (error) {
      console.error(`Error verifying completion for student ${studentId} in course ${courseId}:`, error);
      await this.mockDelay();
      return { data: { completed: false, missingRequirements: [1, 2] } };
    }
  }
}

export default new CourseService();
