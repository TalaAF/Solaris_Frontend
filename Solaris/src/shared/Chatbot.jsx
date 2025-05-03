import React, { useState, useEffect } from 'react';
import './styles/Chatbot.css';

const Chatbot = ({ profile, courses }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatbotResponses, setChatbotResponses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initialize the welcome message with a fallback for profile.name
    const userName = profile?.name || 'User';
    setMessages([
      { sender: 'bot', text: `Hey there, ${userName}! How can I help you today?` }
    ]);

    const fetchResponses = async () => {
      try {
        const response = await fetch('/data/chatbot.json');
        if (!response.ok) throw new Error('Failed to fetch chatbot responses');
        const data = await response.json();
        setChatbotResponses(data);
      } catch (err) {
        console.error('Error fetching chatbot responses:', err);
        setMessages(prev => [...prev, { sender: 'bot', text: 'Error loading responses. Please try again.' }]);
      }
    };

    fetchResponses();
  }, [profile]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    const matchedResponse = chatbotResponses.find(res => 
      input.toLowerCase().includes(res.query.toLowerCase())
    );

    const botMessage = matchedResponse
      ? { sender: 'bot', text: matchedResponse.response }
      : { sender: 'bot', text: "I'm sorry, I don't understand. Try asking about your progress or enrolled courses." };

    setMessages(prev => [...prev, botMessage]);
    setInput('');
  };

  const toggleChatbot = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <div className="chatbot-icon" onClick={toggleChatbot}></div>
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <h3 className="chatbot-heading">Chatbot Assistant</h3>
          <button className="chatbot-close" onClick={toggleChatbot}>×</button>
        </div>
        <div className="chatbot-messages">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))
          ) : (
            <p className="chatbot-placeholder">No messages yet. Start chatting!</p>
          )}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your courses (e.g., progress)..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="chatbot-send">
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;