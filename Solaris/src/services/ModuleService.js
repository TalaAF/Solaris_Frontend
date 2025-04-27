// ModuleService.js
// Service to handle API calls to the module backend

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ModuleService {
  // Get all modules
  getAllModules() {
    return axios.get(`${API_URL}/modules`);
  }

  // Create a new module
  createModule(moduleData) {
    return axios.post(`${API_URL}/modules`, moduleData);
  }

  // Reorder modules
  reorderModules(moduleIds) {
    return axios.post(`${API_URL}/modules/reorder`, moduleIds);
  }

  // Assign content to module
  assignContentToModule(contentId, moduleId) {
    return axios.post(`${API_URL}/modules/${contentId}/assign-to-module/${moduleId}`);
  }

  // Reorder contents within a module
  reorderContents(moduleId, contentIds) {
    return axios.post(`${API_URL}/modules/${moduleId}/reorder-contents`, contentIds);
  }

  // Add tag to content
  addTagToContent(contentId, tagData) {
    return axios.post(`${API_URL}/modules/${contentId}/add-tag`, tagData);
  }

  // Validate content sequence
  validateSequence(moduleId, contentIds) {
    return axios.post(`${API_URL}/modules/${moduleId}/validate-sequence`, contentIds);
  }

  // Get contents order
  getContentsOrder(moduleId) {
    return axios.get(`${API_URL}/modules/${moduleId}/contents-order`);
  }
}

export default new ModuleService();