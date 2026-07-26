# AirCode

Practice coding problems offline with Python, C++, and Ollama.

AirCode runs on your laptop. No account. No cloud backend. Good for planes.

## What You Get

- A local web app
- Python and C++ code editor
- Run tests on your machine
- Ask Ollama for hints and code review
- Add your own exact LeetCode problems for personal offline use
- Generate original practice problems with Ollama

## Setup

First time only:

```bash
npm install
```

Start:

```bash
./aircode
```

That starts Ollama if needed, starts AirCode, and opens the app.

## Before Your Flight

Install Ollama and pull a good coding model:

```bash
ollama pull qwen2.5-coder:14b
```

Then run AirCode once while you still have Wi-Fi:

```bash
./aircode
```

Add any exact LeetCode problems you want by clicking **Add Exact Problem**.
Private problems are saved in `.aircode/problems/`, which is ignored by git.

## Using It

1. Pick a problem.
2. Choose Python or C++.
3. Write code.
4. Click **Run** for local tests.
5. Click **Submit** for Ollama review.

## Plane Mode

After opening your laptop on the plane:

```bash
./aircode
```

That is it.

## Exact LeetCode Problems

This repo does not include LeetCode problem text.

For personal use, paste problems into the app yourself before you go offline.

## Requirements

- Node.js 20+
- Python 3
- `g++` or `clang++`
- Ollama

## Checks

```bash
npm run check
npm run smoke
npm run build
```

## License

MIT
