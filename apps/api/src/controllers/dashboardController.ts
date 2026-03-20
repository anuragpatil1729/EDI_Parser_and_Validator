import { Request, Response } from "express";

import { listParsedResultsByUser } from "../services/fileStore";

type DashboardType = "837" | "835" | "834";

type ParsedSegment = {
  id?: string;
  elements?: string[];
};

type ParsedPayload = {
  transaction_type?: string;
  segments?: ParsedSegment[];
};

function getSegments(parsed: unknown): ParsedSegment[] {
  if (!parsed || typeof parsed !== "object") {
    return [];
  }

  const payload = parsed as ParsedPayload;
  return Array.isArray(payload.segments) ? payload.segments : [];
}

function getTransactionType(parsed: unknown): string {
  if (!parsed || typeof parsed !== "object") {
    return "";
  }
  return String((parsed as ParsedPayload).transaction_type || "");
}

function build837Claims(items: unknown[]) {
  return items.flatMap((parsed, parsedIndex) => {
    const segments = getSegments(parsed);
    let patientName = "Unknown Patient";

    return segments
      .filter((segment) => segment.id === "CLM")
      .map((segment, claimIndex) => ({
        claimId: segment.elements?.[0] || `CLM-${parsedIndex + 1}-${claimIndex + 1}`,
        patient: patientName,
        total: Number(segment.elements?.[1] || 0),
        status: "Submitted",
      }))
      .map((claim) => {
        const nm1 = segments.find((segment) => segment.id === "NM1" && (segment.elements?.[0] === "QC" || segment.elements?.[0] === "IL"));
        if (nm1) {
          patientName = [nm1.elements?.[2], nm1.elements?.[1]].filter(Boolean).join(", ") || patientName;
        }
        return { ...claim, patient: patientName };
      });
  });
}

function build835Claims(items: unknown[]) {
  return items.flatMap((parsed, parsedIndex) => {
    const segments = getSegments(parsed);

    return segments
      .filter((segment) => segment.id === "CLP")
      .map((segment, claimIndex) => {
        const billed = Number(segment.elements?.[2] || 0);
        const paid = Number(segment.elements?.[3] || 0);
        return {
          claim_id: segment.elements?.[0] || `CLP-${parsedIndex + 1}-${claimIndex + 1}`,
          billed,
          paid,
          adjustments: billed - paid,
        };
      });
  });
}

function build834Members(items: unknown[]) {
  return items.flatMap((parsed) => {
    const segments = getSegments(parsed);
    const members: Array<{ member_id: string; name: string; status: string; plan: string }> = [];
    let currentName = "Unknown Member";

    segments.forEach((segment, index) => {
      if (segment.id === "NM1") {
        currentName = [segment.elements?.[2], segment.elements?.[1]].filter(Boolean).join(", ") || currentName;
      }
      if (segment.id === "INS") {
        members.push({
          member_id: segment.elements?.[7] || `MEM-${index + 1}`,
          name: currentName,
          status: segment.elements?.[0] === "Y" ? "Active" : "Terminated",
          plan: segment.elements?.[1] || "Unknown Plan",
        });
      }
    });

    return members;
  });
}

export async function dashboardController(req: Request, res: Response) {
  const type = String(req.params.type || "") as DashboardType;
  if (!["837", "835", "834"].includes(type)) {
    return res.status(400).json({ error: "type must be one of: 837, 835, 834" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const parsed = await listParsedResultsByUser(userId);
  const filtered = parsed.filter((item) => getTransactionType(item) === type);

  if (type === "837") {
    return res.json({ claims: build837Claims(filtered) });
  }
  if (type === "835") {
    const claims = build835Claims(filtered);
    return res.json({ claims });
  }

  return res.json({ members: build834Members(filtered) });
}
