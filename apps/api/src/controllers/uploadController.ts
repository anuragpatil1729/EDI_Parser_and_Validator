import { Request, Response } from "express";

export function uploadController(req: Request, res: Response) {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "file is required" });
  return res.json({
    fileName: file.originalname,
    content: file.buffer.toString("utf-8")
  });
}
