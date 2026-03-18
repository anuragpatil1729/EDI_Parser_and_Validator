"use client";

import { useState } from "react";
import { askAi } from "@/lib/api";

export function useChat() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ explanation: string; suggested_fix: string } | null>(null);

  async function ask(question: string, transactionType: string, segment: string, error: string, value?: string | null) {
    setLoading(true);
    try {
      const answer = await askAi(question, transactionType, segment, error, value);
      setResponse(answer);
      return answer;
    } finally {
      setLoading(false);
    }
  }

  return { ask, response, loading };
}
