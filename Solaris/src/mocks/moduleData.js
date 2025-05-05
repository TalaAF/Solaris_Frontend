const moduleData = [
  {
    id: 1,
    title: "Introduction to Programming",
    description: "Learn the basics of programming using Python.", // Ensure this is always defined
    sequence: 1,
    items: [
      {
        id: 1,
        title: "What is Programming?",
        type: "document",
        status: "completed",
        duration: "10 min"
      },
      {
        id: 2,
        title: "Python Basics",
        type: "video",
        status: "in-progress",
        duration: "15 min"
      },
      {
        id: 3,
        title: "Programming Quiz 1",
        type: "quiz",
        status: "not-started",
        duration: "10 min"
      }
    ]
  },
  {
    id: 2,
    title: "Data Structures",
    description: "Explore different data structures and their applications.", // Ensure this is always defined
    sequence: 2,
    items: [
      {
        id: 4,
        title: "Arrays and Lists",
        type: "document",
        status: "not-started",
        duration: "12 min"
      },
      {
        id: 5,
        title: "Stacks and Queues",
        type: "video",
        status: "not-started",
        duration: "20 min"
      },
      {
        id: 6,
        title: "Data Structures Quiz",
        type: "quiz",
        status: "not-started",
        duration: "15 min"
      }
    ]
  },
  {
    id: 3,
    title: "Algorithms",
    description: "Understand the fundamentals of algorithms.", // Ensure this is always defined
    sequence: 3,
    items: [
      {
        id: 7,
        title: "Sorting Algorithms",
        type: "document",
        status: "not-started",
        duration: "18 min"
      },
      {
        id: 8,
        title: "Searching Algorithms",
        type: "video",
        status: "not-started",
        duration: "22 min"
      },
      {
        id: 9,
        title: "Algorithms Quiz",
        type: "quiz",
        status: "not-started",
        duration: "15 min"
      }
    ]
  }
];

export default moduleData;