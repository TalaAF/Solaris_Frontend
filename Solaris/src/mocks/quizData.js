const quizData = [
  {
    id: 1,
    title: "Programming Quiz 1",
    moduleId: 1,
    description: "Test your understanding of basic programming concepts.",
    timeLimit: 15, // minutes
    totalPoints: 30,
    passingScore: 70, // percentage
    attempts: {
      max: 2,
      used: 0,
      remaining: 2
    },
    status: "not-started", // not-started, in-progress, completed
    dueDate: "2025-06-05T23:59:00Z",
    questions: [
      {
        id: 1,
        question: "What does the 'print()' function do in Python?",
        type: "multiple-choice",
        points: 3,
        options: [
          "Prints the result to the console",
          "Sends content to a printer",
          "Creates a printed copy of a variable",
          "Formats a string for output"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Which of these is NOT a valid variable name in most programming languages?",
        type: "multiple-choice",
        points: 3,
        options: [
          "my_variable",
          "_variable",
          "variable1",
          "1variable"
        ],
        correctAnswer: 3
      },
      {
        id: 3,
        question: "What is the purpose of comments in code?",
        type: "multiple-choice",
        points: 3,
        options: [
          "To make the code run faster",
          "To explain the code to other developers",
          "To create documentation that appears in the user interface",
          "To hide code from certain users"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 2,
    title: "Data Structures Quiz",
    moduleId: 2,
    description: "Test your knowledge on basic data structures.",
    timeLimit: 20,
    totalPoints: 40,
    passingScore: 75,
    attempts: {
      max: 2,
      used: 1,
      remaining: 1
    },
    status: "completed", // Example of a completed quiz
    dueDate: "2025-06-20T23:59:00Z",
    completedDate: "2025-06-18T15:30:00Z",
    score: 85,
    questions: [
      {
        id: 4,
        question: "Which data structure operates on a LIFO principle?",
        type: "multiple-choice",
        points: 4,
        options: [
          "Queue",
          "Stack",
          "Linked List",
          "Array"
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "What is the time complexity of accessing an element in an array by index?",
        type: "multiple-choice",
        points: 4,
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n²)"
        ],
        correctAnswer: 0
      },
      {
        id: 6,
        question: "Which data structure is best for implementing a priority queue?",
        type: "multiple-choice",
        points: 4,
        options: [
          "Array",
          "Stack",
          "Queue",
          "Heap"
        ],
        correctAnswer: 3
      }
    ]
  },
  {
    id: 3,
    title: "Algorithms Quiz",
    moduleId: 3,
    description: "Test your understanding of fundamental algorithms.",
    timeLimit: 25,
    totalPoints: 50,
    passingScore: 80,
    attempts: {
      max: 2,
      used: 0,
      remaining: 2
    },
    status: "not-started",
    dueDate: "2025-07-10T23:59:00Z",
    questions: [
      {
        id: 7,
        question: "What is the time complexity of binary search?",
        type: "multiple-choice",
        points: 5,
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n²)"
        ],
        correctAnswer: 1
      },
      {
        id: 8,
        question: "Which sorting algorithm is generally the fastest for large datasets?",
        type: "multiple-choice",
        points: 5,
        options: [
          "Bubble Sort",
          "Insertion Sort",
          "Merge Sort",
          "Quick Sort"
        ],
        correctAnswer: 3
      },
      {
        id: 9,
        question: "What algorithm is used to find the shortest path in a weighted graph?",
        type: "multiple-choice",
        points: 5,
        options: [
          "Breadth-First Search",
          "Depth-First Search",
          "Dijkstra's Algorithm",
          "Bubble Sort"
        ],
        correctAnswer: 2
      }
    ]
  }
];

export default quizData;