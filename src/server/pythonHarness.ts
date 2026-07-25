import type { Problem } from "../shared/types";

export function buildPythonHarness(problem: Problem, code: string): string {
  const testsJson = JSON.stringify(problem.tests);
  const paramNames = problem.signature.params.map((param) => param.name);

  return `import copy
import json
import time
import traceback

${code}

TESTS = json.loads(${JSON.stringify(testsJson)})
PARAMS = ${JSON.stringify(paramNames)}
FUNCTION_NAME = ${JSON.stringify(problem.signature.functionName)}

def emit(payload):
    print(json.dumps(payload, separators=(",", ":")), flush=True)

for test in TESTS:
    started = time.perf_counter()
    expected = test["expected"]
    try:
        solution = Solution()
        args = [copy.deepcopy(test["input"][name]) for name in PARAMS]
        actual = getattr(solution, FUNCTION_NAME)(*args)
        duration = (time.perf_counter() - started) * 1000
        emit({
            "name": test["name"],
            "passed": actual == expected,
            "input": test["input"],
            "expected": expected,
            "actual": actual,
            "durationMs": duration
        })
    except Exception as error:
        duration = (time.perf_counter() - started) * 1000
        emit({
            "name": test["name"],
            "passed": False,
            "input": test["input"],
            "expected": expected,
            "error": "".join(traceback.format_exception_only(type(error), error)).strip(),
            "durationMs": duration
        })
`;
}
