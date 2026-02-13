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
        self.current_model_name = None

    def _initialize_model(self, force_fallback=False):
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is missing.")
        
        genai.configure(api_key=self.api_key)
        
        try:
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            print(f"DEBUG: Available models: {available_models}")
            
            # Prioritize 1.5-flash and Pro, as 2.0-flash is currently showing limit: 0 for this account
            targets = [
                'models/gemini-1.5-flash',
                'models/gemini-pro',
                'models/gemini-1.5-pro',
                'models/gemini-2.0-flash-lite',
                'models/gemini-2.0-flash' # Moved to last because of the 'limit: 0' error
            ]
            
            # If we are forcing a fallback, remove the current failing model from the list
            if force_fallback and self.current_model_name in targets:
                targets.remove(self.current_model_name)

            selected = next((t for t in targets if t in available_models), available_models[0] if available_models else 'models/gemini-1.5-flash')
            
            print(f"DEBUG: Selecting model: {selected}")
            self.model = genai.GenerativeModel(selected)
            self.current_model_name = selected
            
        except Exception as e:
            print(f"Initialization Error: {e}")
            self.model = genai.GenerativeModel('models/gemini-1.5-flash')
            self.current_model_name = 'models/gemini-1.5-flash'

    async def get_chat_response(self, user_message: str, history: List[Message]) -> str:
        if not self.model:
            self._initialize_model()
            
        return await self._send_with_retry(user_message, history)

    async def _send_with_retry(self, user_message, history, retries=1):
        chat_history = []
        for msg in history:
            chat_history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content]
            })

        try:
            chat = self.model.start_chat(history=chat_history)
            response = chat.send_message(user_message)
            return response.text
        except Exception as e:
            error_str = str(e).lower()
            # If we hit a quota or "limit: 0" error, try to switch models immediately
            if ("quota" in error_str or "limit" in error_str or "429" in error_str) and retries > 0:
                print(f"DEBUG: Quota/Limit hit on {self.current_model_name}. Attempting fallback...")
                self._initialize_model(force_fallback=True)
                return await self._send_with_retry(user_message, history, retries - 1)
            
            print(f"Gemini API Error: {str(e)}")
            raise e

# Singleton instance
gemini_service = None

def get_gemini_service():
    global gemini_service
    if gemini_service is None:
        gemini_service = GeminiService()
    return gemini_service
