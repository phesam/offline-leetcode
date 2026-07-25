import os from "node:os";
import type {
  AskRequest,
  AskResponse,
  GenerateProblemRequest,
  GenerateProblemResponse,
  OllamaModelInfo,
  OllamaRecommendation,
  ParseProblemRequest,
  Problem
} from "../shared/types";

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const FALLBACK_MODEL = "qwen2.5-coder:7b";
const OLLAMA_CHAT_TIMEOUT_MS = 90_000;

interface OllamaTagsResponse {
  models?: Array<{
    name?: string;
    model?: string;
    size?: number;
  }>;
}

async function postOllamaChat(body: unknown, timeoutMs = OLLAMA_CHAT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

function totalMemoryGb(): number {
  return Math.round((os.totalmem() / 1024 ** 3) * 10) / 10;
}

function bestFitForHardware(memoryGb: number): { model: string; reason: string } {
  if (memoryGb >= 48) {
    return {
      model: "qwen2.5-coder:32b",
      reason: "Your machine has enough memory for a larger local coding model, so AirCode recommends Qwen2.5-Coder 32B."
    };
  }

  if (memoryGb >= 14) {
    return {
      model: "qwen2.5-coder:14b",
      reason: "Your machine has about 16 GB-class memory, so Qwen2.5-Coder 14B is the strongest practical coding-focused target."
    };
  }

  if (memoryGb >= 8) {
    return {
      model: "qwen2.5-coder:7b",
      reason: "Your machine is in the 8 GB-class range, so Qwen2.5-Coder 7B is the best practical coding-focused target."
    };
  }

  return {
    model: "qwen2.5-coder:3b",
    reason: "Your machine has limited memory, so AirCode recommends the smaller Qwen2.5-Coder 3B model."
  };
}

function modelRank(name: string): number {
  const normalized = name.toLowerCase();
  let score = 0;

  if (normalized.includes("embed")) return -1000;
  if (normalized.includes("qwen") && normalized.includes("coder")) score += 1000;
  else if (normalized.includes("deepseek") && normalized.includes("coder")) score += 920;
  else if (normalized.includes("codestral")) score += 880;
  else if (normalized.includes("codellama")) score += 820;
  else if (normalized.includes("starcoder")) score += 780;
  else if (normalized.includes("deepseek-r1")) score += 720;
  else if (normalized.includes("qwen")) score += 680;
  else if (normalized.includes("llama")) score += 600;
  else if (normalized.includes("mistral")) score += 520;
  else score += 250;

  const sizeMatch = normalized.match(/(?::|-)(\d+(?:\.\d+)?)b/);
  if (sizeMatch) score += Number(sizeMatch[1]) * 10;

  if (normalized.includes("32b")) score += 80;
  if (normalized.includes("14b")) score += 50;
  if (normalized.includes("7b") || normalized.includes("8b")) score += 25;
  if (normalized.includes("latest")) score += 1;

  return score;
}

function chooseBestInstalled(models: OllamaModelInfo[]): string | undefined {
  return [...models]
    .filter((model) => !model.name.toLowerCase().includes("embed"))
    .sort((a, b) => modelRank(b.name) - modelRank(a.name))[0]?.name;
}

function modelInstalled(models: OllamaModelInfo[], target: string): boolean {
  return models.some((model) => model.name === target || model.name.startsWith(`${target}:`));
}

async function getInstalledModels(): Promise<OllamaModelInfo[]> {
  const response = await fetch(`${OLLAMA_HOST}/api/tags`);
  if (!response.ok) throw new Error("unavailable");
  const payload = (await response.json()) as OllamaTagsResponse;
  return (
    payload.models
      ?.map((model) => ({
        name: model.name || model.model || "",
        sizeBytes: model.size
      }))
      .filter((model) => model.name) ?? []
  );
}

function buildRecommendation(models: OllamaModelInfo[]): OllamaRecommendation {
  const memoryGb = totalMemoryGb();
  const bestFit = bestFitForHardware(memoryGb);
  const bestInstalled = chooseBestInstalled(models);
  const envModel = process.env.OLLAMA_MODEL?.trim();
  const selectedModel = envModel || (modelInstalled(models, bestFit.model) ? bestFit.model : bestInstalled) || bestFit.model || FALLBACK_MODEL;

  return {
    selectedModel,
    bestInstalledModel: bestInstalled,
    bestFitModel: bestFit.model,
    pullCommand: modelInstalled(models, bestFit.model) ? undefined : `ollama pull ${bestFit.model}`,
    reason: envModel
      ? `OLLAMA_MODEL is set, so AirCode is honoring ${envModel}.`
      : bestFit.reason,
    totalMemoryGb: memoryGb,
    installedModels: models
  };
}

export async function askOllama(request: AskRequest): Promise<AskResponse> {
  let model = request.model.trim();
  if (!model) {
    try {
      model = buildRecommendation(await getInstalledModels()).selectedModel;
    } catch {
      model = process.env.OLLAMA_MODEL?.trim() || FALLBACK_MODEL;
    }
  }
  const runSummary = request.runResult
    ? JSON.stringify(
        {
          ok: request.runResult.ok,
          compileOutput: request.runResult.compileOutput,
          stderr: request.runResult.stderr,
          results: request.runResult.results
        },
        null,
        2
      )
    : "No test run has been provided yet.";

  const system = `You are an offline coding interview coach inside a local practice app.
Be concise, specific, and helpful. Prefer hints before full solutions unless the user explicitly asks for a solution.
When reviewing code, discuss correctness, complexity, edge cases, and a small next step.
Do not claim to have access to hidden LeetCode tests. You only know the local tests shown in the prompt.`;

  const userContext = `Problem:
${request.problem.title} (${request.problem.difficulty})
Tags: ${request.problem.tags.join(", ")}

Statement:
${request.problem.statementMarkdown}

Signature:
${request.problem.signature.returnType} ${request.problem.signature.functionName}(${request.problem.signature.params
    .map((param) => `${param.type} ${param.name}`)
    .join(", ")})

Language: ${request.language}

Current code:
\`\`\`${request.language === "python" ? "python" : "cpp"}
${request.code}
\`\`\`

Latest local test result:
\`\`\`json
${runSummary}
\`\`\``;

  try {
    const response = await postOllamaChat({
        model,
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 1200
        },
        messages: [
          { role: "system", content: system },
          { role: "user", content: userContext },
          ...request.messages
        ]
      });

    if (!response.ok) {
      return {
        ok: false,
        message: `Ollama returned ${response.status}. Make sure Ollama is running and the model '${model}' is pulled.`,
        model
      };
    }

    const payload = (await response.json()) as { message?: { content?: string } };
    return {
      ok: true,
      message: payload.message?.content?.trim() || "Ollama returned an empty response.",
      model
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? `${error.message}. Start Ollama with 'ollama serve' and pull a model before going offline.`
          : "Could not connect to Ollama.",
      model
    };
  }
}

