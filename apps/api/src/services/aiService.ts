import { env } from "../config/env";

export async function askAssistant(question: string, transactionType: string, validationIssues: unknown[]) {
  const response = await fetch(`${env.aiUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      transaction_type: transactionType,
      validation_issues: validationIssues
    })
  });
  if (!response.ok) throw new Error(`AI failed: ${response.status}`);
  return response.json();
}
