import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { includedProblems } from "../shared/problems";
import type { AskRequest, GenerateProblemRequest, ParseProblemRequest, RunRequest } from "../shared/types";
import { askOllama, generateProblemWithOllama, ollamaHealth, parseProblemWithOllama } from "./ollama";
import { deletePrivateProblem, readPrivateProblems, savePrivateProblem } from "./privateProblems";
import { readBuiltIndex, runnerHealth, runSubmission } from "./runner";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT ?? 4174);

app.use(express.json({ limit: "2mb" }));

app.get("/api/problems", (_request, response) => {
  response.json({ problems: includedProblems });
});

app.get("/api/private-problems", async (_request, response) => {
  response.json({ problems: await readPrivateProblems() });
});

app.post("/api/private-problems", async (request, response) => {
  response.json({ problem: await savePrivateProblem(request.body) });
});

app.delete("/api/private-problems/:id", async (request, response) => {
  await deletePrivateProblem(request.params.id);
  response.json({ ok: true });
});

app.get("/api/health", async (_request, response) => {
  const [runner, ollama] = await Promise.all([runnerHealth(), ollamaHealth()]);
  response.json({ runner, ollama });
});

app.post("/api/run", async (request, response) => {
  const body = request.body as RunRequest;
  if (!body?.problem || !body?.code || !body?.language) {
    response.status(400).json({ ok: false, error: "Missing language, code, or problem." });
    return;
  }
  response.json(await runSubmission(body));
});

app.post("/api/ask", async (request, response) => {
  const body = request.body as AskRequest;
  if (!body?.problem || !body?.code || !body?.language || !Array.isArray(body.messages)) {
    response.status(400).json({ ok: false, message: "Missing problem, code, language, or messages." });
    return;
  }
  response.json(await askOllama(body));
});

app.post("/api/generate-problem", async (request, response) => {
  const body = request.body as GenerateProblemRequest;
  if (!body?.difficulty) {
    response.status(400).json({ ok: false, message: "Missing difficulty." });
    return;
  }
  response.json(await generateProblemWithOllama(body));
});

app.post("/api/parse-problem", async (request, response) => {
  const body = request.body as ParseProblemRequest;
  if (!body?.rawText) {
    response.status(400).json({ ok: false, message: "Missing pasted problem text." });
    return;
  }
  response.json(await parseProblemWithOllama(body));
});

const builtClient = path.resolve(__dirname, "../../dist/client");
app.use(express.static(builtClient));

app.get("*", async (_request, response) => {
  const index = await readBuiltIndex();
  if (!index) {
    response.status(404).send("AirCode API is running. Start the web UI with npm run dev:web or run npm run build.");
    return;
  }
  response.type("html").send(index);
});

app.listen(port, "127.0.0.1", () => {
  console.log(`AirCode API listening on http://127.0.0.1:${port}`);
});
