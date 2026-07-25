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
  },
  {
    id: "longest-substring-without-repeating-characters",
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    source: "included",
    statementMarkdown:
      "Return the length of the longest contiguous substring of `s` that contains no repeated characters.",
    signature: {
      functionName: "lengthOfLongestSubstring",
      params: [{ name: "s", type: "string" }],
      returnType: "int"
    },
    examples: [{ input: { s: "abcabcbb" }, output: 3 }],
    tests: [
      { name: "classic", input: { s: "abcabcbb" }, expected: 3 },
      { name: "all same", input: { s: "bbbbb" }, expected: 1 },
      { name: "overlap", input: { s: "pwwkew" }, expected: 3 },
      { name: "empty", input: { s: "" }, expected: 0 }
    ]
  },
  {
    id: "number-of-islands",
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    tags: ["Matrix", "DFS", "BFS"],
    source: "included",
    statementMarkdown:
      "Given a grid of `0`s and `1`s, count connected groups of `1`s. Connections are horizontal or vertical only.",
    signature: {
      functionName: "numIslands",
      params: [{ name: "grid", type: "vector<vector<int>>" }],
      returnType: "int"
    },
    examples: [{ input: { grid: [[1, 1, 0], [0, 1, 0], [1, 0, 1]] }, output: 3 }],
    tests: [
      { name: "three islands", input: { grid: [[1, 1, 0], [0, 1, 0], [1, 0, 1]] }, expected: 3 },
      { name: "one island", input: { grid: [[1, 1, 1], [0, 1, 0], [1, 1, 1]] }, expected: 1 },
      { name: "water", input: { grid: [[0, 0], [0, 0]] }, expected: 0 },
      { name: "diagonal separate", input: { grid: [[1, 0], [0, 1]] }, expected: 2 }
    ]
  },
  {
    id: "house-robber",
    slug: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Array"],
    source: "included",
    statementMarkdown:
      "Each value in `nums` is money in a house. Adjacent houses cannot both be taken. Return the most money possible.",
    signature: {
      functionName: "rob",
      params: [{ name: "nums", type: "vector<int>" }],
      returnType: "int"
    },
    examples: [{ input: { nums: [1, 2, 3, 1] }, output: 4 }],
    tests: [
      { name: "small", input: { nums: [1, 2, 3, 1] }, expected: 4 },
      { name: "choose ends", input: { nums: [2, 7, 9, 3, 1] }, expected: 12 },
      { name: "single", input: { nums: [5] }, expected: 5 },
      { name: "empty", input: { nums: [] }, expected: 0 }
    ]
  },
  {
    id: "decode-ways",
    slug: "decode-ways",
    title: "Decode Ways",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "String"],
    source: "included",
    statementMarkdown:
      "Digits map to letters with `1 -> A` through `26 -> Z`. Return how many valid decodings string `s` has.",
    signature: {
      functionName: "numDecodings",
      params: [{ name: "s", type: "string" }],
      returnType: "int"
    },
    examples: [{ input: { s: "226" }, output: 3 }],
    tests: [
      { name: "two paths", input: { s: "12" }, expected: 2 },
      { name: "three paths", input: { s: "226" }, expected: 3 },
      { name: "leading zero", input: { s: "06" }, expected: 0 },
      { name: "valid zero", input: { s: "2101" }, expected: 1 }
    ]
  },
  {
    id: "palindrome-partitioning",
    slug: "palindrome-partitioning",
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    tags: ["Backtracking", "String"],
    source: "included",
    statementMarkdown:
      "Split `s` into substrings so every substring is a palindrome.\n\nReturn partitions in depth-first order, trying shorter prefixes before longer prefixes.",
    signature: {
      functionName: "partition",
      params: [{ name: "s", type: "string" }],
      returnType: "vector<vector<string>>"
    },
    examples: [{ input: { s: "aab" }, output: [["a", "a", "b"], ["aa", "b"]] }],
    tests: [
      { name: "classic", input: { s: "aab" }, expected: [["a", "a", "b"], ["aa", "b"]] },
      { name: "single", input: { s: "a" }, expected: [["a"]] },
      { name: "all same", input: { s: "aaa" }, expected: [["a", "a", "a"], ["a", "aa"], ["aa", "a"], ["aaa"]] },
      { name: "none longer", input: { s: "ab" }, expected: [["a", "b"]] }
    ]
  },
  {
    id: "kth-largest-element-in-array",
    slug: "kth-largest-element-in-array",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    tags: ["Heap", "Quickselect", "Sorting"],
    source: "included",
    statementMarkdown:
      "Return the value that would be at position `k` if `nums` were sorted from largest to smallest. Duplicate values count as separate positions.",
    signature: {
      functionName: "findKthLargest",
      params: [
        { name: "nums", type: "vector<int>" },
        { name: "k", type: "int" }
      ],
      returnType: "int"
    },
    examples: [{ input: { nums: [3, 2, 1, 5, 6, 4], k: 2 }, output: 5 }],
    tests: [
      { name: "simple", input: { nums: [3, 2, 1, 5, 6, 4], k: 2 }, expected: 5 },
      { name: "duplicates", input: { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4 }, expected: 4 },
      { name: "first", input: { nums: [7, 6, 5], k: 1 }, expected: 7 },
      { name: "last", input: { nums: [7, 6, 5], k: 3 }, expected: 5 }
    ]
  },
  {
    id: "set-matrix-zeroes",
    slug: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    tags: ["Matrix", "Array"],
    source: "included",
    statementMarkdown:
      "If a cell in `matrix` is `0`, set its entire row and column to `0`. Return the modified matrix.",
    signature: {
      functionName: "setZeroes",
      params: [{ name: "matrix", type: "vector<vector<int>>" }],
      returnType: "vector<vector<int>>"
    },
    examples: [{ input: { matrix: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] }, output: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] }],
    tests: [
      { name: "center", input: { matrix: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] }, expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
      { name: "corner", input: { matrix: [[0, 1], [1, 1]] }, expected: [[0, 0], [0, 1]] },
      { name: "multiple", input: { matrix: [[1, 2, 3], [4, 0, 6], [7, 8, 0]] }, expected: [[1, 0, 0], [0, 0, 0], [0, 0, 0]] },
      { name: "no zero", input: { matrix: [[1, 2], [3, 4]] }, expected: [[1, 2], [3, 4]] }
    ]
  },
  {
    id: "spiral-matrix",
    slug: "spiral-matrix",
    title: "Spiral Matrix",
    difficulty: "Medium",
    tags: ["Matrix", "Simulation"],
    source: "included",
    statementMarkdown:
      "Return all values of `matrix` in clockwise spiral order, starting from the top-left cell.",
    signature: {
      functionName: "spiralOrder",
      params: [{ name: "matrix", type: "vector<vector<int>>" }],
      returnType: "vector<int>"
    },
    examples: [{ input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, output: [1, 2, 3, 6, 9, 8, 7, 4, 5] }],
    tests: [
      { name: "square", input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { name: "wide", input: { matrix: [[1, 2, 3, 4], [5, 6, 7, 8]] }, expected: [1, 2, 3, 4, 8, 7, 6, 5] },
      { name: "tall", input: { matrix: [[1], [2], [3]] }, expected: [1, 2, 3] },
      { name: "single row", input: { matrix: [[1, 2, 3]] }, expected: [1, 2, 3] }
    ]
  },
  {
    id: "minimum-window-substring",
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    tags: ["String", "Sliding Window"],
    source: "included",
    statementMarkdown:
      "Return the shortest substring of `s` that contains every character of `t`, including duplicate character counts. Return an empty string if no such window exists.",
    signature: {
      functionName: "minWindow",
      params: [
        { name: "s", type: "string" },
        { name: "t", type: "string" }
      ],
      returnType: "string"
    },
    examples: [{ input: { s: "ADOBECODEBANC", t: "ABC" }, output: "BANC" }],
    tests: [
      { name: "classic", input: { s: "ADOBECODEBANC", t: "ABC" }, expected: "BANC" },
      { name: "single", input: { s: "a", t: "a" }, expected: "a" },
      { name: "missing", input: { s: "a", t: "aa" }, expected: "" },
      { name: "duplicates", input: { s: "aaabdabcefaecbef", t: "abc" }, expected: "abc" }
    ]
  },
  {
    id: "word-search",
    slug: "word-search",
    title: "Word Search",
    difficulty: "Medium",
    tags: ["Matrix", "Backtracking"],
    source: "included",
    statementMarkdown:
      "Return whether `word` can be formed by walking horizontally or vertically through adjacent cells. A cell may be used at most once in the same path.",
    signature: {
      functionName: "exist",
      params: [
        { name: "board", type: "vector<vector<string>>" },
        { name: "word", type: "string" }
      ],
      returnType: "bool"
    },
    examples: [{ input: { board: [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], word: "ABCCED" }, output: true }],
    tests: [
      { name: "path exists", input: { board: [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], word: "ABCCED" }, expected: true },
      { name: "short path", input: { board: [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], word: "SEE" }, expected: true },
      { name: "reuse blocked", input: { board: [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], word: "ABCB" }, expected: false },
      { name: "single", input: { board: [["A"]], word: "A" }, expected: true }
    ]
  },
  {
    id: "unique-paths",
    slug: "unique-paths",
    title: "Unique Paths",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Math"],
    source: "included",
    statementMarkdown:
      "A robot starts in the top-left of an `m` by `n` grid and can only move right or down. Return how many different paths reach the bottom-right cell.",
    signature: {
      functionName: "uniquePaths",
      params: [
        { name: "m", type: "int" },
        { name: "n", type: "int" }
      ],
      returnType: "int"
    },
    examples: [{ input: { m: 3, n: 7 }, output: 28 }],
    tests: [
      { name: "wide", input: { m: 3, n: 7 }, expected: 28 },
      { name: "small", input: { m: 3, n: 2 }, expected: 3 },
      { name: "single row", input: { m: 1, n: 10 }, expected: 1 },
      { name: "square", input: { m: 4, n: 4 }, expected: 20 }
    ]
  },
  {
    id: "jump-game",
    slug: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    tags: ["Array", "Greedy"],
    source: "included",
    statementMarkdown:
      "Each value in `nums` is the farthest jump length from that position. Return whether index `0` can reach the last index.",
    signature: {
      functionName: "canJump",
      params: [{ name: "nums", type: "vector<int>" }],
      returnType: "bool"
    },
    examples: [{ input: { nums: [2, 3, 1, 1, 4] }, output: true }],
    tests: [
      { name: "reachable", input: { nums: [2, 3, 1, 1, 4] }, expected: true },
      { name: "stuck", input: { nums: [3, 2, 1, 0, 4] }, expected: false },
      { name: "single", input: { nums: [0] }, expected: true },
      { name: "zero after start", input: { nums: [2, 0, 0] }, expected: true }
    ]
  },
  {
    id: "gas-station",
    slug: "gas-station",
    title: "Gas Station",
    difficulty: "Medium",
    tags: ["Array", "Greedy"],
    source: "included",
    statementMarkdown:
      "At station `i`, you gain `gas[i]` fuel and spend `cost[i]` fuel to drive to the next station. Return the start index that completes the circuit, or `-1` if none exists.",
    signature: {
      functionName: "canCompleteCircuit",
      params: [
        { name: "gas", type: "vector<int>" },
        { name: "cost", type: "vector<int>" }
      ],
      returnType: "int"
    },
    examples: [{ input: { gas: [1, 2, 3, 4, 5], cost: [3, 4, 5, 1, 2] }, output: 3 }],
    tests: [
      { name: "classic", input: { gas: [1, 2, 3, 4, 5], cost: [3, 4, 5, 1, 2] }, expected: 3 },
      { name: "impossible", input: { gas: [2, 3, 4], cost: [3, 4, 3] }, expected: -1 },
      { name: "start zero", input: { gas: [5, 1, 2, 3, 4], cost: [4, 4, 1, 5, 1] }, expected: 4 },
      { name: "single", input: { gas: [2], cost: [2] }, expected: 0 }
    ]
  },
  {
    id: "insert-interval",
    slug: "insert-interval",
    title: "Insert Interval",
    difficulty: "Medium",
    tags: ["Array", "Intervals"],
    source: "included",
    statementMarkdown:
      "`intervals` is sorted by start and contains non-overlapping closed intervals. Insert `newInterval`, merge overlaps, and return the sorted result.",
    signature: {
      functionName: "insert",
      params: [
        { name: "intervals", type: "vector<vector<int>>" },
        { name: "newInterval", type: "vector<int>" }
      ],
      returnType: "vector<vector<int>>"
    },
    examples: [{ input: { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] }, output: [[1, 5], [6, 9]] }],
    tests: [
      { name: "middle merge", input: { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] }, expected: [[1, 5], [6, 9]] },
      { name: "multi merge", input: { intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval: [4, 8] }, expected: [[1, 2], [3, 10], [12, 16]] },
      { name: "empty", input: { intervals: [], newInterval: [5, 7] }, expected: [[5, 7]] },
      { name: "before all", input: { intervals: [[3, 5], [7, 9]], newInterval: [1, 2] }, expected: [[1, 2], [3, 5], [7, 9]] }
    ]
  },
  {
    id: "non-overlapping-intervals",
    slug: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    tags: ["Greedy", "Intervals"],
    source: "included",
    statementMarkdown:
      "Return the fewest intervals to remove so the remaining intervals do not overlap. Intervals that only touch at an endpoint do not overlap.",
    signature: {
      functionName: "eraseOverlapIntervals",
      params: [{ name: "intervals", type: "vector<vector<int>>" }],
      returnType: "int"
    },
    examples: [{ input: { intervals: [[1, 2], [2, 3], [3, 4], [1, 3]] }, output: 1 }],
    tests: [
      { name: "one removal", input: { intervals: [[1, 2], [2, 3], [3, 4], [1, 3]] }, expected: 1 },
      { name: "many same", input: { intervals: [[1, 2], [1, 2], [1, 2]] }, expected: 2 },
      { name: "none", input: { intervals: [[1, 2], [2, 3]] }, expected: 0 },
      { name: "nested", input: { intervals: [[1, 100], [11, 22], [1, 11], [2, 12]] }, expected: 2 }
    ]
  },
  {
    id: "rotting-oranges",
    slug: "rotting-oranges",
    title: "Rotting Oranges",
    difficulty: "Medium",
    tags: ["Matrix", "BFS"],
    source: "included",
    statementMarkdown:
      "`0` is empty, `1` is fresh fruit, and `2` is rotten fruit. Each minute, rotten fruit rots adjacent fresh fruit. Return minutes until no fresh fruit remains, or `-1` if impossible.",
    signature: {
      functionName: "orangesRotting",
      params: [{ name: "grid", type: "vector<vector<int>>" }],
      returnType: "int"
    },
    examples: [{ input: { grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]] }, output: 4 }],
    tests: [
      { name: "classic", input: { grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]] }, expected: 4 },
      { name: "blocked", input: { grid: [[2, 1, 1], [0, 1, 1], [1, 0, 1]] }, expected: -1 },
      { name: "already done", input: { grid: [[0, 2]] }, expected: 0 },
      { name: "one fresh no rot", input: { grid: [[1]] }, expected: -1 }
    ]
  },
  {
    id: "pacific-atlantic-water-flow",
    slug: "pacific-atlantic-water-flow",
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    tags: ["Matrix", "DFS", "BFS"],
    source: "included",
    statementMarkdown:
      "Water can flow from a cell to adjacent cells with height less than or equal to the current height. Return all coordinates that can flow to both the top/left edges and the bottom/right edges.\n\nReturn coordinates sorted by row, then column.",
    signature: {
      functionName: "pacificAtlantic",
      params: [{ name: "heights", type: "vector<vector<int>>" }],
      returnType: "vector<vector<int>>"
    },
    examples: [{ input: { heights: [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]] }, output: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] }],
    tests: [
      { name: "classic", input: { heights: [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]] }, expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] },
      { name: "single", input: { heights: [[1]] }, expected: [[0, 0]] },
      { name: "flat", input: { heights: [[1, 1], [1, 1]] }, expected: [[0, 0], [0, 1], [1, 0], [1, 1]] },
      { name: "slope", input: { heights: [[3, 2], [2, 1]] }, expected: [[0, 0], [0, 1], [1, 0]] }
    ]
  },
  {
    id: "longest-repeating-character-replacement",
    slug: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    source: "included",
    statementMarkdown:
      "You may replace at most `k` characters in `s`. Return the length of the longest substring that can be made of one repeated character.",
    signature: {
      functionName: "characterReplacement",
      params: [
        { name: "s", type: "string" },
        { name: "k", type: "int" }
      ],
      returnType: "int"
    },
    examples: [{ input: { s: "AABABBA", k: 1 }, output: 4 }],
    tests: [
      { name: "classic", input: { s: "AABABBA", k: 1 }, expected: 4 },
      { name: "all fit", input: { s: "ABAB", k: 2 }, expected: 4 },
      { name: "none", input: { s: "AAAA", k: 0 }, expected: 4 },
      { name: "small", input: { s: "ABCDE", k: 1 }, expected: 2 }
    ]
  },
  {
    id: "word-ladder",
    slug: "word-ladder",
    title: "Word Ladder",
    difficulty: "Hard",
    tags: ["Graph", "BFS", "String"],
    source: "included",
    statementMarkdown:
      "Change one character at a time to transform `beginWord` into `endWord`. Every intermediate word must be in `wordList`. Return the number of words in the shortest transformation sequence, or `0` if none exists.",
    signature: {
      functionName: "ladderLength",
      params: [
        { name: "beginWord", type: "string" },
        { name: "endWord", type: "string" },
        { name: "wordList", type: "vector<string>" }
      ],
      returnType: "int"
    },
    examples: [{ input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log", "cog"] }, output: 5 }],
    tests: [
      { name: "classic", input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log", "cog"] }, expected: 5 },
      { name: "missing end", input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log"] }, expected: 0 },
      { name: "one step", input: { beginWord: "a", endWord: "c", wordList: ["a", "b", "c"] }, expected: 2 },
      { name: "detour", input: { beginWord: "red", endWord: "tax", wordList: ["ted", "tex", "red", "tax", "tad", "den", "rex", "pee"] }, expected: 4 }
    ]
  },
  {
    id: "burst-balloons",
    slug: "burst-balloons",
    title: "Burst Balloons",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Intervals"],
    source: "included",
    statementMarkdown:
      "When you burst balloon `i`, you gain `left * nums[i] * right`, where `left` and `right` are the nearest remaining balloon values beside it. Missing outside neighbors count as `1`. Return the maximum coins possible.",
    signature: {
      functionName: "maxCoins",
      params: [{ name: "nums", type: "vector<int>" }],
      returnType: "int"
    },
    examples: [{ input: { nums: [3, 1, 5, 8] }, output: 167 }],
    tests: [
      { name: "classic", input: { nums: [3, 1, 5, 8] }, expected: 167 },
      { name: "two", input: { nums: [1, 5] }, expected: 10 },
      { name: "single", input: { nums: [7] }, expected: 7 },
      { name: "with one", input: { nums: [1, 2, 3] }, expected: 12 }
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
