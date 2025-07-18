// ContentTypeAdapter.js
// A utility class to help map between different content types and ensure proper handling

/**
 * ContentTypeAdapter provides helper methods to correctly process different content types
 * and integrate with the right backend endpoints based on the content type.
 */
class ContentTypeAdapter {
  // Content type constants
  static TYPES = {
    DOCUMENT: 'document',
    VIDEO: 'video',
    QUIZ: 'quiz',
    ASSIGNMENT: 'assignment'
  };

  // Map frontend content types to backend enum values
  static mapToBackendType(frontendType) {
    const typeMap = {
      [this.TYPES.DOCUMENT]: 'ARTICLE',
      [this.TYPES.VIDEO]: 'VIDEO',
      [this.TYPES.QUIZ]: 'QUIZ',
      [this.TYPES.ASSIGNMENT]: 'ASSIGNMENT'
    };
    
    return typeMap[frontendType] || 'ARTICLE';
  }

  // Map backend content types to frontend values
  static mapToFrontendType(backendType) {
    const typeMap = {
      'ARTICLE': this.TYPES.DOCUMENT,
      'VIDEO': this.TYPES.VIDEO,
      'QUIZ': this.TYPES.QUIZ,
      'ASSIGNMENT': this.TYPES.ASSIGNMENT
    };
    
    return typeMap[backendType] || this.TYPES.DOCUMENT;
  }

  // Determine if content is a special type handled by separate controllers
  static isSpecialContentType(type) {
    return type === this.TYPES.QUIZ || type === this.TYPES.ASSIGNMENT;
  }

  // Get the appropriate API path for a content type
  static getApiPathForType(type) {
    switch (type) {
      case this.TYPES.QUIZ:
        return '/api/quizzes';
      case this.TYPES.ASSIGNMENT:
        return '/api/assignments';
      default:
        return '/api/contents';
    }
  }

  // Transform content data based on content type (useful for form preparation)
  static prepareContentData(data, type) {
    // Clone the data to avoid modifying the original
    const prepared = { ...data };
    
    switch (type) {
      case this.TYPES.QUIZ:
        // Prepare quiz-specific fields
        if (!prepared.timeLimit) prepared.timeLimit = 0;
        if (!prepared.passingScore) prepared.passingScore = 70.0;
        if (prepared.randomizeQuestions === undefined) prepared.randomizeQuestions = false;
        break;
        
      case this.TYPES.ASSIGNMENT:
        // Prepare assignment-specific fields
        if (!prepared.maxScore) prepared.maxScore = 100;
        break;
        
      case this.TYPES.VIDEO:
        // Prepare video-specific fields
        if (!prepared.duration) prepared.duration = 0;
        break;
    }
    
    return prepared;
  }

  // Convert a generic content response to include type-specific fields
  static enhanceContentResponse(content) {
    if (!content) return content;
    
    const enhanced = { ...content };
    
    // Add 'type' field if it doesn't exist but can be inferred
    if (!enhanced.type && enhanced.fileType) {
      if (enhanced.fileType.startsWith('video/')) {
        enhanced.type = this.TYPES.VIDEO;
      } else if (enhanced.fileType.startsWith('image/')) {
        enhanced.type = 'image';
      } else {
        enhanced.type = this.TYPES.DOCUMENT;
      }
    }
    
    return enhanced;
  }

  // Convert an array of backend contents to frontend format
  static convertContentsArray(contentsArray) {
    if (!Array.isArray(contentsArray)) return [];
    
    return contentsArray.map(content => this.enhanceContentResponse(content));
  }

  // Check if a file type is supported for upload
  static isSupportedFileType(file) {
    const supportedTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/html',
      'text/markdown',
      
      // Presentations
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      
      // Spreadsheets
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      
      // Videos
      'video/mp4',
      'video/webm',
      'video/ogg',
      
      // Audio
      'audio/mpeg',
      'audio/ogg',
      'audio/wav'
    ];
    
    return supportedTypes.includes(file.type);
  }
}

export default ContentTypeAdapter;