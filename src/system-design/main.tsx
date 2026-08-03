import React from "react";
import { createRoot } from "react-dom/client";
import { marked } from "marked";
import { systemDesignChecklist, systemDesignLevelGuidance, systemDesignPrompts, systemDesignSteps } from "../shared/systemDesign";
import type { OllamaRecommendation, SystemDesignAnswer, SystemDesignReviewResponse } from "../shared/types";
import "./styles.css";

const MODEL_KEY = "aircode.ollamaModel.v2";
const ANSWER_KEY = "aircode.systemDesign.answer.v1";
const CHECKS_KEY = "aircode.systemDesign.checks.v1";
const SESSION_SECONDS = 45 * 60;

interface Health {
  ollama: {
    available: boolean;
    models: string[];
    defaultModel: string;
    recommendation?: OllamaRecommendation;
  };
}

function blankAnswer(promptId = systemDesignPrompts[0].id): SystemDesignAnswer {
  const prompt = systemDesignPrompts.find((item) => item.id === promptId) ?? systemDesignPrompts[0];
  return {
    promptId: prompt.id,
    promptTitle: prompt.title,
    level: "Early",
    requirements: "",
    scale: "",
    api: "",
    dataModel: "",
    architecture: "",
    deepDives: "",
    risks: ""
  };
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T) : ({} as T);
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload ? String(payload.message) : `API returned ${response.status}.`;
    throw new Error(message);
  }
  return payload;
}

function selectableModels(health: Health | undefined, currentModel: string): string[] {
  const installed = health?.ollama.models.filter((modelName) => !modelName.toLowerCase().includes("embed")) ?? [];
  if (currentModel && !installed.includes(currentModel)) return [currentModel, ...installed];
  return installed;
}

function formatClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

function renderMarkdown(markdown: string): { __html: string } {
  return { __html: marked.parse(markdown, { async: false }) };
}

