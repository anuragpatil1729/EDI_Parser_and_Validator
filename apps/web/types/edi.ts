export type Segment = {
  id: string;
  elements: string[];
  index: number;
  loop?: string;
};

export type LoopNode = {
  loop: string;
  segments: Segment[];
  children: LoopNode[];
};

export type ParseResult = {
  transaction_type: string;
  segments: Segment[];
  loops: LoopNode;
  metadata: Record<string, unknown>;
};

export type ValidationIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
  loop?: string;
  segment?: string;
  element_position?: number;
  fix_suggestion?: string;
};

export type ValidationResult = {
  transaction_type: string;
  is_valid: boolean;
  issues: ValidationIssue[];
  summary: { total: number; errors: number; warnings: number };
};
