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
    onDeleteChat,
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
                            <p style={{ padding: '0 10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                No chat history yet.
                            </p>
                        </div>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat.id}
                                className={`chat-item-container ${activeChatId === chat.id ? 'active' : ''}`}
                            >
                                <button
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
                                </button>

                                <button
                                    className="delete-chat-btn"
                                    onClick={(e) => onDeleteChat(chat.id, e)}
                                    title="Delete Chat"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
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
