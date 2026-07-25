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
  },
  {
    id: "three-sum",
    slug: "three-sum",
    title: "3Sum",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers"],
    source: "included",
    statementMarkdown:
      "Return every unique triplet of values that sums to `0`.\n\nEach triplet must be sorted ascending, and the list of triplets must be sorted lexicographically.",
    signature: {
      functionName: "threeSum",
      params: [{ name: "nums", type: "vector<int>" }],
      returnType: "vector<vector<int>>"
    },
    examples: [{ input: { nums: [-1, 0, 1, 2, -1, -4] }, output: [[-1, -1, 2], [-1, 0, 1]] }],
    tests: [
      { name: "two answers", input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: [[-1, -1, 2], [-1, 0, 1]] },
      { name: "none", input: { nums: [1, 2, -2, -1] }, expected: [] },
      { name: "all zero", input: { nums: [0, 0, 0, 0] }, expected: [[0, 0, 0]] },
      { name: "multiple", input: { nums: [-2, 0, 1, 1, 2] }, expected: [[-2, 0, 2], [-2, 1, 1]] }
    ]
  },
  {
    id: "merge-intervals",
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting", "Intervals"],
    source: "included",
    statementMarkdown:
      "Given closed intervals `[start, end]`, merge all overlapping intervals and return the merged list sorted by start.",
    signature: {
      functionName: "merge",
      params: [{ name: "intervals", type: "vector<vector<int>>" }],
      returnType: "vector<vector<int>>"
    },
    examples: [{ input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, output: [[1, 6], [8, 10], [15, 18]] }],
    tests: [
      { name: "classic", input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, expected: [[1, 6], [8, 10], [15, 18]] },
      { name: "touching", input: { intervals: [[1, 4], [4, 5]] }, expected: [[1, 5]] },
      { name: "unsorted", input: { intervals: [[5, 7], [1, 3], [2, 4]] }, expected: [[1, 4], [5, 7]] },
      { name: "contained", input: { intervals: [[1, 10], [2, 3], [4, 8]] }, expected: [[1, 10]] }
    ]
  },
  {
    id: "top-k-frequent-elements",
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    tags: ["Hash Table", "Heap", "Bucket Sort"],
    source: "included",
    statementMarkdown:
      "Return the `k` values that appear most often in `nums`.\n\nOutput must be sorted by frequency descending. Break ties by smaller value first.",
    signature: {
      functionName: "topKFrequent",
      params: [
        { name: "nums", type: "vector<int>" },
        { name: "k", type: "int" }
      ],
      returnType: "vector<int>"
    },
    examples: [{ input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, output: [1, 2] }],
    tests: [
      { name: "classic", input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, expected: [1, 2] },
      { name: "one value", input: { nums: [5], k: 1 }, expected: [5] },
      { name: "tie", input: { nums: [4, 4, 2, 2, 1], k: 2 }, expected: [2, 4] },
      { name: "negative", input: { nums: [-1, -1, 2, 3, 3, 3], k: 2 }, expected: [3, -1] }
    ]
  },
  {
    id: "course-schedule",
    slug: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    tags: ["Graph", "Topological Sort"],
    source: "included",
    statementMarkdown:
      "There are `numCourses` courses labeled `0` through `numCourses - 1`. Each pair `[course, prereq]` means `prereq` must be completed before `course`.\n\nReturn whether all courses can be completed.",
    signature: {
      functionName: "canFinish",
      params: [
        { name: "numCourses", type: "int" },
        { name: "prerequisites", type: "vector<vector<int>>" }
      ],
      returnType: "bool"
    },
    examples: [{ input: { numCourses: 2, prerequisites: [[1, 0]] }, output: true }],
    tests: [
      { name: "simple possible", input: { numCourses: 2, prerequisites: [[1, 0]] }, expected: true },
      { name: "cycle", input: { numCourses: 2, prerequisites: [[1, 0], [0, 1]] }, expected: false },
      { name: "chain", input: { numCourses: 4, prerequisites: [[1, 0], [2, 1], [3, 2]] }, expected: true },
      { name: "hidden cycle", input: { numCourses: 5, prerequisites: [[1, 0], [2, 1], [3, 2], [1, 3]] }, expected: false }
    ]
  },
  {
    id: "coin-change",
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "BFS"],
    source: "included",
    statementMarkdown:
      "Given coin denominations and a target `amount`, return the fewest coins needed to make exactly that amount. Return `-1` if it cannot be made.",
    signature: {
      functionName: "coinChange",
      params: [
        { name: "coins", type: "vector<int>" },
        { name: "amount", type: "int" }
      ],
      returnType: "int"
    },
    examples: [{ input: { coins: [1, 2, 5], amount: 11 }, output: 3 }],
    tests: [
      { name: "classic", input: { coins: [1, 2, 5], amount: 11 }, expected: 3 },
      { name: "impossible", input: { coins: [2], amount: 3 }, expected: -1 },
      { name: "zero amount", input: { coins: [1], amount: 0 }, expected: 0 },
      { name: "greedy trap", input: { coins: [1, 3, 4], amount: 6 }, expected: 2 }
    ]
  },
  {
    id: "longest-increasing-subsequence",
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Binary Search"],
    source: "included",
    statementMarkdown:
      "Return the length of the longest subsequence whose values are strictly increasing. The subsequence does not need to be contiguous.",
    signature: {
      functionName: "lengthOfLIS",
      params: [{ name: "nums", type: "vector<int>" }],
      returnType: "int"
    },
    examples: [{ input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, output: 4 }],
    tests: [
      { name: "classic", input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, expected: 4 },
      { name: "many equal", input: { nums: [7, 7, 7, 7] }, expected: 1 },
      { name: "already increasing", input: { nums: [1, 2, 3, 4] }, expected: 4 },
      { name: "zigzag", input: { nums: [0, 1, 0, 3, 2, 3] }, expected: 4 }
    ]
  },
  {
    id: "word-break",
    slug: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Trie", "String"],
    source: "included",
    statementMarkdown:
      "Return whether `s` can be split into one or more words from `wordDict`. Words may be reused.",
    signature: {
      functionName: "wordBreak",
      params: [
        { name: "s", type: "string" },
        { name: "wordDict", type: "vector<string>" }
      ],
      returnType: "bool"
    },
    examples: [{ input: { s: "leetcode", wordDict: ["leet", "code"] }, output: true }],
    tests: [
      { name: "two words", input: { s: "leetcode", wordDict: ["leet", "code"] }, expected: true },
      { name: "reuse word", input: { s: "applepenapple", wordDict: ["apple", "pen"] }, expected: true },
      { name: "cannot split", input: { s: "catsandog", wordDict: ["cats", "dog", "sand", "and", "cat"] }, expected: false },
      { name: "single exact", input: { s: "aaaa", wordDict: ["aaaa"] }, expected: true }
    ]
  },
  {
    id: "longest-common-subsequence",
    slug: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "String"],
    source: "included",
    statementMarkdown:
      "Return the length of the longest sequence that appears in both strings in the same relative order.",
    signature: {
      functionName: "longestCommonSubsequence",
      params: [
        { name: "text1", type: "string" },
        { name: "text2", type: "string" }
      ],
      returnType: "int"
    },
    examples: [{ input: { text1: "abcde", text2: "ace" }, output: 3 }],
    tests: [
      { name: "classic", input: { text1: "abcde", text2: "ace" }, expected: 3 },
      { name: "same", input: { text1: "abc", text2: "abc" }, expected: 3 },
      { name: "none", input: { text1: "abc", text2: "def" }, expected: 0 },
      { name: "interleaved", input: { text1: "bsbininm", text2: "jmjkbkjkv" }, expected: 1 }
    ]
  },
  {
    id: "trapping-rain-water",
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Stack"],
    source: "included",
    statementMarkdown:
      "Each value in `height` is an elevation bar. After raining, water can sit between taller bars. Return the total trapped water.",
    signature: {
      functionName: "trap",
      params: [{ name: "height", type: "vector<int>" }],
      returnType: "int"
    },
    examples: [{ input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, output: 6 }],
    tests: [
      { name: "classic", input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expected: 6 },
      { name: "valley", input: { height: [4, 2, 0, 3, 2, 5] }, expected: 9 },
      { name: "flat", input: { height: [2, 2, 2] }, expected: 0 },
      { name: "empty", input: { height: [] }, expected: 0 }
    ]
  },
  {
    id: "edit-distance",
    slug: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "String"],
    source: "included",
    statementMarkdown:
      "Return the fewest single-character inserts, deletes, or replacements needed to transform `word1` into `word2`.",
    signature: {
      functionName: "minDistance",
      params: [
        { name: "word1", type: "string" },
        { name: "word2", type: "string" }
      ],
      returnType: "int"
    },
    examples: [{ input: { word1: "horse", word2: "ros" }, output: 3 }],
    tests: [
      { name: "classic", input: { word1: "horse", word2: "ros" }, expected: 3 },
      { name: "longer", input: { word1: "intention", word2: "execution" }, expected: 5 },
      { name: "empty source", input: { word1: "", word2: "abc" }, expected: 3 },
      { name: "same", input: { word1: "plane", word2: "plane" }, expected: 0 }
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
