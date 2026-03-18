import { Request, Response } from "express";
import { saveFile } from "../services/fileStore";

const allowedExtensions = [".edi", ".txt", ".dat", ".x12"];

export async function uploadController(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "file is required" });
  }

  const fileName = file.originalname.toLowerCase();
  const isAllowed = allowedExtensions.some((ext) => fileName.endsWith(ext));
  if (!isAllowed) {
    return res.status(400).json({ error: "Unsupported file type" });
  }

  const content = file.buffer.toString("utf-8");
  const fileId = await saveFile(file.originalname, content);
  return res.status(201).json({ fileId });
}
