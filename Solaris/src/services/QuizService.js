/**
 * QuizService.js
 * 
 * A comprehensive service for interacting with the Quiz API in a learning management system.
 * This service provides methods for managing quizzes, questions, and quiz attempts.
 */

import api from './api'; // Import the axios instance

class QuizService {
  /**
   * Create a new quiz
   * @param {Object} quizData - Quiz data including title, description, timeLimit, etc.
   * @returns {Promise<Object>} Created quiz
   */
  async createQuiz(quizData) {
    const response = await api.post('/api/quizzes', quizData);
    return response.data;
  }

  /**
   * Get a quiz by ID
   * @param {number} quizId - Quiz ID
   * @returns {Promise<Object>} Quiz details
   */
  async getQuizById(quizId) {
    const response = await api.get(`/api/quizzes/${quizId}`);
    return response.data;
  }

  /**
   * Get a quiz with detailed information including all questions
   * @param {number} quizId - Quiz ID
   * @returns {Promise<Object>} Detailed quiz with questions
   */
  async getQuizWithQuestions(quizId) {
    const response = await api.get(`/api/quizzes/${quizId}/detailed`);
    return response.data;
  }

  /**
   * Get all quizzes for a course
   * @param {number} courseId - Course ID
   * @returns {Promise<Array>} List of quizzes for the course
   */
  async getQuizzesByCourse(courseId) {
    console.log(`Getting quizzes for course ${courseId} from API`);
    try {
      const response = await api.get(`/api/quizzes/course/${courseId}`);
      console.log('Quiz response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getQuizzesByCourse:', error);
      throw error;
    }
  }

  /**
   * Get all published quizzes for a course
   * @param {number} courseId - Course ID
   * @returns {Promise<Array>} List of published quizzes
   */
  async getPublishedQuizzesByCourse(courseId) {
    const response = await api.get(`/api/quizzes/course/${courseId}/published`);
    return response.data;
  }

  /**
   * Get all currently available quizzes for a course (student view)
   * @param {number} courseId - Course ID
   * @returns {Promise<Array>} List of available quizzes
   */
  async getAvailableQuizzesByCourse(courseId) {
    const response = await api.get(`/api/quizzes/course/${courseId}/available`);
    return response.data;
  }

  /**
   * Get a student view of a quiz
   * @param {number} quizId - Quiz ID
   * @param {number} studentId - Student ID
   * @returns {Promise<Object>} Student view of the quiz
   */
  async getQuizForStudent(quizId, studentId) {
    const response = await api.get(`/api/quizzes/${quizId}/student/${studentId}`);
    return response.data;
  }

  /**
   * Update an existing quiz
   * @param {number} quizId - Quiz ID
   * @param {Object} quizData - Updated quiz data
   * @returns {Promise<Object>} Updated quiz
   */
  async updateQuiz(quizId, quizData) {
    const response = await api.put(`/api/quizzes/${quizId}`, quizData);
    return response.data;
  }

  /**
   * Delete a quiz
   * @param {number} quizId - Quiz ID
   * @returns {Promise<void>}
   */
  async deleteQuiz(quizId) {
    await api.delete(`/api/quizzes/${quizId}`);
    return;
  }

  /**
   * Publish a quiz (make it available to students)
   * @param {number} quizId - Quiz ID
   * @returns {Promise<Object>} Published quiz
   */
  async publishQuiz(quizId) {
    const response = await api.patch(`/api/quizzes/${quizId}/publish`);
    return response.data;
  }

  /**
   * Unpublish a quiz (hide it from students)
   * @param {number} quizId - Quiz ID
   * @returns {Promise<Object>} Unpublished quiz
   */
  async unpublishQuiz(quizId) {
    const response = await api.patch(`/api/quizzes/${quizId}/unpublish`);
    return response.data;
  }

  /**
   * Get analytics for a quiz
   * @param {number} quizId - Quiz ID
   * @returns {Promise<Object>} Quiz analytics
   */
  async getQuizAnalytics(quizId) {
    const response = await api.get(`/api/quizzes/${quizId}/analytics`);
    return response.data;
  }

  /**
   * Get difficulty level of a quiz
   * @param {number} quizId - Quiz ID
   * @returns {Promise<number>} Difficulty level (0-100)
   */
  async getQuizDifficulty(quizId) {
    const response = await api.get(`/api/quizzes/${quizId}/difficulty`);
    return response.data;
  }

  /**
   * Get pass rate for a quiz
   * @param {number} quizId - Quiz ID
   * @returns {Promise<number>} Pass rate (0-100%)
   */
  async getQuizPassRate(quizId) {
    const response = await api.get(`/api/quizzes/${quizId}/pass-rate`);
    return response.data;
  }

  // --------------------------------------------------------------------------
  // Question Methods
  // --------------------------------------------------------------------------

  /**
   * Create a new question for a quiz
   * @param {Object} questionData - Question data
   * @returns {Promise<Object>} Created question
   */
  async createQuestion(questionData) {
    const response = await api.post('/api/questions', questionData);
    return response.data;
  }

  /**
   * Get a question by ID
   * @param {number} questionId - Question ID
   * @returns {Promise<Object>} Question details
   */
  async getQuestionById(questionId) {
    const response = await api.get(`/api/questions/${questionId}`);
    return response.data;
  }

