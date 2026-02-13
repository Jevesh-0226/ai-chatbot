import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import List
from models.chat_models import Message

load_dotenv()

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        if self.api_key and self.api_key != "YOUR_API_KEY_HERE":
            genai.configure(api_key=self.api_key)
            self._initialize_model()

    def _initialize_model(self):
        try:
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            preferred_models = ['models/gemini-1.5-flash', 'models/gemini-pro']
            selected_model = next((pm for pm in preferred_models if pm in available_models), available_models[0] if available_models else 'models/gemini-pro')
            self.model = genai.GenerativeModel(selected_model)
            print(f"DEBUG: Selected model: {selected_model}")
        except Exception as e:
            print(f"Error initializing model: {e}")

    async def get_chat_response(self, user_message: str, history: List[Message]) -> str:
        if not self.api_key or self.api_key == "YOUR_API_KEY_HERE":
            raise ValueError("GEMINI_API_KEY is missing. Please set it in your Render environment variables.")
        if not self.model:
            self._initialize_model()
            if not self.model:
                raise ValueError("Could not initialize Gemini model. Check your API key and permissions.")

        # Convert our message format to Gemini's format
        chat_history = []
        for msg in history:
            chat_history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content]
            })

        # Start a chat session with history
        chat = self.model.start_chat(history=chat_history)
        
        # Send the user message
        response = chat.send_message(user_message)
        
        return response.text

# Singleton instance
gemini_service = None

def get_gemini_service():
    global gemini_service
    if gemini_service is None:
        gemini_service = GeminiService()
    return gemini_service
