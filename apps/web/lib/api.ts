import { API_BASE } from "./constants";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function uploadFile(file: File): Promise<{ fileId: string }> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${API_BASE}/upload`, { method: "POST", body: form });
  return handleResponse(response);
}

export async function parseByFileId(fileId: string) {
  const response = await fetch(`${API_BASE}/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId }),
  });
  return handleResponse(response);
}

export async function validateEdi(transaction_type: string, segments: unknown[]) {
  const response = await fetch(`${API_BASE}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transaction_type, segments }),
  });
  return handleResponse(response);
}

export async function askAi(question: string, transaction_type: string, segment: string, error: string) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, transaction_type, segment, error }),
  });
  return handleResponse(response);
}
