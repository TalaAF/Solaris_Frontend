// Export all API services from this file for easy importing
import CourseService from "./CourseService";
import EnrollmentService from "./EnrollmentService";
import UserService from "./UserService";
import CourseDataMapper from "./CourseDataMapper";
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
  EnrollmentService,
  UserService,
  CourseDataMapper,
  transformCourseData,
  transformModuleData,
  transformContentItem,
  calculateModuleStatus,
  estimateDuration,
  formatDuration,
  determineSemester,
  convertToLetterGrade,
};