import { Request, Response } from "express";

import { getAiProvider } from "../services/aiService";

export async function providerController(_req: Request, res: Response) {
  try {
    const provider = await getAiProvider();
    return res.json(provider);
  } catch {
    return res.status(502).json({ provider: "gemini", model: "unknown" });
  }
}
