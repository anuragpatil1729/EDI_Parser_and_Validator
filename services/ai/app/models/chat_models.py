from typing import Dict, List, Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str
    transaction_type: Optional[str] = None
    validation_issues: Optional[List[Dict]] = None


class ChatResponse(BaseModel):
    answer: str
    next_steps: List[str]
