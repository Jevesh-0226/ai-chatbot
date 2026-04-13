from fastapi import APIRouter, HTTPException, Depends
from models.chat_models import ChatRequest, ChatResponse
from services.groq_service import get_groq_service, GroqService
from datetime import datetime
from utils.logger import setup_logger

router = APIRouter()
logger = setup_logger(__name__)

@router.post("/chat")
async def chat_endpoint(request: ChatRequest, service: GroqService = Depends(get_groq_service)):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Collect the full response from the stream
        full_response = ""
        try:
            async for chunk in service.get_chat_response(request.message, request.history):
                full_response += chunk
        except Exception as e:
            error_msg = f"Error: {str(e)}"
            logger.error(f"Streaming error: {error_msg}")
            raise HTTPException(status_code=500, detail=error_msg)

        # Return as JSON response
        response_obj = ChatResponse(
            response=full_response,
            timestamp=datetime.now()
        )
        logger.info(f"Returning response: response_type={type(response_obj)}, content_preview={full_response[:100]}")
        return response_obj
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error in chat endpoint: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)
