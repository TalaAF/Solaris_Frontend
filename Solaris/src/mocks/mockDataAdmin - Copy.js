// Dashboard Stats
export const dashboardStats = {
    totalUsers: 1250,
    activeUsers: 1050,
    usersByRole: {
      ADMIN: 15,
      INSTRUCTOR: 85,
      STUDENT: 1150
    },
    totalCourses: 75,
    totalDepartments: 8,
    newUsersThisMonth: 42,
    courseEnrollments: {
      total: 8750,
      completedCourses: 6500,
      inProgress: 1850,
      notStarted: 400
    }
  };
  
  // Recent Activity
  export const recentActivity = [
    {
      id: 1,
      activityType: "USER_CREATED",
      description: "New instructor account created",
      user: "Jane Smith",
      timestamp: "2025-05-04T15:30:00Z"
    },
    {
      id: 2,
      activityType: "COURSE_PUBLISHED",
      description: "New course published: Advanced Machine Learning",
      user: "Dr. Michael Chen",
      timestamp: "2025-05-04T14:45:00Z"
    },
    {
      id: 3,
      activityType: "USER_ENROLLED",
      description: "15 students enrolled in Introduction to Programming",
      user: "System",
      timestamp: "2025-05-04T12:20:00Z"
    },
    {
      id: 4,
      activityType: "CERTIFICATE_ISSUED",
      description: "10 certificates issued for Web Development Fundamentals",
      user: "System",
      timestamp: "2025-05-04T10:15:00Z"
    },
    {
      id: 5,
      activityType: "CONTENT_UPLOADED",
      description: "New lecture materials uploaded to Database Systems",
      user: "Prof. Sarah Johnson",
      timestamp: "2025-05-03T16:40:00Z"
    }
  ];
  
  // User Data
  export const users = [
    {
      id: 123,
      email: "john.smith@example.com",
      fullName: "John Smith",
      departmentId: 5,
      departmentName: "Computer Science",
      roleNames: ["STUDENT"],
      profilePicture: "https://github.com/shadcn.png",
      isActive: true,
      createdAt: "2023-09-15T08:30:00Z",
      updatedAt: "2023-09-15T08:30:00Z"
    },
    {
      id: 124,
      email: "sarah.johnson@example.com",
      fullName: "Sarah Johnson",
      departmentId: 5,
      departmentName: "Computer Science",
      roleNames: ["INSTRUCTOR"],
      profilePicture: "https://github.com/shadcn.png",
      isActive: true,
      createdAt: "2023-08-10T11:20:00Z",
      updatedAt: "2023-09-12T14:15:00Z"
    },
    {
      id: 125,
      email: "michael.chen@example.com",
      fullName: "Michael Chen",
      departmentId: 2,
      departmentName: "Mathematics",
      roleNames: ["INSTRUCTOR"],
      profilePicture: "https://github.com/shadcn.png",
      isActive: true,
      createdAt: "2023-07-05T09:45:00Z",
      updatedAt: "2023-09-01T16:30:00Z"
    },
    {
      id: 126,
      email: "emily.davis@example.com",
      fullName: "Emily Davis",
      departmentId: 3,
      departmentName: "Physics",
      roleNames: ["STUDENT"],
      profilePicture: "https://github.com/shadcn.png",
      isActive: false,
      createdAt: "2023-09-02T13:10:00Z",
      updatedAt: "2023-09-10T10:25:00Z"
    },
    {
      id: 127,
      email: "admin@example.com",
      fullName: "Admin User",
      departmentId: 1,
      departmentName: "Administration",
      roleNames: ["ADMIN"],
      profilePicture: "https://github.com/shadcn.png",
      isActive: true,
      createdAt: "2023-06-15T08:00:00Z",
      updatedAt: "2023-08-20T11:45:00Z"
    },
    {
      id: 1,
      email: "admin@solaris.edu",
      fullName: "Admin User",
      departmentId: 1,
      departmentName: "Administration",
      roleNames: ["ADMIN"],
      profilePicture: "https://github.com/shadcn.png",
      isActive: true,
      createdAt: "2025-01-01T10:30:00Z",
      updatedAt: "2025-01-01T10:30:00Z"
    },
    {
      id: 2,
      email: "professor@solaris.edu",
      fullName: "Jane Smith",
      departmentId: 2,
      departmentName: "Mathematics",
      roleNames: ["INSTRUCTOR"],
      profilePicture: "https://github.com/shadcn.png",
      isActive: true,
      createdAt: "2025-01-15T09:45:00Z",
      updatedAt: "2025-01-15T09:45:00Z"
    },
    {
      id: 3,
      email: "student@solaris.edu",
      fullName: "Alex Johnson",
      departmentId: 5,
      departmentName: "Computer Science",
      roleNames: ["STUDENT"],
      profilePicture: "https://github.com/shadcn.png",
      isActive: true,
      createdAt: "2025-02-01T14:20:00Z",
      updatedAt: "2025-02-01T14:20:00Z"
    },
    {
      id: 4,
      email: "instructor@solaris.edu", 
      fullName: "Michael Chen",
      departmentId: 3,
      departmentName: "Physics",
      roleNames: ["INSTRUCTOR"],
      profilePicture: "https://github.com/shadcn.png",
      isActive: true,
      createdAt: "2025-02-10T11:15:00Z",
      updatedAt: "2025-02-10T11:15:00Z"
    },
    {
      id: 5,
      email: "student2@solaris.edu",
      fullName: "Sarah Williams",
      departmentId: 5,
      departmentName: "Computer Science",
      roleNames: ["STUDENT"],
      profilePicture: "",
      isActive: false,
      createdAt: "2025-03-05T16:30:00Z",
      updatedAt: "2025-04-10T09:15:00Z"
    }
  ];
  
  // Course Data
  export const courses = [
    {
      id: 101,
      title: "Introduction to Computer Science",
      description: "Foundational course covering algorithms and data structures",
      instructorEmail: "sarah.johnson@example.com",
      instructorName: "Sarah Johnson",
      departmentId: 5, 
      departmentName: "Computer Science",
      maxCapacity: 100,
      enrolledStudents: 76,
      isActive: true,
      startDate: "2023-09-01T00:00:00Z",
      endDate: "2023-12-15T00:00:00Z",
      prerequisiteCourseIds: []
    },
    {
      id: 102,
      title: "Advanced Programming Techniques",
      description: "Advanced topics in software development and programming patterns",
      instructorEmail: "michael.chen@example.com",
      instructorName: "Michael Chen",
      departmentId: 5, 
      departmentName: "Computer Science",
      maxCapacity: 50,
      enrolledStudents: 32,
      isActive: true,
      startDate: "2023-09-01T00:00:00Z",
      endDate: "2023-12-15T00:00:00Z",
      prerequisiteCourseIds: [101]
    },
    {
      id: 103,
      title: "Database Systems",
      description: "Comprehensive coverage of database design and implementation",
      instructorEmail: "sarah.johnson@example.com",
      instructorName: "Sarah Johnson",
      departmentId: 5, 
      departmentName: "Computer Science",
      maxCapacity: 60,
      enrolledStudents: 45,
      isActive: true,
      startDate: "2023-09-01T00:00:00Z",
      endDate: "2023-12-15T00:00:00Z",
      prerequisiteCourseIds: [101]
    }
  ];
  
  // Department Data
  export const departments = [
    {
      id: 1,
      name: "Administration",
      code: "ADM",
      description: "Central administrative department for the university",
      specialtyArea: "University Administration",
      headOfDepartment: "Dr. Sarah Johnson",
      contactInformation: "admin@solaris.edu",
      isActive: true,
      userCount: 12
    },
    {
      id: 2,
      name: "Mathematics",
      code: "MATH",
      description: "Department of Mathematics and Statistical Sciences",
      specialtyArea: "Pure and Applied Mathematics",
      headOfDepartment: "Dr. Richard Brown",
      contactInformation: "math@solaris.edu",
      isActive: true,
      userCount: 28
    },
    {
      id: 3,
      name: "Physics",
      code: "PHYS",
      description: "Department of Physics and Astronomy",
      specialtyArea: "Theoretical Physics and Astrophysics",
      headOfDepartment: "Dr. Michael Chen",
      contactInformation: "physics@solaris.edu",
      isActive: true,
      userCount: 23
    },
    {
      id: 4,
      name: "Biology",
      code: "BIO",
      description: "Department of Biological Sciences",
      specialtyArea: "Molecular Biology and Genetics",
      headOfDepartment: "Dr. Emily Davis",
      contactInformation: "biology@solaris.edu",
      isActive: true,
      userCount: 31
    },
    {
      id: 5,
      name: "Computer Science",
      code: "CS",
      description: "Department of Computer Science and Engineering",
      specialtyArea: "Artificial Intelligence and Machine Learning",
      headOfDepartment: "Dr. James Wilson",
      contactInformation: "cs@solaris.edu",
      isActive: true,
      userCount: 45
    },
    {
      id: 6,
      name: "Chemistry",
      code: "CHEM",
      description: "Department of Chemistry and Biochemistry",
      specialtyArea: "Organic Chemistry and Biochemistry",
      headOfDepartment: "Dr. Sophia Martinez",
      contactInformation: "chemistry@solaris.edu",
      isActive: false,
      userCount: 19
    },
    {
      id: 7,
      name: "Literature",
      code: "LIT",
      description: "Department of Literature and Creative Writing",
      specialtyArea: "Comparative Literature and Poetry",
      headOfDepartment: "Dr. Thomas Lee",
      contactInformation: "literature@solaris.edu",
      isActive: true,
      userCount: 17
    },
    {
      id: 8,
      name: "History",
      code: "HIST",
      description: "Department of Historical Studies",
      specialtyArea: "World History and Archaeological Studies",
      headOfDepartment: "Dr. Jennifer Adams",
      contactInformation: "history@solaris.edu",
      isActive: true,
      userCount: 22
    }
  ];
  
  // Content Data
  export const contents = [
    {
      id: 501,
      title: "Introduction to Algorithms",
      description: "Fundamental algorithm concepts and implementations",
      filePath: "/content/algorithms-intro.pdf",
      fileType: "application/pdf",
      fileSize: 2457600,
      createdAt: "2023-08-10T15:20:00Z",
      updatedAt: "2023-08-10T15:20:00Z",
      courseId: 101,
      courseName: "Introduction to Computer Science",
      moduleId: 25,
      moduleName: "Week 1: Fundamentals",
      orderInModule: 2,
      tags: ["algorithms", "fundamentals", "beginner"]
    },
    {
      id: 502,
      title: "Data Structures Overview",
      description: "Introduction to common data structures and their applications",
      filePath: "/content/data-structures.pdf",
      fileType: "application/pdf",
      fileSize: 3210000,
      createdAt: "2023-08-12T10:15:00Z",
      updatedAt: "2023-08-12T10:15:00Z",
      courseId: 101,
      courseName: "Introduction to Computer Science",
      moduleId: 26,
      moduleName: "Week 2: Data Structures",
      orderInModule: 1,
      tags: ["data structures", "fundamentals", "beginner"]
    },
    {
      id: 503,
      title: "Database Design Principles",
      description: "Core concepts in relational database design",
      filePath: "/content/database-design.pptx",
      fileType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      fileSize: 5240000,
      createdAt: "2023-08-20T14:30:00Z",
      updatedAt: "2023-08-20T14:30:00Z",
      courseId: 103,
      courseName: "Database Systems",
      moduleId: 30,
      moduleName: "Week 1: Database Fundamentals",
      orderInModule: 3,
      tags: ["database", "design", "relational"]
    }
  ];
  
  // Quiz Data
  export const quizzes = [
    {
      id: 301,
      title: "Midterm Exam",
      description: "Comprehensive assessment of first half material",
      timeLimit: 120,
      startDate: "2023-10-15T09:00:00Z",
      endDate: "2023-10-15T12:00:00Z",
      passingScore: 70.0,
      randomizeQuestions: true,
      published: true,
      courseId: 101,
      courseName: "Introduction to Computer Science",
      questionCount: 25,
      totalPossibleScore: 100
    },
    {
      id: 302,
      title: "Database Concepts Quiz",
      description: "Assessment of basic database concepts",
      timeLimit: 45,
      startDate: "2023-09-20T10:00:00Z",
      endDate: "2023-09-20T11:00:00Z",
      passingScore: 65.0,
      randomizeQuestions: false,
      published: true,
      courseId: 103,
      courseName: "Database Systems",
      questionCount: 15,
      totalPossibleScore: 60
    }
  ];
  
  // Role Data
  export const roles = [
    {
      id: 1,
      name: "ADMIN",
      description: "System administrators with full access",
      permissions: [
        {id: 1, name: "admin:full", description: "Full administrative access"},
        {id: 2, name: "user:create", description: "Can create users"},
        {id: 3, name: "user:read", description: "Can view user information"},
        {id: 4, name: "user:update", description: "Can update users"},
        {id: 5, name: "course:create", description: "Can create courses"},
        {id: 6, name: "course:read", description: "Can view course information"},
        {id: 7, name: "course:update", description: "Can update courses"}
      ]
    },
    {
      id: 2,
      name: "INSTRUCTOR",
      description: "Faculty members who teach courses",
      permissions: [
        {id: 6, name: "course:read", description: "Can view course information"},
        {id: 7, name: "course:update", description: "Can update courses"},
        {id: 8, name: "content:create", description: "Can create content"},
        {id: 9, name: "content:read", description: "Can view content"},
        {id: 10, name: "content:update", description: "Can update content"},
        {id: 11, name: "assessment:create", description: "Can create assessments"},
        {id: 12, name: "assessment:read", description: "Can view assessments"},
        {id: 13, name: "assessment:update", description: "Can update assessments"}
      ]
    },
    {
      id: 3,
      name: "STUDENT",
      description: "Learners enrolled in courses",
      permissions: [
        {id: 14, name: "course:enroll", description: "Can enroll in courses"},
        {id: 15, name: "content:read", description: "Can view content"},
        {id: 16, name: "assessment:submit", description: "Can submit assessments"}
      ]
    },
    { id: 1, name: "ADMIN" },
    { id: 2, name: "INSTRUCTOR" },
    { id: 3, name: "STUDENT" }
  ];
  
  // Certificate Data
  export const certificates = [
    {
      studentId: 123,
      studentName: "John Smith",
      courseId: 101,
      certificateUrl: "https://example.com/certificates/abc123",
      issuedAt: "2023-12-15T10:30:00Z",
      courseName: "Introduction to Computer Science",
      achievementDetails: "Completed with distinction",
      grade: 95,
      issuerName: "University of Technology",
      issuerSignature: "Dr. Sarah Johnson",
      isRevoked: false,
      revocationReason: null,
      linkedInSharingUrl: "https://linkedin.com/sharing/certificate/abc123"
    },
    {
      studentId: 126,
      studentName: "Emily Davis",
      courseId: 101,
      certificateUrl: "https://example.com/certificates/def456",
      issuedAt: "2023-12-14T14:45:00Z",
      courseName: "Introduction to Computer Science",
      achievementDetails: "Successfully completed",
      grade: 82,
      issuerName: "University of Technology",
      issuerSignature: "Dr. Sarah Johnson",
      isRevoked: false,
      revocationReason: null,
      linkedInSharingUrl: "https://linkedin.com/sharing/certificate/def456"
    }
  ];
  
  // Add assessment mock data
  export const assessments = [
    {
      id: 1,
      title: "Midterm Exam",
      description: "Comprehensive midterm exam covering all topics from weeks 1-6.",
      type: "exam",
      courseId: 1,
      courseName: "Introduction to Computer Science",
      dueDate: "2025-06-15",
      totalPoints: 100,
      passingPoints: 60,
      isPublished: true,
      duration: 120,
    },
    {
      id: 2,
      title: "Weekly Quiz 3",
      description: "Short quiz covering material from week 3 lectures.",
      type: "quiz" ,
      courseId: 1,
      courseName: "Introduction to Computer Science",
      dueDate: "2025-05-20",
      totalPoints: 20,
      passingPoints: 12,
      isPublished: true,
      duration: 30,
    },
    {
      id: 3,
      title: "Research Paper",
      description: "Research paper on a topic of your choice related to machine learning algorithms.",
      type: "assignment" ,
      courseId: 2,
      courseName: "Machine Learning Fundamentals",
      dueDate: "2025-07-10",
      totalPoints: 50,
      passingPoints: 30,
      isPublished: false,
      duration: 0,
    },
    {
      id: 4,
      title: "Database Design Project",
      description: "Design and implement a database schema for a real-world scenario.",
      type: "assignment" ,
      courseId: 3,
      courseName: "Database Systems",
      dueDate: "2025-06-30",
      totalPoints: 100,
      passingPoints: 70,
      isPublished: true,
      duration: 0,
    },
    {
      id: 5,
      title: "Final Exam",
      description: "Comprehensive final exam covering all course material.",
      type: "exam",
      courseId: 2,
      courseName: "Machine Learning Fundamentals",
      dueDate: "2025-08-05",
      totalPoints: 150,
      passingPoints: 90,
      isPublished: false,
      duration: 180,
    }
  ];
  
  // Content data
