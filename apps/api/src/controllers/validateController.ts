import { Request, Response } from "express";
import { validateEdi } from "../services/validatorService";

export async function validateController(req: Request, res: Response) {
  try {
    const { transaction_type, segments } = req.body || {};
    if (!transaction_type || !Array.isArray(segments)) {
      return res.status(400).json({ error: "transaction_type and segments are required" });
    }

    const result = await validateEdi(transaction_type, segments);
    return res.json(result);
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : "Validation failed" });
  }
}
