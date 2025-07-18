import api from "./api";

const USE_MOCK = false; // Set to false since backend is ready

// Mock data for fallback/testing
const mockQuizzes = {
  1: {
    id: 1,
    title: "Introduction to Anatomy Quiz",
    description: "Test your knowledge of basic anatomical terms",
    courseId: 1,
    courseName: "Human Anatomy",
    startDate: "2025-05-15T10:00:00Z",
    endDate: "2025-05-18T23:59:59Z",
    timeLimit: 30,
    passingScore: 70,
    questionCount: 10,
    randomizeQuestions: true,
    published: true,
    createdAt: "2025-05-01T14:30:00Z",
    updatedAt: "2025-05-02T09:15:00Z"
  },
  2: {
    id: 2,
    title: "Cell Biology Fundamentals",
    description: "Review of cell structure and function",
    courseId: 1,
    courseName: "Human Anatomy",
    startDate: "2025-05-20T10:00:00Z",
    endDate: "2025-05-22T23:59:59Z",
    timeLimit: 45,
    passingScore: 60,
    questionCount: 15,
    randomizeQuestions: false,
    published: false,
    createdAt: "2025-05-03T11:30:00Z",
    updatedAt: "2025-05-03T11:30:00Z"
  }
};

const mockAssignments = {
  1: {
    id: 1,
    title: "Anatomical Drawing Project",
    description: "Create and label a detailed anatomical drawing",
    courseId: 1,
    courseName: "Human Anatomy",
    dueDate: "2025-05-25T23:59:59Z",
    maxScore: 100,
    isPublished: true,
    createdAt: "2025-05-05T10:00:00Z",
    updatedAt: "2025-05-05T10:00:00Z"
  },
  2: {
    id: 2,
    title: "Case Study Analysis",
    description: "Analyze the provided clinical case and identify relevant anatomical structures",
    courseId: 1,
    courseName: "Human Anatomy",
    dueDate: "2025-06-01T23:59:59Z",
    maxScore: 50,
    isPublished: false,
    createdAt: "2025-05-07T14:20:00Z",
    updatedAt: "2025-05-07T14:20:00Z"
  }
};

class AssessmentService {
  // Helper for mock responses
  async mockDelay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper to adapt assignment data from backend format to frontend format
  adaptAssignment(assignment) {
    return {
      ...assignment,
      // Convert backend 'published' to frontend 'isPublished'
      isPublished: assignment.published,
      // Add any other field adaptations needed
    };
  }

  // Helper to adapt quiz data from backend format to frontend format
  adaptQuiz(quiz) {
    return {
      ...quiz,
      // Add any field adaptations needed for quizzes
    };
  }

  // ----------------
  // QUIZ OPERATIONS
  // ----------------
  
  // Get all quizzes with pagination and filtering
  async getAllQuizzes(page = 0, size = 10, filters = {}) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      let filtered = Object.values(mockQuizzes);
      
      // Apply filters
      if (filters.courseId) {
        filtered = filtered.filter(q => q.courseId == filters.courseId);
      }
      
      if (filters.status) {
        const isPublished = filters.status === "true";
        filtered = filtered.filter(q => q.published === isPublished);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(q => 
          q.title.toLowerCase().includes(searchLower) || 
          q.description?.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort
      const sortField = filters.sortBy || 'createdAt';
      const sortDir = filters.sortDir === 'desc' ? -1 : 1;
      
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortDir;
        if (a[sortField] > b[sortField]) return 1 * sortDir;
        return 0;
      });
      
      // Pagination
      const total = filtered.length;
      const start = page * size;
      const paginatedResults = filtered.slice(start, start + size);
      
