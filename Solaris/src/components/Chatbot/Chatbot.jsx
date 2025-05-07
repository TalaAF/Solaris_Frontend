import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import './Chatbot.css';
import notificationSound from './notification.mp3';

const Chatbot = ({ profile, courses }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(null);

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  useEffect(() => {
    const userName = profile?.name || 'User';
    setMessages([
      { sender: 'bot', text: `Hey there, ${userName}! How can I help you today?` }
    ]);

    // Initialize audio
    audioRef.current = new Audio(notificationSound);
  }, [profile]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const context = `You are a helpful assistant for a student named ${profile?.name || 'User'}. 
        They are enrolled in courses: ${courses?.join(', ') || 'unknown'}. 
        Provide accurate and concise answers related to their courses or general academic queries.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: input }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const botMessage = {
        sender: 'bot',
        text: completion.choices[0].message.content.trim() || "I'm sorry, I couldn't generate a response."
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error with OpenAI API:', err);
      const botMessage = {
        sender: 'bot',
        text: "I'm sorry, there was an error processing your request. Try again later."
      };
      setMessages(prev => [...prev, botMessage]);
    }

    setInput('');
  };

  const toggleChatbot = () => {
    if (!isOpen && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
    setIsOpen(prev => !prev);
  };

  return (
    <div className="solaris-chatbot">
      <div
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleChatbot}
        aria-label="Toggle chatbot"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 10H8.01M12 10H12.01M16 10H16.01M6 16H18C19.1046 16 20 15.1046 20 14V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-title">Chatbot Assistant</div>
          <div className="chatbot-actions">
            <button className="chatbot-action" onClick={toggleChatbot}>×</button>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chatbot-message ${msg.sender}`}>
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
        </div>

        <div className="chatbot-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your courses (e.g., progress)..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="chatbot-input"
          />
          <button
            onClick={handleSendMessage}
            className="chatbot-send-button"
            disabled={!input.trim()}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="chatbot-footer">
          Powered by <strong>Solaris</strong>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;