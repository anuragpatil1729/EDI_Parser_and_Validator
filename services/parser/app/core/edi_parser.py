from typing import Any, Dict

from app.core.loop_builder import build_loops
from app.core.segment_parser import parse_segments
from app.core.transaction_detector import detect_transaction_type


def parse_edi(raw_edi: str) -> Dict[str, Any]:
    segments = parse_segments(raw_edi)
    txn = detect_transaction_type(segments)
    loop_tree = build_loops(segments)
    return {
        "transaction_type": txn,
        "segments": [
            {"id": seg[0], "elements": seg[1:], "index": i}
            for i, seg in enumerate(segments)
        ],
        "loops": loop_tree,
        "metadata": {
            "segment_count": len(segments),
            "has_interchange": any(s[0] == "ISA" for s in segments),
            "has_functional_group": any(s[0] == "GS" for s in segments),
        },
    }
