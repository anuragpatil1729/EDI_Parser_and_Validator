from typing import List


def detect_transaction_type(segments: List[List[str]]) -> str:
    for seg in segments:
        if seg[0] == "ST" and len(seg) > 1:
            code = seg[1]
            if "837" in code:
                return "837"
            if "835" in code:
                return "835"
            if "834" in code:
                return "834"
    return "unknown"
