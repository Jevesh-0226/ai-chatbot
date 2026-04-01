import React, { useState, useEffect, useRef } from 'react';

/**
 * ChatMessage Component
 * Renders individual chat messages with role-based styling
 * Implements streaming typewriter effect for AI responses
 */
const ChatMessage = ({ message }) => {
    const { role, content, timestamp, isStreaming } = message;
    const [displayedContent, setDisplayedContent] = useState('');
    // Track typing status locally to control cursor visibility manually
    const [isTyping, setIsTyping] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        // If it's an AI message marked for streaming
        if (role === 'ai' && isStreaming) {
            setDisplayedContent('');
            setIsTyping(true); // Start typing
            let index = 0;

            // Calculate typing speed based on content length
            // Start fast, maybe vary slightly for realism
            const speed = Math.max(10, Math.min(30, 1500 / content.length));

            intervalRef.current = setInterval(() => {
                if (index < content.length) {
                    // Use functional update to ensure character correctness
                    // Capture current char based on updated index from closure? 
                    // No, index is mutable variable. 
                    // Better to rely on string slicing to be absolutely safe against skips
                    // setDisplayedContent(content.slice(0, index + 1));
                    // But char-by-char is efficient enough.
                    const char = content.charAt(index);
                    setDisplayedContent((prev) => prev + char);
                    index++;
                } else {
                    clearInterval(intervalRef.current);
                    setIsTyping(false); // Stop typing, hide cursor
                }
            }, speed);

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        } else {
            // Just display full content immediately
            setDisplayedContent(content);
            setIsTyping(false);
        }
    }, [content, isStreaming, role]);

    return (
        <div className={`message-wrapper ${role} message-enter`}>
            {role === 'ai' && (
                <div className="message-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
            )}

            <div className="message-content">
                <div className={`message-bubble ${role === 'ai' && isStreaming ? 'streaming' : ''}`}>
                    {displayedContent}
                    {/* Only show cursor if we are actively typing */}
                    {isTyping && (
                        <span className="cursor">|</span>
                    )}
                </div>
                <div className="message-time">{timestamp}</div>
            </div>

            {role === 'user' && (
                <div className="message-avatar user-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
