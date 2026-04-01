import React from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

/**
 * ChatContainer Component
 * Scrollable container for all chat messages
 * Displays welcome screen when no messages exist
 */
const ChatContainer = ({ messages, isLoading, messagesEndRef }) => {
    return (
        <main className="chat-messages">
            {messages.length === 0 ? (
                <div className="welcome-screen">
                    <div className="welcome-icon">
                        <svg
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h1>Hello, I'm Gemini.</h1>
                    <p>How can I help you today? I can assist with writing, learning, brainstorming, or just chat about anything.</p>

                    <div className="suggestion-cards">
                        <div className="suggestion-card">
                            <div className="suggestion-icon">💡</div>
                            <div className="suggestion-text">Creative ideas</div>
                        </div>
                        <div className="suggestion-card">
                            <div className="suggestion-icon">📚</div>
                            <div className="suggestion-text">Learn something new</div>
                        </div>
                        <div className="suggestion-card">
                            <div className="suggestion-icon">✍️</div>
                            <div className="suggestion-text">Writing assistance</div>
                        </div>
                        <div className="suggestion-card">
                            <div className="suggestion-icon">🔍</div>
                            <div className="suggestion-text">Research & analysis</div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    {isLoading && <TypingIndicator />}
                </>
            )}
            <div ref={messagesEndRef} />
        </main>
    );
};

export default ChatContainer;