function extractJsonObject(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Ollama did not return a JSON object.");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

function normalizeGeneratedProblem(value: unknown, topic: string): Problem {
  const problem = value as Partial<Problem>;
  if (!problem.title || !problem.statementMarkdown || !problem.signature || !problem.tests?.length) {
    throw new Error("Generated problem was missing title, statement, signature, or tests.");
  }

  const slug =
    problem.slug ||
    problem.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return {
    id: `generated-${slug}-${Date.now()}`,
    slug,
    title: problem.title,
    difficulty: problem.difficulty || "Medium",
    tags: problem.tags?.length ? problem.tags : [topic || "Algorithms"],
    source: "personal",
    statementMarkdown: problem.statementMarkdown,
    signature: problem.signature,
    examples: problem.examples?.length ? problem.examples : [],
    tests: problem.tests
  };
}

export async function generateProblemWithOllama(request: GenerateProblemRequest): Promise<GenerateProblemResponse> {
  let model = request.model.trim();
  if (!model) {
    model = buildRecommendation(await getInstalledModels()).selectedModel;
  }
  const topic = request.topic.trim() || "arrays and hash maps";

  const prompt = `Create one original coding interview practice problem. Do not copy or closely paraphrase any LeetCode, NeetCode, HackerRank, Codeforces, or book problem statement.
Use a distinctive title and premise. Avoid canonical titles such as Two Sum, Valid Parentheses, Maximum Subarray, Best Time to Buy and Sell Stock, Merge Intervals, Number of Islands, Course Schedule, Word Ladder, or Longest Substring Without Repeating Characters.

Return only valid JSON with this exact shape:
{
  "slug": "short-kebab-case",
  "title": "Problem Title",
  "difficulty": "${request.difficulty}",
  "tags": ["Topic"],
  "statementMarkdown": "Clear original problem statement in Markdown.",
  "signature": {
    "functionName": "camelCaseName",
    "params": [{"name": "nums", "type": "vector<int>"}],
    "returnType": "int"
  },
  "examples": [{"input": {"nums": [1,2,3]}, "output": 6, "explanation": "Short explanation."}],
  "tests": [
    {"name": "sample", "input": {"nums": [1,2,3]}, "expected": 6},
    {"name": "edge case", "input": {"nums": []}, "expected": 0}
  ]
}

Difficulty: ${request.difficulty}
Topic or pattern: ${topic}

Use only these C++ runner types: int, long long, double, bool, string, vector<int>, vector<long long>, vector<double>, vector<bool>, vector<string>, vector<vector<int>>, vector<vector<string>>.
Make 5 to 8 tests. Ensure every test input key exactly matches the signature param names.`;

  try {
    const response = await postOllamaChat({
        model,
        stream: false,
        options: {
          temperature: 0.35,
          num_predict: 1800
        },
        messages: [
          {
            role: "system",
            content:
              "You generate original coding interview practice problems as strict JSON. You do not reproduce proprietary problem text."
          },
          { role: "user", content: prompt }
        ]
      });

    if (!response.ok) {
      return { ok: false, message: `Ollama returned ${response.status} while generating a problem.`, model };
    }

    const payload = (await response.json()) as { message?: { content?: string } };
    const parsed = extractJsonObject(payload.message?.content ?? "");
    return { ok: true, problem: normalizeGeneratedProblem(parsed, topic), model };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not generate a problem with Ollama.",
      model
    };
  }
}

