from groq import AsyncGroq
import os
from dotenv import load_dotenv
from typing import List
from models.chat_models import Message

load_dotenv()

class GroqService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if self.api_key:
            self.api_key = self.api_key.strip()
        self.client = None
        self.model = "llama-3.1-8b-instant" # Using a faster, versatile model

    def _initialize_client(self):
        if not self.api_key:
            raise ValueError("GROQ_API_KEY is missing from environment variables.")
        
        self.client = AsyncGroq(api_key=self.api_key)

    async def get_chat_response(self, user_message: str, history: List[Message]):
        if not self.client:
            self._initialize_client()
            
        messages = []
        for msg in history:
            messages.append({
                "role": "user" if msg.role == "user" else "assistant",
                "content": msg.content
            })
        
        # Add the current user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=4096,
                top_p=1,
                stream=True,
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            print(f"Groq Service Error: {str(e)}")
            raise e

# Singleton instance
groq_service = None

def get_groq_service():
    global groq_service
    if groq_service is None:
        groq_service = GroqService()
    return groq_service
