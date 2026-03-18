from __future__ import annotations

from typing import Any, Dict


def build_prompt(question: str, context: Dict[str, Any]) -> str:
    return (
        "You are a healthcare EDI expert assistant. "
        "Provide a practical response with three sections: "
        "(1) what the segment means, "
        "(2) why this validation error happens, "
        "(3) exactly how to fix it in the EDI file.\n\n"
        f"Transaction: {context.get('transaction_type', 'unknown')}\n"
        f"Segment: {context.get('segment', 'unknown')}\n"
        f"Segment meaning hint: {context.get('segment_meaning', 'N/A')}\n"
        f"Current value: {context.get('value', '')}\n"
        f"Validation error: {context.get('error', '')}\n"
        f"User question: {question}\n\n"
        "Keep the answer concise, actionable, and avoid generic advice."
    )
