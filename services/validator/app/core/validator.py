from typing import Any, Dict

from app.core.code_validators import run_code_checks
from app.core.cross_checks import run_cross_checks
from app.core.format_checks import run_format_checks
from app.core.rule_engine import run_required_segment_rules


def validate(transaction_type: str, segments: list[dict]) -> Dict[str, Any]:
    issues = []
    issues.extend(run_required_segment_rules(transaction_type, segments))
    issues.extend(run_format_checks(segments))
    issues.extend(run_code_checks(segments))
    issues.extend(run_cross_checks(transaction_type, segments))

    errors = sum(1 for i in issues if i["severity"] == "error")
    warnings = sum(1 for i in issues if i["severity"] == "warning")

    return {
        "transaction_type": transaction_type,
        "is_valid": errors == 0,
        "issues": issues,
        "summary": {
            "total": len(issues),
            "errors": errors,
            "warnings": warnings,
        },
    }
