from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from models.chat_models import ChatRequest, ChatResponse
from services.groq_service import get_groq_service, GroqService
from datetime import datetime
from utils.logger import setup_logger
import json

router = APIRouter()
logger = setup_logger(__name__)

@router.post("/chat")
async def chat_endpoint(request: ChatRequest, service: GroqService = Depends(get_groq_service)):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        async def event_generator():
            try:
                async for chunk in service.get_chat_response(request.message, request.history):
                    # We send simple text chunks for the frontend to consume
                    yield chunk
            except Exception as e:
                error_msg = f"Error: {str(e)}"
                logger.error(f"Streaming error: {error_msg}")
                yield f"\n[ERROR]: {error_msg}"

        return StreamingResponse(event_generator(), media_type="text/plain")
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error in chat endpoint: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)
