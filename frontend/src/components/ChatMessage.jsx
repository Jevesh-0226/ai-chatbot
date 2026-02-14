import React, { useState, useEffect, useRef } from 'react';

/**
 * ChatMessage Component
 * Renders individual chat messages with role-based styling
 * Implements streaming typewriter effect for AI responses
 */
const ChatMessage = ({ message, isLast, onStreamingComplete }) => {
    const { role, content, timestamp, isStreaming } = message;
    const [displayedContent, setDisplayedContent] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        // If it's an AI message marked for streaming
        if (role === 'ai' && isStreaming) {
            setDisplayedContent('');
            let index = 0;

            // Calculate typing speed based on content length
            // Start fast, maybe vary slightly for realism
            const speed = Math.max(10, Math.min(30, 1500 / content.length));

            intervalRef.current = setInterval(() => {
                if (index < content.length) {
                    setDisplayedContent((prev) => prev + content.charAt(index));
                    index++;
                } else {
                    clearInterval(intervalRef.current);
                    if (onStreamingComplete) onStreamingComplete();
                }
            }, speed);

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        } else {
            // Just display full content immediately for:
            // 1. User messages
            // 2. Old AI messages (not isStreaming)
            // 3. AI messages that finished streaming
            setDisplayedContent(content);
        }
    }, [content, isStreaming, role, onStreamingComplete]);

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
                <div className={`message-bubble ${role === 'ai' && isStreaming ? 'streaming' : ''}`}>
                    {displayedContent}
                    {role === 'ai' && isStreaming && displayedContent.length < content.length && (
                        <span className="cursor">|</span>
                    )}
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
