import React from 'react';

/**
 * TypingIndicator Component
 * Animated typing indicator shown while AI is generating response
 */
const TypingIndicator = () => {
    return (
        <div className="message-wrapper ai message-enter">
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

            <div className="message-content">
                <div className="message-bubble typing-bubble">
                    <div className="typing">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
