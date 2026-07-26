import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const APP_URL = process.env.AIRCODE_URL ?? "http://127.0.0.1:4174";
const OLLAMA_URL = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const children = [];

function log(message) {
  console.log(`[aircode] ${message}`);
}

function command(name) {
  return process.platform === "win32" ? `${name}.cmd` : name;
}

function spawnChild(label, commandName, args, options = {}) {
  const child = spawn(commandName, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: options.silent ? "ignore" : "inherit"
  });

  child.on("error", (error) => {
    console.error(`[aircode] ${label} failed: ${error.message}`);
  });

  children.push(child);
  return child;
}

function cleanup() {
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
}

process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(url, timeoutMs = 1500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return undefined;
    return await response.json();
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

async function waitForJson(url, label, timeoutMs = 20_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const payload = await getJson(url);
    if (payload) return payload;
    await sleep(500);
  }
  throw new Error(`${label} did not start within ${Math.round(timeoutMs / 1000)}s.`);
}

async function runCommand(label, commandName, args) {
  await new Promise((resolve, reject) => {
    log(label);
    const child = spawn(commandName, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit"
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} exited with ${code}.`));
    });
  });
}

async function ensureBuilt() {
  const indexPath = path.join(process.cwd(), "dist", "client", "index.html");
  if (existsSync(indexPath)) {
    log("built app found");
    return;
  }
  const tscPath = path.join(process.cwd(), "node_modules", "typescript", "bin", "tsc");
  const vitePath = path.join(process.cwd(), "node_modules", "vite", "bin", "vite.js");
  if (!existsSync(tscPath) || !existsSync(vitePath)) {
    throw new Error("dependencies are missing. Run `npm install` once while online, then run AirCode again.");
  }
  await runCommand("typechecking app", process.execPath, [tscPath]);
  await runCommand("building app", process.execPath, [vitePath, "build"]);
}

async function ensureOllama() {
  const tags = await getJson(`${OLLAMA_URL}/api/tags`);
  if (tags) {
    log("ollama is running");
    return false;
  }

  log("starting ollama");
  spawnChild("ollama", "ollama", ["serve"]);
  const payload = await waitForJson(`${OLLAMA_URL}/api/tags`, "ollama");
  const models = payload.models?.map((model) => model.name || model.model).filter(Boolean) ?? [];
  if (!models.length) log("ollama is running, but no models are pulled yet");
  else log(`ollama models: ${models.join(", ")}`);
  return true;
}

async function ensureApp() {
  const health = await getJson(`${APP_URL}/api/health`);
  if (health) {
    log(`aircode is already running at ${APP_URL}`);
    return false;
  }

  log("starting aircode");
  const tsxPath = path.join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs");
  if (!existsSync(tsxPath)) {
    throw new Error("dependencies are missing. Run `npm install` once while online, then run AirCode again.");
  }
  spawnChild("aircode", process.execPath, [tsxPath, "src/server/index.ts"]);
  await waitForJson(`${APP_URL}/api/health`, "aircode");
  return true;
}

function openApp() {
  const opener =
    process.platform === "darwin"
      ? ["open", [APP_URL]]
      : process.platform === "win32"
        ? ["cmd", ["/c", "start", "", APP_URL]]
        : ["xdg-open", [APP_URL]];

  spawn(opener[0], opener[1], { stdio: "ignore", detached: true }).unref();
}

async function main() {
  await ensureBuilt();
  const startedOllama = await ensureOllama();
  const startedApp = await ensureApp();
  openApp();
  log(`open ${APP_URL}`);

  if (!startedOllama && !startedApp) return;

  log("leave this terminal open; press Ctrl+C to stop AirCode");
  await new Promise(() => undefined);
}

main().catch((error) => {
  cleanup();
  console.error(`[aircode] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
