import api from './api';

const AdminAssessmentService = {
  // Quiz Management APIs
  getAllQuizzes: async () => {
    try {
      const response = await api.get('/api/quizzes');
      return response;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },
  
  getQuizzesByCourse: async (courseId) => {
    try {
      const response = await api.get(`/api/quizzes/course/${courseId}`);
      return response;
    } catch (error) {
      console.error('Error fetching quizzes by course:', error);
      throw error;
    }
  },
  
  getQuizById: async (id) => {
    try {
      const response = await api.get(`/api/quizzes/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  },
  
  getDetailedQuiz: async (id) => {
    try {
      const response = await api.get(`/api/quizzes/${id}/detailed`);
      return response;
    } catch (error) {
      console.error('Error fetching detailed quiz:', error);
      throw error;
    }
  },
  
  createQuiz: async (quizData) => {
    try {
      const response = await api.post('/api/quizzes', quizData);
      return response;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },
  
  updateQuiz: async (id, quizData) => {
    try {
      const response = await api.put(`/api/quizzes/${id}`, quizData);
      return response;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },
  
  deleteQuiz: async (id) => {
    try {
      const response = await api.delete(`/api/quizzes/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  },
  
  publishQuiz: async (id) => {
    try {
      const response = await api.patch(`/api/quizzes/${id}/publish`);
      return response;
    } catch (error) {
      console.error('Error publishing quiz:', error);
      throw error;
    }
  },
  
  unpublishQuiz: async (id) => {
    try {
      const response = await api.patch(`/api/quizzes/${id}/unpublish`);
      return response;
    } catch (error) {
      console.error('Error unpublishing quiz:', error);
      throw error;
    }
  },
  
  getQuizAnalytics: async (id) => {
    try {
      const response = await api.get(`/api/quizzes/${id}/analytics`);
      return response;
    } catch (error) {
      console.error('Error fetching quiz analytics:', error);
      throw error;
    }
  },
  
  // Assignment Management APIs
  getAllAssignments: async () => {
    try {
      const response = await api.get('/api/assessments/assignments');
      return response;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },
  
  getAssignmentById: async (id) => {
    try {
      const response = await api.get(`/api/assessments/assignments/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  },
  
  createAssignment: async (assignmentData) => {
    try {
      const response = await api.post('/api/assessments/assignments', assignmentData);
      return response;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },
  
  deleteAssignment: async (id) => {
    try {
      const response = await api.delete(`/api/assessments/assignments/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },
  
  getSubmissionsForAssignment: async (assignmentId) => {
    try {
      const response = await api.get(`/api/assessments/assignments/${assignmentId}/submissions`);
      return response;
    } catch (error) {
      console.error('Error fetching submissions for assignment:', error);
      throw error;
    }
  }
};

export default AdminAssessmentService;