const QuestionType = {
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  MULTIPLE_ANSWER: "MULTIPLE_ANSWER",
  TRUE_FALSE: "TRUE_FALSE",
  SHORT_ANSWER: "SHORT_ANSWER",
  ESSAY: "ESSAY"
};

const quizData = [
  {
    id: 1,
    title: "Programming Quiz 1",
    moduleId: 1,
    description: "Test your understanding of basic programming concepts.",
    timeLimit: 15, // minutes
    totalPoints: 40,
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
        type: QuestionType.MULTIPLE_CHOICE,
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
        question: "Which of these are valid variable names in Python? (Select all that apply)",
        type: QuestionType.MULTIPLE_ANSWER,
        points: 4,
        options: [
          "my_variable",
          "_variable",
          "1variable",
          "class",
          "variable1"
        ],
        correctAnswers: [0, 1, 4]
      },
      {
        id: 3,
        question: "In Python, strings are mutable data types.",
        type: QuestionType.TRUE_FALSE,
        points: 3,
        correctAnswer: false
      },
      {
        id: 4,
        question: "What symbol is used for the modulo operator in most programming languages?",
        type: QuestionType.SHORT_ANSWER,
        points: 5,
        correctAnswer: "%",
        caseSensitive: false
      },
      {
        id: 5,
        question: "Explain the concept of inheritance in object-oriented programming and provide a simple example.",
        type: QuestionType.ESSAY,
        points: 10,
        rubric: [
          "Clearly defines inheritance - 3 points",
          "Explains the benefits of inheritance - 3 points",
          "Provides a relevant example - 4 points"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Data Structures Quiz",
    moduleId: 2,
    description: "Test your knowledge on basic data structures.",
    timeLimit: 20,
    totalPoints: 45,
    passingScore: 75,
    attempts: {
      max: 2,
      used: 1,
      remaining: 1
    },
    status: "completed",
    dueDate: "2025-06-20T23:59:00Z",
    completedDate: "2025-06-18T15:30:00Z",
    score: 85,
    questions: [
      {
        id: 6,
        question: "Which data structure operates on a LIFO principle?",
        type: QuestionType.MULTIPLE_CHOICE,
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
        id: 7,
        question: "Select all data structures that allow O(1) access to elements by index.",
        type: QuestionType.MULTIPLE_ANSWER,
        points: 5,
        options: [
          "Array",
          "Linked List",
          "ArrayList/Vector",
          "Hash Table",
          "Binary Search Tree"
        ],
        correctAnswers: [0, 2, 3]
      },
      {
        id: 8,
        question: "Hash tables require a hash function that produces unique outputs for every possible input.",
        type: QuestionType.TRUE_FALSE,
        points: 4,
        correctAnswer: false
      },
      {
        id: 9,
        question: "What is the time complexity of binary search?",
        type: QuestionType.SHORT_ANSWER,
        points: 6,
        correctAnswer: "O(log n)",
        acceptableAnswers: ["O(log n)", "O(logn)", "log n", "logn"]
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
        id: 10,
        question: "What is the time complexity of binary search?",
        type: QuestionType.MULTIPLE_CHOICE,
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
        id: 11,
        question: "Which sorting algorithm is generally the fastest for large datasets?",
        type: QuestionType.MULTIPLE_CHOICE,
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
        id: 12,
        question: "What algorithm is used to find the shortest path in a weighted graph?",
        type: QuestionType.MULTIPLE_CHOICE,
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

export { QuestionType };
export default quizData;