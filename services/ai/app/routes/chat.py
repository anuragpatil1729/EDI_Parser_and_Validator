from fastapi import APIRouter

from app.core.context_builder import build_context
from app.core.llm_client import generate_response
from app.core.prompt_builder import build_prompt
from app.models.chat_models import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    context = build_context(payload.transaction_type, payload.validation_issues)
    _ = build_prompt(payload.question, context)
    issue_codes = [i.get("code", "UNKNOWN") for i in (payload.validation_issues or [])]
    response = generate_response(issue_codes)
    return ChatResponse(**response)
