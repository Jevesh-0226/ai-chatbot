import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ChatContainer from '../components/ChatContainer';
import ChatInput from '../components/ChatInput';

/**
 * ChatPage Component
 * Main chat interface page
 * Manages chat state, API calls, and theme
 */
const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const clearChat = () => {
        setMessages([]);
    };

    // Handle sending messages to API
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
            // API call - DO NOT MODIFY THIS SECTION
            const response = await fetch('https://ai-chatbot-0l8g.onrender.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: messages.map(msg => ({
                        role: msg.role === 'ai' ? 'model' : 'user',
                        content: msg.content
                    }))
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

    return (
        <div className="app-container">
            <Header
                theme={theme}
                onToggleTheme={toggleTheme}
                onClearChat={clearChat}
            />

            <ChatContainer
                messages={messages}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
            />

            <ChatInput
                input={input}
                onInputChange={setInput}
                onSend={handleSend}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ChatPage;
