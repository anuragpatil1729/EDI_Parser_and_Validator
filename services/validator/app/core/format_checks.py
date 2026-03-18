from datetime import datetime
from typing import Dict, List


def _valid_date(value: str) -> bool:
    if len(value) != 8 or not value.isdigit():
        return False
    try:
        datetime.strptime(value, "%Y%m%d")
        return True
    except ValueError:
        return False


def run_format_checks(segments: List[Dict]) -> List[Dict]:
    issues: List[Dict] = []
    for seg in segments:
        sid = seg.get("id")
        elems = seg.get("elements", [])
        if sid == "DTP" and elems:
            value = elems[-1]
            if not _valid_date(value):
                issues.append({
                    "severity": "error",
                    "code": "INVALID_DATE",
                    "message": f"Date '{value}' is not valid YYYYMMDD.",
                    "segment": "DTP",
                    "location": f"segment_index={seg.get('index')}",
                    "fix_suggestion": "Use format YYYYMMDD with a real calendar date.",
                })
        if sid == "NM1" and len(elems) > 8:
            qualifier = elems[7]
            identifier = elems[8]
            if qualifier == "XX" and (len(identifier) != 10 or not identifier.isdigit()):
                issues.append({
                    "severity": "error",
                    "code": "INVALID_NPI",
                    "message": f"NPI '{identifier}' must be 10 digits.",
                    "segment": "NM1",
                    "location": f"segment_index={seg.get('index')}",
                    "fix_suggestion": "Provide a 10-digit billing/rendering provider NPI.",
                })
    return issues
