import { Request, Response } from "express";
import { validateEdi } from "../services/validatorService";

export async function validateController(req: Request, res: Response) {
  const { transactionType, segments } = req.body || {};
  if (!transactionType || !Array.isArray(segments)) {
    return res.status(400).json({ error: "transactionType and segments are required" });
  }
  const result = await validateEdi(transactionType, segments);
  return res.json(result);
}
