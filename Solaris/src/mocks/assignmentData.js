const assignmentData = [
  {
    id: 1,
    title: "Programming Fundamentals Assignment",
    moduleId: 1,
    description: "Create a simple Python program that calculates student grades based on input scores.",
    instructions: "Write a program that takes input for multiple test scores and computes the average grade. The program should also determine the letter grade (A, B, C, D, F) based on standard grading scales.",
    dueDate: "2025-06-02T23:59:00Z",
    totalPoints: 100,
    status: "not-submitted", // not-submitted, submitted, graded
    submissionType: "file", // file, text, both
    allowedFileTypes: ".py, .txt",
    canResubmit: true,
    gradedDate: null,
    feedback: null,
    score: null
  },
  {
    id: 2,
    title: "Data Structures Implementation",
    moduleId: 2,
    description: "Implement a linked list data structure with basic operations.",
    instructions: "Create a LinkedList class that supports the following operations: append, insert, delete, and search. Include a detailed README explaining your implementation and time complexity analysis.",
    dueDate: "2025-06-15T23:59:00Z",
    totalPoints: 100,
    status: "submitted", // Example of a submitted assignment
    submissionType: "file",
    allowedFileTypes: ".py, .java, .js, .txt",
    submissionDate: "2025-06-10T14:32:00Z",
    canResubmit: false,
    gradedDate: null,
    feedback: null,
    score: null
  },
  {
    id: 3,
    title: "Algorithm Analysis Report",
    moduleId: 3,
    description: "Compare and analyze sorting algorithms performance.",
    instructions: "Implement three different sorting algorithms (your choice) and compare their performance across different input sizes. Create a report with graphs showing the time complexity differences.",
    dueDate: "2025-06-30T23:59:00Z",
    totalPoints: 100,
    status: "graded", // Example of a graded assignment
    submissionType: "both",
    allowedFileTypes: ".pdf, .docx",
    submissionDate: "2025-06-25T09:15:00Z",
    canResubmit: false,
    gradedDate: "2025-06-28T16:45:00Z",
    feedback: "Excellent analysis. Your graphs clearly illustrate the performance differences. Consider adding more discussion on space complexity for future work.",
    score: 95
  }
];

export default assignmentData;