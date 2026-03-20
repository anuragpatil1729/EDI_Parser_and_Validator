import { ParseResult, ValidationResult } from "@/types/edi";
import { API_BASE } from "./constants";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const fromStorage = localStorage.getItem("sb-access-token");
  if (fromStorage) return fromStorage;
  const cookieToken = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("sb-access-token="));
  return cookieToken ? cookieToken.replace("sb-access-token=", "") : null;
}

function withAuth(headers: HeadersInit = {}): HeadersInit {
  const token = getAuthToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
}

async function handleResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    throw new Error(fallbackMessage);
  }
  return response.json() as Promise<T>;
}

export async function uploadFile(file: File): Promise<{ fileId: string }> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${API_BASE}/upload`, { method: "POST", body: form, headers: withAuth() });
  return handleResponse<{ fileId: string }>(response, "Unable to upload file right now.");
}

export async function parseByFileId(fileId: string): Promise<ParseResult> {
  const response = await fetch(`${API_BASE}/parse`, {
    method: "POST",
    headers: withAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ fileId }),
  });
  return handleResponse<ParseResult>(response, "Unable to parse this file.");
}

export async function validateEdi(transaction_type: string, segments: unknown[], fileId?: string): Promise<ValidationResult> {
  const response = await fetch(`${API_BASE}/validate`, {
    method: "POST",
    headers: withAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ transaction_type, segments, fileId }),
  });
  return handleResponse<ValidationResult>(response, "Validation could not be completed.");
}

export async function askAi(
  question: string,
  transaction_type: string,
  segment: string,
  error: string,
  value?: string | null,
  context?: { element?: string; loop_name?: string },
): Promise<{ explanation: string; suggested_fix: string }> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: withAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      question,
      transaction_type,
      segment,
      element: context?.element,
      loop_name: context?.loop_name,
      error,
      value: value ?? "",
    }),
  });
  return handleResponse<{ explanation: string; suggested_fix: string }>(response, "AI assistant is currently unavailable.");
}

export async function translateEdi(parsed: ParseResult, options?: { issues?: ValidationResult["issues"] }): Promise<unknown> {
  const response = await fetch(`${API_BASE}/translate`, {
    method: "POST",
    headers: withAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      transaction_type: parsed.transaction_type,
      parsed,
      issues: options?.issues ?? undefined,
    }),
  });

  return handleResponse<unknown>(response, "Translation is temporarily unavailable.");
}

export async function getDashboardData(type: "837" | "835" | "834"): Promise<unknown> {
  const response = await fetch(`${API_BASE}/dashboard/${type}`, { headers: withAuth() });
  return handleResponse<unknown>(response, "Unable to load dashboard data.");
}

export async function getAiProvider(): Promise<{ provider: "ollama" | "gemini"; model: string }> {
  const response = await fetch(`${API_BASE}/ai-provider`, { headers: withAuth() });
  return handleResponse<{ provider: "ollama" | "gemini"; model: string }>(response, "Unable to load AI provider.");
}

export async function getUploadMeta(fileId: string): Promise<{ fileName: string; uploadedAt: string }> {
  const response = await fetch(`${API_BASE}/upload/${fileId}`, { headers: withAuth() });
  return handleResponse<{ fileName: string; uploadedAt: string }>(response, "Unable to load upload details.");
}
