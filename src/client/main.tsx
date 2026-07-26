import React from "react";
import { createRoot } from "react-dom/client";
import CodeMirror from "@uiw/react-codemirror";
import { indentWithTab } from "@codemirror/commands";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { LanguageSupport, indentUnit } from "@codemirror/language";
import { Prec } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { marked } from "marked";
import { includedProblems, getStarterCode } from "../shared/problems";
import type {
  AskResponse,
  ChatMessage,
  GenerateProblemResponse,
  Language,
  OllamaRecommendation,
  ParseProblemRequest,
  Problem,
  RunResponse
} from "../shared/types";
import "./styles.css";

const PERSONAL_PROBLEMS_KEY = "aircode.personalProblems.v1";
const SOLUTIONS_KEY = "aircode.solutions.v1";
const MODEL_KEY = "aircode.ollamaModel.v1";
const API_OFFLINE_MESSAGE =
  "Local API is not running. From the repo, run `npm run dev`, then open http://127.0.0.1:5173. For the built app, run `npm run build && npm run start`, then open http://127.0.0.1:4174.";
const SUBMIT_PROMPT =
  "Treat this as a final submission review. First use the latest local test result. Then inspect my code for correctness, complexity, missed edge cases, and whether the algorithm would pass broad hidden-style tests for this problem. Give me a clear verdict: PASS, FAIL, or UNSURE. If it fails or is unsure, give one concrete counterexample or the smallest next fix. Do not invent LeetCode-only hidden tests.";

interface Health {
  runner: { python: string; cpp: string };
  ollama: {
    host: string;
    defaultModel: string;
    available: boolean;
    models: string[];
    recommendation?: OllamaRecommendation;
  };
}

interface ProblemDraft {
  title: string;
  slug: string;
  difficulty: Problem["difficulty"];
  tags: string;
  statementMarkdown: string;
  functionName: string;
  returnType: string;
  paramsJson: string;
  examplesJson: string;
  testsJson: string;
}

const emptyDraft: ProblemDraft = {
  title: "",
  slug: "",
  difficulty: "Easy",
  tags: "",
  statementMarkdown: "",
  functionName: "",
  returnType: "int",
  paramsJson: '[{"name":"nums","type":"vector<int>"}]',
  examplesJson: '[{"input":{"nums":[1,2,3]},"output":6}]',
  testsJson: '[{"name":"sample","input":{"nums":[1,2,3]},"expected":6}]'
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function problemKey(problem: Problem, language: Language): string {
  return `${problem.id}:${language}`;
}

function renderMarkdown(markdown: string): { __html: string } {
  return { __html: marked.parse(markdown, { async: false }) };
}

function jsonPretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function mergeProblems(...groups: Problem[][]): Problem[] {
  const byId = new Map<string, Problem>();
  for (const group of groups) {
    for (const problem of group) byId.set(problem.id, problem);
  }
  return [...byId.values()];
}

function formatValue(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  return JSON.stringify(value);
}

function formatInput(input: Record<string, unknown>): string {
  return Object.entries(input)
    .map(([key, value]) => `${key}=${formatValue(value)}`)
    .join("  ");
}

function editorExtensions(language: Language): Array<LanguageSupport | ReturnType<typeof indentUnit.of> | ReturnType<typeof Prec.highest>> {
  return [
    language === "python" ? python() : cpp(),
    indentUnit.of("    "),
    Prec.highest(keymap.of([indentWithTab]))
  ];
}

function selectableModels(health: Health | undefined, currentModel: string): string[] {
  const installed = health?.ollama.models.filter((modelName) => !modelName.toLowerCase().includes("embed")) ?? [];
  if (currentModel && !installed.includes(currentModel)) return [currentModel, ...installed];
  return installed;
}

function isFetchFailure(error: unknown): boolean {
  return error instanceof TypeError && error.message.toLowerCase().includes("fetch");
}

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(path, init);
    const text = await response.text();
    const payload = text ? (JSON.parse(text) as T) : ({} as T);
    if (!response.ok) {
      if (response.status >= 500 && path.startsWith("/api")) throw new Error(API_OFFLINE_MESSAGE);
      const message =
        typeof payload === "object" && payload && "message" in payload
          ? String(payload.message)
          : typeof payload === "object" && payload && "error" in payload
            ? String(payload.error)
            : `API returned ${response.status}.`;
      throw new Error(message);
    }
    return payload;
  } catch (error) {
    if (isFetchFailure(error)) throw new Error(API_OFFLINE_MESSAGE);
    if (error instanceof SyntaxError) throw new Error(API_OFFLINE_MESSAGE);
    throw error;
  }
}

