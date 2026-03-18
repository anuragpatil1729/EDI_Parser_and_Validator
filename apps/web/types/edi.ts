export type Segment = {
  id: string;
  elements: string[];
  index: number;
};

export type ParseResult = {
  transaction_type: string;
  segments: Segment[];
  loops: Record<string, unknown>;
  metadata: Record<string, unknown>;
};

export type ValidationIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
  segment?: string;
  location?: string;
  fix_suggestion?: string;
};

export type ValidationResult = {
  transaction_type: string;
  is_valid: boolean;
  issues: ValidationIssue[];
  summary: { total: number; errors: number; warnings: number };
};
