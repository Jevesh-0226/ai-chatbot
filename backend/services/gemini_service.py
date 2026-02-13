import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import List
from models.chat_models import Message

load_dotenv()

class GeminiService:
    def __init__(self):
        pass

    def _get_model(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "YOUR_API_KEY_HERE":
            raise ValueError("GEMINI_API_KEY is not set in environment variables.")
        
        genai.configure(api_key=api_key)
        # Using a fixed model name that is known to work broadly
        return genai.GenerativeModel('gemini-1.5-flash')

    async def get_chat_response(self, user_message: str, history: List[Message]) -> str:
        model = self._get_model()
        
        chat_history = []
        for msg in history:
            chat_history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content]
            })

        # Start chat session
        chat = model.start_chat(history=chat_history)
        
        # Send message
        response = chat.send_message(user_message)
        
        if not response or not response.text:
            return "The AI returned an empty response. Please try again."
            
        return response.text

# Singleton instance
gemini_service = None

def get_gemini_service():
    global gemini_service
    if gemini_service is None:
        gemini_service = GeminiService()
    return gemini_service
