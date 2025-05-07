// Export all API services from this file for easy importing
import CourseService from "./CourseService";
import ModuleService from "./ModuleService";
import ContentService from "./ContentService";
import ProgressService from "./ProgressService";
import NotificationService from "./NotificationService";
import EnrollmentService from "./EnrollmentService";
import {
  transformCourseData,
  transformModuleData,
  transformContentItem,
  calculateModuleStatus,
  estimateDuration,
  formatDuration,
  determineSemester,
  convertToLetterGrade,
} from "./DataMapper.js"; // Added the .js extension

import {
  transformNotification,
  mapNotificationType,
  formatTimeAgo,
  mapFrontendCategoryToBackend,
  parseNotificationData
} from "../utils/NotificationDataMapper";

// Add enrollment data mapper functions
import {
  mapEnrollmentDTO,
  formatEnrollmentDate,
  getEnrollmentStatusClass,
  getEnrollmentStatusLabel
} from "./EnrollmentMapper";

export {
  // Services
  CourseService,
  ModuleService,
  ContentService,
  ProgressService,
  NotificationService,
  EnrollmentService,
  
  // Data Mappers
  transformCourseData,
  transformModuleData,
  transformContentItem,
  calculateModuleStatus,
  estimateDuration,
  formatDuration,
  determineSemester,
  convertToLetterGrade,
  
  // Notification Utilities
  transformNotification,
  mapNotificationType,
  formatTimeAgo,
  mapFrontendCategoryToBackend,
  parseNotificationData,
  
  // Enrollment Utilities
  mapEnrollmentDTO,
  formatEnrollmentDate,
  getEnrollmentStatusClass,
  getEnrollmentStatusLabel
};