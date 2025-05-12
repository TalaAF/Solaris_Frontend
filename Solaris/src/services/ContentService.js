// ContentService.js
// Service to handle API calls for content with appropriate backend integration

import api from "./api";
import ContentTypeAdapter from "./ContentTypeAdapter";

class ContentService {
  // Create new content
  async createContent(courseId, contentData) {
    try {
      // Check if contentData is already a FormData object
      let formData;
      if (contentData instanceof FormData) {
        formData = contentData;
        
        // Ensure courseId is in the FormData
        if (!formData.has('courseId')) {
          formData.append('courseId', courseId);
        }
      } else {
        // Create FormData from contentData object
        formData = new FormData();
        
        // Add courseId
        formData.append('courseId', courseId);
        
        // Add content type if specified
        if (contentData.type) {
          const backendType = ContentTypeAdapter.mapToBackendType(contentData.type);
          formData.append('type', backendType);
        }
        
        // Add basic content fields
        if (contentData.title) formData.append('title', contentData.title);
        if (contentData.description) formData.append('description', contentData.description || '');
        if (contentData.moduleId) formData.append('moduleId', contentData.moduleId);
        if (contentData.order !== undefined) formData.append('order', contentData.order);
        
        // Handle different content types
        if (contentData.type === 'document') {
          // For document type, handle file or content
          if (contentData.file) {
            formData.append('file', contentData.file);
          } else if (contentData.content) {
            // If no file, create a text file from the content
            const textBlob = new Blob([contentData.content], { type: 'text/plain' });
            formData.append('file', textBlob, 'content.txt');
          }
        } else if (contentData.type === 'video') {
          // For video type, include videoUrl
          if (contentData.videoUrl) formData.append('videoUrl', contentData.videoUrl);
          if (contentData.duration) formData.append('duration', contentData.duration);
        } else if (contentData.type === 'quiz') {
          // For quiz type, handle quiz content
          if (contentData.content) {
            try {
              // Check if content is a JSON string or object
              const quizData = typeof contentData.content === 'string' ? 
                JSON.parse(contentData.content) : contentData.content;
              
              // Create a structured quiz object
              const quiz = {
                title: contentData.title,
                description: contentData.description || '',
                courseId: courseId,
                timeLimit: quizData.timeLimit || 0,
                passingScore: quizData.passingScore || 70,
                questions: quizData.questions || []
              };
              
              // Send quiz data as JSON
              return this.createQuiz(quiz);
            } catch (err) {
              console.error("Error parsing quiz content:", err);
              throw new Error("Invalid quiz content format");
            }
          }
        }
      }
      
      // Send the content creation request
      return await api.post(`/api/contents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    } catch (error) {
      console.error(`Error creating content for course ${courseId}:`, error);
      throw error;
    }
  }

  // Replace your existing createContent method with this implementation
  async createContent(moduleId, contentData) {
    try {
      console.log(`Creating content for module ${moduleId} with data:`, contentData);
      const response = await api.post(`/api/contents/modules/${moduleId}/json`, contentData);
      return response.data;
    } catch (error) {
      console.error(`Error creating content for module ${moduleId}:`, error);
      throw error;
    }
  }

  // Get content by ID
  async getContentById(id) {
    try {
      console.log(`Fetching content ${id}`);
      
      // Add validation to prevent bad requests
      if (!id || isNaN(parseInt(id))) {
        console.error(`Invalid content ID: ${id}`);
        throw new Error("Invalid content ID");
      }
      
      const response = await api.get(`/api/contents/${id}`);
      
      // Check if the response contains valid data
      if (!response || !response.data) {
        throw new Error("No content data returned from API");
      }
      
      return response;
    } catch (error) {
      console.error(`Error fetching content ${id}:`, error);
      // Return a minimal valid response to prevent UI crashes
      return { 
        data: { 
          id: id,
          title: "Content Unavailable",
          description: "Could not load content details",
          type: "document",
          content: "Content could not be loaded due to an error."
        } 
      };
    }
  }

  // Get content by course ID
  async getContentsByCourseId(courseId) {
    try {
      return await api.get(`/api/contents/course/${courseId}`);
    } catch (error) {
      console.error(`Error fetching contents for course ${courseId}:`, error);
      throw error;
    }
  }

  // Update content
  async updateContent(id, updates) {
    try {
      // If updates is a FormData object, use it directly
      if (updates instanceof FormData) {
        return await api.put(`/api/contents/${id}`, updates, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }
      
      // Otherwise, send as JSON
      return await api.put(`/api/contents/${id}`, updates);
    } catch (error) {
      console.error(`Error updating content ${id}:`, error);
      throw error;
    }
  }

  // Delete content
  async deleteContent(id) {
    try {
      return await api.delete(`/api/contents/${id}`);
    } catch (error) {
      console.error(`Error deleting content ${id}:`, error);
      throw error;
    }
  }

  // Get content versions
  async getContentVersions(id) {
    try {
      return await api.get(`/api/contents/${id}/versions`);
    } catch (error) {
      console.error(`Error fetching versions for content ${id}:`, error);
      throw error;
    }
  }

  // Search contents
  async searchContents(keyword, page = 0, size = 10) {
    try {
      return await api.get(`/api/contents/search?keyword=${keyword}&page=${page}&size=${size}`);
    } catch (error) {
      console.error(`Error searching contents with keyword "${keyword}":`, error);
      throw error;
    }
  }

  // Filter contents
  async filterContents(tags, fileType) {
    try {
      let url = `/api/contents/filter?`;
      if (tags) url += `tags=${tags}`;
      if (fileType) url += `&fileType=${fileType}`;
      return await api.get(url);
    } catch (error) {
      console.error(`Error filtering contents:`, error);
      throw error;
    }
  }

  // Upload file
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      return await api.post(`/api/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    } catch (error) {
      console.error(`Error uploading file:`, error);
      throw error;
    }
  }

  // Download file
  async downloadFile(fileName) {
    try {
      return await api.get(`/api/files/download/${fileName}`, {
        responseType: "blob"
      });
    } catch (error) {
      console.error(`Error downloading file ${fileName}:`, error);
      throw error;
    }
  }
  
  // Get content by module
  async getContentsByModule(moduleId) {
    try {
      return await api.get(`/api/contents/module/${moduleId}`);
    } catch (error) {
      console.error(`Error fetching contents for module ${moduleId}:`, error);
      throw error;
    }
  }

  // Mark content as viewed/completed
  async markAsViewed(contentId, userId) {
    try {
      return await api.post(`/api/contents/${contentId}/mark-viewed`, { userId });
    } catch (error) {
      console.error(`Error marking content ${contentId} as viewed:`, error);
      throw error;
    }
  }

  // Mark content as viewed (alternative method)
  async markContentAsViewed(contentId, userId) {
    try {
      if (!userId) {
        console.warn('No user ID provided, cannot mark content as viewed');
        return null;
      }

      console.log(`Marking content ${contentId} as viewed by user ${userId}`);
      
      // Use the new endpoint format
      const response = await api.post(`/api/contents/${contentId}/mark-viewed`, { 
        userId: userId 
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error marking content ${contentId} as viewed:`, error);
      // Non-critical feature, don't throw error
      return null;
    }
  }

  // Get all contents with pagination (admin view)
  async getAllContents(page = 0, size = 10, filters = {}) {
    try {
      let url = `/api/contents?page=${page}&size=${size}`;
      
      // Add query parameters for filtering
      if (filters.courseId) url += `&courseId=${filters.courseId}`;
      if (filters.type) url += `&type=${filters.type}`;
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.sortBy) url += `&sort=${filters.sortBy},${filters.sortDir || 'asc'}`;
      
      return await api.get(url);
    } catch (error) {
      console.error('Error fetching all contents:', error);
      throw error;
    }
  }
  
  // Toggle content publish status (admin only)
  async toggleContentStatus(id, isPublished) {
    try {
      return await api.patch(`/api/contents/${id}/publish`, { isPublished });
    } catch (error) {
      console.error(`Error toggling status for content ${id}:`, error);
      throw error;
    }
  }
  
  // Bulk operations (admin only)
  async bulkDeleteContents(contentIds) {
    try {
      return await api.post(`/api/contents/bulk-delete`, { contentIds });
    } catch (error) {
      console.error('Error bulk deleting contents:', error);
      throw error;
    }
  }
  
  // Move content between modules (admin/instructor)
  async moveContent(contentId, targetModuleId, newOrder) {
    try {
      return await api.put(`/api/contents/${contentId}/move`, {
        moduleId: targetModuleId,
        order: newOrder
      });
    } catch (error) {
      console.error(`Error moving content ${contentId}:`, error);
      throw error;
    }
  }

  // Download content file directly
  async downloadContent(contentId) {
    try {
      return await api.get(`/api/contents/${contentId}/download`, {
        responseType: "blob"
      });
    } catch (error) {
      console.error(`Error downloading content ${contentId}:`, error);
      throw error;
    }
  }

  // Restore deleted content
  async restoreContent(contentId) {
    try {
      return await api.post(`/api/contents/${contentId}/restore`);
    } catch (error) {
      console.error(`Error restoring content ${contentId}:`, error);
      throw error;
    }
  }

  // Get deleted contents
  async getDeletedContents(page = 0, size = 10) {
    try {
      return await api.get(`/api/contents/deleted?page=${page}&size=${size}`);
    } catch (error) {
      console.error('Error fetching deleted contents:', error);
      throw error;
    }
  }

  // Helper methods for assignments (since they're a content type but have a separate API)
  async getAssignmentsByCourse(courseId) {
    try {
      return await api.get(`/api/assignments/course/${courseId}`);
    } catch (error) {
      console.error(`Error fetching assignments for course ${courseId}:`, error);
      throw error;
    }
  }

  async getAssignmentById(id) {
    try {
      return await api.get(`/api/assignments/${id}`);
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error);
      throw error;
    }
  }

  async createAssignment(assignmentData) {
    try {
      return await api.post(`/api/assignments`, assignmentData);
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  }

  async updateAssignment(id, assignmentData) {
    try {
      return await api.put(`/api/assignments/${id}`, assignmentData);
    } catch (error) {
      console.error(`Error updating assignment ${id}:`, error);
      throw error;
    }
  }

  async deleteAssignment(id) {
    try {
      return await api.delete(`/api/assignments/${id}`);
    } catch (error) {
      console.error(`Error deleting assignment ${id}:`, error);
      throw error;
    }
  }

  async publishAssignment(id) {
    try {
      return await api.patch(`/api/assignments/${id}/publish`);
    } catch (error) {
      console.error(`Error publishing assignment ${id}:`, error);
      throw error;
    }
  }

  async unpublishAssignment(id) {
    try {
      return await api.patch(`/api/assignments/${id}/unpublish`);
    } catch (error) {
      console.error(`Error unpublishing assignment ${id}:`, error);
      throw error;
    }
  }

  // Helper methods for quizzes (since they're a content type but have a separate API)
  async createQuiz(quizData) {
    try {
      return await api.post(`/api/quizzes`, quizData);
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }

  async getQuizzesByCourse(courseId) {
    try {
      return await api.get(`/api/quizzes/course/${courseId}`);
    } catch (error) {
      console.error(`Error fetching quizzes for course ${courseId}:`, error);
      throw error;
    }
  }

  async getAvailableQuizzesByCourse(courseId) {
    try {
      return await api.get(`/api/quizzes/course/${courseId}/available`);
    } catch (error) {
      console.error(`Error fetching available quizzes for course ${courseId}:`, error);
      throw error;
    }
  }

  async getQuizById(id) {
    try {
      return await api.get(`/api/quizzes/${id}`);
    } catch (error) {
      console.error(`Error fetching quiz ${id}:`, error);
      throw error;
    }
  }

  async getQuizWithQuestions(id) {
    try {
      return await api.get(`/api/quizzes/${id}/detailed`);
    } catch (error) {
      console.error(`Error fetching quiz with questions ${id}:`, error);
      throw error;
    }
  }

  async getQuizForStudent(quizId, studentId) {
    try {
      return await api.get(`/api/quizzes/${quizId}/student/${studentId}`);
    } catch (error) {
      console.error(`Error fetching quiz ${quizId} for student ${studentId}:`, error);
      throw error;
    }
  }

  async updateQuiz(id, quizData) {
    try {
      return await api.put(`/api/quizzes/${id}`, quizData);
    } catch (error) {
      console.error(`Error updating quiz ${id}:`, error);
      throw error;
    }
  }

  async deleteQuiz(id) {
    try {
      return await api.delete(`/api/quizzes/${id}`);
    } catch (error) {
      console.error(`Error deleting quiz ${id}:`, error);
      throw error;
    }
  }

  async publishQuiz(id) {
    try {
      return await api.patch(`/api/quizzes/${id}/publish`);
    } catch (error) {
      console.error(`Error publishing quiz ${id}:`, error);
      throw error;
    }
  }

  async unpublishQuiz(id) {
    try {
      return await api.patch(`/api/quizzes/${id}/unpublish`);
    } catch (error) {
      console.error(`Error unpublishing quiz ${id}:`, error);
      throw error;
    }
  }

  async getQuizAnalytics(id) {
    try {
      return await api.get(`/api/quizzes/${id}/analytics`);
    } catch (error) {
      console.error(`Error fetching quiz analytics ${id}:`, error);
      throw error;
    }
  }
}

export default new ContentService();