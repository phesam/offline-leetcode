import type { Problem } from "./types";

export const includedProblems: Problem[] = [
  {
    id: "two-sum",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    source: "included",
    statementMarkdown:
      "Given `nums` and `target`, return two different indices whose values add up to `target`.\n\nReturn the indices in increasing order. Each test has exactly one answer.",
    signature: {
      functionName: "twoSum",
      params: [
        { name: "nums", type: "vector<int>" },
        { name: "target", type: "int" }
      ],
      returnType: "vector<int>"
    },
    examples: [{ input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] }],
    tests: [
      { name: "front pair", input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { name: "middle pair", input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      { name: "duplicates", input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
      { name: "negative", input: { nums: [-4, 10, 7, 2], target: 3 }, expected: [0, 2] }
    ]
  },
  {
    id: "valid-parentheses",
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    source: "included",
    statementMarkdown:
      "Given a string containing only `()[]{}`, return whether every opener is closed by the matching bracket in the correct order.",
    signature: {
      functionName: "isValid",
      params: [{ name: "s", type: "string" }],
      returnType: "bool"
    },
    examples: [{ input: { s: "([])" }, output: true }],
    tests: [
      { name: "nested", input: { s: "([])" }, expected: true },
      { name: "wrong close", input: { s: "(]" }, expected: false },
      { name: "interleaved", input: { s: "([)]" }, expected: false },
      { name: "empty", input: { s: "" }, expected: true },
      { name: "separate groups", input: { s: "()[]{}" }, expected: true }
    ]
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Greedy"],
    source: "included",
    statementMarkdown:
      "Given daily stock prices, choose one day to buy and a later day to sell. Return the maximum profit, or `0` if no profitable trade exists.",
    signature: {
      functionName: "maxProfit",
      params: [{ name: "prices", type: "vector<int>" }],
      returnType: "int"
    },
    examples: [{ input: { prices: [7, 1, 5, 3, 6, 4] }, output: 5 }],
    tests: [
      { name: "classic gain", input: { prices: [7, 1, 5, 3, 6, 4] }, expected: 5 },
      { name: "falling", input: { prices: [7, 6, 4, 3, 1] }, expected: 0 },
      { name: "single", input: { prices: [5] }, expected: 0 },
      { name: "late sell", input: { prices: [2, 4, 1, 9] }, expected: 8 }
    ]
  },
  {
    id: "contains-duplicate",
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    tags: ["Array", "Hash Set"],
    source: "included",
    statementMarkdown:
      "Return `true` if any value appears at least twice in `nums`; otherwise return `false`.",
    signature: {
      functionName: "containsDuplicate",
      params: [{ name: "nums", type: "vector<int>" }],
      returnType: "bool"
    },
    examples: [{ input: { nums: [1, 2, 3, 1] }, output: true }],
    tests: [
      { name: "has repeat", input: { nums: [1, 2, 3, 1] }, expected: true },
      { name: "all unique", input: { nums: [1, 2, 3, 4] }, expected: false },
      { name: "negative repeat", input: { nums: [-1, 0, -1] }, expected: true },
      { name: "empty", input: { nums: [] }, expected: false }
    ]
  },
  {
    id: "product-of-array-except-self",
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    tags: ["Array", "Prefix"],
    source: "included",
    statementMarkdown:
      "For each position, return the product of every number in `nums` except the number at that position.\n\nDo not use division.",
    signature: {
      functionName: "productExceptSelf",
      params: [{ name: "nums", type: "vector<int>" }],
      returnType: "vector<int>"
    },
    examples: [{ input: { nums: [1, 2, 3, 4] }, output: [24, 12, 8, 6] }],
    tests: [
      { name: "positive", input: { nums: [1, 2, 3, 4] }, expected: [24, 12, 8, 6] },
      { name: "one zero", input: { nums: [1, 2, 0, 4] }, expected: [0, 0, 8, 0] },
      { name: "two zeros", input: { nums: [0, 2, 0, 4] }, expected: [0, 0, 0, 0] },
      { name: "negative", input: { nums: [-1, 2, -3, 4] }, expected: [-24, 12, -8, 6] }
    ]
  },
  {
    id: "maximum-subarray",
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    source: "included",
    statementMarkdown:
      "Return the largest sum of any non-empty contiguous subarray of `nums`.",
    signature: {
      functionName: "maxSubArray",
      params: [{ name: "nums", type: "vector<int>" }],
      returnType: "int"
    },
    examples: [{ input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, output: 6 }],
    tests: [
      { name: "mixed", input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
      { name: "single", input: { nums: [1] }, expected: 1 },
      { name: "all negative", input: { nums: [-8, -3, -6] }, expected: -3 },
      { name: "all positive", input: { nums: [2, 3, 4] }, expected: 9 }
    ]
  },
  {
    id: "maximum-product-subarray",
    slug: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    source: "included",
    statementMarkdown:
      "Return the largest product of any non-empty contiguous subarray of `nums`.",
    signature: {
      functionName: "maxProduct",
      params: [{ name: "nums", type: "vector<int>" }],
      returnType: "int"
    },
    examples: [{ input: { nums: [2, 3, -2, 4] }, output: 6 }],
    tests: [
      { name: "simple", input: { nums: [2, 3, -2, 4] }, expected: 6 },
      { name: "zero split", input: { nums: [-2, 0, -1] }, expected: 0 },
      { name: "two negatives", input: { nums: [-2, 3, -4] }, expected: 24 },
      { name: "single negative", input: { nums: [-2] }, expected: -2 }
    ]
  },
  {
    id: "find-minimum-in-rotated-sorted-array",
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    source: "included",
    statementMarkdown:
      "A strictly increasing array was rotated some number of times. Return its smallest value.",
    signature: {
      functionName: "findMin",
      params: [{ name: "nums", type: "vector<int>" }],
      returnType: "int"
    },
    examples: [{ input: { nums: [3, 4, 5, 1, 2] }, output: 1 }],
    tests: [
      { name: "rotated", input: { nums: [3, 4, 5, 1, 2] }, expected: 1 },
      { name: "not rotated", input: { nums: [1, 2, 3, 4] }, expected: 1 },
      { name: "two items", input: { nums: [2, 1] }, expected: 1 },
      { name: "late pivot", input: { nums: [5, 6, 7, 8, 1, 2] }, expected: 1 }
    ]
  },
  {
    id: "search-in-rotated-sorted-array",
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    source: "included",
    statementMarkdown:
      "A strictly increasing array was rotated some number of times. Return the index of `target`, or `-1` if it is missing.",
    signature: {
      functionName: "search",
      params: [
        { name: "nums", type: "vector<int>" },
        { name: "target", type: "int" }
      ],
      returnType: "int"
    },
    examples: [{ input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, output: 4 }],
    tests: [
      { name: "found", input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, expected: 4 },
      { name: "missing", input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }, expected: -1 },
      { name: "single found", input: { nums: [1], target: 1 }, expected: 0 },
      { name: "left side", input: { nums: [6, 7, 8, 1, 2, 3, 4], target: 7 }, expected: 1 }
    ]
  },
  {
    id: "container-with-most-water",
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers"],
    source: "included",
    statementMarkdown:
      "Each value in `height` is a vertical line height. Pick two lines and the x-axis to hold as much water as possible. Return that maximum area.",
    signature: {
      functionName: "maxArea",
      params: [{ name: "height", type: "vector<int>" }],
      returnType: "int"
    },
    examples: [{ input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, output: 49 }],
    tests: [
      { name: "classic", input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: 49 },
      { name: "two lines", input: { height: [1, 1] }, expected: 1 },
      { name: "increasing", input: { height: [1, 2, 3, 4, 5] }, expected: 6 },
      { name: "wide short", input: { height: [4, 3, 2, 1, 4] }, expected: 16 }
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
