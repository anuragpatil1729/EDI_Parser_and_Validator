"use client";

import { useState } from "react";
import { parseEdi, validateEdi } from "@/lib/api";
import { ParseResult, ValidationResult } from "@/types/edi";

export function useParse() {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  async function parseAndValidate(rawEdi: string) {
    const parsed: ParseResult = await parseEdi(rawEdi);
    const validated: ValidationResult = await validateEdi(parsed.transaction_type, parsed.segments);
    setParseResult(parsed);
    setValidation(validated);
    return { parsed, validated };
  }

  return { parseResult, validation, parseAndValidate };
}
