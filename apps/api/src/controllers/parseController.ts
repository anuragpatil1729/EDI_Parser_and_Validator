import { Request, Response } from "express";
import { parseEdi } from "../services/parserService";

export async function parseController(req: Request, res: Response) {
  const rawEdi = String(req.body?.rawEdi || "");
  if (!rawEdi.trim()) return res.status(400).json({ error: "rawEdi is required" });
  const parsed = await parseEdi(rawEdi);
  return res.json(parsed);
}
