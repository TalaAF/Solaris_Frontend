const contentData = [
  {
    id: 1,
    title: "What is Programming?",
    type: "document",
    content: `# Introduction to Programming\n\nProgramming is the process of...`,
    duration: "10 min",
    description: "Learn the basics of programming concepts and terminology."
  },
  {
    id: 2,
    title: "JavaScript Basics Quiz",
    type: "quiz",
    status: "not-started",
    duration: 10,
    fileSize: null,
    questions: [
      {
        question: "What is the correct syntax for referring to an external script called 'script.js'?",
        options: [
          "<script src='script.js'>",
          "<script href='script.js'>",
          "<script name='script.js'>",
          "<script file='script.js'>"
        ],
        correctAnswer: "<script src='script.js'>"
      },
      {
        question: "Which of the following is a JavaScript data type?",
        options: [
          "String",
          "Number",
          "Boolean",
          "All of the above"
        ],
        correctAnswer: "All of the above"
      }
    ]
  },
  {
    id: 3,
    title: "JavaScript Functions",
    type: "document",
    status: "in-progress",
    duration: 20,
    fileSize: 102400, // 100 KB
  },
  {
    id: 4,
    title: "JavaScript Assignment 1",
    type: "assignment",
    status: "not-started",
    duration: null,
    fileSize: null,
    description: "Create a simple JavaScript function that returns the sum of two numbers.",
    dueDate: "2025-03-01",
    submissionStatus: "not-submitted"
  }
];

export default contentData;