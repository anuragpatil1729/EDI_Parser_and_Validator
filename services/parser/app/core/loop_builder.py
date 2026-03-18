from __future__ import annotations

from typing import Any, Dict, List, Optional

LOOP_BY_SEGMENT: Dict[str, str] = {
    "ISA": "INTERCHANGE",
    "GS": "FUNCTIONAL_GROUP",
    "ST": "TRANSACTION_SET",
    "BHT": "HEADER",
    "NM1": "NAME",
    "CLM": "2300",
    "LX": "2400",
    "INS": "2000",
    "CLP": "2100",
}

HL_LOOP_MAP: Dict[str, str] = {
    "20": "2000A",  # Billing / Information source
    "21": "2000A",
    "22": "2000B",  # Subscriber
    "23": "2000C",  # Patient / dependent
}


def _segment_to_model(segment: List[str], index: int, loop_id: str) -> Dict[str, Any]:
    return {
        "id": segment[0],
        "elements": segment[1:],
        "index": index,
        "loop": loop_id,
    }


def _new_hl_node(hl_id: str, parent_id: Optional[str], loop_id: str, index: int, segment: List[str]) -> Dict[str, Any]:
    return {
        "loop": loop_id,
        "hl_id": hl_id,
        "parent_id": parent_id,
        "segments": [_segment_to_model(segment, index, loop_id)],
        "children": [],
    }


def _new_container(loop_id: str) -> Dict[str, Any]:
    return {"loop": loop_id, "segments": [], "children": []}


def build_loops(segments: List[List[str]]) -> Dict[str, Any]:
    root: Dict[str, Any] = _new_container("ROOT")
    hl_nodes: Dict[str, Dict[str, Any]] = {}
    current_hl_node: Optional[Dict[str, Any]] = None
    root_containers: Dict[str, Dict[str, Any]] = {}

    for index, segment in enumerate(segments):
        segment_id = segment[0]

        if segment_id == "HL":
            hl_id = segment[1] if len(segment) > 1 and segment[1] else str(index)
            parent_id = segment[2] if len(segment) > 2 and segment[2] else None
            hl_code = segment[3] if len(segment) > 3 else ""
            loop_id = HL_LOOP_MAP.get(hl_code, "2000")

            node = _new_hl_node(hl_id=hl_id, parent_id=parent_id, loop_id=loop_id, index=index, segment=segment)
            hl_nodes[hl_id] = node

            if parent_id and parent_id in hl_nodes:
                hl_nodes[parent_id]["children"].append(node)
            else:
                root["children"].append(node)

            current_hl_node = node
            continue

        if current_hl_node:
            loop_id = current_hl_node["loop"]
            current_hl_node["segments"].append(_segment_to_model(segment, index, loop_id))
            continue

        loop_id = LOOP_BY_SEGMENT.get(segment_id, "UNMAPPED")
        if loop_id not in root_containers:
            root_containers[loop_id] = _new_container(loop_id)
            root["children"].append(root_containers[loop_id])

        root_containers[loop_id]["segments"].append(_segment_to_model(segment, index, loop_id))

    return root
