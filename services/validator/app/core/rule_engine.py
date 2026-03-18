from typing import Dict, List

REQUIRED_BY_TXN = {
    "837": ["ST", "BHT", "NM1", "CLM", "SE"],
    "835": ["ST", "BPR", "TRN", "SE"],
    "834": ["ST", "BGN", "INS", "SE"],
}


def run_required_segment_rules(transaction_type: str, segments: List[Dict]) -> List[Dict]:
    segment_ids = [s.get("id") for s in segments]
    issues: List[Dict] = []
    for req in REQUIRED_BY_TXN.get(transaction_type, []):
        if req not in segment_ids:
            issues.append({
                "severity": "error",
                "code": "MISSING_SEGMENT",
                "message": f"Required segment '{req}' is missing for transaction {transaction_type}.",
                "segment": req,
                "location": "structural",
                "fix_suggestion": f"Insert required segment {req} in the correct loop.",
            })
    return issues
