import { env } from "../config/env";

export async function parseEdi(rawEdi: string) {
  const response = await fetch(`${env.parserUrl}/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raw_edi: rawEdi })
  });
  if (!response.ok) throw new Error(`Parser failed: ${response.status}`);
  return response.json();
}
