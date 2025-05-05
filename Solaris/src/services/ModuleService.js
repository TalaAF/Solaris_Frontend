// ModuleService.js
// Service to handle API calls to the module backend with mock data support

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const USE_MOCK = false; // Toggle this when your backend is ready

// Mock data for development
const mockModules = [
  {
    id: 1,
    courseId: 1,
    title: "Introduction to Anatomy",
    description: "Basic concepts and terminology in anatomy",
    sequence: 1,
    status: "completed"
  },
  {
    id: 2,
    courseId: 1,
    title: "Cell Structure and Function",
    description: "Understanding the fundamental unit of life",
    sequence: 2,
    status: "in-progress"
  },
  {
    id: 3,
    courseId: 1,
    title: "Tissues and Organs",
    description: "How cells organize into functional units",
    sequence: 3,
    status: "not-started"
  }
];

const mockContentOrders = [
  { id: 1, moduleId: 1, contentId: 1, sequence: 1 },
  { id: 2, moduleId: 1, contentId: 2, sequence: 2 },
  { id: 3, moduleId: 1, contentId: 3, sequence: 3 },
  { id: 4, moduleId: 2, contentId: 4, sequence: 1 },
  { id: 5, moduleId: 2, contentId: 5, sequence: 2 }
];

class ModuleService {
  // Helper for mock responses
  async mockDelay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all modules
  async getAllModules() {
    if (USE_MOCK) {
      await this.mockDelay();
      return { data: mockModules };
    }
    
    try {
      return await axios.get(`${API_URL}/modules`);
    } catch (error) {
      console.error("Error fetching modules:", error);
      await this.mockDelay();
      return { data: mockModules }; // Fallback to mock data
    }
  }

  // Get module by ID
  async getModuleById(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      const module = mockModules.find(m => m.id == id);
      if (!module) throw new Error("Module not found");
      return { data: module };
    }
    
    try {
      return await axios.get(`${API_URL}/modules/${id}`);
    } catch (error) {
      console.error(`Error fetching module ${id}:`, error);
      await this.mockDelay();
      const module = mockModules.find(m => m.id == id);
      if (!module) throw new Error("Module not found");
      return { data: module };
    }
  }

  // Get modules by course
  async getModulesByCourse(courseId) {
    if (USE_MOCK) {
      await this.mockDelay();
      const modules = mockModules.filter(m => m.courseId == courseId);
      return { data: modules };
    }
    
    try {
      return await axios.get(`${API_URL}/modules/course/${courseId}`);
    } catch (error) {
      console.error(`Error fetching modules for course ${courseId}:`, error);
      await this.mockDelay();
      const modules = mockModules.filter(m => m.courseId == courseId);
      return { data: modules };
    }
  }

  // Create a new module
  async createModule(moduleData) {
    if (USE_MOCK) {
      await this.mockDelay();
      const newModule = { ...moduleData, id: mockModules.length + 1 };
      mockModules.push(newModule);
      return { data: newModule };
    }
    
    try {
      return await axios.post(`${API_URL}/modules`, moduleData);
    } catch (error) {
      console.error("Error creating module:", error);
      throw error;
    }
  }

  // Reorder modules
  async reorderModules(moduleIds) {
    if (USE_MOCK) {
      await this.mockDelay();
      // Mock implementation would reorder the modules here
      return { data: { success: true } };
    }
    
    try {
      return await axios.post(`${API_URL}/modules/reorder`, moduleIds);
    } catch (error) {
      console.error("Error reordering modules:", error);
      throw error;
    }
  }

  // Assign content to module
  async assignContentToModule(contentId, moduleId) {
    if (USE_MOCK) {
      await this.mockDelay();
      // Mock implementation would assign content to module here
      return { data: { success: true } };
    }
    
    try {
      return await axios.post(`${API_URL}/modules/${contentId}/assign-to-module/${moduleId}`);
    } catch (error) {
      console.error(`Error assigning content ${contentId} to module ${moduleId}:`, error);
      throw error;
    }
  }

  // Reorder contents within a module
  async reorderContents(moduleId, contentIds) {
    if (USE_MOCK) {
      await this.mockDelay();
      // Mock implementation would reorder the contents here
      return { data: { success: true } };
    }
    
    try {
      return await axios.post(`${API_URL}/modules/${moduleId}/reorder-contents`, contentIds);
    } catch (error) {
      console.error(`Error reordering contents for module ${moduleId}:`, error);
      throw error;
    }
  }

  // Add tag to content
  async addTagToContent(contentId, tagData) {
    if (USE_MOCK) {
      await this.mockDelay();
      // Mock implementation would add tag to content here
      return { data: { success: true } };
    }
    
    try {
      return await axios.post(`${API_URL}/modules/${contentId}/add-tag`, tagData);
    } catch (error) {
      console.error(`Error adding tag to content ${contentId}:`, error);
      throw error;
    }
  }

  // Validate content sequence
  async validateSequence(moduleId, contentIds) {
    if (USE_MOCK) {
      await this.mockDelay();
      // Mock validation - always returns valid for now
      return { data: { valid: true } };
    }
    
    try {
      return await axios.post(`${API_URL}/modules/${moduleId}/validate-sequence`, contentIds);
    } catch (error) {
      console.error(`Error validating sequence for module ${moduleId}:`, error);
      throw error;
    }
  }

  // Get contents order
  async getContentsOrder(moduleId) {
    if (USE_MOCK) {
      await this.mockDelay();
      const contents = mockContentOrders.filter(c => c.moduleId == moduleId);
      return { data: contents };
    }
    
    try {
      return await axios.get(`${API_URL}/modules/${moduleId}/contents-order`);
    } catch (error) {
      console.error(`Error fetching contents order for module ${moduleId}:`, error);
      await this.mockDelay();
      const contents = mockContentOrders.filter(c => c.moduleId == moduleId);
      return { data: contents };
    }
  }

  // Update module
  async updateModule(id, moduleData) {
    if (USE_MOCK) {
      await this.mockDelay();
      const index = mockModules.findIndex(m => m.id == id);
      if (index === -1) throw new Error("Module not found");
      
      mockModules[index] = { ...mockModules[index], ...moduleData };
      return { data: mockModules[index] };
    }
    
    try {
      return await axios.put(`${API_URL}/modules/${id}`, moduleData);
    } catch (error) {
      console.error(`Error updating module ${id}:`, error);
      throw error;
    }
  }

  // Delete module
  async deleteModule(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      const index = mockModules.findIndex(m => m.id == id);
      if (index === -1) throw new Error("Module not found");
      
      const deleted = mockModules.splice(index, 1)[0];
      return { data: deleted };
    }
    
    try {
      return await axios.delete(`${API_URL}/modules/${id}`);
    } catch (error) {
      console.error(`Error deleting module ${id}:`, error);
      throw error;
    }
  }
}

export default new ModuleService();
