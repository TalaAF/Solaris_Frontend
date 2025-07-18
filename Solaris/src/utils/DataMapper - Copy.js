/**
 * DataMapper.js
 *
 * Utility functions to map between backend and frontend data structures
 */

/**
 * Transform course data from backend to frontend format
 *
 * @param {Object} backendCourse - Course data from backend API
 * @param {Array} modules - Course modules if available
 * @param {Object} statistics - Course statistics if available
 * @returns {Object} Transformed course data for frontend
 */
export const transformCourseData = (
  backendCourse,
  modules = [],
  statistics = null,
) => {
  if (!backendCourse) return null;

  // Generate course code if not provided
  const courseCode = backendCourse.code || `CODE${backendCourse.id}`;

  // Map instructor data
  const instructor = {
    name: backendCourse.instructorEmail || "Unknown Instructor",
    avatar: null, // Backend doesn't provide this
    title: "Instructor", // Backend doesn't provide this
  };

  // Calculate progress from statistics or default to provided progress
  const progress =
    statistics && statistics.averageCompletionPercentage
      ? Math.round(statistics.averageCompletionPercentage)
      : backendCourse.progress || 0;

  // Determine course status based on progress
  const status =
    progress >= 100
      ? "completed"
      : progress > 0
        ? "in-progress"
        : "not-started";

  return {
    id: backendCourse.id,
    title: backendCourse.title,
    code: courseCode,
    description: backendCourse.description,
    instructor: instructor,
    progress: progress,
    status: status,
    modules: modules,
    departmentId: backendCourse.departmentId,
    departmentName: backendCourse.departmentName,
    maxCapacity: backendCourse.maxCapacity,
    currentEnrollment: backendCourse.currentEnrollment,
    startDate: backendCourse.startDate,
    endDate: backendCourse.endDate,
    createdAt: backendCourse.createdAt,
    updatedAt: backendCourse.updatedAt,
  };
};

/**
 * Transform module data from backend to frontend format
 *
 * @param {Object} backendModule - Module data from backend API
 * @param {Array} items - Module items if available
 * @returns {Object} Transformed module data for frontend
 */
export const transformModuleData = (backendModule, items = []) => {
  if (!backendModule) return null;

  // Calculate module status based on items
  const moduleStatus = calculateModuleStatus(items);

  return {
    id: backendModule.id,
    title: backendModule.title,
    description: backendModule.description,
    number: backendModule.sequence || backendModule.number,
    status: moduleStatus,
    items: items,
  };
};

/**
 * Transform content item from backend to frontend format
 *
 * @param {Object} contentItem - Content item data from backend API
 * @returns {Object} Transformed content item data for frontend
 */
export const transformContentItem = (contentItem) => {
  if (!contentItem) return null;

  return {
    id: contentItem.id,
    title: contentItem.title,
    description: contentItem.description,
    type: mapContentTypeToItemType(contentItem.type || contentItem.fileType),
    status: contentItem.status || "not-started",
    contentUrl: contentItem.filePath,
    duration: formatDuration(
      contentItem.duration || estimateDuration(contentItem),
    ),
  };
};

/**
 * Map content type from backend to frontend item type
 *
 * @param {string} contentType - Content type from backend
 * @returns {string} Mapped item type for frontend
 */
export const mapContentTypeToItemType = (contentType) => {
  if (!contentType) return "document";

  const type = contentType.toLowerCase();
  if (type.includes("video") || type.includes("mp4")) return "video";
  if (type.includes("quiz")) return "quiz";
  if (type.includes("interactive")) return "interactive";
  return "document";
};

/**
 * Calculate module status based on item statuses
 *
 * @param {Array} items - Module items
 * @returns {string} Module status: 'completed', 'in-progress', or 'not-started'
 */
export const calculateModuleStatus = (items) => {
  if (!items || items.length === 0) return "not-started";

  const completedCount = items.filter(
    (item) => item.status === "completed",
  ).length;
  const inProgressCount = items.filter(
    (item) => item.status === "in-progress",
  ).length;

  if (completedCount === items.length) return "completed";
  if (completedCount > 0 || inProgressCount > 0) return "in-progress";
  return "not-started";
};

/**
 * Estimate duration based on content type and size
 *
 * @param {Object} content - Content item data
 * @returns {number} Estimated duration in minutes
 */
export const estimateDuration = (content) => {
  // Default durations based on content type
  if (!content) return 10;

  const type = (content.type || content.fileType || "").toLowerCase();
  if (type.includes("video")) return 15;
  if (type.includes("quiz")) return 10;
  if (type.includes("interactive")) return 20;

  // For documents, estimate based on file size if available
  if (content.fileSize) {
    // Rough estimate: 1 minute per 50KB for text documents
    return Math.max(5, Math.round(content.fileSize / (50 * 1024)));
  }

  return 10; // Default duration
};

/**
 * Format duration in minutes
 *
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const formatDuration = (minutes) => {
  if (!minutes) return "10 min";
  return `${minutes} min`;
};

/**
 * Extract semester from course dates
 *
 * @param {Object} course - Course data
 * @returns {string} Semester string (e.g., 'Fall 2023')
 */
export const determineSemester = (course) => {
  if (!course.startDate) return "Current Semester";

  const startDate = new Date(course.startDate);
  const year = startDate.getFullYear();
  const month = startDate.getMonth();

  if (month >= 0 && month <= 4) return `Spring ${year}`;
  if (month >= 5 && month <= 7) return `Summer ${year}`;
  return `Fall ${year}`;
};

/**
 * Convert numerical grade to letter grade
 *
 * @param {number} grade - Numerical grade (0-100)
 * @returns {string} Letter grade (A, B, C, D, F)
 */
export const convertToLetterGrade = (grade) => {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
};
