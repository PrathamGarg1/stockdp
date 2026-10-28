import { expect, test } from "vitest"
import problems from "../src/problems.json"
import { solutions } from "../src/solutions"
import { runTrace } from "../src/trace"

// Har solution apne default example par wahi answer de jo mere C++ ne diya (`expect` in problems.json).
test.each(problems.map((p) => [p.id, p.expect, p.example]))("%s returns %s", (id, expected, example) => {
  const out = runTrace(solutions[id].js, example)
  expect(out.error).toBeUndefined()
  expect(out.truncated).toBeUndefined()
  expect(out.result).toBe(expected)
  expect(out.frames.length).toBeGreaterThan(0)
})
