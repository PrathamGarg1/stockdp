import { expect, test } from "vitest"
import problems from "../src/problems.json"
import { runTrace } from "../src/trace"

// Each src/solutions/<id>.js is a port of the C++ in mysolutions/. On the default example it must
// return the answer the real C++ gave (`expect` in problems.json).
const sources = import.meta.glob("../src/solutions/*.js", { query: "?raw", import: "default", eager: true })

test.each(problems.map((p) => [p.id, p.expect, p.example]))("%s returns %s", (id, expected, example) => {
  const out = runTrace(sources[`../src/solutions/${id}.js`], example)
  expect(out.error).toBeUndefined()
  expect(out.truncated).toBeUndefined()
  expect(out.result).toBe(expected)
  expect(out.frames.length).toBeGreaterThan(0)
})
