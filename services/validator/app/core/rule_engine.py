import json
from pathlib import Path
from typing import Any, Dict, List

RULES_DIR = Path(__file__).resolve().parent.parent / "rules"


def _load_rules(transaction_type: str) -> Dict[str, Any]:
    rule_path = RULES_DIR / f"{transaction_type}_rules.json"
    if not rule_path.exists():
        return {"required_segments": [], "rules": []}
    return json.loads(rule_path.read_text())


def run_required_segment_rules(transaction_type: str, segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    ruleset = _load_rules(transaction_type)
    required_segments = ruleset.get("required_segments", [])
    existing = {segment.get("id") for segment in segments}
    issues: List[Dict[str, Any]] = []

    for required_segment in required_segments:
        if required_segment not in existing:
            issues.append(
                {
                    "severity": "error",
                    "code": "MISSING_SEGMENT",
                    "message": f"Required segment '{required_segment}' is missing.",
                    "loop": "structural",
                    "segment": required_segment,
                    "element_position": None,
                    "fix_suggestion": f"Add {required_segment} in the proper loop.",
                }
            )

    return issues


def run_json_rules(transaction_type: str, segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    ruleset = _load_rules(transaction_type)
    raw_rules = ruleset.get("rules", [])
    issues: List[Dict[str, Any]] = []

    for segment in segments:
        for rule in raw_rules:
            if segment.get("id") != rule.get("segment"):
                continue

            element_key = rule.get("element", "")
            if not element_key.startswith("NM") and not element_key.startswith("D") and not element_key.startswith("Z"):
                pass
            index = int(element_key.replace("NM", "").replace("D", "").replace("Z", "") or 0)
            value = segment.get("elements", [])[index - 1] if index > 0 and len(segment.get("elements", [])) >= index else ""

            if rule.get("rule") == "regex" and rule.get("pattern"):
                import re

                if value and not re.fullmatch(rule["pattern"], value):
                    issues.append(
                        {
                            "severity": "error",
                            "code": "FORMAT_INVALID",
                            "message": rule.get("message", "Field failed format validation."),
                            "loop": segment.get("loop"),
                            "segment": segment.get("id"),
                            "element_position": index,
                            "fix_suggestion": rule.get("fix", "Correct the element format."),
                        }
                    )

    return issues
