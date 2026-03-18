import os
from typing import Dict

import httpx

GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


def _fallback_response(payload: Dict[str, str]) -> Dict[str, str]:
    return {
        "explanation": (
            f"The error '{payload['error']}' in segment {payload['segment']} indicates a structural or format mismatch. "
            "Payers reject this when the segment does not match implementation guide expectations."
        ),
        "suggested_fix": "Review the segment values, correct identifiers/date formats, and re-run validation before resubmission.",
    }


def generate_response(prompt: str, context: Dict[str, str]) -> Dict[str, str]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return _fallback_response(context)

    body = {
        "contents": [
            {
                "parts": [{"text": prompt}],
            }
        ]
    }

    try:
        response = httpx.post(
            f"{GEMINI_ENDPOINT}?key={api_key}",
            json=body,
            timeout=20,
        )
        response.raise_for_status()
        data = response.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        explanation = lines[0] if lines else _fallback_response(context)["explanation"]
        suggested_fix = lines[1] if len(lines) > 1 else _fallback_response(context)["suggested_fix"]
        return {"explanation": explanation, "suggested_fix": suggested_fix}
    except Exception:
        return _fallback_response(context)
