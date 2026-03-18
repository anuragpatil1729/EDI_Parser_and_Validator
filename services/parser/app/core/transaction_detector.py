from typing import List

TRANSACTION_MAP = {
    "837": "837",
    "837P": "837",
    "837I": "837",
    "005010X222A1": "837",
    "005010X223A2": "837",
    "835": "835",
    "005010X221A1": "835",
    "834": "834",
    "005010X220A1": "834",
}


def detect_transaction_type(segments: List[List[str]]) -> str:
    for segment in segments:
        if segment[0] == "ST" and len(segment) > 1:
            st01 = segment[1]
            st03 = segment[3] if len(segment) > 3 else ""
            if st01 in TRANSACTION_MAP:
                return TRANSACTION_MAP[st01]
            if st03 in TRANSACTION_MAP:
                return TRANSACTION_MAP[st03]
            if "837" in st01:
                return "837"
            if "835" in st01:
                return "835"
            if "834" in st01:
                return "834"
    return "unknown"
