import { randomUUID } from "node:crypto";

import { supabase } from "../config/supabase";

type StoredFile = {
  fileName: string;
  content: string;
  uploadedAt: string;
};

const fileMap = new Map<string, StoredFile>();

export async function saveFile(fileName: string, content: string) {
  const fileId = randomUUID();
  const uploadedAt = new Date().toISOString();
  fileMap.set(fileId, { fileName, content, uploadedAt });

  if (supabase) {
    await supabase.from("edi_uploads").insert({ file_id: fileId, file_name: fileName, content, uploaded_at: uploadedAt });
  }

  return fileId;
}

export async function getFile(fileId: string) {
  const fromMemory = fileMap.get(fileId);
  if (fromMemory) {
    return fromMemory;
  }

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("edi_uploads")
    .select("file_name, content, uploaded_at")
    .eq("file_id", fileId)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    fileName: data.file_name,
    content: data.content,
    uploadedAt: data.uploaded_at,
  };
}
