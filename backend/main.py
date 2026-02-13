from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat
import uvicorn
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

# Wide open CORS for troubleshooting
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

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
