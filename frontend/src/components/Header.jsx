import React from 'react';

/**
 * Header Component
 * Displays chatbot name, avatar, status, theme toggle, and clear chat button
 * Includes mobile menu toggle for sidebar
 */
const Header = ({ theme, onToggleTheme, onClearChat, onToggleSidebar }) => {
    return (
        <header className="chat-header">
            <div className="header-left">
                <button
                    className="icon-button mobile-menu-btn"
                    onClick={onToggleSidebar}
                    aria-label="Toggle Menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                <div className="header-info">
                    <div className="avatar-circle">
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
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Gemini Assistant</h3>
                        <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#10b981',
                                display: 'inline-block',
                                animation: 'pulse 2s infinite'
                            }} />
                            Online
                        </span>
                    </div>
                </div>
            </div>

            <div className="header-right">
                <button
                    onClick={onToggleTheme}
                    className="icon-button theme-toggle"
                    aria-label="Toggle theme"
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <button
                    onClick={onClearChat}
                    className="icon-button clear-button"
                    aria-label="Clear chat"
                    title="Clear all messages"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
