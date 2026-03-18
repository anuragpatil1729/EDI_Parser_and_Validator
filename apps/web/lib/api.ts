import { API_BASE } from "./constants";

export async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  const r = await fetch(`${API_BASE}/upload`, { method: "POST", body: form });
  if (!r.ok) throw new Error("Upload failed");
  return r.json();
}

export async function parseEdi(rawEdi: string) {
  const r = await fetch(`${API_BASE}/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawEdi })
  });
  if (!r.ok) throw new Error("Parse failed");
  return r.json();
}

export async function validateEdi(transactionType: string, segments: unknown[]) {
  const r = await fetch(`${API_BASE}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactionType, segments })
  });
  if (!r.ok) throw new Error("Validation failed");
  return r.json();
}

export async function askAi(question: string, transactionType: string, validationIssues: unknown[]) {
  const r = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, transactionType, validationIssues })
  });
  if (!r.ok) throw new Error("AI chat failed");
  return r.json();
}
