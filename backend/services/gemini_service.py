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
        
        # Try to list models and find one that works
        try:
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            print(f"Available models: {available_models}")
            
            # Priority list of models to try
            for model_name in ['models/gemini-1.5-flash', 'models/gemini-pro', 'gemini-1.5-flash', 'gemini-pro']:
                if model_name in available_models or any(model_name in am for am in available_models):
                    self.model = genai.GenerativeModel(model_name)
                    print(f"Successfully selected model: {model_name}")
                    return
            
            # If none of our preferred models are found, take the first available one
            if available_models:
                self.model = genai.GenerativeModel(available_models[0])
                print(f"Selected fallback model: {available_models[0]}")
            else:
                # Last resort hardcoded
                self.model = genai.GenerativeModel('gemini-pro')
        except Exception as e:
            print(f"Error listing models: {e}. Falling back to gemini-pro.")
            self.model = genai.GenerativeModel('gemini-pro')

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