      return { 
        data: {
          content: paginatedResults,
          totalElements: total,
          totalPages: Math.ceil(total / size),
          size,
          number: page,
          last: start + size >= total
        }
      };
    }
    
    try {
      let url = `/quizzes?page=${page}&size=${size}`;
      
      // Add query parameters for filtering
      if (filters.courseId) url += `&courseId=${filters.courseId}`;
      if (filters.status !== undefined) url += `&published=${filters.status}`;
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.sortBy) url += `&sort=${filters.sortBy},${filters.sortDir || 'asc'}`;
      
      const response = await api.get(url);
      
      // Return the data unmodified if it already has the correct structure
      return response;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }
  
  // Get quiz by ID
  async getQuizById(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      const quiz = mockQuizzes[id];
      if (!quiz) throw new Error("Quiz not found");
      return { data: quiz };
    }
    
    try {
      return await api.get(`/quizzes/${id}`);
    } catch (error) {
      console.error(`Error fetching quiz ${id}:`, error);
      throw error;
    }
  }

  // Get quiz by ID with questions - updated to work with available endpoints
  async getQuizWithQuestions(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      const quiz = mockQuizzes[id];
      if (!quiz) throw new Error("Quiz not found");
      
      // Add mock questions
      quiz.questions = [
        {
          id: 1,
          text: "What is the largest organ in the human body?",
          questionType: "MULTIPLE_CHOICE",
          options: [
            { id: 1, text: "Liver" },
            { id: 2, text: "Skin" },
            { id: 3, text: "Heart" },
            { id: 4, text: "Brain" }
          ],
          correctOptionId: 2,
          points: 5
        }
      ];
      
      return { data: quiz };
    }
    
    try {
      // Use the regular get endpoint and then fetch questions separately
      const quizResponse = await api.get(`/quizzes/${id}`);
      const questionsResponse = await api.get(`/quizzes/${id}/questions`);
      
      // Combine the data
      return { 
        data: {
          ...quizResponse.data,
          questions: questionsResponse.data
        }
      };
    } catch (error) {
      console.error(`Error fetching quiz ${id} with questions:`, error);
      throw error;
    }
  }
  
  // Create quiz
  async createQuiz(quizData) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      const newId = Object.keys(mockQuizzes).length + 1;
      const newQuiz = {
        id: newId,
        ...quizData,
        questionCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockQuizzes[newId] = newQuiz;
      return { data: newQuiz };
    }
    
    try {
      return await api.post(`/quizzes`, quizData);
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }
  
  // Update quiz
  async updateQuiz(id, quizData) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      if (!mockQuizzes[id]) throw new Error("Quiz not found");
      
      mockQuizzes[id] = {
        ...mockQuizzes[id],
        ...quizData,
        updatedAt: new Date().toISOString()
      };
      
      return { data: mockQuizzes[id] };
    }
    
    try {
      return await api.put(`/quizzes/${id}`, quizData);
    } catch (error) {
      console.error(`Error updating quiz ${id}:`, error);
      throw error;
    }
  }
  
  // Delete quiz
  async deleteQuiz(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      if (!mockQuizzes[id]) throw new Error("Quiz not found");
      
      const deleted = mockQuizzes[id];
      delete mockQuizzes[id];
      
      return { data: deleted };
    }
    
    try {
      return await api.delete(`/quizzes/${id}`);
    } catch (error) {
      console.error(`Error deleting quiz ${id}:`, error);
      throw error;
    }
  }
  
  // Toggle quiz publish status - using separate endpoints
  async toggleQuizStatus(id, isPublished) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      if (!mockQuizzes[id]) throw new Error("Quiz not found");
      
      mockQuizzes[id].published = isPublished;
      mockQuizzes[id].updatedAt = new Date().toISOString();
      
      return { data: mockQuizzes[id] };
    }
    
    try {
      const endpoint = isPublished ? 
        `/quizzes/${id}/publish` : 
        `/quizzes/${id}/unpublish`;
        
      return await api.patch(endpoint);
    } catch (error) {
      console.error(`Error toggling status for quiz ${id}:`, error);
      throw error;
    }
  }
  
  // Get quiz analytics
  async getQuizAnalytics(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      return { 
        data: {
          totalAttempts: 25,
          averageScore: 78.4,
          completionRate: 92,
          questionStats: [
            {
              questionId: 1,
              correctResponseRate: 85,
              averageTimeSpent: 22 // seconds
            }
          ],
          scoreDistribution: [
            { range: "0-20%", count: 0 },
            { range: "21-40%", count: 2 },
            { range: "41-60%", count: 5 },
            { range: "61-80%", count: 10 },
            { range: "81-100%", count: 8 }
          ]
        } 
      };
    }
    
    try {
      return await api.get(`/quizzes/${id}/analytics`);
    } catch (error) {
      console.error(`Error fetching analytics for quiz ${id}:`, error);
      throw error;
    }
  }

  // ----------------
  // ASSIGNMENT OPERATIONS
  // ----------------
  
  // Get all assignments with pagination and filtering
  async getAllAssignments(page = 0, size = 10, filters = {}) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      let filtered = Object.values(mockAssignments);
      
      // Apply filters
      if (filters.courseId) {
        filtered = filtered.filter(a => a.courseId == filters.courseId);
      }
      
      if (filters.status) {
        const isPublished = filters.status === "true";
        filtered = filtered.filter(a => a.isPublished === isPublished);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(searchLower) || 
          a.description?.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort
      const sortField = filters.sortBy || 'createdAt';
      const sortDir = filters.sortDir === 'desc' ? -1 : 1;
      
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortDir;
        if (a[sortField] > b[sortField]) return 1 * sortDir;
        return 0;
      });
      
      // Pagination
      const total = filtered.length;
      const start = page * size;
      const paginatedResults = filtered.slice(start, start + size);
      
      return { 
        data: {
          content: paginatedResults,
          totalElements: total,
          totalPages: Math.ceil(total / size),
          size,
          number: page,
          last: start + size >= total
        }
      };
    }
    
    try {
      let url = `/assignments?page=${page}&size=${size}`;
      
      // Add query parameters for filtering
      if (filters.courseId) url += `&courseId=${filters.courseId}`;
      if (filters.status !== undefined) url += `&published=${filters.status}`;
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.sortBy) url += `&sort=${filters.sortBy},${filters.sortDir || 'asc'}`;
      
      const response = await api.get(url);
      
      // Adapt assignment data if needed
      if (response.data && response.data.content) {
        response.data.content = response.data.content.map(this.adaptAssignment);
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  }
  
  // Get assignment by ID
  async getAssignmentById(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      const assignment = mockAssignments[id];
      if (!assignment) throw new Error("Assignment not found");
      return { data: assignment };
    }
    
    try {
      const response = await api.get(`/assignments/${id}`);
      response.data = this.adaptAssignment(response.data);
      return response;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error);
      throw error;
    }
  }
  
  // Create assignment
  async createAssignment(assignmentData) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      const newId = Object.keys(mockAssignments).length + 1;
      const newAssignment = {
        id: newId,
        ...assignmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockAssignments[newId] = newAssignment;
      return { data: newAssignment };
    }
    
    try {
      // Convert isPublished to published if present
      if (assignmentData.isPublished !== undefined) {
        assignmentData = {
          ...assignmentData,
          published: assignmentData.isPublished
        };
        delete assignmentData.isPublished;
      }
      
      const response = await api.post(`/assignments`, assignmentData);
      response.data = this.adaptAssignment(response.data);
      return response;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  }
  
  // Update assignment
  async updateAssignment(id, assignmentData) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      if (!mockAssignments[id]) throw new Error("Assignment not found");
      
      mockAssignments[id] = {
        ...mockAssignments[id],
        ...assignmentData,
        updatedAt: new Date().toISOString()
      };
      
      return { data: mockAssignments[id] };
    }
    
    try {
      // Convert isPublished to published if present
      if (assignmentData.isPublished !== undefined) {
        assignmentData = {
          ...assignmentData,
          published: assignmentData.isPublished
        };
        delete assignmentData.isPublished;
      }
      
      const response = await api.put(`/assignments/${id}`, assignmentData);
      response.data = this.adaptAssignment(response.data);
      return response;
    } catch (error) {
      console.error(`Error updating assignment ${id}:`, error);
      throw error;
    }
  }
  
  // Delete assignment
  async deleteAssignment(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      if (!mockAssignments[id]) throw new Error("Assignment not found");
      
      const deleted = mockAssignments[id];
      delete mockAssignments[id];
      
      return { data: deleted };
    }
    
    try {
      return await api.delete(`/assignments/${id}`);
    } catch (error) {
      console.error(`Error deleting assignment ${id}:`, error);
      throw error;
    }
  }
  
  // Toggle assignment publish status - using separate endpoints
  async toggleAssignmentStatus(id, isPublished) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      if (!mockAssignments[id]) throw new Error("Assignment not found");
      
      mockAssignments[id].isPublished = isPublished;
      mockAssignments[id].updatedAt = new Date().toISOString();
      
      return { data: mockAssignments[id] };
    }
    
    try {
      const endpoint = isPublished ? 
        `/assignments/${id}/publish` : 
        `/assignments/${id}/unpublish`;
      
      const response = await api.patch(endpoint);
      response.data = this.adaptAssignment(response.data);
      return response;
    } catch (error) {
      console.error(`Error toggling status for assignment ${id}:`, error);
      throw error;
    }
  }
  
  // Get assignment submissions
  async getAssignmentSubmissions(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      // Mock submissions
      return { 
        data: [
          {
            id: 1,
            assignmentId: id,
            userId: 101,
            userName: "John Doe",
            submissionText: "This is my submission",
            attachments: ["file1.pdf"],
            submittedAt: "2025-05-10T15:30:00Z",
            grade: 85,
            feedback: "Good work!"
          },
          {
            id: 2,
            assignmentId: id,
            userId: 102,
            userName: "Jane Smith",
            submissionText: "Here's my completed assignment",
            attachments: ["file2.pdf", "image.jpg"],
            submittedAt: "2025-05-11T09:45:00Z",
            grade: null,
            feedback: null
          }
        ]
      };
    }
    
    try {
      return await api.get(`/assignments/${id}/submissions`);
    } catch (error) {
      console.error(`Error fetching submissions for assignment ${id}:`, error);
      throw error;
    }
  }

  // ----------------
  // STUDENT OPERATIONS
  // ----------------

  // Get accessible quizzes for student - adapted for available endpoints
  async getStudentQuizzes(courseId, userId) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      // Filter quizzes that are published and belong to the course
      const studentQuizzes = Object.values(mockQuizzes).filter(
        q => q.courseId == courseId && q.published
      );
      
      return { data: studentQuizzes };
    }
    
    try {
      // Use regular quizzes endpoint with filters
      const response = await api.get(`/quizzes?courseId=${courseId}&published=true`);
      
      // Client-side processing to add student-specific fields
      const studentAttempts = await api.get(`/quiz-attempts?studentId=${userId}`);
      const attemptMap = {};
      
      studentAttempts.data.forEach(attempt => {
        attemptMap[attempt.quizId] = attempt;
      });
      
      // Enrich data with student's attempt information
      const quizzes = response.data.content.map(quiz => {
        const attempt = attemptMap[quiz.id];
        return {
          ...quiz,
          submitted: !!attempt,
          attemptDate: attempt?.endTime || null,
          score: attempt?.score || null,
          passed: attempt ? attempt.score >= quiz.passingScore : false
        };
      });
      
      return { 
        data: quizzes,
        pagination: {
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          size: response.data.size,
          number: response.data.number
        }
      };
    } catch (error) {
      console.error(`Error fetching quizzes for student:`, error);
      throw error;
    }
  }

  // Get accessible assignments for student - similar adaptation
  async getStudentAssignments(courseId, userId) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      // Filter assignments that are published and belong to the course
      const studentAssignments = Object.values(mockAssignments).filter(
        a => a.courseId == courseId && a.isPublished
      );
      
      return { data: studentAssignments };
    }
    
    try {
      // Use regular assignments endpoint with filters
      const response = await api.get(`/assignments?courseId=${courseId}&published=true`);
      
      // Client-side processing to add student-specific fields
      const studentSubmissions = await api.get(`/assignment-submissions?studentId=${userId}`);
      const submissionMap = {};
      
      studentSubmissions.data.forEach(submission => {
        submissionMap[submission.assignmentId] = submission;
      });
      
      // Enrich data with student's submission information
      const assignments = response.data.content.map(assignment => {
        const submission = submissionMap[assignment.id];
        const adapted = this.adaptAssignment(assignment);
        
        return {
          ...adapted,
          submitted: !!submission,
          submissionDate: submission?.submittedAt || null,
          grade: submission?.grade || null,
          feedback: submission?.feedback || null
        };
      });
      
      return { 
        data: assignments,
        pagination: {
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          size: response.data.size,
          number: response.data.number
        }
      };
    } catch (error) {
      console.error(`Error fetching assignments for student:`, error);
      throw error;
    }
  }

  // Submit quiz attempt
  async submitQuizAttempt(quizId, userId, answers) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      // Mock quiz submission
      return {
        data: {
          id: Math.floor(Math.random() * 1000),
          quizId,
          userId,
          startTime: new Date(Date.now() - 15 * 60000).toISOString(),
          endTime: new Date().toISOString(),
          score: 80,
          passingScore: 70,
          passed: true,
          answers: answers
        }
      };
    }
    
    try {
      return await api.post(`/quizzes/${quizId}/submit`, {
        userId,
        answers
      });
    } catch (error) {
      console.error(`Error submitting attempt for quiz ${quizId}:`, error);
      throw error;
    }
  }

  // Submit assignment
  async submitAssignment(assignmentId, userId, submissionData) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      // Mock assignment submission
      return {
        data: {
          id: Math.floor(Math.random() * 1000),
          assignmentId,
          userId,
          submissionText: submissionData.text,
          attachments: submissionData.attachments || [],
          submittedAt: new Date().toISOString()
        }
      };
    }
    
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('text', submissionData.text);
      
      if (submissionData.files && submissionData.files.length > 0) {
        submissionData.files.forEach(file => {
          formData.append('files', file);
        });
      }
      
      return await api.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error(`Error submitting assignment ${assignmentId}:`, error);
      throw error;
    }
  }
}

export default new AssessmentService();