from typing import Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    transaction_type: Optional[str] = None
    segment: str
    error: str
    question: Optional[str] = None


class ChatResponse(BaseModel):
    explanation: str
    suggested_fix: str
