def build_prompt(question: str, context: str) -> str:
    return (
        "You are a healthcare EDI assistant. "
        "Answer in plain English with actionable fixes. "
        f"Context: {context} Question: {question}"
    )
