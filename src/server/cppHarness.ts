import type { Problem, ProblemTestCase, SupportedType } from "../shared/types";

function cppString(value: string): string {
  return JSON.stringify(value);
}

function cppLiteral(type: SupportedType, value: unknown): string {
  if (type === "string") return `string(${cppString(String(value))})`;
  if (type === "bool") return value ? "true" : "false";
  if (type === "double") return String(Number(value));
  if (type === "int" || type === "long long") return String(Number(value));

  if (!Array.isArray(value)) {
    throw new Error(`Expected array literal for ${type}`);
  }

  const inner = type.slice("vector<".length, -1) as SupportedType;
  return `{${value.map((item) => cppLiteral(inner, item)).join(", ")}}`;
}

function stringifyForCpp(value: unknown): string {
  return JSON.stringify(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function cppJsonStringContent(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function testBlock(problem: Problem, test: ProblemTestCase, index: number): string {
  const args = problem.signature.params.map((param, paramIndex) => {
    const value = test.input[param.name];
    return `${param.type} arg${index}_${paramIndex} = ${cppLiteral(param.type, value)};`;
  });
  const callArgs = problem.signature.params.map((_, paramIndex) => `arg${index}_${paramIndex}`).join(", ");
  const expected = cppLiteral(problem.signature.returnType, test.expected);

  return `
    {
        auto started = chrono::steady_clock::now();
        ${args.join("\n        ")}
        ${problem.signature.returnType} expected = ${expected};
        try {
            auto actual = solution.${problem.signature.functionName}(${callArgs});
            auto ended = chrono::steady_clock::now();
            double duration = chrono::duration<double, milli>(ended - started).count();
            bool passed = actual == expected;
            cout << "{\\"name\\":\\"${cppJsonStringContent(test.name)}\\",\\"passed\\":" << (passed ? "true" : "false")
                 << ",\\"input\\":${stringifyForCpp(test.input)}"
                 << ",\\"expected\\":" << toJson(expected)
                 << ",\\"actual\\":" << toJson(actual)
                 << ",\\"durationMs\\":" << fixed << setprecision(3) << duration << "}" << endl;
        } catch (const exception& error) {
            auto ended = chrono::steady_clock::now();
            double duration = chrono::duration<double, milli>(ended - started).count();
            cout << "{\\"name\\":\\"${cppJsonStringContent(test.name)}\\",\\"passed\\":false"
                 << ",\\"input\\":${stringifyForCpp(test.input)}"
                 << ",\\"expected\\":" << toJson(expected)
                 << ",\\"error\\":\\"" << escapeJson(error.what()) << "\\""
                 << ",\\"durationMs\\":" << fixed << setprecision(3) << duration << "}" << endl;
        }
    }`;
}

export function buildCppHarness(problem: Problem, code: string): string {
  const blocks = problem.tests.map((test, index) => testBlock(problem, test, index)).join("\n");

  return `#include <algorithm>
#include <chrono>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <map>
#include <numeric>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>
using namespace std;

string escapeJson(const string& input) {
    string output;
    for (char ch : input) {
        switch (ch) {
            case '\\\\': output += "\\\\\\\\"; break;
            case '"': output += "\\\\\\""; break;
            case '\\n': output += "\\\\n"; break;
            case '\\r': output += "\\\\r"; break;
            case '\\t': output += "\\\\t"; break;
            default: output += ch;
        }
    }
    return output;
}

string toJson(const string& value) {
    return string("\\"") + escapeJson(value) + "\\"";
}

string toJson(const char* value) {
    return toJson(string(value));
}

string toJson(bool value) {
    return value ? "true" : "false";
}

template <typename T>
typename enable_if<is_arithmetic<T>::value && !is_same<T, bool>::value, string>::type toJson(T value) {
    ostringstream out;
    out << value;
    return out.str();
}

template <typename T>
string toJson(const vector<T>& values) {
    string output = "[";
    for (size_t index = 0; index < values.size(); index++) {
        if (index > 0) output += ",";
        output += toJson(values[index]);
    }
    output += "]";
    return output;
}

${code}

int main() {
    Solution solution;
${blocks}
    return 0;
}
`;
}
