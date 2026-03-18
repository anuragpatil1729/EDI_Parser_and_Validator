import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.validator import validate


def test_validate_detects_missing_segments():
    result = validate("837", [{"id": "ST", "elements": ["837"], "index": 0, "loop": "TRANSACTION_SET"}])
    assert result["is_valid"] is False
    assert any(issue["code"] == "MISSING_SEGMENT" for issue in result["issues"])
