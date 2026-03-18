"use client";

import { FormEvent, useState } from "react";
import { ValidationIssue } from "@/types/edi";
import { useChat } from "@/hooks/useChat";

export default function AIChatPanel({ transactionType, issues }: { transactionType: string; issues: ValidationIssue[] }) {
  const [question, setQuestion] = useState("Why is this claim rejected?");
  const { response, loading, ask } = useChat();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await ask(question, transactionType, issues);
  }

  return (
    <section>
      <h3>AI Assistant</h3>
      <form onSubmit={onSubmit}>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "Thinking..." : "Ask"}</button>
      </form>
      {response && (
        <div>
          <p>{response.answer}</p>
          <ul>{response.next_steps.map((step) => <li key={step}>{step}</li>)}</ul>
        </div>
      )}
    </section>
  );
}
