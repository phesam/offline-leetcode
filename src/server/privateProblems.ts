import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Problem } from "../shared/types";

const PRIVATE_DIR = path.join(process.cwd(), ".aircode", "problems");

function safeFileName(id: string): string {
  return `${id.replace(/[^a-zA-Z0-9._-]/g, "_")}.json`;
}

function isProblem(value: unknown): value is Problem {
  const problem = value as Partial<Problem>;
  return Boolean(problem?.id && problem?.title && problem?.statementMarkdown && problem?.signature && Array.isArray(problem?.tests));
}

export async function readPrivateProblems(): Promise<Problem[]> {
  await mkdir(PRIVATE_DIR, { recursive: true });
  const files = await readdir(PRIVATE_DIR);
  const problems = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        try {
          const parsed = JSON.parse(await readFile(path.join(PRIVATE_DIR, file), "utf8")) as unknown;
          return isProblem(parsed) ? parsed : null;
        } catch {
          return null;
        }
      })
  );

  return problems
    .filter((problem): problem is Problem => Boolean(problem))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function savePrivateProblem(problem: Problem): Promise<Problem> {
  await mkdir(PRIVATE_DIR, { recursive: true });
  const privateProblem: Problem = {
    ...problem,
    source: "personal"
  };
  await writeFile(path.join(PRIVATE_DIR, safeFileName(privateProblem.id)), `${JSON.stringify(privateProblem, null, 2)}\n`, "utf8");
  return privateProblem;
}

export async function deletePrivateProblem(id: string): Promise<void> {
  await rm(path.join(PRIVATE_DIR, safeFileName(id)), { force: true });
}
