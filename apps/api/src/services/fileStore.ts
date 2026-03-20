import { randomUUID } from "node:crypto";

import { supabase } from "../config/supabase";

type StoredFile = {
  fileName: string;
  content: string;
  uploadedAt: string;
  userId?: string;
};

type ParsedResult = {
  fileId: string;
  parsedJson: unknown;
  createdAt: string;
  userId?: string;
};

type ValidationResult = {
  fileId: string;
  validationJson: unknown;
  createdAt: string;
  userId?: string;
};

const fileMap = new Map<string, StoredFile>();
const parsedMap = new Map<string, ParsedResult>();
const validationMap = new Map<string, ValidationResult>();

export async function saveFile(fileName: string, content: string, userId?: string) {
  const fileId = randomUUID();
  const uploadedAt = new Date().toISOString();
  fileMap.set(fileId, { fileName, content, uploadedAt, userId });

  if (supabase) {
    await supabase.from("edi_uploads").insert({ file_id: fileId, file_name: fileName, content, uploaded_at: uploadedAt, user_id: userId ?? null });
  }

  return fileId;
}

export async function saveBatchFiles(files: Array<{ fileName: string; content: string }>, userId?: string) {
  const stored = await Promise.all(files.map(async (file) => ({ fileId: await saveFile(file.fileName, file.content, userId), fileName: file.fileName })));
  return {
    total_files: stored.length,
    file_ids: stored,
  };
}

export async function getFile(fileId: string, userId?: string) {
  const fromMemory = fileMap.get(fileId);
  if (fromMemory && (!fromMemory.userId || fromMemory.userId === userId)) {
    return fromMemory;
  }

  if (!supabase) {
    return null;
  }

  let query = supabase
    .from("edi_uploads")
    .select("file_name, content, uploaded_at, user_id")
    .eq("file_id", fileId);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data } = await query.maybeSingle();

  if (!data) {
    return null;
  }

  return {
    fileName: data.file_name,
    content: data.content,
    uploadedAt: data.uploaded_at,
    userId: data.user_id ?? undefined,
  };
}

export async function saveParsedResult(fileId: string, parsedJson: unknown, userId?: string) {
  const createdAt = new Date().toISOString();
  const payload = { fileId, parsedJson, createdAt, userId };
  parsedMap.set(fileId, payload);

  if (supabase) {
    await supabase.from("edi_parsed_results").upsert({ file_id: fileId, parsed_json: parsedJson, created_at: createdAt, user_id: userId ?? null });
  }

  return payload;
}

export async function saveValidationResult(fileId: string, validationJson: unknown, userId?: string) {
  const createdAt = new Date().toISOString();
  const payload = { fileId, validationJson, createdAt, userId };
  validationMap.set(fileId, payload);

  if (supabase) {
    await supabase.from("edi_validation_results").upsert({ file_id: fileId, validation_json: validationJson, created_at: createdAt, user_id: userId ?? null });
  }

  return payload;
}

export async function listParsedResultsByUser(userId: string): Promise<unknown[]> {
  if (supabase) {
    const { data } = await supabase
      .from("edi_parsed_results")
      .select("parsed_json")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return (data || []).map((row) => row.parsed_json);
  }

  return Array.from(parsedMap.values())
    .filter((entry) => !entry.userId || entry.userId === userId)
    .map((entry) => entry.parsedJson);
}

export function getStoredParsedResult(fileId: string) {
  return parsedMap.get(fileId) || null;
}

export function getStoredValidationResult(fileId: string) {
  return validationMap.get(fileId) || null;
}
