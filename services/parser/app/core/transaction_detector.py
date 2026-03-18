from __future__ import annotations

from typing import Dict, List

TRANSACTION_MAP = {
    "837": "837",
    "837P": "837P",
    "837I": "837I",
    "837D": "837D",
    "005010X222A1": "837P",
    "005010X223A2": "837I",
    "005010X224A2": "837D",
    "835": "835",
    "005010X221A1": "835",
    "834": "834",
    "005010X220A1": "834",
}


def detect_transaction_type(segments: List[List[str]]) -> str:
    for segment in segments:
        if segment[0] != "ST" or len(segment) < 2:
            continue

        st01 = segment[1].strip()
        st03 = segment[3].strip() if len(segment) > 3 else ""

        if st03 in TRANSACTION_MAP:
            return TRANSACTION_MAP[st03]
        if st01 in TRANSACTION_MAP:
            return TRANSACTION_MAP[st01]

        if "837" in st01:
            return "837"
        if "835" in st01:
            return "835"
        if "834" in st01:
            return "834"

    return "unknown"


def extract_metadata(segments: List[List[str]], transaction_type: str) -> Dict[str, str]:
    metadata: Dict[str, str] = {
        "type": transaction_type,
        "sender": "",
        "receiver": "",
        "group": "",
        "date": "",
    }

    for segment in segments:
        segment_id = segment[0]
        if segment_id == "ISA":
            if len(segment) > 6:
                metadata["sender"] = segment[6]
            if len(segment) > 8:
                metadata["receiver"] = segment[8]
            if len(segment) > 9:
                metadata["date"] = f"20{segment[9]}" if len(segment[9]) == 6 else segment[9]

        if segment_id == "GS":
            if len(segment) > 1:
                metadata["group"] = segment[1]
            if not metadata["date"] and len(segment) > 4:
                metadata["date"] = segment[4]

        if segment_id == "ST" and len(segment) > 1:
            if segment[1] in {"837", "835", "834"}:
                metadata["type"] = segment[1]
            if len(segment) > 3 and segment[3] in TRANSACTION_MAP:
                metadata["type"] = TRANSACTION_MAP[segment[3]]

    return metadata
