import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import List
from models.chat_models import Message

load_dotenv()

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            self.api_key = self.api_key.strip()
        self.model = None

    def _initialize_model(self):
        if not self.api_key or self.api_key == "YOUR_API_KEY_HERE":
            raise ValueError("GEMINI_API_KEY is missing from environment variables.")
        
        genai.configure(api_key=self.api_key)
        
        try:
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            print(f"DEBUG: Found models: {available_models}")
            
            # Using exact names verified from debug endpoint
            targets = [
                'models/gemini-1.5-flash', 
                'models/gemini-2.0-flash',
                'models/gemini-pro',
                'models/gemini-1.5-pro'
            ]
            
            selected = next((t for t in targets if t in available_models), None)
            if not selected and available_models:
                selected = available_models[0]
                
            if not selected:
                selected = 'models/gemini-1.5-flash'

            print(f"DEBUG: Final decision - using {selected}")
            self.model = genai.GenerativeModel(selected)
            
        except Exception as e:
            print(f"Initialization Error: {e}")
            self.model = genai.GenerativeModel('models/gemini-1.5-flash')

    async def get_chat_response(self, user_message: str, history: List[Message]) -> str:
        if not self.model:
            self._initialize_model()
            
        chat_history = []
        for msg in history:
            chat_history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content]
            })

        chat = self.model.start_chat(history=chat_history)
        
        try:
            response = chat.send_message(user_message)
            return response.text
        except Exception as e:
            error_str = str(e)
            print(f"Gemini API Error: {error_str}")
            # Re-throw so the route handler can catch it with detail
            raise e

# Singleton instance
gemini_service = None

def get_gemini_service():
    global gemini_service
    if gemini_service is None:
        gemini_service = GeminiService()
    return gemini_service
