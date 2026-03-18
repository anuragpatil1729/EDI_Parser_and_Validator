from typing import Any, Dict, List


def build_loops(segments: List[List[str]]) -> Dict[str, Any]:
    root: Dict[str, Any] = {"name": "ROOT", "children": []}
    current_hl = root
    for idx, seg in enumerate(segments):
        if seg[0] == "HL":
            node = {
                "name": f"HL-{seg[1] if len(seg) > 1 else idx}",
                "segment": seg,
                "children": [],
            }
            root["children"].append(node)
            current_hl = node
        else:
            current_hl["children"].append({"name": seg[0], "segment": seg, "index": idx})
    return root
