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
            # List all models to debug what is actually available on Render
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            print(f"DEBUG: Available models: {available_models}")
            
            if not available_models:
                raise ValueError("No generative models found for this API key.")

            # Priority 1: 1.5-flash (fastest/cheapest)
            # Priority 2: 1.0-pro (stable)
            # Priority 3: Anything available
            selected = None
            for target in ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro']:
                match = next((m for m in available_models if target in m), None)
                if match:
                    selected = match
                    break
            
            if not selected:
                selected = available_models[0]

            print(f"DEBUG: Selected model based on availability: {selected}")
            self.model = genai.GenerativeModel(selected)
            
        except Exception as e:
            print(f"Model Initialization Error: {str(e)}")
            # Last resort hardcode if list_models fails
            self.model = genai.GenerativeModel('gemini-1.5-flash')

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
            print(f"Error sending message: {str(e)}")
            raise e

# Singleton instance
gemini_service = None

def get_gemini_service():
    global gemini_service
    if gemini_service is None:
        gemini_service = GeminiService()
    return gemini_service
