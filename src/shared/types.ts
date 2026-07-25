export type Difficulty = "Easy" | "Medium" | "Hard";
export type Language = "python" | "cpp";

export type SupportedType =
  | "int"
  | "long long"
  | "double"
  | "bool"
  | "string"
  | "vector<int>"
  | "vector<long long>"
  | "vector<double>"
  | "vector<bool>"
  | "vector<string>"
  | "vector<vector<int>>"
  | "vector<vector<string>>";

export interface ProblemParam {
  name: string;
  type: SupportedType;
}

export interface ProblemSignature {
  functionName: string;
  params: ProblemParam[];
  returnType: SupportedType;
}

export interface ProblemExample {
  input: Record<string, unknown>;
  output: unknown;
  explanation?: string;
}

export interface ProblemTestCase {
  name: string;
  input: Record<string, unknown>;
  expected: unknown;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  source: "included" | "personal";
  statementMarkdown: string;
  signature: ProblemSignature;
  examples: ProblemExample[];
  tests: ProblemTestCase[];
}

export interface RunRequest {
  language: Language;
  code: string;
  problem: Problem;
}

export interface TestResult {
  name: string;
  passed: boolean;
  input: Record<string, unknown>;
  expected: unknown;
  actual?: unknown;
  error?: string;
  durationMs: number;
}

export interface RunResponse {
  ok: boolean;
  compileOutput?: string;
  stderr?: string;
  results: TestResult[];
  durationMs: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AskRequest {
  model: string;
  problem: Problem;
  language: Language;
  code: string;
  runResult?: RunResponse;
  messages: ChatMessage[];
}

export interface AskResponse {
  ok: boolean;
  message: string;
  model?: string;
}

export interface GenerateProblemRequest {
  model: string;
  difficulty: Difficulty;
  topic: string;
}

export interface GenerateProblemResponse {
  ok: boolean;
  problem?: Problem;
  message?: string;
  model?: string;
}

export interface ParseProblemRequest {
  model: string;
  rawText: string;
}

export interface OllamaModelInfo {
  name: string;
  sizeBytes?: number;
}

export interface OllamaRecommendation {
  selectedModel: string;
  bestInstalledModel?: string;
  bestFitModel: string;
  pullCommand?: string;
  reason: string;
  totalMemoryGb: number;
  installedModels: OllamaModelInfo[];
}
