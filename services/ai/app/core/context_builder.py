from typing import Dict, List


def build_context(transaction_type: str | None, validation_issues: List[Dict] | None) -> str:
    txn = transaction_type or "unknown"
    issues = validation_issues or []
    top = ", ".join(i.get("code", "UNKNOWN") for i in issues[:5]) or "none"
    return f"Transaction={txn}; issue_count={len(issues)}; top_codes={top}."
