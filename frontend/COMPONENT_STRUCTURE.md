# Frontend Component Structure

## Overview
The frontend has been refactored into a clean, modular component-based architecture with modern UI/UX design.

## Directory Structure

```
src/
├── components/
│   ├── Header.jsx           # Chat header with branding and controls
│   ├── ChatContainer.jsx    # Message list and welcome screen
│   ├── ChatMessage.jsx      # Individual message component
│   ├── ChatInput.jsx        # Input field and send button
│   └── TypingIndicator.jsx  # Animated typing dots
├── pages/
│   └── ChatPage.jsx         # Main chat page (orchestrates all components)
├── App.jsx                  # Root component
├── App.css                  # Global styles
├── index.css                # Base styles
└── main.jsx                 # Entry point
```

## Components

### 1. **Header.jsx**
- Displays chatbot name and avatar
- Shows online status with pulsing indicator
- Theme toggle button (light/dark mode)
- Clear chat button

### 2. **ChatContainer.jsx**
- Scrollable message container
- Welcome screen with suggestion cards
- Renders all chat messages
- Shows typing indicator when AI is responding

### 3. **ChatMessage.jsx**
- Individual message bubble
- Avatar icons for user and AI
- Timestamp display
- Role-based styling (user vs AI)

### 4. **ChatInput.jsx**
- Text input field
- Send button with loading spinner
- Enter key support
- Disabled state during loading

### 5. **TypingIndicator.jsx**
- Animated three-dot indicator
- Shows when AI is processing

### 6. **ChatPage.jsx**
- Main page component
- Manages all state (messages, input, loading, theme)
- Handles API calls (unchanged from original)
- Auto-scroll functionality

## Features Implemented

✅ **Modern Component Architecture**
- Clean separation of concerns
- Reusable components
- Proper state management

✅ **Enhanced UI/UX**
- Message avatars for user and AI
- Gradient user message bubbles
- Smooth animations and transitions
- Hover effects on buttons
- Loading spinner in send button
- Suggestion cards on welcome screen

✅ **Dark Mode Support**
- Toggle button in header
- Consistent theming across all components
- Smooth theme transitions

✅ **Professional Design**
- Modern Inter font family
- Glassmorphism effects
- Soft shadows and rounded corners
- Responsive layout
- Mobile-friendly design

✅ **UX Enhancements**
- Auto-scroll to newest message
- Enter key sends message
- Input disabled while loading
- Typing indicator animation
- Message timestamps
- Clear chat functionality
- Welcome message with suggestions

## API Integration

**IMPORTANT:** The API call logic in `ChatPage.jsx` remains **completely unchanged** from the original implementation:
- Same endpoint: `https://ai-chatbot-0l8g.onrender.com/api/chat`
- Same request format
- Same response handling
- Same error handling

## Styling

The CSS has been enhanced with:
- CSS custom properties for theming
- Organized sections with comments
- Smooth animations (slideIn, float, bounce, pulse)
- Responsive breakpoints for mobile
- Modern color palette
- Improved shadows and borders

## Running the Application

```bash
cd frontend
npm install
npm run dev
```

The application will start on `http://localhost:5173` (or the next available port).

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- All functionality from the original app is preserved
- Backend remains completely untouched
- Component structure allows for easy future enhancements
- Code is well-commented for maintainability
