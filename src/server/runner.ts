import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { RunRequest, RunResponse, TestResult } from "../shared/types";
import { buildCppHarness } from "./cppHarness";
import { buildPythonHarness } from "./pythonHarness";

const EXECUTION_TIMEOUT_MS = 4500;
const COMPILE_TIMEOUT_MS = 8000;

interface ProcessResult {
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  durationMs: number;
}

function runProcess(command: string, args: string[], cwd: string, timeoutMs: number): Promise<ProcessResult> {
  return new Promise((resolve) => {
    const started = performance.now();
    const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({
        code: 1,
        stdout,
        stderr: `${stderr}${error.message}`,
        timedOut,
        durationMs: performance.now() - started
      });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        code,
        stdout,
        stderr,
        timedOut,
        durationMs: performance.now() - started
      });
    });
  });
}

function parseResults(stdout: string): TestResult[] {
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as TestResult);
}

function processFailure(message: string, durationMs: number): RunResponse {
  return {
    ok: false,
    stderr: message,
    results: [],
    durationMs
  };
}

export async function runSubmission(request: RunRequest): Promise<RunResponse> {
  const workDir = await mkdtemp(path.join(tmpdir(), "aircode-"));
  const started = performance.now();

  try {
    if (request.language === "python") {
      const filePath = path.join(workDir, "solution.py");
      await writeFile(filePath, buildPythonHarness(request.problem, request.code), "utf8");
      const result = await runProcess("python3", [filePath], workDir, EXECUTION_TIMEOUT_MS);
      if (result.timedOut) return processFailure("Python execution timed out.", result.durationMs);
      if (result.code !== 0) return processFailure(result.stderr || "Python execution failed.", result.durationMs);
      return {
        ok: true,
        stderr: result.stderr,
        results: parseResults(result.stdout),
        durationMs: performance.now() - started
      };
    }

    const sourcePath = path.join(workDir, "main.cpp");
    const binaryPath = path.join(workDir, "solution");
    await writeFile(sourcePath, buildCppHarness(request.problem, request.code), "utf8");

    const compiler = process.env.CXX || "g++";
    const compile = await runProcess(
      compiler,
      ["-std=c++17", "-O2", "-Wall", "-Wextra", sourcePath, "-o", binaryPath],
      workDir,
      COMPILE_TIMEOUT_MS
    );
    if (compile.timedOut) {
      return {
        ok: false,
        compileOutput: "C++ compilation timed out.",
        results: [],
        durationMs: performance.now() - started
      };
    }
    if (compile.code !== 0) {
      return {
        ok: false,
        compileOutput: compile.stderr || compile.stdout || "C++ compilation failed.",
        results: [],
        durationMs: performance.now() - started
      };
    }

    const result = await runProcess(binaryPath, [], workDir, EXECUTION_TIMEOUT_MS);
    if (result.timedOut) return processFailure("C++ execution timed out.", result.durationMs);
    if (result.code !== 0) return processFailure(result.stderr || "C++ execution failed.", result.durationMs);

    return {
      ok: true,
      compileOutput: compile.stderr,
      stderr: result.stderr,
      results: parseResults(result.stdout),
      durationMs: performance.now() - started
    };
  } catch (error) {
    return processFailure(error instanceof Error ? error.message : "Unknown runner error.", performance.now() - started);
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

export async function runnerHealth(): Promise<{ python: string; cpp: string }> {
  const [python, cpp] = await Promise.all([
    runProcess("python3", ["--version"], process.cwd(), 1500),
    runProcess(process.env.CXX || "g++", ["--version"], process.cwd(), 1500)
  ]);

  return {
    python: python.stdout.trim() || python.stderr.trim() || "unavailable",
    cpp: (cpp.stdout.trim() || cpp.stderr.trim() || "unavailable").split("\n")[0]
  };
}

export async function readBuiltIndex(): Promise<string | null> {
  try {
    return await readFile(path.join(process.cwd(), "dist/client/index.html"), "utf8");
  } catch {
    return null;
  }
}
