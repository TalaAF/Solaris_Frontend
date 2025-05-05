const assignmentData = [
  {
    id: 1,
    title: "Python Programming Assignment",
    moduleId: 1,
    description: "Create a simple Python program that demonstrates variables, control structures, and functions.",
    instructions: "Write a Python program that calculates the fibonacci sequence up to n terms. Your program should use functions, handle input validation, and include comments explaining your code.",
    dueDate: "2025-05-18",
    submissionStatus: "not-submitted", // not-submitted, in-progress, submitted, graded
    weight: 15, // Percentage of final grade
    maxPoints: 100,
    gradingRubric: [
      { criteria: "Code functionality", points: 40 },
      { criteria: "Code organization and style", points: 30 },
      { criteria: "Documentation and comments", points: 20 },
      { criteria: "Input validation", points: 10 }
    ],
    attachments: [
      {
        name: "assignment_guidelines.pdf",
        url: "#",
        size: "245 KB"
      }
    ],
    submittedDate: null,
    feedback: null,
    grade: null
  },
  {
    id: 2,
    title: "Data Structures Implementation",
    moduleId: 2,
    description: "Implement a stack and queue using linked lists in Python.",
    instructions: "Your implementation should include methods for all standard operations (insert, delete, etc.) and should handle edge cases such as underflow and overflow. Include unit tests to verify the functionality of your data structures.",
    dueDate: "2025-06-01",
    submissionStatus: "submitted", // not-submitted, in-progress, submitted, graded
    weight: 25, // Percentage of final grade
    maxPoints: 100,
    gradingRubric: [
      { criteria: "Code functionality", points: 50 },
      { criteria: "Code organization and style", points: 20 },
      { criteria: "Documentation and comments", points: 20 },
      { criteria: "Edge case handling", points: 10 }
    ],
    attachments: [
      {
        name: "data_structures_guidelines.pdf",
        url: "#",
        size: "300 KB"
      }
    ],
    submittedDate: "2025-05-30",
    feedback: "Well done, but see comments on edge case handling.",
    grade: 85
  },
  {
    id: 3,
    title: "Database Design Project",
    moduleId: 3,
    description: "Design and implement a database for a given scenario using MySQL.",
    instructions: "Create an ER diagram, convert it to a relational schema, and populate the database with sample data. Write queries to demonstrate the functionality of your database design.",
    dueDate: "2025-06-15",
    submissionStatus: "in-progress", // not-submitted, in-progress, submitted, graded
    weight: 30, // Percentage of final grade
    maxPoints: 100,
    gradingRubric: [
      { criteria: "ER diagram accuracy", points: 25 },
      { criteria: "Relational schema design", points: 25 },
      { criteria: "SQL query functionality", points: 25 },
      { criteria: "Documentation and comments", points: 25 }
    ],
    attachments: [
      {
        name: "database_design_scenario.pdf",
        url: "#",
        size: "150 KB"
      }
    ],
    submittedDate: null,
    feedback: null,
    grade: null
  }
];

export default assignmentData;