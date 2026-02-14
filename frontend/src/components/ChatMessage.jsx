import React from 'react';

/**
 * ChatMessage Component
 * Renders individual chat messages with role-based styling
 * @param {Object} message - Message object containing role, content, and timestamp
 */
const ChatMessage = ({ message }) => {
    const { role, content, timestamp } = message;

    return (
        <div className={`message-wrapper ${role} message-enter`}>
            {role === 'ai' && (
                <div className="message-avatar">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
            )}

            <div className="message-content">
                <div className="message-bubble">
                    {content}
                </div>
                <div className="message-time">{timestamp}</div>
            </div>

            {role === 'user' && (
                <div className="message-avatar user-avatar">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
