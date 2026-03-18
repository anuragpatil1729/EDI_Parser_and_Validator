from typing import Dict, List


def run_cross_checks(transaction_type: str, segments: List[Dict]) -> List[Dict]:
    issues: List[Dict] = []
    ids = [s.get("id") for s in segments]

    if transaction_type == "837" and "CLM" not in ids:
        issues.append({
            "severity": "error",
            "code": "MISSING_CLM",
            "message": "837 must include at least one CLM (claim information) segment.",
            "segment": "CLM",
            "location": "loop=2300",
            "fix_suggestion": "Add CLM segment for each claim.",
        })
    if transaction_type == "835" and "BPR" not in ids:
        issues.append({
            "severity": "error",
            "code": "MISSING_BPR",
            "message": "835 must include BPR (financial information).",
            "segment": "BPR",
            "location": "header",
            "fix_suggestion": "Add BPR segment near transaction start.",
        })
    if transaction_type == "834" and "INS" not in ids:
        issues.append({
            "severity": "error",
            "code": "MISSING_INS",
            "message": "834 must include INS (member level detail).",
            "segment": "INS",
            "location": "loop=2000",
            "fix_suggestion": "Add INS segment for each enrolled member.",
        })
    return issues
