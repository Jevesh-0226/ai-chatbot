import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import List
from models.chat_models import Message

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "YOUR_API_KEY_HERE":
            print("ERROR: GEMINI_API_KEY is not set correctly in .env")
            raise ValueError("GEMINI_API_KEY not found or default value used")
        
        print(f"Gemini service initialized successfully using key starting with: {api_key[:4]}...")
        
        genai.configure(api_key=api_key)
        
        # List available models to find a valid one
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        print(f"Available models: {available_models}")
        
        # Try to find a preferred model
        preferred_models = ['models/gemini-1.5-flash', 'models/gemini-1.5-flash-latest', 'models/gemini-pro']
        selected_model = None
        
        for pm in preferred_models:
            if pm in available_models:
                selected_model = pm
                break
        
        if not selected_model and available_models:
            selected_model = available_models[0]
            
        if not selected_model:
            raise ValueError("No generative models found for this API key.")
            
        print(f"DEBUG: Successfully selected model: {selected_model}")
        self.model = genai.GenerativeModel(selected_model)

    async def get_chat_response(self, user_message: str, history: List[Message]) -> str:
        # Convert our message format to Gemini's format
        # Gemini expects 'user' and 'model' roles (not 'assistant')
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
