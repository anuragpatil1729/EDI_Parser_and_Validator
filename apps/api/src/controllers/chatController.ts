import { Request, Response } from "express";
import { askAssistant } from "../services/aiService";

export async function chatController(req: Request, res: Response) {
  const { question, transactionType, validationIssues } = req.body || {};
  if (!question) return res.status(400).json({ error: "question is required" });
  const answer = await askAssistant(String(question), String(transactionType || "unknown"), validationIssues || []);
  return res.json(answer);
}
