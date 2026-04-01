# Professional AI Chatbot Web Application

A modern, aesthetic, and production-ready chatbot application built with FastAPI (Python) and React (Vite). Powered by Groq AI and Llama 3.

## 🚀 Features

- **Modern UI**: Clean, responsive design with glassmorphism and smooth animations.
- **Real-time Interaction**: Instant AI responses with a typing indicator.
- **Conversation Context**: Remembers previous messages in the session.
- **Professional Backend**: Built with FastAPI, featuring modular architecture and error handling.
- **Secure**: API keys are stored only in the backend environment.

## 🛠 Tech Stack

- **Frontend**: React (Vite), CSS3 (Custom Design System).
- **Backend**: Python FastAPI.
- **AI Model**: Llama 3 (via Groq API).
- **Tools**: Pydantic, Dotenv, Groq Python SDK.

## 📂 Project Structure

```text
ai-chatbot/
├── backend/
│   ├── main.py              # Entry point
│   ├── routes/              # API endpoints
│   ├── services/            # AI service logic
│   ├── models/              # Data models
│   ├── .env                 # Environment variables (Create this)
│   └── requirements.txt      # Python dependencies
└── frontend/
    ├── src/
    │   ├── App.jsx          # Main chat interface
    │   └── App.css          # Modern styling
    └── index.html           # HTML template
```

## ⚙️ Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on `.env.example` and add your **GROQ_API_KEY**.
5. Start the backend:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables

The backend requires the following in `.env`:
- `GROQ_API_KEY`: Your API key from [Groq Console](https://console.groq.com/).
- `PORT`: (Optional) Default is 8000.

---
Built for portfolio demonstration.
