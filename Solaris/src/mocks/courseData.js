const courseData = {
  id: 1,
  title: "Advanced Web Technologies",
  code: "AWT101",
  description: "This course covers advanced topics in web development, including modern frameworks, APIs, and best practices.",
  instructor: {
    name: "Dr. Jane Doe",
    email: "jane.doe@example.com",
    avatar: null,
    title: "Senior Lecturer"
  },
  progress: 75,
  completionRequirements: [
    { type: "module", id: 1, completed: true },
    { type: "module", id: 2, completed: false }
  ]
};

export default courseData;