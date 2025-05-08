// src/services/CourseDataMapper.js

/**
 * Maps course data from backend format to frontend format
 */
const CourseDataMapper = {
    /**
     * Map student data from backend to frontend format
     * @param {Object} user - User data from backend
     * @returns {Object} Student data for frontend
     */
    mapStudentData(user) {
      if (!user) return null;
      
      return {
        id: user.id.toString(),
        name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        term: this.determineCurrentTerm(),
        status: "Registered", // Default status
        majorGPA: parseFloat(user.majorGPA || 3.5).toFixed(2),
        cumulativeGPA: parseFloat(user.cumulativeGPA || 3.5).toFixed(2)
      };
    },
    
    /**
     * Map courses data from backend to frontend format
     * @param {Array} enrollments - Enrollment data from backend
     * @param {Array} completedCourses - Completed courses data
     * @param {Array} availableCourses - Available courses for registration
     * @returns {Object} Mapped course data for frontend
     */
    mapCourseData(enrollments, completedCourses, availableCourses) {
      const registeredCourses = this.mapRegisteredCourses(enrollments);
      const mappedCompletedCourses = this.mapCompletedCourses(completedCourses);
      const mappedAvailableCourses = this.mapAvailableCourses(availableCourses, registeredCourses, mappedCompletedCourses);
      
      return {
        registered: registeredCourses,
        completed: mappedCompletedCourses,
        available: mappedAvailableCourses
      };
    },
    
    /**
     * Map currently registered courses
     * @param {Array} enrollments - Enrollment data
     * @returns {Array} Mapped registered courses
     */
    mapRegisteredCourses(enrollments = []) {
      return enrollments
        .filter(enrollment => 
          enrollment.status === 'APPROVED' || 
          enrollment.status === 'IN_PROGRESS')
        .map(enrollment => {
          const course = enrollment.course || {};
          return {
            code: course.code || `COURSE${course.id}`,
            title: course.title || 'Untitled Course',
            credits: course.credits || 3,
            type: this.determineCourseType(course),
            status: 'in-progress',
            term: course.semester || this.determineCurrentTerm() 
          };
        });
    },
    
    /**
     * Map completed courses
     * @param {Array} completedCourses - Completed courses data
     * @returns {Array} Mapped completed courses
     */
    mapCompletedCourses(completedCourses = []) {
      return completedCourses
        .filter(course => course.progress >= 100)
        .map(course => ({
          code: course.code || `COURSE${course.id}`,
          title: course.title || 'Untitled Course',
          credits: course.credits || 3,
          type: this.determineCourseType(course),
          status: 'completed',
          term: course.semester || 'Fall 2024' // Default to previous term
        }));
    },
    
    /**
     * Map available courses for registration
     * @param {Array} availableCourses - Available courses
     * @param {Array} registeredCourses - Already registered courses
     * @param {Array} completedCourses - Already completed courses
     * @returns {Array} Mapped available courses
     */
    mapAvailableCourses(availableCourses = [], registeredCourses = [], completedCourses = []) {
      // Get IDs of registered and completed courses to filter them out
      const registeredIds = registeredCourses.map(c => c.code);
      const completedIds = completedCourses.map(c => c.code);
      
      return availableCourses
        .filter(course => {
          const courseCode = course.code || `COURSE${course.id}`;
          return !registeredIds.includes(courseCode) && !completedIds.includes(courseCode);
        })
        .map(course => ({
          code: course.code || `COURSE${course.id}`,
          title: course.title || 'Untitled Course',
          credits: course.credits || 3,
          type: this.determineCourseType(course),
          status: 'available',
          term: 'Fall 2025' // Next term for available courses
        }));
    },
    
    /**
     * Determine course type based on department, tags, etc.
     * @param {Object} course - Course data
     * @returns {string} Course type (Major Requirement, Major Elective, etc.)
     */
    determineCourseType(course) {
      if (!course) return 'University Requirement';
      
      // Check department name first
      if (course.departmentName) {
        if (course.departmentName.toLowerCase().includes('medical') || 
            course.departmentName.toLowerCase().includes('health')) {
          return 'Medical Requirement';
        }
      }
      
      // Check tags if available
      if (course.tags) {
        if (course.tags.includes('major_requirement')) return 'Major Requirement';
        if (course.tags.includes('elective')) return 'Major Elective';
        if (course.tags.includes('medical')) return 'Medical Requirement';
      }
      
      // Check course code
      const courseCode = (course.code || '').toUpperCase();
      if (courseCode.startsWith('MED') || courseCode.startsWith('ANAT') || courseCode.startsWith('PHARM')) {
        return 'Medical Requirement';
      }
      if (courseCode.startsWith('SWER')) {
        return 'Major Requirement';
      }
      if (courseCode.startsWith('RELS') || courseCode.startsWith('PHIL')) {
        return 'University Requirement';
      }
      
      // Default to major elective
      return 'Major Elective';
    },
    
    /**
     * Calculate total credits
     * @param {Array} courses - List of courses
     * @returns {number} Total credits
     */
    calculateTotalCredits(courses = []) {
      return courses.reduce((total, course) => total + (course.credits || 0), 0);
    },
    
    /**
     * Determine current term based on date
     * @returns {string} Current term (e.g., 'Spring-2025')
     */
    determineCurrentTerm() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      
      let term;
      if (month >= 0 && month <= 4) {
        term = 'Spring';
      } else if (month >= 5 && month <= 7) {
        term = 'Summer';
      } else {
        term = 'Fall';
      }
      
      return `${term}-${year}`;
    }
  };
  
  export default CourseDataMapper;