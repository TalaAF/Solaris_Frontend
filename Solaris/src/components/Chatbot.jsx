import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = ({ profile, courses }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const messagesEndRef = useRef(null);
  
  // API key - WARNING: This approach is for development only
  const OPENAI_API_KEY = "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";

  // Fallback knowledge base for different topics
  const fallbackResponses = {
    schedule: [
      "📆 Your next class is Clinical Pathology Lab at 11:00 AM in Room L205.",
      "📚 You have 3 classes scheduled for today.",
      "🗓️ Your Friday schedule is lighter, with only one afternoon session.",
      "⏰ Your next class starts in 45 minutes. It's in Building B, Room 305.",
      "📋 You have office hours available with Dr. Roberts on Thursday from 2-4pm."
    ],
    assignments: [
      "📝 You have 2 assignments due this week.",
      "📋 The Biochemistry lab report is due on Thursday.",
      "📊 Your Clinical Skills assessment is scheduled for next Monday.",
      "📚 Don't forget about the group project for Medical Ethics due next week.",
      "✅ Your Anatomy assignment was submitted successfully. Expect feedback in 3-5 days."
    ],
    grades: [
      "🌟 Your current grade average is B+ (87%).",
      "🎓 You scored an A- on your last Anatomy quiz.",
      "📈 Your Biochemistry midterm score was in the top 15% of the class.",
      "📊 You need a 78% on the final to maintain your current grade.",
      "🏆 Your latest assignment received a score of 92%."
    ],
    courses: [
      "📚 You're currently enrolled in: Anatomy 101, Clinical Skills, Biochemistry, and Medical Ethics.",
      "👥 Your Medical Ethics course has a group project coming up.",
      "📖 The Anatomy 101 final exam will cover chapters 7-12.",
      "🔬 Your lab session for Biochemistry has been moved to Thursday.",
      "📝 The syllabus for Clinical Skills has been updated."
    ],
    professors: [
      "👨‍🏫 Dr. Johnson's office hours are Tuesdays and Thursdays from 2-4pm.",
      "📧 You can email Professor Williams at williams@solaris.edu.",
      "👩‍🔬 Dr. Chen is the course coordinator for Biochemistry.",
      "🎓 Professor Garcia has posted new lecture notes for Monday's class.",
      "📆 Dr. Thompson has rescheduled tomorrow's lecture to next week."
    ]
  };

  // Generate initial greeting on load
  useEffect(() => {
    const userName = profile?.name || 'User';
    setMessages([
      { sender: 'bot', text: `👋 Hi ${userName}! I'm your Solaris assistant. How can I help with your courses today?` }
    ]);
    console.log("Chatbot initialized for:", userName);
  }, [profile]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Generate a local response based on user input
  const getLocalResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Check for greetings
    if (/\b(hi|hello|hey|greetings)\b/.test(input)) {
      return "👋 Hello! How can I help you with your courses today?";
    }
    
    // Check for gratitude
    if (/\b(thanks|thank you|thx)\b/.test(input)) {
      return "😊 You're welcome! Let me know if you need anything else.";
    }
    
    // Check for goodbyes
    if (/\b(bye|goodbye|see you|farewell)\b/.test(input)) {
      return "👋 Goodbye! Have a great day. Feel free to come back if you have more questions.";
    }
    
    // Check for schedule related questions
    if (/\b(schedule|class|classes|timetable|when is|time|calendar)\b/.test(input)) {
      return getRandomResponse(fallbackResponses.schedule);
    }
    
    // Check for assignment related questions
    if (/\b(assignment|homework|due|deadline|project|report|essay|paper|exam|test|quiz)\b/.test(input)) {
      return getRandomResponse(fallbackResponses.assignments);
    }
    
    // Check for grade related questions
    if (/\b(grade|score|result|mark|percentage|gpa|performance)\b/.test(input)) {
      return getRandomResponse(fallbackResponses.grades);
    }
    
    // Check for course related questions
    if (/\b(course|class|subject|study|curriculum|syllabus|module)\b/.test(input)) {
      return getRandomResponse(fallbackResponses.courses);
    }
    
    // Check for professor related questions
    if (/\b(professor|teacher|instructor|faculty|dr\.|doctor|prof|tutor)\b/.test(input)) {
      return getRandomResponse(fallbackResponses.professors);
    }
    
    // Default responses if no pattern is matched
    const defaultResponses = [
      "🤔 I'm not sure I understand. Could you ask about your schedule, assignments, grades, or courses?",
      "📚 I'm still learning! Could you rephrase your question about your academic work?",
      "💡 That's a great question. To help you better, try asking about specific courses, deadlines, or schedules.",
      "👨‍🎓 I'm your academic assistant. I can help with questions about your courses, schedule, assignments, and grades."
    ];
    
    return getRandomResponse(defaultResponses);
  };
  
  // Get random response from an array
  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Get response from OpenAI with retry logic
  const getOpenAIResponse = async (userInput) => {
    const maxRetries = 5;
    let retries = 0;

    // Create context about the user's profile and courses
    const coursesInfo = Array.isArray(courses) ? courses.join(', ') : 'your courses';
    const systemPrompt = `You are a helpful academic assistant for a student named ${profile?.name || 'User'}.
    They are taking these courses: ${coursesInfo}.
    Provide short, helpful responses about academic topics, schedules, assignments, etc.
    Keep your answers under 100 words and use emojis occasionally to be friendly.
    Only answer questions related to academics and education.`;

    // Get chat history for context
    const messageHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Prepare request payload
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messageHistory.slice(-5), // Include recent conversation history
        { role: "user", content: userInput }
      ],
      temperature: 0.7,
      max_tokens: 150,
    };

    while (retries < maxRetries) {
      try {
        console.log("Making API request to OpenAI, attempt:", retries + 1);
        
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("OpenAI API response successful");
          setUsingFallback(false); // We got a successful response, not using fallback
          return data.choices[0].message.content;
        } else if (response.status === 429) {
          console.log("OpenAI API rate limited, retrying...");
          // Wait before retrying with exponential backoff
          const waitTime = Math.pow(2, retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retries++;
        } else {
          const errorData = await response.text();
          console.error("OpenAI API error:", response.status, errorData);
          throw new Error(`API Error: ${response.status}`);
        }
      } catch (error) {
        console.error("Error in OpenAI request:", error);
        if (retries >= maxRetries - 1) {
          // After max retries, switch to fallback mode
          console.log("Switching to fallback mode after max retries");
          setUsingFallback(true);
          return getLocalResponse(userInput);
        }
        retries++;
      }
    }
    
    // This will only execute if all retries are exhausted without throwing an error
    setUsingFallback(true);
    return getLocalResponse(userInput);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Show loading indicator and clear input
    setIsLoading(true);
    const userQuestion = input; // Save the question before clearing input
    setInput('');
    
    try {
      let botResponse;
      
      // Try OpenAI first, unless we're already in fallback mode
      if (!usingFallback) {
        try {
          botResponse = await getOpenAIResponse(userQuestion);
        } catch (apiError) {
          console.log("API error, switching to fallback mode", apiError);
          setUsingFallback(true);
          botResponse = getLocalResponse(userQuestion);
        }
      } else {
        // We're already in fallback mode, don't try API
        console.log("Using fallback mode for response");
        botResponse = getLocalResponse(userQuestion);
      }
      
      // Add bot response to messages
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: botResponse,
        isFallback: usingFallback
      }]);
    } catch (error) {
      console.error("Failed to get response:", error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "I'm sorry, I'm having trouble right now. Let me try a simpler answer.",
        isFallback: true
      }]);
      
      // After apologizing, provide a fallback response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: getLocalResponse(userQuestion),
          isFallback: true
        }]);
      }, 1000);
      
      setUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    console.log("Toggling chatbot, current state:", isOpen);
    setIsOpen(prev => !prev);
  };

  return (
    <div className="solaris-chatbot" style={{zIndex: 9999}}>
      <div
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleChatbot}
        aria-label="Toggle chatbot"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#e6b400',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 9999
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 10H8.01M12 10H12.01M16 10H16.01M6 16H18C19.1046 16 20 15.1046 20 14V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div 
        className={`chatbot-container ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '350px',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(230, 180, 0, 0.2)',
          zIndex: 9999
        }}
      >
        <div 
          className="chatbot-header"
          style={{
            background: 'linear-gradient(135deg, #e6b400, #ffcc00)',
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
        >
          <div 
            className="chatbot-title"
            style={{
              color: 'white',
              fontWeight: '600',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {usingFallback && (
              <span title="Using local responses" style={{fontSize: '12px'}}>🔌</span>
            )}
            Solaris Assistant
          </div>
          <div className="chatbot-actions">
            <button 
              className="chatbot-action" 
              onClick={toggleChatbot}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div 
          className="chatbot-messages"
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chatbot-message ${msg.sender}`}
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: msg.sender === 'bot' ? '#f0f0f0' : '#e6b400',
                color: msg.sender === 'bot' ? '#333' : 'white',
                alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
              }}
            >
              <div className="message-content">
                {msg.text}
                {msg.isFallback && (
                  <span 
                    style={{
                      fontSize: '10px', 
                      opacity: 0.5, 
                      marginLeft: '4px',
                      verticalAlign: 'top'
                    }}
                    title="This response is generated locally"
                  >
                    *
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div 
              className="chatbot-message bot"
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: '#f0f0f0',
                alignSelf: 'flex-start',
              }}
            >
              <div 
                className="typing-indicator"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{
                  height: '8px',
                  width: '8px',
                  backgroundColor: '#e6b400',
                  borderRadius: '50%',
                  display: 'block',
                  opacity: 0.4,
                  animation: 'typing 1s infinite alternate',
                }}></span>
                <span style={{
                  height: '8px',
                  width: '8px',
                  backgroundColor: '#e6b400',
                  borderRadius: '50%',
                  display: 'block',
                  opacity: 0.4,
                  animation: 'typing 1s infinite alternate 0.3s',
                }}></span>
                <span style={{
                  height: '8px',
                  width: '8px',
                  backgroundColor: '#e6b400',
                  borderRadius: '50%',
                  display: 'block',
                  opacity: 0.4,
                  animation: 'typing 1s infinite alternate 0.6s',
                }}></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div 
          className="chatbot-input-container"
          style={{
            padding: '16px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your courses..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="chatbot-input"
            style={{
              flex: 1,
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '12px 18px',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSendMessage}
            className="chatbot-send-button"
            disabled={!input.trim() || isLoading}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: !input.trim() || isLoading ? '#e2e8f0' : '#e6b400',
              color: 'white',
              border: 'none',
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div 
          className="chatbot-footer"
          style={{
            padding: '12px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#94a3b8',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          {usingFallback ? (
            <>Powered by <strong>Solaris Assistant</strong> • Offline Mode</>
          ) : (
            <>Powered by <strong>Solaris AI</strong> • {new Date().getFullYear()}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;