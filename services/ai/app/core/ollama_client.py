from __future__ import annotations

import os
from typing import Any, Dict, Optional

import httpx

from app.core.llm_client import _extract_first_json_object


def _fallback_json(context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    tx = context.get("transaction_type") if context else None
    return {
        "transaction_type": tx or "unknown",
        "sections": {},
        "issues_summary": {},
        "readable_walkthrough": "Translation is unavailable because the Ollama inference endpoint did not return valid JSON.",
    }


def generate_chat_response_ollama(prompt: str, model: str, context: Optional[Dict[str, str]] = None) -> Dict[str, str]:
    ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434").rstrip("/")
    fallback = {
        "explanation": f"Issue in segment {context.get('segment', 'UNKNOWN') if context else 'UNKNOWN'} requires format alignment with implementation guide.",
        "suggested_fix": "Check the segment values and submit once validated.",
    }

    try:
        response = httpx.post(
            f"{ollama_url}/api/generate",
            json={"model": model, "prompt": prompt, "stream": False},
            timeout=40,
        )
        response.raise_for_status()
        text = str(response.json().get("response") or "")
        parsed = _extract_first_json_object(text)
        if parsed and isinstance(parsed.get("explanation"), str) and isinstance(parsed.get("suggested_fix"), str):
            return {"explanation": parsed["explanation"], "suggested_fix": parsed["suggested_fix"]}

        lines = [line.strip() for line in text.splitlines() if line.strip()]
        if lines:
            return {"explanation": lines[0], "suggested_fix": lines[1] if len(lines) > 1 else fallback["suggested_fix"]}
    except Exception:
        pass

    return fallback


async def generate_json_response_ollama(prompt: str, *, model: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434").rstrip("/")

    base_payload: Dict[str, Any] = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": float(os.getenv("OLLAMA_TEMPERATURE", "0.2"))},
    }

    try:
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(f"{ollama_url}/api/generate", json={**base_payload, "format": "json"})
        resp.raise_for_status()
        text = str(resp.json().get("response") or "")
        parsed = _extract_first_json_object(text)
        return parsed if parsed is not None else _fallback_json(context)
    except Exception:
        return _fallback_json(context)
