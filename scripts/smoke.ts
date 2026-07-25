import { includedProblems } from "../src/shared/problems";
import { runSubmission } from "../src/server/runner";

const pairSum = includedProblems[0];

const pythonCode = `class Solution:
    def pairSum(self, nums, target):
        seen = {}
        for index, value in enumerate(nums):
            need = target - value
            if need in seen:
                return [seen[need], index]
            seen[value] = index
`;

const cppCode = `class Solution {
public:
    vector<int> pairSum(vector<int> nums, int target) {
        unordered_map<int, int> seen;
        for (int index = 0; index < static_cast<int>(nums.size()); index++) {
            int need = target - nums[index];
            if (seen.count(need)) return {seen[need], index};
            seen[nums[index]] = index;
        }
        return {};
    }
};
`;

async function main(): Promise<void> {
  const python = await runSubmission({ language: "python", code: pythonCode, problem: pairSum });
  const cpp = await runSubmission({ language: "cpp", code: cppCode, problem: pairSum });

  const pythonOk = python.ok && python.results.every((result) => result.passed);
  const cppOk = cpp.ok && cpp.results.every((result) => result.passed);

  console.log(`Python runner: ${pythonOk ? "pass" : "fail"}`);
  console.log(`C++ runner: ${cppOk ? "pass" : "fail"}`);

  if (!pythonOk) console.log(JSON.stringify(python, null, 2));
  if (!cppOk) console.log(JSON.stringify(cpp, null, 2));
  if (!pythonOk || !cppOk) process.exit(1);
}

main();