export const content = [
  {
    id: 1,
    title: "Introduction to Web Development",
    type: "lesson",
    courseId: 1,
    courseName: "Advanced Web Development",
    createdBy: "Dr. John Smith",
    createdAt: "2025-03-10T10:00:00Z",
    isPublished: true,
    duration: 45 // minutes
  },
  {
    id: 2,
    title: "HTML5 Fundamentals",
    type: "video",
    courseId: 1,
    courseName: "Advanced Web Development",
    createdBy: "Dr. John Smith",
    createdAt: "2025-03-12T15:30:00Z",
    isPublished: true,
    duration: 30
  },
  {
    id: 3,
    title: "CSS Styling Techniques",
    type: "document",
    courseId: 1,
    courseName: "Advanced Web Development",
    createdBy: "Dr. Sarah Johnson",
    createdAt: "2025-03-15T08:45:00Z",
    isPublished: false,
    duration: 60
  },
  {
    id: 4,
    title: "JavaScript Basics",
    type: "presentation",
    courseId: 1,
    courseName: "Advanced Web Development",
    createdBy: "Dr. John Smith",
    createdAt: "2025-03-18T14:15:00Z",
    isPublished: true,
    duration: 50
  },
  {
    id: 5,
    title: "Introduction to Human Anatomy",
    type: "lesson",
    courseId: 2,
    courseName: "Human Anatomy",
    createdBy: "Dr. Michael Chen",
    createdAt: "2025-02-05T09:20:00Z",
    isPublished: true,
    duration: 60
  },
  {
    id: 6,
    title: "Skeletal System Overview",
    type: "video",
    courseId: 2,
    courseName: "Human Anatomy",
    createdBy: "Dr. Michael Chen",
    createdAt: "2025-02-08T11:30:00Z",
    isPublished: true,
    duration: 45
  },
  {
    id: 7,
    title: "Cardiovascular System",
    type: "document",
    courseId: 2,
    courseName: "Human Anatomy",
    createdBy: "Dr. Emily Davis",
    createdAt: "2025-02-12T16:45:00Z",
    isPublished: false,
    duration: 75
  },
  {
    id: 8,
    title: "Introduction to Pharmacology",
    type: "lesson",
    courseId: 3,
    courseName: "Clinical Pharmacology",
    createdBy: "Dr. Emily Davis",
    createdAt: "2025-01-15T10:00:00Z",
    isPublished: true,
    duration: 55
  }
];