function App(): React.ReactElement {
  const [personalProblems, setPersonalProblems] = React.useState<Problem[]>(() =>
    readJson<Problem[]>(PERSONAL_PROBLEMS_KEY, [])
  );
  const [selectedId, setSelectedId] = React.useState(includedProblems[0].id);
  const [language, setLanguage] = React.useState<Language>("python");
  const [solutions, setSolutions] = React.useState<Record<string, string>>(() =>
    readJson<Record<string, string>>(SOLUTIONS_KEY, {})
  );
  const [runResult, setRunResult] = React.useState<RunResponse | undefined>();
  const [isRunning, setIsRunning] = React.useState(false);
  const [health, setHealth] = React.useState<Health | undefined>();
  const [model, setModel] = React.useState(() => localStorage.getItem(MODEL_KEY) || "");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [question, setQuestion] = React.useState("hint?");
  const [isAsking, setIsAsking] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [draft, setDraft] = React.useState<ProblemDraft>(emptyDraft);
  const [showAddProblem, setShowAddProblem] = React.useState(false);
  const [pastedProblemText, setPastedProblemText] = React.useState("");
  const [isParsingProblem, setIsParsingProblem] = React.useState(false);
  const [generatedDifficulty, setGeneratedDifficulty] = React.useState<Problem["difficulty"]>("Medium");
  const [generatedTopic, setGeneratedTopic] = React.useState("arrays and hash maps");
  const [isGeneratingProblem, setIsGeneratingProblem] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const problems = React.useMemo(() => [...includedProblems, ...personalProblems], [personalProblems]);
  const selectedProblem = problems.find((problem) => problem.id === selectedId) ?? problems[0];
  const solutionKey = problemKey(selectedProblem, language);
  const code = solutions[solutionKey] ?? getStarterCode(selectedProblem, language);
  const personalCount = personalProblems.length;
  const lastProblemId = React.useRef(selectedProblem.id);
  const apiWasOnline = React.useRef(false);

  const refreshHealth = React.useCallback(async (initializeModel = false): Promise<void> => {
    try {
      const payload = await apiJson<Health>("/api/health");
      setHealth(payload);
      apiWasOnline.current = true;
      if (initializeModel) {
        const installed = selectableModels(payload, "");
        const storedModel = localStorage.getItem(MODEL_KEY);
        const autoModel = payload.ollama.recommendation?.selectedModel || payload.ollama.defaultModel;
        setModel(storedModel && installed.includes(storedModel) ? storedModel : autoModel);
      }
    } catch (error) {
      setHealth(undefined);
      if (apiWasOnline.current || initializeModel) {
        setNotice(error instanceof Error ? error.message : API_OFFLINE_MESSAGE);
      }
      apiWasOnline.current = false;
    }
  }, []);

  React.useEffect(() => {
    void refreshHealth(true);
    const timer = window.setInterval(() => {
      void refreshHealth();
    }, 5000);

    apiJson<{ problems: Problem[] }>("/api/private-problems")
      .then((payload: { problems: Problem[] }) => {
        setPersonalProblems((current) => mergeProblems(current, payload.problems ?? []));
      })
      .catch(() => undefined);

    return () => window.clearInterval(timer);
  }, [refreshHealth]);

  React.useEffect(() => {
    if (lastProblemId.current === selectedProblem.id) return;
    lastProblemId.current = selectedProblem.id;
    setMessages([]);
    setQuestion("hint?");
    setRunResult(undefined);
  }, [selectedProblem.id]);

  React.useEffect(() => {
    writeJson(PERSONAL_PROBLEMS_KEY, personalProblems);
  }, [personalProblems]);

  React.useEffect(() => {
    writeJson(SOLUTIONS_KEY, solutions);
  }, [solutions]);

  React.useEffect(() => {
    if (model) localStorage.setItem(MODEL_KEY, model);
  }, [model]);

  function updateCode(value: string): void {
    setSolutions((current) => ({ ...current, [solutionKey]: value }));
  }

  function resetCode(): void {
    setSolutions((current) => ({ ...current, [solutionKey]: getStarterCode(selectedProblem, language) }));
    setRunResult(undefined);
  }

  function changeModel(nextModel: string): void {
    setModel(nextModel);
    setMessages([]);
    setQuestion("hint?");
    setNotice(`MODEL ${nextModel}`);
  }

  async function savePrivate(problem: Problem): Promise<Problem> {
    try {
      const payload = await apiJson<{ problem?: Problem }>("/api/private-problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(problem)
      });
      return payload.problem ?? problem;
    } catch {
      return problem;
    }
  }

  async function executeRun(): Promise<RunResponse> {
    return apiJson<RunResponse>("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code, problem: selectedProblem })
    });
  }

  function showRunError(error: unknown): void {
    const message = error instanceof Error ? error.message : "Could not reach the local runner.";
    setRunResult({
      ok: false,
      stderr: message,
      results: [],
      durationMs: 0
    });
    setNotice(message);
  }

  async function runTests(): Promise<void> {
    setIsRunning(true);
    setNotice("");
    try {
      setRunResult(await executeRun());
    } catch (error) {
      showRunError(error);
    } finally {
      setIsRunning(false);
    }
  }

  async function askAi(prompt = question, resultForPrompt = runResult, displayPrompt = prompt): Promise<void> {
    if (!prompt.trim()) return;
    setIsAsking(true);
    setNotice("");
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: displayPrompt.trim() }];
    const requestMessages: ChatMessage[] = [...messages, { role: "user", content: prompt.trim() }];
    setMessages(nextMessages);
    setQuestion("");

    try {
      const payload = await apiJson<AskResponse>("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          language,
          code,
          problem: selectedProblem,
          runResult: resultForPrompt,
          messages: requestMessages
        })
      });
      setMessages([...nextMessages, { role: "assistant", content: payload.message }]);
      if (!payload.ok) setNotice(payload.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not reach the local API.";
      setMessages([...nextMessages, { role: "assistant", content: message }]);
      setNotice(message);
    } finally {
      setIsAsking(false);
    }
  }

  async function submitSolution(): Promise<void> {
    setIsSubmitting(true);
    setIsRunning(true);
    setNotice("");
    try {
      const latestRunResult = await executeRun();
      setRunResult(latestRunResult);
      setIsRunning(false);
      await askAi(SUBMIT_PROMPT, latestRunResult, "submit");
    } catch (error) {
      showRunError(error);
    } finally {
      setIsRunning(false);
      setIsSubmitting(false);
    }
  }

  function parseDraft(): Problem {
    const idBase = draft.slug.trim() || draft.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = `personal-${idBase}-${Date.now()}`;
    return {
      id,
      slug: idBase,
      title: draft.title.trim(),
      difficulty: draft.difficulty,
      tags: draft.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      source: "personal",
      statementMarkdown: draft.statementMarkdown.trim(),
      signature: {
        functionName: draft.functionName.trim(),
        params: JSON.parse(draft.paramsJson),
        returnType: draft.returnType.trim() as Problem["signature"]["returnType"]
      },
      examples: JSON.parse(draft.examplesJson),
      tests: JSON.parse(draft.testsJson)
    };
  }

  async function addProblem(): Promise<void> {
    try {
      const problem = parseDraft();
      if (!problem.title || !problem.slug || !problem.statementMarkdown || !problem.signature.functionName) {
        setNotice("Add a title, slug, statement, and function name.");
        return;
      }
      const savedProblem = await savePrivate(problem);
      setPersonalProblems((current) => mergeProblems(current, [savedProblem]));
      setSelectedId(savedProblem.id);
      setDraft(emptyDraft);
      setShowAddProblem(false);
      setNotice("SAVED LOCAL");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not parse the problem JSON.");
    }
  }

  function exportProblems(): void {
    const blob = new Blob([jsonPretty(personalProblems)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aircode-personal-problems.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function deleteProblem(problemId: string): void {
    setPersonalProblems((current) => current.filter((problem) => problem.id !== problemId));
    fetch(`/api/private-problems/${encodeURIComponent(problemId)}`, { method: "DELETE" }).catch(() => undefined);
    if (selectedId === problemId) setSelectedId(includedProblems[0].id);
  }

  async function generateProblem(): Promise<void> {
    setIsGeneratingProblem(true);
    setNotice("");
    try {
      const payload = await apiJson<GenerateProblemResponse>("/api/generate-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          difficulty: generatedDifficulty,
          topic: generatedTopic
        })
      });
      if (!payload.ok || !payload.problem) {
        setNotice(payload.message || "Ollama could not generate a problem.");
        return;
      }
      const savedProblem = await savePrivate(payload.problem);
      setPersonalProblems((current) => mergeProblems(current, [savedProblem]));
      setSelectedId(savedProblem.id);
      setNotice(`SAVED ${savedProblem.title}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not reach Ollama.");
    } finally {
      setIsGeneratingProblem(false);
    }
  }

  async function parseExactProblem(): Promise<void> {
    setIsParsingProblem(true);
    setNotice("");
    try {
      const requestBody: ParseProblemRequest = {
        model,
        rawText: pastedProblemText
      };
      const payload = await apiJson<GenerateProblemResponse>("/api/parse-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      if (!payload.ok || !payload.problem) {
        setNotice(payload.message || "Could not parse problem.");
        return;
      }
      const savedProblem = await savePrivate(payload.problem);
      setPersonalProblems((current) => mergeProblems(current, [savedProblem]));
      setSelectedId(savedProblem.id);
      setPastedProblemText("");
      setShowAddProblem(false);
      setNotice(`SAVED ${savedProblem.title}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not reach Ollama.");
    } finally {
      setIsParsingProblem(false);
    }
  }

  const passed = runResult?.results.filter((result) => result.passed).length ?? 0;
  const total = runResult?.results.length ?? selectedProblem.tests.length;
  const recommendation = health?.ollama.recommendation;
  const ollamaBusy = isAsking || isSubmitting || isGeneratingProblem || isParsingProblem;
  const ollamaBusyLabel = isSubmitting
    ? "SUBMISSION REVIEW"
    : isGeneratingProblem
      ? "GENERATING PROBLEM"
      : isParsingProblem
        ? "PARSING PROBLEM"
        : "THINKING";

  return (
    <main className={`app-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar" aria-label="Problems">
        <div className="brand">
          <div>
            <h1>AIRCODE</h1>
          </div>
          <span className={health?.ollama.available ? "status online" : "status"} title={health?.ollama.host}>
            {health?.ollama.available ? "ONLINE" : "OFFLINE"}
          </span>
          <button
            type="button"
            className="collapse-toggle"
            onClick={() => setIsSidebarCollapsed((value) => !value)}
            aria-label={isSidebarCollapsed ? "Expand problem sidebar" : "Collapse problem sidebar"}
            aria-expanded={!isSidebarCollapsed}
          >
            {isSidebarCollapsed ? ">" : "<"}
          </button>
        </div>

        <div className="sidebar-content" hidden={isSidebarCollapsed}>
          <div className="sidebar-actions">
            <button type="button" onClick={() => setShowAddProblem((value) => !value)}>
              PASTE LC
            </button>
            <button type="button" onClick={exportProblems} disabled={!personalCount}>
              EXPORT
            </button>
          </div>

          <div className="problem-list">
            {problems.map((problem) => (
              <button
                type="button"
                className={`problem-row ${problem.id === selectedProblem.id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedId(problem.id);
                }}
                key={problem.id}
              >
                <span>{problem.title}</span>
                <small>
                  {problem.difficulty} / {problem.source === "personal" ? "local" : "sample"}
                </small>
              </button>
            ))}
          </div>

          <div className="generate-box">
            <label htmlFor="generate-topic">GEN</label>
            <select
              value={generatedDifficulty}
              onChange={(event) => setGeneratedDifficulty(event.target.value as Problem["difficulty"])}
              aria-label="Generated problem difficulty"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <input
              id="generate-topic"
              value={generatedTopic}
              onChange={(event) => setGeneratedTopic(event.target.value)}
              placeholder="pattern"
            />
            <button type="button" onClick={generateProblem} disabled={isGeneratingProblem || !health?.ollama.available}>
              {isGeneratingProblem ? "WORKING" : "GENERATE"}
            </button>
            {isGeneratingProblem && (
              <div className="inline-loader" role="status" aria-live="polite">
                <span>OLLAMA</span>
                <span>GENERATING</span>
                <span className="loader-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
          </div>
        </div>

      </aside>

      <section className="problem-pane">
        <header className="problem-header">
          <div>
            <span className={`difficulty ${selectedProblem.difficulty.toLowerCase()}`}>{selectedProblem.difficulty}</span>
            <h2>{selectedProblem.title}</h2>
            <p>{selectedProblem.tags.join(" · ") || "Personal practice"}</p>
          </div>
          {selectedProblem.source === "personal" && (
            <button type="button" className="danger" onClick={() => deleteProblem(selectedProblem.id)}>
              DEL
            </button>
          )}
        </header>

        <article className="statement" dangerouslySetInnerHTML={renderMarkdown(selectedProblem.statementMarkdown)} />

        <details className="examples" aria-label="Examples">
          <summary>examples</summary>
          {selectedProblem.examples.map((example, index) => (
            <div className="example" key={`${selectedProblem.id}-example-${index}`}>
              <strong>#{index + 1}</strong>
              <div className="example-io">
                <div>
                  <span>in</span>
                  <code>{formatInput(example.input)}</code>
                </div>
                <div>
                  <span>out</span>
                  <code>{formatValue(example.output)}</code>
                </div>
              </div>
              {example.explanation && <p>{example.explanation}</p>}
            </div>
          ))}
        </details>

        {showAddProblem && (
          <section className="drawer" aria-label="Add exact problem">
            <div className="drawer-title">
              <h3>PASTE PROBLEM</h3>
            </div>
            <textarea
              className="paste-box"
              value={pastedProblemText}
              onChange={(event) => setPastedProblemText(event.target.value)}
              placeholder="paste exact problem text"
            />
            <div className="drawer-actions">
              <button type="button" onClick={parseExactProblem} disabled={isParsingProblem || !pastedProblemText.trim()}>
                {isParsingProblem ? "WORKING" : "PARSE"}
              </button>
              <button type="button" className="secondary" onClick={() => setShowAddProblem(false)}>
                CLOSE
              </button>
            </div>
            {isParsingProblem && (
              <div className="inline-loader" role="status" aria-live="polite">
                <span>OLLAMA</span>
                <span>PARSING</span>
                <span className="loader-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
            <details className="schema-editor">
              <summary>edit</summary>
              <div className="form-grid">
                <label>
                  Title
                  <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
                </label>
                <label>
                  Slug
                  <input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} />
                </label>
                <label>
                  Difficulty
                  <select
                    value={draft.difficulty}
                    onChange={(event) => setDraft({ ...draft, difficulty: event.target.value as Problem["difficulty"] })}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </label>
                <label>
                  Tags
                  <input
                    value={draft.tags}
                    onChange={(event) => setDraft({ ...draft, tags: event.target.value })}
                    placeholder="Array, Hash Table"
                  />
                </label>
                <label className="wide">
                  Statement Markdown
                  <textarea
                    value={draft.statementMarkdown}
                    onChange={(event) => setDraft({ ...draft, statementMarkdown: event.target.value })}
                  />
                </label>
                <label>
                  Function
                  <input
                    value={draft.functionName}
                    onChange={(event) => setDraft({ ...draft, functionName: event.target.value })}
                    placeholder="twoSum"
                  />
                </label>
                <label>
                  Return Type
                  <input value={draft.returnType} onChange={(event) => setDraft({ ...draft, returnType: event.target.value })} />
                </label>
                <label className="wide">
                  Params JSON
                  <textarea
                    value={draft.paramsJson}
                    onChange={(event) => setDraft({ ...draft, paramsJson: event.target.value })}
                  />
                </label>
                <label className="wide">
                  Examples JSON
                  <textarea
                    value={draft.examplesJson}
                    onChange={(event) => setDraft({ ...draft, examplesJson: event.target.value })}
                  />
                </label>
                <label className="wide">
                  Tests JSON
                  <textarea value={draft.testsJson} onChange={(event) => setDraft({ ...draft, testsJson: event.target.value })} />
                </label>
              </div>
              <div className="drawer-actions">
                <button type="button" onClick={addProblem}>
                  SAVE
                </button>
              </div>
            </details>
          </section>
        )}
      </section>

      <section className="workspace-pane" aria-label="Workspace">
        <div className="toolbar">
          <div className="segmented" aria-label="Language">
            <button type="button" className={language === "python" ? "active" : ""} onClick={() => setLanguage("python")}>
              Python
            </button>
            <button type="button" className={language === "cpp" ? "active" : ""} onClick={() => setLanguage("cpp")}>
              C++
            </button>
          </div>
          <button type="button" className="secondary" onClick={resetCode}>
            RESET
          </button>
          <button type="button" onClick={runTests} disabled={isRunning}>
            {isRunning ? "RUNNING" : "RUN"}
          </button>
          <button type="button" onClick={submitSolution} disabled={isRunning || isAsking || !health?.ollama.available}>
            {isSubmitting ? "SUBMITTING" : "SUBMIT"}
          </button>
        </div>

        <CodeMirror
          className="code-editor"
          value={code}
          extensions={editorExtensions(language)}
          basicSetup={{
            autocompletion: true,
            bracketMatching: true,
            closeBrackets: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            lineNumbers: true,
            syntaxHighlighting: true
          }}
          theme="dark"
          height="100%"
          onChange={updateCode}
          aria-label={`${language} solution editor`}
        />

        <section className="results" aria-label="Test results">
          <div className="results-title">
            <strong>LOCAL TESTS</strong>
            <span>
              {passed}/{total}
            </span>
          </div>
          {runResult?.compileOutput && <pre className="output">{runResult.compileOutput}</pre>}
          {runResult?.stderr && <pre className="output error">{runResult.stderr}</pre>}
          <div className="test-list">
            {(runResult?.results ?? []).map((result) => (
              <div className={`test-row ${result.passed ? "pass" : "fail"}`} key={result.name}>
                <div>
                  <strong>{result.name}</strong>
                  <small>{result.durationMs.toFixed(1)} ms</small>
                </div>
                <span>{result.passed ? "PASS" : "FAIL"}</span>
                {!result.passed && <pre>{jsonPretty({ input: result.input, expected: result.expected, actual: result.actual, error: result.error })}</pre>}
              </div>
            ))}
          </div>
        </section>

        <section className="coach" aria-label="Ollama coach">
          <div className="coach-header">
            <div>
              <strong>Ollama Coach</strong>
              <small>{health?.runner ? `${health.runner.python} / ${health.runner.cpp}` : "checking"}</small>
            </div>
            <select value={model} onChange={(event) => changeModel(event.target.value)} aria-label="Ollama model">
              {selectableModels(health, model).length ? (
                selectableModels(health, model).map((modelName) => (
                  <option value={modelName} key={modelName}>
                    {modelName}
                  </option>
                ))
              ) : (
                <option value={model}>{model || "No models found"}</option>
              )}
            </select>
          </div>
          {recommendation && (
            <div className="model-advice">
              <div>
                <strong>AUTO: {recommendation.selectedModel}</strong>
                {recommendation.pullCommand && <code>{recommendation.pullCommand}</code>}
              </div>
              <button type="button" className="secondary" onClick={() => changeModel(recommendation.selectedModel)}>
                USE
              </button>
            </div>
          )}
          {ollamaBusy && (
            <div className="ollama-loader" role="status" aria-live="polite">
              <span className="loader-scan" aria-hidden="true" />
              <div>
                <strong>OLLAMA</strong>
                <small>{ollamaBusyLabel}</small>
              </div>
              <span className="loader-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
          <div className="prompt-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => askAi("Give me a hint without giving away the solution.")}
              disabled={isAsking}
            >
              HINT
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => askAi("Review my code for correctness and complexity.")}
              disabled={isAsking}
            >
              REVIEW
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => askAi("Use the latest test result to explain what is failing.")}
              disabled={isAsking}
            >
              WHY FAIL
            </button>
          </div>
          <div className="chat-log">
            {messages.map((message, index) => (
              <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
                <strong>{message.role === "user" ? "YOU" : "AI"}</strong>
                <p>{message.content}</p>
              </div>
            ))}
            {isAsking && (
              <div className="chat-message assistant pending">
                <strong>AI</strong>
                <p>
                  waiting on {model || "ollama"}
                  <span className="typing-cursor" aria-hidden="true" />
                </p>
              </div>
            )}
          </div>
          <div className="ask-row">
            <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="> ask" disabled={isAsking} />
            <button type="button" onClick={() => askAi()} disabled={isAsking || !question.trim()}>
              {isAsking ? "WAIT" : "SEND"}
            </button>
          </div>
        </section>

        {notice && <div className="notice">{notice}</div>}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
