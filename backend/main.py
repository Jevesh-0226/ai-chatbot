from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat
import uvicorn
import logging
import os
import google.generativeai as genai

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI Chatbot API is running"}

@app.get("/api/debug-models")
async def debug_models():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "API Key is missing from environment"}
    
    try:
        genai.configure(api_key=api_key)
        models = [m.name for m in genai.list_models()]
        return {
            "api_key_status": "Loaded (First 4: " + api_key[:4] + ")",
            "available_models": models
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
