import api from "./api";
import { formatDate } from "../utils/dateUtils";

const USE_MOCK = false; // Set to false to use the real backend API

// Mock data for fallback/testing
const mockCertificates = {
  1: {
    id: 1,
    studentId: 101,
    studentName: "John Doe",
    courseId: 1,
    courseName: "Human Anatomy",
    certificateUrl: "https://lms.com/certificates/101/1",
    verificationId: "cert-123456",
    issuedAt: "2025-04-15T10:00:00Z",
    revoked: false,
    revocationReason: null,
    template: "Standard Certificate",
    departmentId: 1,
    departmentName: "Medical Sciences"
  },
  2: {
    id: 2,
    studentId: 102,
    studentName: "Jane Smith",
    courseId: 2,
    courseName: "Advanced Biology",
    certificateUrl: "https://lms.com/certificates/102/2",
    verificationId: "cert-789012",
    issuedAt: "2025-04-20T14:30:00Z",
    revoked: false,
    revocationReason: null,
    template: "Honors Certificate",
    departmentId: 1,
    departmentName: "Medical Sciences"
  }
};

// Mock certificate templates
const mockCertificateTemplates = {
  1: {
    id: 1,
    name: "Standard Certificate",
    description: "Basic completion certificate template",
    semesterName: "Fall 2024",
    template: "Standard Certificate",
    isActive: true,
    issuedCount: 15,
    dateCreated: "2025-03-10T09:00:00Z",
    lastModified: "2025-04-05T11:30:00Z"
  },
  2: {
    id: 2,
    name: "Honors Certificate",
    description: "Premium certificate for high-achieving students",
    semesterName: "Spring 2025",
    template: "Honors Certificate",
    isActive: true,
    issuedCount: 5,
    dateCreated: "2025-03-15T09:00:00Z",
    lastModified: "2025-03-15T09:00:00Z"
  },
  3: {
    id: 3,
    name: "General Achievement Certificate",
    description: "Generic certificate of achievement that can be issued without a specific semester",
    semesterName: null,
    template: "Generic Certificate",
    isActive: true,
    issuedCount: 3,
    dateCreated: "2025-03-20T09:00:00Z",
    lastModified: "2025-03-20T09:00:00Z"
  }
};

class CertificateService {
  // Helper for mock responses
  async mockDelay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper to adapt certificate data from backend format to frontend format
  adaptCertificate(certificate) {
    // Handle nulls
    if (!certificate) return null;
    
    return {
      ...certificate,
      // Add missing fields with defaults
      studentName: certificate.studentName || "Unknown Student",
      courseName: certificate.courseName || "Unknown Course",
      departmentId: certificate.departmentId || null,
      departmentName: certificate.departmentName || null,
      template: certificate.template || certificate.templateContent || "Default Template",
      revoked: certificate.revoked !== undefined ? certificate.revoked : false,
      revocationReason: certificate.revocationReason || null,
      formattedIssuedDate: formatDate(certificate.issuedAt)
    };
  }

  // Helper to adapt certificate template data for frontend
  adaptCertificateTemplate(template) {
    // Handle nulls
    if (!template) return null;
    
    return {
      ...template,
      // Map backend to frontend field names
      id: template.id,
      name: template.name,
      description: template.description || "", // Map courseId to semesterId for backward
      // Handle the difference between templateContent and template fields
      template: template.templateContent || template.template || "Default Template",
      isActive: template.isActive !== undefined ? template.isActive : true,
      issuedCount: template.issuedCount || 0,
      dateCreated: template.dateCreated,
      lastModified: template.lastModified,
      // Add formatted dates
      formattedCreatedDate: formatDate(template.dateCreated),
      formattedModifiedDate: formatDate(template.lastModified)
    };
  }

  // ----------------
  // CERTIFICATE OPERATIONS
  // ----------------
  
  // Get all certificates with pagination and filtering
  async getAllCertificates(page = 0, size = 10, filters = {}) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      let filtered = Object.values(mockCertificates);
      
      // Apply filters
      if (filters.courseId) {
        filtered = filtered.filter(c => c.courseId == filters.courseId);
      }
      
      if (filters.studentId) {
        filtered = filtered.filter(c => c.studentId == filters.studentId);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(c => 
          (c.studentName || "").toLowerCase().includes(searchLower) || 
          (c.courseName || "").toLowerCase().includes(searchLower)
        );
      }
      
