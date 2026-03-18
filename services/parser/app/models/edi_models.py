from typing import Any, Dict, List
from pydantic import BaseModel, Field


class ParseRequest(BaseModel):
    raw_edi: str = Field(..., min_length=1)


class SegmentModel(BaseModel):
    id: str
    elements: List[str]
    index: int


class ParseResponse(BaseModel):
    transaction_type: str
    segments: List[SegmentModel]
    loops: Dict[str, Any]
    metadata: Dict[str, Any]
