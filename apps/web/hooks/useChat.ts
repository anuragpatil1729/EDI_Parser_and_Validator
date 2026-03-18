"use client";

import { useState } from "react";
import { askAi } from "@/lib/api";
import { ChatResponse } from "@/types/api";

export function useChat() {
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(question: string, transactionType: string, validationIssues: unknown[]) {
    setLoading(true);
    try {
      const result = await askAi(question, transactionType, validationIssues);
      setResponse(result);
      return result;
    } finally {
      setLoading(false);
    }
  }

  return { response, loading, ask };
}