      // Sort
      const sortField = filters.sortBy || 'issuedAt';
      const sortDir = filters.sortDir === 'asc' ? 1 : -1;
      
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
          content: paginatedResults.map(this.adaptCertificate),
          totalElements: total,
          totalPages: Math.ceil(total / size),
          size,
          number: page,
          last: start + size >= total
        }
      };
    }
    
    try {
      // Build query params for filtering
      let url = `/api/certificates?page=${page}&size=${size}`;
      
      if (filters.courseId) url += `&courseId=${filters.courseId}`;
      if (filters.studentId) url += `&studentId=${filters.studentId}`;
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.sortBy) url += `&sort=${filters.sortBy},${filters.sortDir || 'desc'}`;
      
      const response = await api.get(url);
      
      // Handle paginated response
      if (response.data && response.data.content) {
        return { 
          data: {
            content: response.data.content.map(this.adaptCertificate),
            totalElements: response.data.totalElements,
            totalPages: response.data.totalPages,
            size: response.data.size,
            number: response.data.number,
            last: response.data.last
          }
        };
      }
      
      // Handle array response
      if (Array.isArray(response.data)) {
        const certificates = response.data;
        const total = certificates.length;
        const start = page * size;
        const end = Math.min(start + size, total);
        
        return {
          data: {
            content: certificates.slice(start, end).map(this.adaptCertificate),
            totalElements: total,
            totalPages: Math.ceil(total / size),
            size,
            number: page,
            last: end >= total
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      throw error;
    }
  }

  // Get certificate by ID
  async getCertificateById(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      const certificate = mockCertificates[id];
      if (!certificate) throw new Error("Certificate not found");
      return { data: this.adaptCertificate(certificate) };
    }
    
    try {
      const response = await api.get(`/api/certificates/${id}`);
      return { data: this.adaptCertificate(response.data) };
    } catch (error) {
      console.error(`Error fetching certificate ${id}:`, error);
      throw error;
    }
  }

  // Get certificates by student
  async getCertificatesByStudent(studentId, page = 0, size = 10) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      const studentCertificates = Object.values(mockCertificates)
        .filter(c => c.studentId == studentId);
      
      // Add pagination
      const total = studentCertificates.length;
      const start = page * size;
      const paginatedResults = studentCertificates.slice(start, start + size);
      
      return { 
        data: {
          content: paginatedResults.map(this.adaptCertificate),
          totalElements: total,
          totalPages: Math.ceil(total / size),
          size,
          number: page,
          last: start + size >= total
        }
      };
    }
    
    try {
      const response = await api.get(`/api/certificates/student/${studentId}`);
      
      // Backend returns a plain array, so manually paginate and format
      const certificates = response.data || [];
      const total = certificates.length;
      const start = page * size;
      const end = Math.min(start + size, total);
      
      return {
        data: {
          content: certificates.slice(start, end).map(this.adaptCertificate),
          totalElements: total,
          totalPages: Math.ceil(total / size),
          size,
          number: page,
          last: end >= total
        }
      };
    } catch (error) {
      console.error(`Error fetching certificates for student ${studentId}:`, error);
      throw error;
    }
  }

  // Get certificates by course
  async getCertificatesByCourse(courseId, page = 0, size = 10) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      const courseCertificates = Object.values(mockCertificates)
        .filter(c => c.courseId == courseId);
      
      // Add pagination
      const total = courseCertificates.length;
      const start = page * size;
      const paginatedResults = courseCertificates.slice(start, start + size);
      
      return { 
        data: {
          content: paginatedResults.map(this.adaptCertificate),
          totalElements: total,
          totalPages: Math.ceil(total / size),
          size,
          number: page,
          last: start + size >= total
        }
      };
    }
    
    try {
      const response = await api.get(`/api/certificates/course/${courseId}`);
      
      // Backend returns a plain array, so manually paginate and format
      const certificates = response.data || [];
      const total = certificates.length;
      const start = page * size;
      const end = Math.min(start + size, total);
      
      return {
        data: {
          content: certificates.slice(start, end).map(this.adaptCertificate),
          totalElements: total,
          totalPages: Math.ceil(total / size),
          size,
          number: page,
          last: end >= total
        }
      };
    } catch (error) {
      console.error(`Error fetching certificates for course ${courseId}:`, error);
      throw error;
    }
  }

  // Generate certificate for a student
  async generateCertificate(studentId, courseId = null, templateId = null) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      const newId = Object.keys(mockCertificates).length + 1;
      const newCertificate = {
        id: newId,
        studentId,
        studentName: "Mock Student",
        // Make courseId optional
        ...(courseId && { courseId, courseName: "Mock Course" }),
        certificateUrl: courseId 
          ? `https://lms.com/certificates/${studentId}/${courseId}` 
          : `https://lms.com/certificates/${studentId}`,
        verificationId: `cert-${Math.floor(Math.random() * 1000000)}`,
        issuedAt: new Date().toISOString(),
        revoked: false,
        revocationReason: null,
        // Include template if provided
        ...(templateId && { templateId })
      };
      
      mockCertificates[newId] = newCertificate;
      return { data: this.adaptCertificate(newCertificate) };
    }
    
    try {
      let endpoint = `/api/certificates/generate/${studentId}`;
      if (courseId) {
        endpoint += `/${courseId}`;
      }
      
      // Note: Backend might not support template parameter yet
      // Keep for future compatibility
      if (templateId) {
        endpoint += `?templateId=${templateId}`;
      }
      
      const response = await api.post(endpoint);
      return { data: this.adaptCertificate(response.data) };
    } catch (error) {
      console.error(`Error generating certificate for student ${studentId}:`, error);
      throw error;
    }
  }

  // Verify certificate
  async verifyCertificate(verificationId) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      // Check if any mock certificate has this verification ID
      const certificate = Object.values(mockCertificates)
        .find(c => c.verificationId === verificationId);
      
      return { data: !!certificate && !certificate.revoked };
    }
    
    try {
      const response = await api.get(`/api/certificates/verify/${verificationId}`);
      return response;
    } catch (error) {
      console.error(`Error verifying certificate ${verificationId}:`, error);
      throw error;
    }
  }

  // Download certificate
  async downloadCertificate(certificateId) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      // In mock mode, we can't really return a PDF, so we'll just return success
      return { success: true, message: "Certificate download simulated in mock mode" };
    }
    
    try {
      const response = await api.get(`/api/certificates/${certificateId}/download`, {
        responseType: 'blob'
      });
      
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificate.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
    } catch (error) {
      console.error(`Error downloading certificate ${certificateId}:`, error);
      throw error;
    }
  }

  // Generate batch certificates
  async generateBatchCertificates(courseId, studentIds, templateId = null) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      const newCertificates = studentIds.map((studentId, index) => {
        const newId = Object.keys(mockCertificates).length + index + 1;
        const certificate = {
          id: newId,
          studentId,
          studentName: `Mock Student ${studentId}`,
          courseId,
          courseName: "Mock Course",
          certificateUrl: `https://lms.com/certificates/${studentId}/${courseId}`,
          verificationId: `cert-${Math.floor(Math.random() * 1000000)}`,
          issuedAt: new Date().toISOString(),
          revoked: false,
          revocationReason: null,
          templateId: templateId || 1
        };
        
        mockCertificates[newId] = certificate;
        return certificate;
      });
      
      return { data: newCertificates.map(this.adaptCertificate) };
    }
    
    try {
      // Add the templateId to the request body if provided
      const requestBody = {
        studentIds,
        templateId: templateId || null
      };
      
      const response = await api.post(`/api/certificates/batch/${courseId}`, requestBody);
      
      // Handle array response
      if (Array.isArray(response.data)) {
        return { data: response.data.map(this.adaptCertificate) };
      }
      
      return response;
    } catch (error) {
      console.error(`Error generating batch certificates for course ${courseId}:`, error);
      throw error;
    }
  }

  // ----------------
  // CERTIFICATE TEMPLATE OPERATIONS
  // ----------------
  
  // Get all certificate templates
  async getAllCertificateTemplates(page = 0, size = 10, filters = {}) {
    if (USE_MOCK) {
      await this.mockDelay();
      return { data: Object.values(mockCertificateTemplates) };
    }
    
    try {
      // Build query params for filters  
    let url = `/api/certificate-templates?page=${page}&size=${size}`;
    if (filters.isActive !== undefined) url += `&isActive=${filters.isActive}`;
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      
      const response = await api.get(url);
      
      // Handle paginated response
      if (response.data && response.data.content) {
        return { 
          data: response.data.content.map(this.adaptCertificateTemplate),
          pagination: {
            totalElements: response.data.totalElements,
            totalPages: response.data.totalPages,
            size: response.data.size,
            number: response.data.number,
            last: response.data.last
          }
        };
      }
      
      // Handle array response
      return { data: Array.isArray(response.data) ? response.data.map(this.adaptCertificateTemplate) : [] };
    } catch (error) {
      console.error('Error fetching certificate templates:', error);
      throw error;
    }
  }

  // Get certificate template by ID
  async getCertificateTemplateById(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      const template = mockCertificateTemplates[id];
      if (!template) throw new Error("Certificate template not found");
      return { data: this.adaptCertificateTemplate(template) };
    }
    
    try {
      const response = await api.get(`/api/certificate-templates/${id}`);
      return { data: this.adaptCertificateTemplate(response.data) };
    } catch (error) {
      console.error(`Error fetching certificate template ${id}:`, error);
      throw error;
    }
  }

  // Create certificate template
  async createCertificateTemplate(templateData) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      const newId = Object.keys(mockCertificateTemplates).length + 1;
      const newTemplate = {
        id: newId,
      name: templateData.name,
      description: templateData.description,
      semesterName: templateData.semesterName,
      template: templateData.template || templateData.templateContent,
      isActive: templateData.isActive !== undefined ? templateData.isActive : true,
      issuedCount: 0,
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
      };
      
      mockCertificateTemplates[newId] = newTemplate;
      return { data: this.adaptCertificateTemplate(newTemplate) };
    }
    
    try {
      // Prepare data for the backend
      const backendTemplateData = {
          name: templateData.name,
      description: templateData.description,
      semesterName: templateData.semesterName || null,
      templateContent: templateData.template || templateData.templateContent, // Map template to templateContent
      isActive: templateData.isActive !== undefined ? templateData.isActive : true
      };
      
      const response = await api.post(`/api/certificate-templates`, backendTemplateData);
      return { data: this.adaptCertificateTemplate(response.data) };
    } catch (error) {
      console.error('Error creating certificate template:', error);
      throw error;
    }
  }

  // Update certificate template
  async updateCertificateTemplate(id, templateData) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      if (!mockCertificateTemplates[id]) throw new Error("Certificate template not found");
      
        mockCertificateTemplates[id] = {
      ...mockCertificateTemplates[id],
      name: templateData.name,
      description: templateData.description,
      semesterName: templateData.semesterName,
      template: templateData.template || templateData.templateContent,
      isActive: templateData.isActive !== undefined ? templateData.isActive : true,
      lastModified: new Date().toISOString()
    };
      
      return { data: this.adaptCertificateTemplate(mockCertificateTemplates[id]) };
    }
    
    try {
      // Prepare data for the backend
       const backendTemplateData = {
      name: templateData.name,
      description: templateData.description,
      semesterName: templateData.semesterName || null,
      templateContent: templateData.template || templateData.templateContent, // Map template to templateContent
      isActive: templateData.isActive !== undefined ? templateData.isActive : true
      };
      
      const response = await api.put(`/api/certificate-templates/${id}`, backendTemplateData);
      return { data: this.adaptCertificateTemplate(response.data) };
    } catch (error) {
      console.error(`Error updating certificate template ${id}:`, error);
      throw error;
    }
  }

  // Delete certificate template
  async deleteCertificateTemplate(id) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      if (!mockCertificateTemplates[id]) throw new Error("Certificate template not found");
      
      const deleted = mockCertificateTemplates[id];
      delete mockCertificateTemplates[id];
      
      return { data: this.adaptCertificateTemplate(deleted) };
    }
    
    try {
      return await api.delete(`/api/certificate-templates/${id}`);
    } catch (error) {
      console.error(`Error deleting certificate template ${id}:`, error);
      throw error;
    }
  }

  // LinkedIn sharing functionality
  async generateLinkedInSharingUrl(certificateId) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      const certificate = mockCertificates[certificateId];
      if (!certificate) throw new Error("Certificate not found");
      
      const certName = encodeURIComponent(`Course Completion: ${certificate.courseName || "Certificate of Achievement"}`);
      const orgName = encodeURIComponent("Solaris LMS");
      
      const sharingUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
                        `&name=${certName}` +
                        `&organizationName=${orgName}`;
      
      // Update the mock certificate with the sharing URL
      mockCertificates[certificateId].linkedInSharingUrl = sharingUrl;
      
      return { data: { sharingUrl } };
    }
    
    try {
      const response = await api.get(`/api/certificates/${certificateId}/linkedin-share`);
      return response;
    } catch (error) {
      console.error(`Error generating LinkedIn sharing URL for certificate ${certificateId}:`, error);
      throw error;
    }
  }

  // Add method to revoke a certificate
  async revokeCertificate(certificateId, reason) {
    if (USE_MOCK) {
      await this.mockDelay();
      
      const certificate = mockCertificates[certificateId];
      if (!certificate) throw new Error("Certificate not found");
      
      certificate.revoked = true;
      certificate.revocationReason = reason || "Certificate revoked by administrator";
      
      return { data: this.adaptCertificate(certificate) };
    }
    
    try {
      const response = await api.post(`/api/certificates/${certificateId}/revoke`, { reason });
      return response;
    } catch (error) {
      console.error(`Error revoking certificate ${certificateId}:`, error);
      throw error;
    }
  }
}

export default new CertificateService();