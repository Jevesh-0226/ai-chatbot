import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://ai-chatbot-0l8g.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.map(msg => ({ role: msg.role === 'ai' ? 'model' : 'user', content: msg.content }))
        })
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ detail: 'API Error' }));
        throw new Error(errorBody.detail || 'API Error');
      }

      const data = await response.json();

      const aiMessage = {
        role: 'ai',
        content: data.response,
        timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Simple typewriter simulation or just set message
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Error: ${error.message}. Please check your backend terminal for error logs and verify your API key.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="app-container">
      <header className="chat-header">
        <div className="header-info">
          <div className="avatar-circle">AI</div>
          <div>
            <h3>Gemini Assistant</h3>
            <span style={{ fontSize: '0.8rem', color: '#10b981' }}>● Online</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={toggleTheme} className="theme-toggle" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={clearChat} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>
            Clear
          </button>
        </div>
      </header>

      <main className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="avatar-circle" style={{ width: 80, height: 80, fontSize: '2rem', marginBottom: 20 }}>AI</div>
            <h1>Hello, I'm Gemini.</h1>
            <p>How can I help you today? I can help you with writing, learning, or just chat about anything.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.role} message-enter`}>
              <div className="message-bubble">
                {msg.content}
              </div>
              <div className="message-time">{msg.timestamp}</div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="message-wrapper ai message-enter">
            <div className="message-bubble" style={{ padding: '8px 12px' }}>
              <div className="typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <form className="input-area" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="send-button" disabled={!input.trim() || isLoading}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}

export default App;
