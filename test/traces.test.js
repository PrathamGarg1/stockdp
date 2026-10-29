import { expect, test } from "vitest"
import problems from "../src/problems.json"
import { solutions, show } from "../src/solutions"

// Har solution apne default example par wahi answer de jo mere C++ ne diya (`expect` in problems.json).
test.each(problems.map((p) => [p.id, p.expect, p.example]))("%s returns %s", (id, expected, example) => {
  const { answer, steps } = solutions[id].solve(...structuredClone(example))
  expect(show(answer)).toBe(expected)
  expect(steps.length).toBeGreaterThan(0)
})
