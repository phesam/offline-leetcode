import type { Problem } from "./types";

export const includedProblems: Problem[] = [
  {
    id: "pair-sum-indices",
    slug: "pair-sum-indices",
    title: "Pair Sum Indices",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    source: "included",
    statementMarkdown:
      "Given an array of integers `nums` and an integer `target`, return the indices of two distinct elements whose sum equals `target`.\n\nYou may assume exactly one valid answer exists. Return the indices in any order.",
    signature: {
      functionName: "pairSum",
      params: [
        { name: "nums", type: "vector<int>" },
        { name: "target", type: "int" }
      ],
      returnType: "vector<int>"
    },
    examples: [
      {
        input: { nums: [3, 4, 8, 11], target: 12 },
        output: [1, 2],
        explanation: "nums[1] + nums[2] = 4 + 8 = 12."
      }
    ],
    tests: [
      { name: "middle pair", input: { nums: [3, 4, 8, 11], target: 12 }, expected: [1, 2] },
      { name: "first and last", input: { nums: [10, -3, 5, 7], target: 17 }, expected: [0, 3] },
      { name: "negative value", input: { nums: [-8, 6, 1, 12], target: -2 }, expected: [0, 1] }
    ]
  },
  {
    id: "compress-runs",
    slug: "compress-runs",
    title: "Compress Runs",
    difficulty: "Medium",
    tags: ["String", "Two Pointers"],
    source: "included",
    statementMarkdown:
      "Given a lowercase string `s`, compress consecutive runs of the same character into `character + count` when the count is greater than 1. Single characters remain unchanged.\n\nReturn the compressed string.",
    signature: {
      functionName: "compressRuns",
      params: [{ name: "s", type: "string" }],
      returnType: "string"
    },
    examples: [
      {
        input: { s: "aaabbcdddd" },
        output: "a3b2cd4"
      }
    ],
    tests: [
      { name: "mixed runs", input: { s: "aaabbcdddd" }, expected: "a3b2cd4" },
      { name: "no compression", input: { s: "abcd" }, expected: "abcd" },
      { name: "single large run", input: { s: "zzzzzz" }, expected: "z6" }
    ]
  },
  {
    id: "count-islands",
    slug: "count-islands",
    title: "Count Islands",
    difficulty: "Medium",
    tags: ["DFS", "BFS", "Matrix"],
    source: "included",
    statementMarkdown:
      "Given a grid of `0`s and `1`s, count how many islands it contains. An island is a group of `1`s connected horizontally or vertically. The grid edges are surrounded by water.",
    signature: {
      functionName: "countIslands",
      params: [{ name: "grid", type: "vector<vector<int>>" }],
      returnType: "int"
    },
    examples: [
      {
        input: {
          grid: [
            [1, 1, 0],
            [0, 1, 0],
            [1, 0, 1]
          ]
        },
        output: 3
      }
    ],
    tests: [
      {
        name: "three islands",
        input: {
          grid: [
            [1, 1, 0],
            [0, 1, 0],
            [1, 0, 1]
          ]
        },
        expected: 3
      },
      {
        name: "one island",
        input: {
          grid: [
            [1, 1, 1],
            [0, 1, 0],
            [1, 1, 1]
          ]
        },
        expected: 1
      },
      {
        name: "empty water",
        input: {
          grid: [
            [0, 0],
            [0, 0]
          ]
        },
        expected: 0
      }
    ]
  }
];

export function getStarterCode(problem: Problem, language: "python" | "cpp"): string {
  const params = problem.signature.params;
  if (language === "python") {
    const args = params.map((param) => param.name).join(", ");
    return `class Solution:\n    def ${problem.signature.functionName}(self, ${args}):\n        # Write your solution here\n        pass\n`;
  }

  const cppParams = params.map((param) => `${param.type} ${param.name}`).join(", ");
  return `class Solution {\npublic:\n    ${problem.signature.returnType} ${problem.signature.functionName}(${cppParams}) {\n        // Write your solution here\n        return {};\n    }\n};\n`;
}
