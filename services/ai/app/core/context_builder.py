from typing import Dict


def build_context(transaction_type: str, segment: str, error: str) -> Dict[str, str]:
    return {
        "transaction_type": transaction_type,
        "segment": segment,
        "error": error,
    }
