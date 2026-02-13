import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import List
from models.chat_models import Message

load_dotenv()

class GeminiService:
    def __init__(self):
        self.model = None

    def _initialize_model(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "YOUR_API_KEY_HERE":
            raise ValueError("GEMINI_API_KEY is missing from environment variables.")
        
        genai.configure(api_key=api_key)
        
        try:
            # Try to get the flash model directly first as it's the most common/modern
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            # Just test if it exists by looking at it (doesn't send a message)
            print("DEBUG: Attempting to use gemini-1.5-flash")
        except Exception:
            try:
                self.model = genai.GenerativeModel('gemini-pro')
                print("DEBUG: Falling back to gemini-pro")
            except Exception as e:
                raise ValueError(f"Could not find any suitable Gemini model: {str(e)}")

    async def get_chat_response(self, user_message: str, history: List[Message]) -> str:
        if not self.model:
            self._initialize_model()
            
        chat_history = []
        for msg in history:
            chat_history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content]
            })

        # Start chat session
        chat = self.model.start_chat(history=chat_history)
        
        # Send message
        try:
            response = chat.send_message(user_message)
            return response.text
        except Exception as e:
            # If 1.5-flash failed with 404, try pro as a one-time emergency switch
            if "404" in str(e) and "gemini-1.5-flash" in str(self.model.model_name):
                print("DEBUG: Emergency switch to gemini-pro due to 404")
                self.model = genai.GenerativeModel('gemini-pro')
                chat = self.model.start_chat(history=chat_history)
                response = chat.send_message(user_message)
                return response.text
            raise e

# Singleton instance
gemini_service = None

def get_gemini_service():
    global gemini_service
    if gemini_service is None:
        gemini_service = GeminiService()
    return gemini_service
