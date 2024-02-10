import { nthPrime } from "./submission.mjs";

function testNthPrime() {
  const testCases = [
    { input: 1, expected: 2 },
    { input: 2, expected: 3 },
    { input: 6, expected: 13 },
    { input: 10001, expected: 104743 }
  ];

  for (const testCase of testCases) {
    const result = nthPrime(testCase.input);
    if (result === testCase.expected) {
      console.log(`Test passed for input ${testCase.input}`);
    } else {
      console.log(`Test failed for input ${testCase.input}. Expected ${testCase.expected}, but got ${result}`);
    }
  }
}

testNthPrime();