  /**
   * Get all questions for a quiz
   * @param {number} quizId - Quiz ID
   * @returns {Promise<Array>} List of questions
   */
  async getQuestionsByQuizId(quizId) {
    const response = await api.get(`/api/questions/quiz/${quizId}`);
    return response.data;
  }

  /**
   * Get student view of all questions for a quiz (without revealing correct answers)
   * @param {number} quizId - Quiz ID
   * @returns {Promise<Array>} List of questions for students
   */
  async getQuestionsForStudent(quizId) {
    const response = await api.get(`/api/questions/quiz/${quizId}/student`);
    return response.data;
  }

  /**
   * Update an existing question
   * @param {number} questionId - Question ID
   * @param {Object} questionData - Updated question data
   * @returns {Promise<Object>} Updated question
   */
  async updateQuestion(questionId, questionData) {
    const response = await api.put(`/api/questions/${questionId}`, questionData);
    return response.data;
  }

  /**
   * Delete a question
   * @param {number} questionId - Question ID
   * @returns {Promise<void>}
   */
  async deleteQuestion(questionId) {
    await api.delete(`/api/questions/${questionId}`);
    return;
  }

  /**
   * Reorder questions in a quiz
   * @param {number} quizId - Quiz ID
   * @param {Array<number>} questionIds - Ordered list of question IDs
   * @returns {Promise<Array>} Updated list of questions in new order
   */
  async reorderQuestions(quizId, questionIds) {
    const response = await api.put(`/api/questions/quiz/${quizId}/reorder`, questionIds);
    return response.data;
  }

  /**
   * Get difficulty level of a question
   * @param {number} questionId - Question ID
   * @returns {Promise<number>} Difficulty level (0-100)
   */
  async getQuestionDifficulty(questionId) {
    const response = await api.get(`/api/questions/${questionId}/difficulty`);
    return response.data;
  }

  // --------------------------------------------------------------------------
  // Quiz Attempt Methods
  // --------------------------------------------------------------------------

  /**
   * Start a new quiz attempt
   * @param {Object} startRequest - Request with quiz and student IDs
   * @returns {Promise<Object>} Created quiz attempt with questions
   */
  async startQuizAttempt(startRequest) {
    const response = await api.post('/api/quiz-attempts/start', startRequest);
    return response.data;
  }

  /**
   * Get an in-progress quiz attempt
   * @param {number} attemptId - Attempt ID
   * @returns {Promise<Object>} Quiz attempt with questions
   */
  async getInProgressAttempt(attemptId) {
    const response = await api.get(`/api/quiz-attempts/${attemptId}/in-progress`);
    return response.data;
  }

  /**
   * Submit an answer to a question in a quiz attempt
   * @param {Object} answerRequest - Answer data
   * @returns {Promise<Object>} Updated answer
   */
  async submitAnswer(answerRequest) {
    const response = await api.post('/api/quiz-attempts/submit-answer', answerRequest);
    return response.data;
  }

  /**
   * Submit a quiz attempt for grading
   * @param {Object} submitRequest - Request with attempt ID
   * @returns {Promise<Object>} Completed quiz attempt
   */
  async submitQuizAttempt(submitRequest) {
    const response = await api.post('/api/quiz-attempts/submit', submitRequest);
    return response.data;
  }

  /**
   * Get a quiz attempt by ID
   * @param {number} attemptId - Attempt ID
   * @returns {Promise<Object>} Quiz attempt
   */
  async getQuizAttempt(attemptId) {
    const response = await api.get(`/api/quiz-attempts/${attemptId}`);
    return response.data;
  }

  /**
   * Get a detailed quiz attempt with all answers
   * @param {number} attemptId - Attempt ID
   * @returns {Promise<Object>} Detailed quiz attempt
   */
  async getDetailedQuizAttempt(attemptId) {
    const response = await api.get(`/api/quiz-attempts/${attemptId}/detailed`);
    return response.data;
  }

  /**
   * Get all attempts for a quiz
   * @param {number} quizId - Quiz ID
   * @returns {Promise<Array>} List of quiz attempts
   */
  async getAttemptsByQuiz(quizId) {
    const response = await api.get(`/api/quiz-attempts/quiz/${quizId}`);
    return response.data;
  }

  /**
   * Get all attempts by a student
   * @param {number} studentId - Student ID
   * @returns {Promise<Array>} List of quiz attempts
   */
  async getAttemptsByStudent(studentId) {
    const response = await api.get(`/api/quiz-attempts/student/${studentId}`);
    return response.data;
  }

  /**
   * Get all attempts for a quiz by a student
   * @param {number} quizId - Quiz ID
   * @param {number} studentId - Student ID
   * @returns {Promise<Array>} List of quiz attempts
   */
  async getAttemptsByQuizAndStudent(quizId, studentId) {
    const response = await api.get(`/api/quiz-attempts/quiz/${quizId}/student/${studentId}`);
    return response.data;
  }

  /**
   * Grade a manually graded answer
   * @param {Object} gradeRequest - Grade data
   * @returns {Promise<Object>} Updated answer
   */
  async gradeAnswer(gradeRequest) {
    const response = await api.post('/api/quiz-attempts/grade-answer', gradeRequest);
    return response.data;
  }
}

export default new QuizService();