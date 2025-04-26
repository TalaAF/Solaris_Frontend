import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm SolariBot. How can I help you with your medical studies today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState({
    lastTopic: null,
    followUpMode: false,
    quizMode: false,
    quizQuestion: null,
    quizAnswer: null,
    suggestedTopics: []
  });
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userInput = inputValue.trim();
    
    // Add user message
    setMessages([...messages, { text: userInput, sender: 'user' }]);
    setInputValue('');
    
    // Show bot is typing
    setIsTyping(true);
    
    // Process the response with context
    setTimeout(() => {
      let botResponse = "";
      let newContext = {...context};
      
      // Check if we're in quiz mode
      if (context.quizMode) {
        // Process quiz answer
        const userAnswer = userInput.toLowerCase();
        const correctAnswer = context.quizAnswer.toLowerCase();
        
        if (userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)) {
          botResponse = "Correct! That's the right answer. Would you like another question?";
          // Continue quiz mode but reset the current question
          newContext = {...context, quizQuestion: null, quizAnswer: null};
        } else {
          botResponse = `Not quite. The correct answer is "${context.quizAnswer}". Let's try another question. Ready?`;
          // Continue quiz mode but reset the current question
          newContext = {...context, quizQuestion: null, quizAnswer: null};
        }
      }
      // Check if we're in follow-up mode for a specific topic
      else if (context.followUpMode && context.lastTopic) {
        botResponse = generateFollowUpResponse(userInput.toLowerCase(), context.lastTopic);
        
        // Decide whether to stay in follow-up mode or exit
        if (userInput.toLowerCase().includes('no') || userInput.toLowerCase().includes('thanks') || userInput.toLowerCase().includes('thank')) {
          newContext = {...context, followUpMode: false};
        }
      }
      // Normal response mode
      else {
        const { response, newContextData } = generateResponseWithContext(userInput.toLowerCase(), context);
        botResponse = response;
        newContext = {...context, ...newContextData};
      }
      
      setIsTyping(false);
      setContext(newContext);
      setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);
      
      // If in quiz mode and we need a new question, set up the next question
      if (newContext.quizMode && !newContext.quizQuestion) {
        setTimeout(() => {
          const { question, answer } = generateQuizQuestion(newContext.lastTopic || 'cardiovascular');
          setContext(prevContext => ({
            ...prevContext,
            quizQuestion: question,
            quizAnswer: answer
          }));
          setMessages(prevMessages => [...prevMessages, { text: question, sender: 'bot' }]);
        }, 1500);
      }
    }, 800 + Math.random() * 800); // Random delay between 0.8-1.6 seconds
  };

  // Generate a response with context awareness
  const generateResponseWithContext = (input, currentContext) => {
    let lastTopic = currentContext.lastTopic;
    let followUpMode = false;
    let quizMode = currentContext.quizMode;
    let suggestedTopics = [];
    let response = "";
    
    // Check for quiz requests
    if (input.includes('quiz') || input.includes('test me') || input.includes('question')) {
      quizMode = true;
      
      // Determine quiz topic
      if (input.includes('cardiovascular') || input.includes('heart')) {
        lastTopic = 'cardiovascular';
        response = "I'll quiz you on the cardiovascular system. Let's start:";
      } else if (input.includes('pathology')) {
        lastTopic = 'pathology';
        response = "Let's test your clinical pathology knowledge. Here's your first question:";
      } else if (input.includes('pharmacology') || input.includes('drug')) {
        lastTopic = 'pharmacology';
        response = "Time to quiz you on pharmacology. Ready for your first question?";
      } else if (input.includes('ethics')) {
        lastTopic = 'ethics';
        response = "Let's check your understanding of medical ethics. Here we go:";
      } else {
        lastTopic = 'cardiovascular';  // Default to cardiovascular as it's the upcoming quiz
        response = "Let's prepare for your upcoming Cardiovascular System Quiz. Here's your first question:";
      }
      
      return {
        response,
        newContextData: { lastTopic, followUpMode, quizMode, suggestedTopics }
      };
    }
    
    // Enhanced response generation function for medical students
    response = generateBaseResponse(input);
    
    // Set topic context based on the input and response
    if (input.includes('anatomy') || input.includes('cardiovascular') || input.includes('heart')) {
      lastTopic = 'cardiovascular';
      followUpMode = true;
      suggestedTopics = ['cardiac cycle', 'heart valves', 'blood pressure'];
    } else if (input.includes('pathology') || input.includes('lab')) {
      lastTopic = 'pathology';
      followUpMode = true;
      suggestedTopics = ['blood cells', 'lab techniques', 'histology'];
    } else if (input.includes('pharmacology') || input.includes('drug')) {
      lastTopic = 'pharmacology';
      followUpMode = true;
      suggestedTopics = ['drug interactions', 'beta blockers', 'ace inhibitors'];
    } else if (input.includes('ethics')) {
      lastTopic = 'ethics';
      followUpMode = true;
      suggestedTopics = ['informed consent', 'patient autonomy', 'case study'];
    } else if (input.includes('schedule') || input.includes('today')) {
      lastTopic = 'schedule';
      followUpMode = true;
      suggestedTopics = ['tomorrow', 'next week', 'specific class'];
    } else if (input.includes('deadline') || input.includes('assignment')) {
      lastTopic = 'deadlines';
      followUpMode = true;
      suggestedTopics = ['specific deadline', 'preparation tips', 'submission'];
    }
    
    return {
      response,
      newContextData: { lastTopic, followUpMode, quizMode, suggestedTopics }
    };
  };
  
  // Generate follow-up responses based on the last topic
  const generateFollowUpResponse = (input, topic) => {
    switch (topic) {
      case 'cardiovascular':
        if (input.includes('cardiac cycle')) {
          return "The cardiac cycle consists of systole (contraction) and diastole (relaxation). During systole, blood is ejected from the ventricles, while during diastole, the ventricles fill with blood. The cycle is controlled by electrical signals from the SA node, the heart's natural pacemaker. Would you like to know about pressure changes during the cycle?";
        } else if (input.includes('heart valve') || input.includes('valve')) {
          return "The heart has four valves: two atrioventricular (mitral and tricuspid) and two semilunar (aortic and pulmonary). They ensure one-way blood flow through the heart. The mitral valve has two cusps, while the others have three. Valve problems can lead to regurgitation or stenosis. Would you like to know more about a specific valve?";
        } else if (input.includes('blood pressure')) {
          return "Blood pressure is regulated through multiple mechanisms: baroreceptor reflexes (short-term), renin-angiotensin-aldosterone system (medium-term), and renal body fluid regulation (long-term). Normal BP is around 120/80 mmHg. Your upcoming quiz will likely cover these regulatory mechanisms. Would you like me to explain one in more detail?";
        } else {
          return "For cardiovascular system, I can explain the cardiac cycle, heart valves, blood pressure regulation, or cardiac output. Which would be most helpful for your upcoming quiz?";
        }
        
      case 'pathology':
        if (input.includes('blood cell') || input.includes('hematology')) {
          return "In today's lab, you'll examine normal and abnormal blood cell morphology. Key elements include: RBCs (shape, size, hemoglobin content), WBCs (neutrophils, lymphocytes, monocytes, eosinophils, basophils), and platelets. Common abnormalities include anisocytosis and poikilocytosis. Would you like tips on identifying specific cell types?";
        } else if (input.includes('lab technique') || input.includes('staining')) {
          return "The lab will use Wright's stain for blood smears. Remember the proper technique: create a thin, even smear, air dry completely, fix with methanol, then apply Wright's stain for 1-3 minutes before buffer rinse. Poor technique can create artifacts that mimic pathology. Would you like more details on the staining protocol?";
        } else if (input.includes('histology')) {
          return "For histology slides, you'll use the 4x objective to locate areas of interest, then 10x and 40x for detailed examination. Remember to adjust the condenser and diaphragm for optimal contrast. Your lab report will require descriptions of both normal and abnormal findings. Do you need help with specific slide interpretation?";
        } else {
          return "For your Clinical Pathology lab today, I can provide information on blood cell morphology, staining techniques, or slide interpretation methods. What would be most helpful?";
        }
        
      case 'pharmacology':
        if (input.includes('beta blocker') || input.includes('beta-blocker')) {
          return "Beta-blockers (e.g., metoprolol, propranolol) antagonize β-adrenergic receptors, reducing heart rate and contractility. They're used for hypertension, angina, and post-MI. Side effects include bradycardia, fatigue, and bronchospasm. Your study group will likely discuss cardioselectivity (β1 vs. β2) and intrinsic sympathomimetic activity. Would you like more on mechanism or clinical applications?";
        } else if (input.includes('ace inhibitor') || input.includes('angiotensin')) {
          return "ACE inhibitors (e.g., lisinopril, enalapril) block angiotensin-converting enzyme, reducing angiotensin II formation and aldosterone release. This decreases vasoconstriction and sodium/water retention. They're vital for hypertension, heart failure, and diabetic nephropathy. Key side effects are dry cough, angioedema, and hyperkalemia. Would you like to know more about their differences from ARBs?";
        } else if (input.includes('calcium channel') || input.includes('calcium-channel')) {
          return "Calcium channel blockers (e.g., amlodipine, verapamil) inhibit calcium influx into cardiac and smooth muscle cells. Dihydropyridines (amlodipine) primarily affect vascular tone, while non-dihydropyridines (verapamil, diltiazem) also affect cardiac conduction. They're used for hypertension, angina, and arrhythmias. Would you like more details on their subclasses?";
        } else if (input.includes('diuretic')) {
          return "Diuretics increase urine output and are crucial in hypertension and heart failure. Types include thiazides (hydrochlorothiazide), loop diuretics (furosemide), and potassium-sparing (spironolactone). Each works at different nephron sites with distinct electrolyte effects. For your presentation, focus on mechanisms of action and clinical applications. Would you like more on a specific type?";
        } else {
          return "For your Pharmacology study group on cardiovascular drugs, I can explain beta-blockers, ACE inhibitors, calcium channel blockers, diuretics, or antiarrhythmics. Which would you like to focus on?";
        }
        
      case 'ethics':
        if (input.includes('informed consent')) {
          return "Informed consent requires disclosure of relevant information, patient comprehension, and voluntary decision-making. Today's seminar emphasizes that valid consent must include explanation of: the procedure/treatment, benefits, risks, alternatives, and consequences of refusal. The assigned reading highlights cases where economic or educational pressures can compromise voluntariness. Would you like an example case to prepare for discussion?";
        } else if (input.includes('autonomy') || input.includes('patient autonomy')) {
          return "Patient autonomy is a cornerstone of medical ethics, referring to individuals' right to make their own healthcare decisions. Today's discussion will explore tensions between autonomy and beneficence, especially in cases of patient decisions that physicians believe may cause harm. The reading emphasizes that autonomy requires both liberty (freedom from controlling influences) and agency (capacity for intentional action). Would you like to know more about autonomy limitations?";
        } else if (input.includes('case study') || input.includes('discussion')) {
          return "For your Ethics Case Study Discussion due on April 20th, you need to analyze the case of a Jehovah's Witness patient refusing blood transfusion before emergency surgery. Your analysis should address: respecting religious beliefs vs. duty to preserve life, alternatives to transfusion, and legal/institutional policies. Remember to include the four principles from Beauchamp and Childress. Would you like help structuring your analysis?";
        } else {
          return "For your Medical Ethics seminar today, I can provide information on informed consent requirements, patient autonomy principles, or help with your upcoming case study discussion. Which topic interests you most?";
        }
        
      case 'schedule':
        if (input.includes('tomorrow')) {
          return "You don't have any scheduled classes tomorrow (Saturday). This would be a good time to work on your upcoming deadlines, especially the Cardiovascular System Quiz that's due on Monday at 14:30.";
        } else if (input.includes('next week')) {
          return "Next week you have your regular classes plus extra review sessions for the Midterm Examination on Thursday, April 25th. Your deadline for the Drug Interactions Presentation is also next week on Tuesday, April 22nd.";
        } else if (input.includes('specific') || input.includes('lecture') || input.includes('cardiovascular')) {
          return "Your Cardiovascular System Lecture is today at 8:30-10:00 in Medical Building, Room A102. The lecture will cover coronary circulation and cardiac output regulation. Don't forget to bring your stethoscope as there will be a practical component.";
        } else if (input.includes('lab') || input.includes('pathology')) {
          return "Your Clinical Pathology Lab Session is today at 11:00-13:00 in Science Lab Wing, Room L205. Today's focus is on blood cell morphology analysis. Remember to bring your lab coat and goggles.";
        } else if (input.includes('study group') || input.includes('pharmacology')) {
          return "Your Pharmacology Study Group meets today at 14:30-16:00 in Library, Study Room 3. The focus is on cardiovascular drugs. You're expected to present on diuretics for 5-7 minutes.";
        } else if (input.includes('seminar') || input.includes('ethics')) {
          return "Your Medical Ethics Seminar is today at 16:30-18:00 in the Medical Building Auditorium. Today's topic is informed consent and patient autonomy. The assigned reading was Chapter 4 from 'Principles of Biomedical Ethics'.";
        } else {
          return "Is there a specific class from today's schedule you'd like more information about? I can provide details about the Cardiovascular Lecture, Clinical Pathology Lab, Pharmacology Study Group, or Medical Ethics Seminar.";
        }
        
      case 'deadlines':
        if (input.includes('quiz') || input.includes('cardiovascular')) {
          return "Your Cardiovascular System Quiz is due tomorrow at 14:30. It will cover the cardiac cycle, blood pressure regulation, heart valves, and coronary circulation. It's worth 15% of your Anatomy and Physiology grade. Would you like me to create a quick study plan for tonight?";
        } else if (input.includes('ethics') || input.includes('case study')) {
          return "Your Ethics Case Study Discussion is due on April 20th. You need to submit a 1000-word analysis of the Jehovah's Witness case, applying the four principles of biomedical ethics. The submission portal opens 48 hours before the deadline on the Ethics course page.";
        } else if (input.includes('lab') || input.includes('report') || input.includes('pathology')) {
          return "Your Lab Report for Clinical Pathology is due on April 20th. It should include your observations, drawings, and interpretations from today's blood cell morphology lab. The report template is available on the course page and should follow the standard lab report format you've used previously.";
        } else if (input.includes('presentation') || input.includes('drug')) {
          return "Your Drug Interactions Presentation for Pharmacology is due on April 22nd. You need to prepare a 10-minute presentation on potential interactions between cardiovascular drugs and commonly prescribed medications. Visual aids are required, and you'll need to submit your slides before the presentation.";
        } else if (input.includes('midterm') || input.includes('examination')) {
          return "Your Midterm Examination for Anatomy and Physiology is scheduled for April 25th. It will cover all material from the first half of the semester, with emphasis on the cardiovascular, respiratory, and digestive systems. The format includes multiple choice, short answer, and diagram labeling sections.";
        } else {
          return "You have several upcoming deadlines. Would you like details about your Cardiovascular Quiz (tomorrow), Ethics Case Study (April 20), Lab Report (April 20), Drug Interactions Presentation (April 22), or Midterm Examination (April 25)?";
        }
        
      default:
        return "What else would you like to know about your medical studies? I can help with course content, deadlines, or study strategies.";
    }
  };
  
  // Generate a quiz question based on the topic
  const generateQuizQuestion = (topic) => {
    const quizQuestions = {
      cardiovascular: [
        {
          question: "What heart chamber receives deoxygenated blood from the body?",
          answer: "Right atrium"
        },
        {
          question: "Which valve separates the left atrium from the left ventricle?",
          answer: "Mitral valve"
        },
        {
          question: "During which phase of the cardiac cycle does ventricular filling occur?",
          answer: "Diastole"
        },
        {
          question: "What is the pacemaker of the heart?",
          answer: "Sinoatrial node"
        },
        {
          question: "What hormonal system increases blood pressure through vasoconstriction and fluid retention?",
          answer: "Renin-angiotensin-aldosterone system"
        }
      ],
      pathology: [
        {
          question: "Which cell type is the most abundant leukocyte in normal blood?",
          answer: "Neutrophil"
        },
        {
          question: "What type of anemia is characterized by microcytic, hypochromic red blood cells?",
          answer: "Iron deficiency anemia"
        },
        {
          question: "What staining technique is commonly used for blood smear examination?",
          answer: "Wright's stain"
        },
        {
          question: "What term describes RBCs with abnormal shapes?",
          answer: "Poikilocytosis"
        },
        {
          question: "Which white blood cell is involved in allergic responses?",
          answer: "Eosinophil"
        }
      ],
      pharmacology: [
        {
          question: "Which class of cardiovascular drugs causes a dry cough as a side effect?",
          answer: "ACE inhibitors"
        },
        {
          question: "Which beta-blocker is cardioselective (primarily affects β1 receptors)?",
          answer: "Metoprolol"
        },
        {
          question: "Which diuretic works at the loop of Henle?",
          answer: "Furosemide"
        },
        {
          question: "What is the mechanism of action for calcium channel blockers?",
          answer: "Inhibit calcium influx into cells"
        },
        {
          question: "Which class of antihypertensives can cause hyperkalemia?",
          answer: "Potassium-sparing diuretics"
        }
      ],
      ethics: [
        {
          question: "What are the four principles of biomedical ethics according to Beauchamp and Childress?",
          answer: "Autonomy, beneficence, non-maleficence, and justice"
        },
        {
          question: "What ethical principle emphasizes the right of patients to make their own decisions?",
          answer: "Autonomy"
        },
        {
          question: "What is required for valid informed consent?",
          answer: "Disclosure, understanding, and voluntariness"
        },
        {
          question: "What ethical doctrine states that the ends never justify harmful means?",
          answer: "Deontology"
        },
        {
          question: "What ethical principle refers to the fair distribution of benefits and burdens?",
          answer: "Justice"
        }
      ],
      default: [
        {
          question: "What chamber of the heart pumps blood to the lungs?",
          answer: "Right ventricle"
        },
        {
          question: "What is the normal resting heart rate for adults?",
          answer: "60-100 beats per minute"
        },
        {
          question: "Which blood vessels carry blood away from the heart?",
          answer: "Arteries"
        },
        {
          question: "What is the name of the membrane that surrounds the heart?",
          answer: "Pericardium"
        },
        {
          question: "Which heart valve is most commonly affected by rheumatic heart disease?",
          answer: "Mitral valve"
        }
      ]
    };
    
    const questions = quizQuestions[topic] || quizQuestions.default;
    const randomIndex = Math.floor(Math.random() * questions.length);
    
    return questions[randomIndex];
  };
  
  // Base response generation function
  const generateBaseResponse = (input) => {
    // Specific medical topics
    if (input.includes('anatomy') || input.includes('cardiovascular')) {
      return "The cardiovascular system includes the heart, blood vessels, and blood. It's a key system to understand for your upcoming quiz. Would you like me to explain the cardiac cycle or blood pressure regulation?";
    } else if (input.includes('pathology') || input.includes('lab')) {
      return "Your Clinical Pathology lab session today will focus on blood cell morphology analysis. Don't forget to bring your lab notebook and review the hematology slides from last week's session.";
    } else if (input.includes('pharmacology') || input.includes('drug')) {
      return "For your Pharmacology study group today, the focus is on cardiovascular drugs. The main categories include beta-blockers, calcium channel blockers, ACE inhibitors, and diuretics. Which one would you like me to explain?";
    } else if (input.includes('ethics') || input.includes('medical ethics')) {
      return "Your Medical Ethics seminar today will cover informed consent and patient autonomy. The assigned reading was Chapter 4 from 'Principles of Biomedical Ethics'. Would you like a summary of the key points?";
    
    // Study support
    } else if (input.includes('study') || input.includes('exam') || input.includes('test') || input.includes('quiz')) {
      return "For your Cardiovascular System Quiz tomorrow, focus on cardiac cycle phases, heart valve functions, and blood pressure regulation. I recommend using the Pomodoro technique: 25 minutes of focused study followed by a 5-minute break. Would you like a quick quiz to test your knowledge?";
    } else if (input.includes('deadline') || input.includes('assignment') || input.includes('homework')) {
      return "I see you have several upcoming deadlines. The closest one is your Cardiovascular System Quiz tomorrow at 14:30, followed by two assignments due on April 20th: the Ethics Case Study Discussion and Lab Report Submission. Would you like to create a study plan?";
    } else if (input.includes('course') || input.includes('class')) {
      return "You're currently enrolled in 4 main courses: Anatomy and Physiology (75% complete), Clinical Pathology (45% complete), Pharmacology (60% complete), and Medical Ethics (30% complete). Which one would you like to focus on today?";
    } else if (input.includes('schedule') || input.includes('timetable') || input.includes('today')) {
      return "Today (Friday, April 18) you have 4 classes: Cardiovascular System Lecture (8:30-10:00) in Room A102, Clinical Pathology Lab (11:00-13:00) in Room L205, Study Group for Pharmacology (14:30-16:00) in Study Room 3, and Medical Ethics Seminar (16:30-18:00) in the Auditorium.";
    
    // General assistance
    } else if (input.includes('help') || input.includes('can you')) {
      return "I can help you with your schedule, deadlines, course information, study techniques, and answer basic medical questions. I can also create flashcards, summarize topics, or quiz you on specific subjects. What do you need assistance with today?";
    } else if (input.includes('stress') || input.includes('overwhelmed') || input.includes('tired')) {
      return "Medical school can be demanding. Have you tried the 4-7-8 breathing technique? Inhale for 4 seconds, hold for 7, exhale for 8. Also, your schedule shows a 2-hour gap today between lab and study group - perhaps take a short walk outside to reset your mind?";
    } else if (input.includes('resource') || input.includes('book') || input.includes('material')) {
      return "For Anatomy and Physiology, the recommended resources are Netter's Atlas, Guyton & Hall Textbook, and the Visible Body app. For your current cardiovascular unit, I'd also recommend watching the Osmosis videos on cardiac cycle and blood pressure regulation. Would you like direct links?";
    } else if (input.includes('flashcard') || input.includes('memorize')) {
      return "I can help create flashcards for your cardiovascular system quiz. Here's one to start: Q: What heart chamber receives oxygenated blood from the lungs? A: Left atrium. Would you like more flashcards on this topic?";
    } else if (input.includes('thank')) {
      return "You're welcome! Medical school is challenging, and I'm here to support your learning journey. Feel free to ask anything about your courses, deadlines, or study strategies anytime.";
    
    // Generic responses for other inputs
    } else {
      const genericResponses = [
        "As your medical studies assistant, I can help with course content, create study plans, explain difficult concepts, or quiz you on material. What would be most helpful right now?",
        "I have access to your schedule, deadlines, and course progress. How can I help you prepare for your upcoming classes or assignments today?",
        "Is there a specific medical topic from your current courses that you'd like me to explain? I can break down complex concepts into simpler terms.",
        "Would you like study suggestions for your upcoming Cardiovascular Quiz, help with your Ethics Case Study, or information about today's schedule?",
        "I notice you have a full schedule today with 4 classes. Is there something specific about any of these sessions I can help you prepare for?"
      ];
      
      return genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat toggle button */}
      <button className="chat-button" onClick={toggleChat}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
      
      {/* Chat window */}
      <div className={`chat-window ${isOpen ? "active" : ""}`}>
        <div className="chat-header">
          <div className="chat-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            SolariBot Assistant
          </div>
          <button className="close-chat" onClick={toggleChat}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}-message`}>
              {message.text}
            </div>
          ))}
          
          {isTyping && (
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your question..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <button type="submit" className="send-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;