from typing import Any, Dict, List

LOOP_BY_SEGMENT: Dict[str, str] = {
    "ISA": "INTERCHANGE",
    "GS": "FUNCTIONAL_GROUP",
    "ST": "TRANSACTION_SET",
    "BHT": "1000",
    "NM1": "1000A",
    "HL": "2000",
    "CLM": "2300",
    "LX": "2000",
    "INS": "2000",
}


def build_loops(segments: List[List[str]]) -> Dict[str, Any]:
    root: Dict[str, Any] = {"loop": "ROOT", "segments": [], "children": []}
    current_nodes: Dict[str, Dict[str, Any]] = {"ROOT": root}

    for index, segment in enumerate(segments):
        segment_id = segment[0]
        loop_id = LOOP_BY_SEGMENT.get(segment_id, "UNMAPPED")

        if loop_id not in current_nodes:
            node = {"loop": loop_id, "segments": [], "children": []}
            root["children"].append(node)
            current_nodes[loop_id] = node

        current_nodes[loop_id]["segments"].append(
            {"id": segment_id, "elements": segment[1:], "index": index, "loop": loop_id}
        )

    return root