export async function parseProblemWithOllama(request: ParseProblemRequest): Promise<GenerateProblemResponse> {
  let model = request.model.trim();
  if (!model) {
    model = buildRecommendation(await getInstalledModels()).selectedModel;
  }

  const rawText = request.rawText.trim();
  if (!rawText) {
    return { ok: false, message: "Paste problem text first.", model };
  }

  const prompt = `Turn this user-provided coding problem into AirCode JSON. Preserve the original pasted statement text in "statementMarkdown"; do not summarize it.

Return only valid JSON with this exact shape:
{
  "slug": "short-kebab-case",
  "title": "Problem Title",
  "difficulty": "Easy",
  "tags": ["Topic"],
  "statementMarkdown": "The pasted statement, preserved.",
  "signature": {
    "functionName": "camelCaseName",
    "params": [{"name": "nums", "type": "vector<int>"}],
    "returnType": "int"
  },
  "examples": [{"input": {"nums": [1,2,3]}, "output": 6, "explanation": "Short explanation."}],
  "tests": [{"name": "sample", "input": {"nums": [1,2,3]}, "expected": 6}]
}

Use only these C++ runner types: int, long long, double, bool, string, vector<int>, vector<long long>, vector<double>, vector<bool>, vector<string>, vector<vector<int>>, vector<vector<string>>.
Infer 4 to 8 tests from examples and obvious edge cases. Every test input key must match a signature param name.

Pasted problem:
${rawText}`;

  try {
    const response = await postOllamaChat({
        model,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 1600
        },
        messages: [
          {
            role: "system",
            content:
              "You convert user-provided coding problem text into strict JSON for a local personal-use practice app."
          },
          { role: "user", content: prompt }
        ]
      });

    if (!response.ok) {
      return { ok: false, message: `Ollama returned ${response.status} while parsing the problem.`, model };
    }

    const payload = (await response.json()) as { message?: { content?: string } };
    const parsed = normalizeGeneratedProblem(extractJsonObject(payload.message?.content ?? ""), "LeetCode");
    return {
      ok: true,
      problem: {
        ...parsed,
        id: `personal-${parsed.slug}-${Date.now()}`,
        source: "personal",
        statementMarkdown: rawText
      },
      model
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error && error.name === "AbortError"
          ? "Ollama timed out while parsing. Try a smaller paste or a faster model."
          : error instanceof Error
            ? error.message
            : "Could not parse the pasted problem.",
      model
    };
  }
}

export async function ollamaHealth(): Promise<{
  host: string;
  defaultModel: string;
  available: boolean;
  models: string[];
  recommendation?: OllamaRecommendation;
}> {
  try {
    const models = await getInstalledModels();
    const recommendation = buildRecommendation(models);
    return {
      host: OLLAMA_HOST,
      defaultModel: recommendation.selectedModel,
      available: true,
      models: models.map((model) => model.name),
      recommendation
    };
  } catch {
    const recommendation = buildRecommendation([]);
    return {
      host: OLLAMA_HOST,
      defaultModel: recommendation.selectedModel,
      available: false,
      models: [],
      recommendation
    };
  }
}
