from typing import Dict, List


def run_cross_checks(transaction_type: str, segments: List[Dict]) -> List[Dict]:
    issues: List[Dict] = []

    if transaction_type == "837":
        has_clm = any(segment.get("id") == "CLM" for segment in segments)
        has_sbr = any(segment.get("id") == "SBR" for segment in segments)
        if has_clm and not has_sbr:
            issues.append(
                {
                    "severity": "error",
                    "code": "MISSING_SUBSCRIBER",
                    "message": "SBR segment is required when CLM exists in 837.",
                    "loop": "2000B",
                    "segment": "SBR",
                    "element_position": None,
                    "fix_suggestion": "Include SBR subscriber information before claim details.",
                }
            )

    return issues
