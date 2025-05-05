// ContentService.js
// Service to handle API calls for content with mock data support

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const USE_MOCK = false; // Toggle this when your backend is ready

// Mock data for development
const mockContents = {
  1: {
    id: 1,
    title: "Introduction to Anatomical Terms",
    type: "document",
    courseId: 1,
    moduleId: 1,
    description: "Learn the fundamental terminology used in anatomy studies",
    content: `
      <h1 class="document-heading">Introduction to Anatomical Terms</h1>
      <p class="document-paragraph">
        Anatomical terminology is a standardized way of describing the human body. It uses specific terms to identify organs, structures, and their relationships to one another.
      </p>
      <h2 class="document-subheading">Why Use Anatomical Terminology?</h2>
      <p class="document-paragraph">
        Anatomical terminology provides a universal language that healthcare professionals can use to communicate accurately and efficiently, regardless of their native language or where they were trained.
      </p>
      <ul class="document-list">
        <li class="document-list-item">Eliminates ambiguity in communication</li>
        <li class="document-list-item">Provides precise descriptions of locations</li>
        <li class="document-list-item">Ensures consistent understanding across medical disciplines</li>
        <li class="document-list-item">Facilitates accurate medical documentation</li>
      </ul>
    `,
    createdAt: "2025-03-15T14:30:00Z",
    updatedAt: "2025-03-28T09:15:00Z",
    tags: ["anatomy", "terminology", "basics"],
  },
  2: {
    id: 2,
    title: "Directional Terms Video",
    type: "video",
    courseId: 1,
    moduleId: 1,
    description: "Visual explanation of directional terms in anatomy",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    duration: "10:25",
    createdAt: "2025-03-16T10:45:00Z",
    updatedAt: "2025-03-16T10:45:00Z",
    tags: ["anatomy", "directional-terms", "video"],
  },
  3: {
    id: 3,
    title: "Anatomical Planes Quiz",
    type: "quiz",
    courseId: 1,
    moduleId: 1,
    description: "Test your knowledge of anatomical planes",
    questions: [
      {
        id: 1,
        text: "Which plane divides the body into left and right portions?",
        options: [
          { id: 1, text: "Sagittal plane" },
          { id: 2, text: "Coronal plane" },
          { id: 3, text: "Transverse plane" },
          { id: 4, text: "Oblique plane" },
        ],
        correctOptionId: 1,
      },
    ],
    createdAt: "2025-03-17T16:20:00Z",
    updatedAt: "2025-03-17T16:20:00Z",
    tags: ["anatomy", "quiz", "assessment"],
  },
  4: {
    id: 4,
    title: "Cell Membrane Structure",
    type: "document",
    courseId: 1,
    moduleId: 2,
    description: "Detailed explanation of cell membrane structure and function",
    content: `
      <h1 class="document-heading">Cell Membrane Structure</h1>
      <p class="document-paragraph">
        The cell membrane, also known as the plasma membrane, is a biological membrane that separates the interior of all cells from the outside environment.
      </p>
      <h2 class="document-subheading">Composition</h2>
      <p class="document-paragraph">
        Cell membranes are composed primarily of phospholipids, which form a lipid bilayer. The membrane also contains cholesterol, proteins, and carbohydrates that are attached to some of the proteins and lipids.
      </p>
    `,
    createdAt: "2025-03-20T11:30:00Z",
    updatedAt: "2025-03-20T11:30:00Z",
    tags: ["cells", "biology", "membranes"],
  },
};

// Mock versions
const mockContentVersions = {
  1: [
    {
      id: 101,
      contentId: 1,
      version: 1,
      changeDescription: "Initial creation",
      createdAt: "2025-03-15T14:30:00Z",
    },
    {
      id: 102,
      contentId: 1,
      version: 2,
      changeDescription: "Added section on terminology importance",
      createdAt: "2025-03-28T09:15:00Z",
    },
  ],
};

