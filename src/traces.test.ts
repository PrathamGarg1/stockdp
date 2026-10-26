import { expect, test } from "vitest"
import problems from "./problems.json"
import type { Trace } from "./trace"

// Every trace was produced by running your untouched C++. Its answer must match the expected one.
const traces = import.meta.glob<Trace>("./traces/*.json", { eager: true, import: "default" })

test.each(problems.map((p) => [p.id, p.expect]))("%s returns %s", (id, expected) => {
  const t = traces[`./traces/${id}.json`]
  expect(t.result).toBe(expected)
  expect(t.frames.length).toBeGreaterThan(0)
})
