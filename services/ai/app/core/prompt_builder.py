from typing import Dict


def build_prompt(question: str, context: Dict[str, str]) -> str:
    return (
        "You are a healthcare EDI expert. "
        "Explain the error in plain English and provide a concise fix. "
        f"Transaction: {context['transaction_type']}. "
        f"Segment: {context['segment']}. "
        f"Error: {context['error']}. "
        f"Question: {question}"
    )