function App(): React.ReactElement {
  const [answer, setAnswer] = React.useState<SystemDesignAnswer>(() => readJson<SystemDesignAnswer>(ANSWER_KEY, blankAnswer()));
  const [checks, setChecks] = React.useState<boolean[]>(() => readJson<boolean[]>(CHECKS_KEY, systemDesignChecklist.map(() => false)));
  const [health, setHealth] = React.useState<Health | undefined>();
  const [model, setModel] = React.useState(() => localStorage.getItem(MODEL_KEY) || "");
  const [secondsLeft, setSecondsLeft] = React.useState(SESSION_SECONDS);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [review, setReview] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [isReviewing, setIsReviewing] = React.useState(false);
  const reviewAbortController = React.useRef<AbortController | null>(null);

  const selectedPrompt = systemDesignPrompts.find((prompt) => prompt.id === answer.promptId) ?? systemDesignPrompts[0];
  const completedChecks = checks.filter(Boolean).length;

  React.useEffect(() => {
    apiJson<Health>("/api/health")
      .then((payload) => {
        setHealth(payload);
        const installed = selectableModels(payload, "");
        const storedModel = localStorage.getItem(MODEL_KEY);
        const autoModel = payload.ollama.recommendation?.selectedModel || payload.ollama.defaultModel;
        setModel(storedModel && installed.includes(storedModel) ? storedModel : autoModel);
      })
      .catch(() => setNotice("API OFFLINE"));
  }, []);

  React.useEffect(() => {
    localStorage.setItem(ANSWER_KEY, JSON.stringify(answer));
  }, [answer]);

  React.useEffect(() => {
    localStorage.setItem(CHECKS_KEY, JSON.stringify(checks));
  }, [checks]);

  React.useEffect(() => {
    if (model) localStorage.setItem(MODEL_KEY, model);
  }, [model]);

  React.useEffect(() => {
    if (systemDesignPrompts.some((prompt) => prompt.id === answer.promptId)) return;
    setAnswer((current) => ({ ...blankAnswer(), level: current.level }));
  }, [answer.promptId]);

  React.useEffect(() => {
    if (!timerRunning) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  function updateAnswer(field: keyof SystemDesignAnswer, value: string): void {
    setAnswer((current) => ({ ...current, [field]: value }));
  }

  function choosePrompt(promptId: string): void {
    const prompt = systemDesignPrompts.find((item) => item.id === promptId) ?? systemDesignPrompts[0];
    setAnswer({ ...blankAnswer(prompt.id), level: answer.level });
    setChecks(systemDesignChecklist.map(() => false));
    setReview("");
    setNotice(`PROMPT ${prompt.title}`);
  }

  function resetSession(): void {
    setSecondsLeft(SESSION_SECONDS);
    setTimerRunning(false);
    setAnswer(blankAnswer(answer.promptId));
    setChecks(systemDesignChecklist.map(() => false));
    setReview("");
    setNotice("RESET");
  }

  async function reviewDesign(): Promise<void> {
    reviewAbortController.current?.abort();
    const controller = new AbortController();
    reviewAbortController.current = controller;
    setIsReviewing(true);
    setNotice("");
    try {
      const payload = await apiJson<SystemDesignReviewResponse>("/api/system-design-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ model, answer: { ...answer, promptTitle: selectedPrompt.title } })
      });
      setReview(payload.message);
      if (!payload.ok) setNotice(payload.message);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setReview("Canceled.");
        setNotice("CANCELED");
      } else {
        setNotice(error instanceof Error ? error.message : "Could not review design.");
      }
    } finally {
      if (reviewAbortController.current === controller) reviewAbortController.current = null;
      setIsReviewing(false);
    }
  }

  function cancelReview(): void {
    reviewAbortController.current?.abort();
    setNotice("CANCELING");
  }

  function exportNotes(): void {
    const blob = new Blob([JSON.stringify({ answer, checks, review }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aircode-system-design.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="sd-shell">
      <header className="sd-topbar">
        <div>
          <a href="/" className="back-link">
            CODE
          </a>
          <h1>SYSTEM DESIGN</h1>
        </div>
        <div className="timer">
          <strong>{formatClock(secondsLeft)}</strong>
          <button type="button" onClick={() => setTimerRunning((value) => !value)}>
            {timerRunning ? "PAUSE" : "START"}
          </button>
          <button type="button" className="secondary" onClick={resetSession}>
            RESET
          </button>
        </div>
      </header>

      <section className="prompt-bar">
        <label>
          Prompt
          <select value={answer.promptId} onChange={(event) => choosePrompt(event.target.value)}>
            {systemDesignPrompts.map((prompt) => (
              <option value={prompt.id} key={prompt.id}>
                {prompt.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Level
          <select value={answer.level} onChange={(event) => updateAnswer("level", event.target.value)}>
            <option>Early</option>
            <option>Mid</option>
            <option>Senior</option>
            <option>Staff</option>
          </select>
        </label>
        <label>
          Ollama
          <select value={model} onChange={(event) => setModel(event.target.value)}>
            {selectableModels(health, model).length ? (
              selectableModels(health, model).map((modelName) => (
                <option value={modelName} key={modelName}>
                  {modelName}
                </option>
              ))
            ) : (
              <option>{model || "No models found"}</option>
            )}
          </select>
        </label>
      </section>

      <section className="sd-layout">
        <aside className="sd-side">
          <div className="prompt-card">
            <strong>{selectedPrompt.title}</strong>
            <span>{selectedPrompt.category}</span>
            <p>{selectedPrompt.brief}</p>
          </div>

          <div className="level-card">
            <strong>{answer.level}</strong>
            <p>{systemDesignLevelGuidance[answer.level]}</p>
          </div>

          <div className="facts">
            <h2>Functional</h2>
            {selectedPrompt.functional.map((item) => (
              <p key={item}>{item}</p>
            ))}
            <h2>Constraints</h2>
            {selectedPrompt.constraints.map((item) => (
              <p key={item}>{item}</p>
            ))}
            <h2>Deep Dives</h2>
            {selectedPrompt.deepDiveIdeas.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>

          <div className="checklist">
            <div className="check-title">
              <strong>CHECKLIST</strong>
              <span>
                {completedChecks}/{checks.length}
              </span>
            </div>
            {systemDesignChecklist.map((item, index) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={checks[index] ?? false}
                  onChange={(event) => {
                    const next = [...checks];
                    next[index] = event.target.checked;
                    setChecks(next);
                  }}
                />
                {item}
              </label>
            ))}
          </div>
        </aside>

        <section className="workspace">
          <div className="steps">
            {systemDesignSteps.map((step) => (
              <span key={step.key}>
                {step.minutes} {step.label}
              </span>
            ))}
          </div>

          <div className="answer-grid">
            <label>
              Requirements
              <textarea value={answer.requirements} onChange={(event) => updateAnswer("requirements", event.target.value)} />
            </label>
            <label>
              Scale
              <textarea value={answer.scale} onChange={(event) => updateAnswer("scale", event.target.value)} />
            </label>
            <label>
              API
              <textarea value={answer.api} onChange={(event) => updateAnswer("api", event.target.value)} />
            </label>
            <label>
              Data Model
              <textarea value={answer.dataModel} onChange={(event) => updateAnswer("dataModel", event.target.value)} />
            </label>
            <label className="wide">
              Architecture
              <textarea value={answer.architecture} onChange={(event) => updateAnswer("architecture", event.target.value)} />
            </label>
            <label>
              Deep Dives
              <textarea value={answer.deepDives} onChange={(event) => updateAnswer("deepDives", event.target.value)} />
            </label>
            <label>
              Risks
              <textarea value={answer.risks} onChange={(event) => updateAnswer("risks", event.target.value)} />
            </label>
          </div>

          <div className="review-actions">
            <button type="button" onClick={reviewDesign} disabled={isReviewing || !health?.ollama.available}>
              {isReviewing ? "REVIEWING" : "REVIEW"}
            </button>
            {isReviewing && (
              <button type="button" className="danger" onClick={cancelReview}>
                CANCEL
              </button>
            )}
            <button type="button" className="secondary" onClick={exportNotes}>
              EXPORT
            </button>
          </div>

          {review && <article className="review" dangerouslySetInnerHTML={renderMarkdown(review)} />}
          {notice && <div className="notice">{notice}</div>}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("system-design-root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
