// Module types for courses
/**
 * @typedef {"video" | "reading" | "quiz" | "assignment"} ModuleItemType
 */

/**
 * @typedef {Object} ModuleItem
 * @property {string} id
 * @property {string} title
 * @property {ModuleItemType} type
 * @property {boolean} completed
 * @property {boolean} locked
 * @property {string} [duration]
 */

/**
 * @typedef {Object} Module
 * @property {string} id
 * @property {string} title
 * @property {boolean} completed
 * @property {ModuleItem[]} items
 */

// Schedule and events types
/**
 * @typedef {"meeting" | "lecture" | "lab" | "seminar"} ScheduleItemType
 */

/**
 * @typedef {Object} ScheduleItem
 * @property {string} id
 * @property {string} title
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} location
 * @property {ScheduleItemType} type
 */

/**
 * @typedef {"assignment" | "quiz" | "class" | "meeting"} UpcomingEventType
 */

/**
 * @typedef {Object} UpcomingEvent
 * @property {string} id
 * @property {string} title
 * @property {UpcomingEventType} type
 * @property {Date} due
 * @property {string} course
 */

// Practice test types
/**
 * @typedef {Object} PracticeTest
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} questions
 * @property {number} timeLimit
 * @property {"Basic" | "Moderate" | "Advanced"} difficulty
 * @property {string[]} categories
 */

/**
 * @typedef {Object} PracticeQuestionOption
 * @property {string} id
 * @property {string} text
 */

/**
 * @typedef {Object} PracticeQuestion
 * @property {string} id
 * @property {string} text
 * @property {PracticeQuestionOption[]} options
 * @property {string} correctOptionId
 * @property {string} [explanation]
 * @property {string} category
 * @property {"Basic" | "Moderate" | "Advanced"} difficulty
 */

// Welcome card types
/**
 * @typedef {Object} UserData
 * @property {string} name
 * @property {string} image
 */

// Quick access link types
/**
 * @typedef {Object} QuickAccessLink
 * @property {string} title
 * @property {string} description
 * @property {string} icon
 * @property {string} color
 * @property {string} link
 */

export const DifficultyLevels = {
  BASIC: "Basic",
  MODERATE: "Moderate",
  ADVANCED: "Advanced",
};
