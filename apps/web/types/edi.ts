export type Segment = {
  id: string;
  elements: string[];
  index: number;
  loop?: string;
};

export type LoopNode = {
  loop: string;
  hl_id?: string;
  parent_id?: string;
  segments: Segment[];
  children: LoopNode[];
};

export type ParseResult = {
  transaction_type: string;
  type: string;
  sender: string;
  receiver: string;
  date: string;
  segments: Segment[];
  loops: LoopNode[];
  metadata: Record<string, unknown>;
};

export type ValidationIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
  loop?: string;
  segment?: string;
  element?: string;
  element_position?: number;
  value?: string | null;
  error?: string;
  explanation?: string;
  suggestion?: string;
  fix_suggestion?: string;
};

export type ValidationResult = {
  transaction_type: string;
  is_valid: boolean;
  issues: ValidationIssue[];
  summary: { total: number; errors: number; warnings: number };
};
