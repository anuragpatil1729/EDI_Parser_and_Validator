import json
import os
import re
from typing import Any, Dict, Optional, Literal

import httpx

GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
Provider = Literal["ollama", "gemini"]


def _extract_first_json_object(text: str) -> Optional[dict[str, Any]]:
    if not text:
        return None

    code_block_match = re.search(r"```json\s*(\{.*?\})\s*```", text, flags=re.DOTALL)
    if code_block_match:
        try:
            return json.loads(code_block_match.group(1))
        except Exception:
            pass

    start = text.find("{")
    if start == -1:
        return None

    depth = 0
    in_string = False
    escape_next = False

    for i, ch in enumerate(text[start:], start=start):
        if escape_next:
            escape_next = False
            continue
        if ch == "\\" and in_string:
            escape_next = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                candidate = text[start:i + 1]
                try:
                    return json.loads(candidate)
                except Exception:
                    return None

    return None


def is_ollama_available() -> bool:
    ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434").rstrip("/")
    try:
        response = httpx.get(f"{ollama_url}/api/tags", timeout=3)
        return response.status_code < 400
    except Exception:
        return False


def get_active_provider() -> Dict[str, str]:
    if is_ollama_available():
        return {"provider": "ollama", "model": os.getenv("OLLAMA_MODEL", "edi-translator")}
    return {"provider": "gemini", "model": "gemini-1.5-flash"}


def _fallback_response(payload: Dict[str, str]) -> Dict[str, str]:
    return {
        "explanation": (
            f"The error '{payload['error']}' in segment {payload['segment']} indicates a structural or format mismatch. "
            "Payers reject this when the segment does not match implementation guide expectations."
        ),
        "suggested_fix": "Review the segment values, correct identifiers/date formats, and re-run validation before resubmission.",
    }


def _generate_with_gemini(prompt: str, context: Dict[str, str]) -> Dict[str, str]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return _fallback_response(context)

    body = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        response = httpx.post(f"{GEMINI_ENDPOINT}?key={api_key}", json=body, timeout=20)
        response.raise_for_status()
        data = response.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        explanation = lines[0] if lines else _fallback_response(context)["explanation"]
        suggested_fix = lines[1] if len(lines) > 1 else _fallback_response(context)["suggested_fix"]
        return {"explanation": explanation, "suggested_fix": suggested_fix}
    except Exception:
        return _fallback_response(context)


def _fallback_json(context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    tx = context.get("transaction_type") if context else None
    return {
        "transaction_type": tx or "unknown",
        "sections": {},
        "issues_summary": {},
        "readable_walkthrough": "Translation is unavailable because the LLM provider is currently unavailable.",
    }


def generate_response(prompt: str, context: Dict[str, str]) -> Dict[str, str]:
    provider = get_active_provider()["provider"]
    if provider == "ollama":
        from app.core.ollama_client import generate_chat_response_ollama

        return generate_chat_response_ollama(prompt, model=os.getenv("OLLAMA_MODEL", "edi-translator"), context=context)
    return _generate_with_gemini(prompt, context)


def generate_json_response(prompt: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return _fallback_json(context)

    body: Dict[str, Any] = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json"},
    }

    try:
        response = httpx.post(f"{GEMINI_ENDPOINT}?key={api_key}", json=body, timeout=30)
        response.raise_for_status()
        data = response.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        parsed = _extract_first_json_object(text)
        return parsed if parsed is not None else _fallback_json(context)
    except Exception:
        return _fallback_json(context)