class ContentService {
  // Helper for mock responses
  async mockDelay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Create new content
  async createContent(courseId, formData) {
    if (USE_MOCK) {
      await this.mockDelay();

      const title = formData.get("title") || "New Content";
      const description = formData.get("description") || "";
      const type = formData.get("type") || "document";
      const file = formData.get("file");

      const newId = Object.keys(mockContents).length + 1;
      const newContent = {
        id: newId,
        title,
        description,
        type,
        courseId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
      };

      // Add type-specific properties
      if (type === "document") {
        newContent.content = "<p>Document content goes here</p>";
      } else if (type === "video") {
        newContent.videoUrl = "https://example.com/video.mp4";
        newContent.thumbnailUrl = "https://example.com/thumbnail.jpg";
        newContent.duration = "0:00";
      }

      mockContents[newId] = newContent;
      return { data: newContent };
    }

    try {
      return await axios.post(
        `${API_URL}/contents?courseId=${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    } catch (error) {
      console.error(`Error creating content for course ${courseId}:`, error);
      throw error;
    }
  }

  // Get content by ID
  async getContentById(id, userId = null) {
    if (USE_MOCK) {
      await this.mockDelay();
      const content = mockContents[id];
      if (!content) throw new Error("Content not found");
      return { data: content };
    }

    try {
      let url = `${API_URL}/contents/${id}`;
      if (userId) {
        url += `?userId=${userId}`;
      }
      return await axios.get(url);
    } catch (error) {
      console.error(`Error fetching content ${id}:`, error);
      await this.mockDelay();
      const content = mockContents[id];
      if (!content) throw new Error("Content not found");
      return { data: content };
    }
  }

  // Get content by course ID
  async getContentsByCourseId(courseId) {
    if (USE_MOCK) {
      await this.mockDelay();
      const contents = Object.values(mockContents).filter(
        (c) => c.courseId == courseId,
      );
      return { data: contents };
    }

    try {
      return await axios.get(`${API_URL}/contents/course/${courseId}`);
    } catch (error) {
      console.error(`Error fetching contents for course ${courseId}:`, error);
      await this.mockDelay();
      const contents = Object.values(mockContents).filter(
        (c) => c.courseId == courseId,
      );
      return { data: contents };
    }
  }

  // Update content
  async updateContent(id, title, description) {
    if (USE_MOCK) {
      await this.mockDelay();

      if (!mockContents[id]) throw new Error("Content not found");

      if (title) mockContents[id].title = title;
      if (description) mockContents[id].description = description;
      mockContents[id].updatedAt = new Date().toISOString();

      return { data: mockContents[id] };
    }

    try {
      const formData = new FormData();
      if (title) formData.append("title", title);
      if (description) formData.append("description", description);

      return await axios.put(`${API_URL}/contents/${id}`, formData);
    } catch (error) {
      console.error(`Error updating content ${id}:`, error);
      throw error;
    }
  }

  // Delete content
  async deleteContent(id) {
    if (USE_MOCK) {
      await this.mockDelay();

      if (!mockContents[id]) throw new Error("Content not found");

      const deleted = mockContents[id];
      delete mockContents[id];

      return { data: deleted };
    }

    try {
      return await axios.delete(`${API_URL}/contents/${id}`);
    } catch (error) {
      console.error(`Error deleting content ${id}:`, error);
      throw error;
    }
  }

  // Get content versions
  async getContentVersions(id) {
    if (USE_MOCK) {
      await this.mockDelay();

      const versions = mockContentVersions[id] || [];
      return { data: versions };
    }

    try {
      return await axios.get(`${API_URL}/contents/${id}/versions`);
    } catch (error) {
      console.error(`Error fetching versions for content ${id}:`, error);
      await this.mockDelay();
      const versions = mockContentVersions[id] || [];
      return { data: versions };
    }
  }

  // Search contents
  async searchContents(keyword, page = 0, size = 10) {
    if (USE_MOCK) {
      await this.mockDelay();

      // Simple keyword search on title and description
      const results = Object.values(mockContents).filter(
        (content) =>
          content.title.toLowerCase().includes(keyword.toLowerCase()) ||
          content.description?.toLowerCase().includes(keyword.toLowerCase()),
      );

      // Pagination
      const start = page * size;
      const end = start + size;
      const paginatedResults = results.slice(start, end);

      return {
        data: {
          content: paginatedResults,
          totalElements: results.length,
          totalPages: Math.ceil(results.length / size),
          size,
          page,
          last: end >= results.length,
        },
      };
    }

    try {
      return await axios.get(
        `${API_URL}/contents/search?keyword=${keyword}&page=${page}&size=${size}`,
      );
    } catch (error) {
      console.error(
        `Error searching contents with keyword "${keyword}":`,
        error,
      );
      throw error;
    }
  }

  // Filter contents
  async filterContents(tags, fileType) {
    if (USE_MOCK) {
      await this.mockDelay();

      let filtered = Object.values(mockContents);

      if (tags) {
        const tagList = tags.split(",");
        filtered = filtered.filter(
          (content) =>
            content.tags && tagList.some((tag) => content.tags.includes(tag)),
        );
      }

      if (fileType) {
        filtered = filtered.filter((content) => content.type === fileType);
      }

      return { data: filtered };
    }

    try {
      let url = `${API_URL}/contents/filter?`;
      if (tags) url += `tags=${tags}`;
      if (fileType) url += `&fileType=${fileType}`;
      return await axios.get(url);
    } catch (error) {
      console.error(`Error filtering contents:`, error);
      throw error;
    }
  }

  // Upload file
  async uploadFile(file) {
    if (USE_MOCK) {
      await this.mockDelay();

      // Mock file upload response
      const fileName = file.name;
      const fileUrl = `https://example.com/files/${fileName}`;

      return { data: { fileName, fileUrl } };
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      return await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error(`Error uploading file:`, error);
      throw error;
    }
  }

  // Download file
  async downloadFile(fileName) {
    if (USE_MOCK) {
      await this.mockDelay();

      // Can't really mock a file download in JavaScript
      // Just return a mock blob
      const mockBlob = new Blob(["Mock file content"], { type: "text/plain" });

      return { data: mockBlob };
    }

    try {
      return await axios.get(`${API_URL}/files/download/${fileName}`, {
        responseType: "blob",
      });
    } catch (error) {
      console.error(`Error downloading file ${fileName}:`, error);
      throw error;
    }
  }

  // Get content by module
  async getContentsByModule(moduleId) {
    if (USE_MOCK) {
      await this.mockDelay();
      const contents = Object.values(mockContents).filter(
        (c) => c.moduleId == moduleId,
      );
      return { data: contents };
    }

    try {
      return await axios.get(`${API_URL}/contents/module/${moduleId}`);
    } catch (error) {
      console.error(`Error fetching contents for module ${moduleId}:`, error);
      await this.mockDelay();
      const contents = Object.values(mockContents).filter(
        (c) => c.moduleId == moduleId,
      );
      return { data: contents };
    }
  }

  // Mark content as viewed/completed
  async markAsViewed(contentId, userId) {
    if (USE_MOCK) {
      await this.mockDelay();
      return { data: { success: true } };
    }

    try {
      return await axios.post(`${API_URL}/contents/${contentId}/mark-viewed`, {
        userId,
      });
    } catch (error) {
      console.error(`Error marking content ${contentId} as viewed:`, error);
      throw error;
    }
  }
}

export default new ContentService();
