import React from 'react';

/**
 * Sidebar Component
 * Displays chat history and new chat button
 */
const Sidebar = ({
    chats,
    activeChatId,
    onSelectChat,
    onNewChat,
    isOpen,
    onClose,
    theme
}) => {
    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="brand" onClick={onNewChat} style={{ cursor: 'pointer' }}>
                        <div className="brand-icon">
                            <svg
                                width="24"
                                height="24"
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
                        <h2>Gemini Chat</h2>
                    </div>
                    <button onClick={onNewChat} className="new-chat-btn" aria-label="New Chat">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span className="btn-text">New Chat</span>
                    </button>
                </div>

                <div className="chat-list">
                    <div className="list-label">Recent Chats</div>
                    {chats.length === 0 ? (
                        <div className="empty-history">
                            <p>No chat history yet.</p>
                        </div>
                    ) : (
                        chats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => {
                                    onSelectChat(chat.id);
                                    if (window.innerWidth <= 768) onClose();
                                }}
                                className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                                title={chat.title || 'New Conversation'}
                            >
                                <svg className="chat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <span className="chat-title">{chat.title || 'New Conversation'}</span>
                                {activeChatId === chat.id && (
                                    <div className="active-indicator" />
                                )}
                            </button>
                        ))
                    )}
                </div>

                <div className="sidebar-footer">
                    <div className="user-mini-profile">
                        <div className="avatar-small">U</div>
                        <div className="user-info">
                            <div className="name">User</div>
                            <div className="status">Pro Plan</div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
