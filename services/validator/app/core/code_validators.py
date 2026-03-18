from typing import Dict, List

VALID_CLP_STATUS = {"1", "2", "3", "4", "19", "20", "22"}


def run_code_checks(segments: List[Dict]) -> List[Dict]:
    issues: List[Dict] = []
    for seg in segments:
        if seg.get("id") == "CLP":
            elems = seg.get("elements", [])
            if len(elems) > 1 and elems[1] not in VALID_CLP_STATUS:
                issues.append({
                    "severity": "warning",
                    "code": "UNKNOWN_CLP_STATUS",
                    "message": f"CLP status code '{elems[1]}' is uncommon or invalid.",
                    "segment": "CLP",
                    "location": f"segment_index={seg.get('index')}",
                    "fix_suggestion": "Verify CLP02 against 835 code list.",
                })
    return issues
