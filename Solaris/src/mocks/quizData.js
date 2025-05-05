const quizData = [
  {
    id: 1,
    title: "Programming Quiz 1",
    moduleId: 1,
    questions: [
      {
        id: 1,
        question: "What does the acronym 'API' stand for?",
        options: [
          "Application Programming Interface",
          "Automated Programming Installation",
          "Advanced Programming Integration",
          "Application Process Integration"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Which of the following is NOT a programming language?",
        options: [
          "Java",
          "Python",
          "HTML",
          "Microsoft Word"
        ],
        correctAnswer: 3
      },
      {
        id: 3,
        question: "What is the correct value to return to exit a function in Python?",
        options: [
          "exit",
          "return",
          "break",
          "end"
        ],
        correctAnswer: 1
      }
    ],
    timeLimit: 10,
    passingScore: 70,
    attempts: {
      allowed: 2,
      completed: 0
    },
    dueDate: "2025-05-20",
    status: "not-started", // not-started, in-progress, completed
    weight: 10 // Percentage of final grade
  },
  {
    id: 2,
    title: "Data Structures Quiz",
    moduleId: 2,
    questions: [
      {
        id: 1,
        question: "Which data structure follows the LIFO (Last In First Out) principle?",
        options: [
          "Queue",
          "Stack",
          "Linked List",
          "Tree"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "What is the time complexity of binary search?",
        options: [
          "O(n)",
          "O(n²)",
          "O(log n)",
          "O(n log n)"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Which of these is NOT a linear data structure?",
        options: [
          "Array",
          "Linked List",
          "Queue",
          "Tree"
        ],
        correctAnswer: 3
      }
    ],
    timeLimit: 15,
    passingScore: 70,
    attempts: {
      allowed: 2,
      completed: 1
    },
    dueDate: "2025-05-27",
    status: "completed",
    weight: 15
  },
  {
    id: 3,
    title: "Final Exam",
    moduleId: null, // Not tied to a specific module
    questions: [
      {
        id: 1,
        question: "What is the time complexity of inserting an element at the beginning of an array?",
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n²)"
        ],
        correctAnswer: 2
      },
      {
        id: 2,
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: [
          "Bubble Sort",
          "Selection Sort",
          "Quick Sort",
          "Insertion Sort"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "What is the output of the following Python code?\n\nx = 5\ndef func():\n    x = 10\n    print(x)\nfunc()\nprint(x)",
        options: [
          "10, 10",
          "5, 5",
          "10, 5",
          "5, 10"
        ],
        correctAnswer: 2
      },
      {
        id: 4,
        question: "Which of these is used to prevent SQL injection attacks?",
        options: [
          "Concatenating strings directly",
          "Using parameterized queries",
          "Disabling database error messages",
          "Encrypting the database"
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "What design pattern is used when you want to create an object but let subclasses decide which class to instantiate?",
        options: [
          "Singleton",
          "Factory Method",
          "Observer",
          "Decorator"
        ],
        correctAnswer: 1
      }
    ],
    timeLimit: 45,
    passingScore: 75,
    attempts: {
      allowed: 1,
      completed: 0
    },
    dueDate: "2025-06-10",
    status: "not-started",
    weight: 40
  }
];

export default quizData;