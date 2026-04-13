import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ChatContainer from '../components/ChatContainer';
import ChatInput from '../components/ChatInput';
import Sidebar from '../components/Sidebar';

/**
 * ChatPage Component
 * Main controller for the chat application
 * Manages state for chats, messages, sidebar, and API interactions
 */
const ChatPage = () => {
    // State
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const messagesEndRef = useRef(null);

    // Initialize from LocalStorage
    useEffect(() => {
        const storedChats = localStorage.getItem('gemini_chats');
        const storedTheme = localStorage.getItem('gemini_theme');

        if (storedTheme) setTheme(storedTheme);

        if (storedChats) {
            try {
                const parsedChats = JSON.parse(storedChats);
                // Ensure all historical messages are NOT streaming
                const sanitizedChats = parsedChats.map(chat => ({
                    ...chat,
                    messages: chat.messages.map(msg => ({ ...msg, isStreaming: false }))
                }));
                setChats(sanitizedChats);
                if (sanitizedChats.length > 0) {
                    setActiveChatId(sanitizedChats[0].id);
                } else {
                    createNewChat();
                }
            } catch (e) {
                console.error('Failed to parse chats:', e);
                createNewChat();
            }
        } else {
            createNewChat();
        }
    }, []);

    // Sync to LocalStorage
    useEffect(() => {
        if (chats.length > 0) {
            localStorage.setItem('gemini_chats', JSON.stringify(chats));
        }
    }, [chats]);

    useEffect(() => {
        localStorage.setItem('gemini_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Derive active chat
    const activeChat = chats.find(c => c.id === activeChatId);
    const messages = activeChat ? activeChat.messages : [];

    // Scroll to bottom when messages change or loading state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, isLoading, activeChatId]);

    // Actions
    const createNewChat = () => {
        const newChat = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString()
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setSidebarOpen(false); // Close sidebar on mobile
    };

    const handleSelectChat = (id) => {
        if (id === activeChatId) return;

        // Disable streaming on current chat messages before switching
        setChats(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
                return {
                    ...chat,
                    messages: chat.messages.map(msg => ({ ...msg, isStreaming: false }))
                };
            }
            return chat;
        }));

        setActiveChatId(id);
        setSidebarOpen(false); // Close mobile sidebar
    };

    const deleteChat = (id, e) => {
        if (e) e.stopPropagation();

        // Calculate next active chat before updating state
        let nextActiveId = activeChatId;

        // Filter out the deleted chat
        const updatedChats = chats.filter(chat => chat.id !== id);

        // If the *active* chat is being deleted, pick a new one
        if (id === activeChatId) {
            nextActiveId = updatedChats.length > 0 ? updatedChats[0].id : null;
        }

        setChats(updatedChats);

        // Update active ID
        if (updatedChats.length === 0) {
            // If no chats left, create a new one immediately
            setTimeout(createNewChat, 0);
        } else if (id === activeChatId) {
            setActiveChatId(nextActiveId);
        }
    };

    const clearCurrentChat = () => {
        setChats(prev => prev.map(chat =>
            chat.id === activeChatId ? { ...chat, messages: [] } : chat
        ));
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // Capture curent ID to ensure response goes to correct chat even if user switches
        const currentChatId = activeChatId;

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Optimistically update UI
        setChats(prev => prev.map(chat => {
            if (chat.id === currentChatId) {
                return {
                    ...chat,
                    messages: [...chat.messages, userMessage]
                };
            }
            return chat;
        }));

        setInput('');
        setIsLoading(true);

        try {
            // Use environment variable for production, or relative path for dev (which uses Vite proxy)
            const apiUrl = import.meta.env.VITE_API_URL;
            const chatEndpoint = apiUrl ? `${apiUrl}/api/chat` : '/api/chat';
            
            const response = await fetch(chatEndpoint, {
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
                const errorText = await response.text();
                console.error('Backend error:', errorText);
                throw new Error(`API Error: ${response.status}`);
            }

            const responseText = await response.text();
            console.log('===== RESPONSE DEBUG =====');
            console.log('Raw response text:', responseText);
            console.log('Text length:', responseText.length);
            
            let data = JSON.parse(responseText);
            
            console.log('Parsed JSON object keys:', Object.keys(data));
            console.log('Full parsed object:', JSON.stringify(data, null, 2));
            
            const actualMessage = data.response;
            console.log('EXTRACTED MESSAGE (data.response):', actualMessage);
            console.log('MESSAGE TYPE:', typeof actualMessage);
            console.log('MESSAGE LENGTH:', actualMessage ? actualMessage.length : 'NULL');
            console.log('===== END DEBUG =====');

            if (!actualMessage) {
                throw new Error('Response field missing or empty from API');
            }

            const aiMessage = {
                role: 'ai',
                content: actualMessage,
                timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isStreaming: true
            };
            
            console.log('AI Message object about to be stored:', aiMessage);
            console.log('Content in aiMessage:', aiMessage.content);

            // Add AI message
            setChats(prev => prev.map(chat => {
                if (chat.id === currentChatId) {
                    // Update title if it's the first message
                    const newTitle = chat.messages.length === 1 // Wait, userMessage was added. So length is 1?
                        ? input.substring(0, 30) + (input.length > 30 ? '...' : '')
                        : chat.title;
                    // Actually title update logic is fragile if message count changes.
                    // If length === 1 (just the user message we added optimistically), update title.
                    // But here "chat.messages" refers to the PREVIOUS state + optimistic update applied? 
                    // Ideally check if title is default "New Chat"

                    // Check if title is default
                    const isDefaultTitle = chat.title === 'New Chat';
                    const updatedTitle = isDefaultTitle
                        ? input.substring(0, 30) + (input.length > 30 ? '...' : '')
                        : chat.title;

                    return {
                        ...chat,
                        title: updatedTitle,
                        messages: [...chat.messages, aiMessage] // FIXED: Only append aiMessage
                    };
                }
                return chat;
            }));

        } catch (error) {
            console.error('Chat request error:', error);
            const errorMessage = {
                role: 'ai',
                content: error.message || "Sorry, I couldn't reach the server. Please check your connection and try again.",
                timestamp: new Date().toLocaleTimeString(),
                isStreaming: false
            };
            setChats(prev => prev.map(chat =>
                chat.id === currentChatId
                    ? { ...chat, messages: [...chat.messages, errorMessage] }
                    : chat
            ));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-layout">
            {/* Sidebar Area */}
            <Sidebar
                chats={chats}
                activeChatId={activeChatId}
                onSelectChat={handleSelectChat}
                onNewChat={createNewChat}
                onDeleteChat={deleteChat}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                theme={theme}
            />

            {/* Main Chat Area */}
            <div className="main-content">
                <Header
                    theme={theme}
                    onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                    onClearChat={clearCurrentChat}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
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
        </div>
    );
};

export default ChatPage;
