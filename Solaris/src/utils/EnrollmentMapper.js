/**
 * Utility functions for mapping enrollment data between backend and frontend
 */

/**
 * Map backend enrollment DTO to frontend format
 * @param {Object} enrollmentDTO - Enrollment DTO from backend
 * @returns {Object} Formatted enrollment for frontend
 */
export const mapEnrollmentDTO = (enrollmentDTO) => {
    if (!enrollmentDTO) return null;
  
    return {
      id: enrollmentDTO.id,
      studentId: enrollmentDTO.studentId,
      studentName: enrollmentDTO.studentName,
      courseId: enrollmentDTO.courseId,
      courseName: enrollmentDTO.courseName,
      status: getEnrollmentStatusLabel(enrollmentDTO.status),
      progress: enrollmentDTO.progress || 0,
      enrolledDate: formatEnrollmentDate(enrollmentDTO.enrollmentDate),
      completionDate: enrollmentDTO.completionDate 
        ? formatEnrollmentDate(enrollmentDTO.completionDate) 
        : null,
      lastAccessedDate: enrollmentDTO.lastAccessedDate
        ? formatEnrollmentDate(enrollmentDTO.lastAccessedDate)
        : null,
      email: extractEmailFromName(enrollmentDTO.studentName),
      initials: getInitials(enrollmentDTO.studentName)
    };
  };
  
  /**
   * Format enrollment date to readable string
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date (e.g., "Jan 15, 2023")
   */
  export const formatEnrollmentDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  /**
   * Get CSS class based on enrollment status
   * @param {string} status - Enrollment status from backend
   * @returns {string} CSS class name
   */
  export const getEnrollmentStatusClass = (status) => {
    if (!status) return "inactive";
    
    const statusLower = status.toLowerCase();
    
    if (statusLower === "approved" || statusLower === "in_progress" || statusLower === "active") {
      return "active";
    }
    if (statusLower === "completed") {
      return "completed";
    }
    
    return "inactive"; // PENDING, REJECTED, CANCELLED, EXPIRED
  };
  
  /**
   * Get user-friendly enrollment status label
   * @param {string} status - Enrollment status from backend
   * @returns {string} User-friendly status label
   */
  export const getEnrollmentStatusLabel = (status) => {
    if (!status) return "Inactive";
    
    const statusMap = {
      PENDING: "Pending",
      APPROVED: "Active",
      REJECTED: "Rejected",
      IN_PROGRESS: "Active",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      EXPIRED: "Expired"
    };
    
    return statusMap[status] || "Inactive";
  };
  
  /**
   * Extract email from name (for mock data)
   * @param {string} name - Full name
   * @returns {string} Generated email
   */
  const extractEmailFromName = (name) => {
    if (!name) return "";
    
    const nameParts = name.split(" ");
    
    // If we have at least a first and last name
    if (nameParts.length >= 2) {
      const firstName = nameParts[0].toLowerCase();
      const lastName = nameParts[nameParts.length - 1].toLowerCase();
      
      return `${firstName}.${lastName.charAt(0)}@example.edu`;
    }
    
    return `${name.toLowerCase().replace(/\s/g, ".")}@example.edu`;
  };
  
  /**
   * Get initials from name
   * @param {string} name - Full name
   * @returns {string} Initials (e.g., "JD" for "John Doe")
   */
  const getInitials = (name) => {
    if (!name) return "";
    
    const nameParts = name.split(" ");
    
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    
    return name.charAt(0).toUpperCase();
  };