// ContentService.js
// Service to handle API calls for content

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ContentService {
  // Create new content
  createContent(courseId, formData) {
    return axios.post(`${API_URL}/contents?courseId=${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // Get content by ID
  getContentById(id, userId = null) {
    let url = `${API_URL}/contents/${id}`;
    if (userId) {
      url += `?userId=${userId}`;
    }
    return axios.get(url);
  }

  // Get content by course ID
  getContentsByCourseId(courseId) {
    return axios.get(`${API_URL}/contents/course/${courseId}`);
  }

  // Update content
  updateContent(id, title, description) {
    const formData = new FormData();
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    
    return axios.put(`${API_URL}/contents/${id}`, formData);
  }

  // Delete content
  deleteContent(id) {
    return axios.delete(`${API_URL}/contents/${id}`);
  }

  // Get content versions
  getContentVersions(id) {
    return axios.get(`${API_URL}/contents/${id}/versions`);
  }

  // Search contents
  searchContents(keyword, page = 0, size = 10) {
    return axios.get(`${API_URL}/contents/search?keyword=${keyword}&page=${page}&size=${size}`);
  }

  // Filter contents
  filterContents(tags, fileType) {
    let url = `${API_URL}/contents/filter?`;
    if (tags) url += `tags=${tags}`;
    if (fileType) url += `&fileType=${fileType}`;
    return axios.get(url);
  }

  // Upload file
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // Download file
  downloadFile(fileName) {
    return axios.get(`${API_URL}/files/download/${fileName}`, {
      responseType: 'blob'
    });
  }
}

export default new ContentService();