// Add this to your mockDataAdmin.js file

// Certificate Templates
export const certificateTemplates = [
  {
    id: 1,
    name: "Web Development Certification",
    description: "Certificate for completing the Advanced Web Development course",
    courseId: 1,
    courseName: "Advanced Web Development",
    departmentId: 5,
    departmentName: "Computer Science",
    template: "Standard Certificate",
    issuedCount: 32,
    dateCreated: "2024-04-12T10:00:00Z",
    lastModified: "2024-04-15T14:30:00Z",
    isActive: true
  },
  {
    id: 2,
    name: "Data Science Excellence",
    description: "Certificate for outstanding achievement in Data Science course",
    courseId: 2,
    courseName: "Machine Learning Fundamentals",
    departmentId: 5,
    departmentName: "Computer Science",
    template: "Honors Certificate",
    issuedCount: 15,
    dateCreated: "2024-03-21T09:30:00Z",
    lastModified: "2024-04-02T11:45:00Z",
    isActive: true
  },
  {
    id: 3,
    name: "Physics Foundations",
    description: "Certificate for completing the Physics Foundations course",
    courseId: 3,
    courseName: "Database Systems",
    departmentId: 3,
    departmentName: "Physics",
    template: "Completion Certificate",
    issuedCount: 45,
    dateCreated: "2024-02-15T13:20:00Z",
    lastModified: "2024-02-15T13:20:00Z",
    isActive: false
  }
];

// Make sure to export this in your default export
// Add this to the default export at the bottom of the file
export default {
  // ... other exports
  certificates,
  certificateTemplates,
  content,
  assessments
};