import { Request, Response } from "express";

import { getFile } from "../services/fileStore";

export async function uploadMetaController(req: Request, res: Response) {
  const fileId = String(req.params.fileId || "").trim();
  if (!fileId) {
    return res.status(400).json({ error: "fileId is required" });
  }

  const file = await getFile(fileId, req.user?.id);
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

  return res.json({ fileName: file.fileName, uploadedAt: file.uploadedAt });
}
