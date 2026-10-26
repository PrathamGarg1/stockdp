import type { PatternId } from "./patterns"

// What scripts/trace.py writes to src/traces/<id>.json: your C++ exactly as written,
// plus one Frame per line the debugger stopped on while running it.
export type V = number | boolean | string | V[] | { [k: string]: V }

export type Frame = {
  line: number // 1-based line of the C++ chunk
  depth: number // 0 = the entry method, 1 = a function it called, ...
  fn: string
  args: string[] // names of this function's arguments
  vars: Record<string, V> // arguments and locals that exist at this point
  mem: Record<string, V> // class members (dp, mp, ...)
  ret?: V // set on the stop right after a call returned
}

export type Trace = { cpp: string; result: string; frames: Frame[] }

export type Problem = {
  id: string
  title: string
  pattern: PatternId
  also?: PatternId
  example: V[]
  expect: string
  note: string
}

export const isScalar = (v: V | undefined): v is number | boolean | string => typeof v !== "object"

// ---- recursion tree: rebuilt from how `depth` moves between frames ----

export type Node = {
  id: number
  parent: number // -1 for a root
  label: string
  open: number // frame index where the call started
  close?: number // frame index where it returned
  ret?: V
}

export function buildTree(frames: Frame[]): Node[] {
  const nodes: Node[] = []
  const stack: number[] = []
  let prev = 0
  frames.forEach((f, k) => {
    if (f.depth > prev && f.depth >= 1) {
      const args = f.args.map((a) => f.vars[a]).filter(isScalar)
      nodes.push({ id: nodes.length, parent: stack.at(-1) ?? -1, label: `${f.fn}(${args.join(",")})`, open: k })
      stack.push(nodes.length - 1)
    }
    for (let d = prev; d > f.depth; d--) {
      const done = nodes[stack.pop()!]
      if (done) {
        done.close = k
        done.ret = f.ret
      }
    }
    prev = f.depth
  })
  return nodes
}

// the node being executed at frame k (or the one that just returned)
export function current(nodes: Node[], k: number): number {
  const justReturned = nodes.find((n) => n.close === k)
  if (justReturned) return justReturned.id
  return nodes.filter((n) => n.open <= k && (n.close ?? Infinity) > k).at(-1)?.id ?? -1
}

// ---- pointers: scalar variables named like indices become chips over the input bars ----

const POINTER = /^(i|j|k|l|r|st|ed|lo|hi|idx|start|end|mid|cur|pos)$/

export function pointers(f: Frame, n: number): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [name, v] of Object.entries(f.vars)) {
    if (typeof v === "number" && POINTER.test(name) && v >= 0 && v < n) out[name] = v
  }
  return out
}
