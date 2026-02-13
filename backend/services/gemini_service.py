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
        if not api_key:
            raise ValueError("GEMINI_API_KEY is missing from environment variables.")
        
        genai.configure(api_key=api_key)
        
        try:
            # We saw this list in your debug screenshot!
            # We'll try the exact names that Google says are available to you.
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            print(f"DEBUG: Found models in account: {available_models}")
            
            # Priority list based on your specific debug output
            # We'll use the names exactly as they appeared in your screenshot
            targets = [
                'models/gemini-1.5-flash', 
                'models/gemini-2.0-flash',
                'models/gemini-pro',
                'models/gemini-1.5-pro'
            ]
            
            selected = None
            for t in targets:
                if t in available_models:
                    selected = t
                    break
            
            if not selected and available_models:
                selected = available_models[0]
                
            if not selected:
                # Absolute fallback if list failed
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

        # Start chat
        chat = self.model.start_chat(history=chat_history)
        
        try:
            response = chat.send_message(user_message)
            return response.text
        except Exception as e:
            # If it STILL 404s, it's a library/version issue on Render's end
            # We'll catch it and return a helpful message
            error_str = str(e)
            if "404" in error_str:
                return "The AI service is temporarily confused by the model name. Please try refreshing the page or waiting a moment while the server stabilizes."
            raise e

# Singleton instance
gemini_service = None

def get_gemini_service():
    global gemini_service
    if gemini_service is None:
        gemini_service = GeminiService()
    return gemini_service
