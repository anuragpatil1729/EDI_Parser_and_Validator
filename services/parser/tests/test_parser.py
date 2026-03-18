import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.edi_parser import parse_edi


def test_parse_edi_detects_837_and_segments():
    edi = "ISA*00*          *00*          *ZZ*SENDER*ZZ*RECEIVER*240101*1253*^*00501*000000905*0*T*:~GS*HC*SEND*RECV*20240101*1253*1*X*005010X222A1~ST*837*0001*005010X222A1~BHT*0019*00*0123*20240101*1319*CH~SE*4*0001~GE*1*1~IEA*1*000000905~"
    parsed = parse_edi(edi)
    assert parsed["transaction_type"] == "837P"
    assert parsed["metadata"]["segment_count"] >= 4
