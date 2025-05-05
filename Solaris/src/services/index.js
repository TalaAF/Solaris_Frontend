// Export all API services from this file for easy importing
import CourseService from "./CourseService";
import ModuleService from "./ModuleService";
import ContentService from "./ContentService";
import {
  transformCourseData,
  transformModuleData,
  transformContentItem,
  calculateModuleStatus,
  estimateDuration,
  formatDuration,
  determineSemester,
  convertToLetterGrade,
} from "./DataMapper";

export {
  CourseService,
  ModuleService,
  ContentService,
  transformCourseData,
  transformModuleData,
  transformContentItem,
  calculateModuleStatus,
  estimateDuration,
  formatDuration,
  determineSemester,
  convertToLetterGrade,
};
