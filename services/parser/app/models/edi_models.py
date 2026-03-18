from typing import Any, Dict, List
from pydantic import BaseModel, Field


class ParseRequest(BaseModel):
    raw_edi: str = Field(..., min_length=1)


class SegmentModel(BaseModel):
    id: str
    elements: List[str]
    index: int
    loop: str | None = None


class LoopNode(BaseModel):
    loop: str
    segments: List[SegmentModel]
    children: List["LoopNode"]


class ParseResponse(BaseModel):
    transaction_type: str
    segments: List[SegmentModel]
    loops: Dict[str, Any]
    metadata: Dict[str, Any]
