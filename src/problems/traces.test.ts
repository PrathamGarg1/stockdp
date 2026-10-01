import { describe, expect, it } from "vitest"
import { problems } from "./registry"

describe("sequel traces", () => {
  it("covers 26 problems", () => {
    expect(problems).toHaveLength(26)
    expect(new Set(problems.map((problem) => problem.id)).size).toBe(26)
  })

  for (const problem of problems) {
    for (const preset of problem.presets) {
      it(`${problem.leetcode} ${preset.name} answers ${preset.answer}`, () => {
        const frames = problem.trace(problem.parse(preset.raw))
        expect(frames.length).toBeGreaterThan(0)
        expect(frames.every((frame) => frame.caption.length > 0 && frame.invariant.length > 0)).toBe(true)
        expect(frames[frames.length - 1]?.answer).toBe(preset.answer)
        expect(problem.ladder.some((stage) => stage.id === problem.runs)).toBe(true)
      })
    }
  }
})
