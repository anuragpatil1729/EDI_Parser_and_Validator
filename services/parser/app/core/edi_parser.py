from typing import Any, Dict

from app.core.loop_builder import LOOP_BY_SEGMENT, build_loops
from app.core.segment_parser import parse_segments
from app.core.transaction_detector import detect_transaction_type


def parse_edi(raw_edi: str) -> Dict[str, Any]:
    segments = parse_segments(raw_edi)
    transaction_type = detect_transaction_type(segments)
    loop_tree = build_loops(segments)

    return {
        "transaction_type": transaction_type,
        "segments": [
            {
                "id": segment[0],
                "elements": segment[1:],
                "index": index,
                "loop": LOOP_BY_SEGMENT.get(segment[0], "UNMAPPED"),
            }
            for index, segment in enumerate(segments)
        ],
        "loops": loop_tree,
        "metadata": {
            "segment_count": len(segments),
            "has_interchange": any(segment[0] == "ISA" for segment in segments),
            "has_functional_group": any(segment[0] == "GS" for segment in segments),
        },
    }
