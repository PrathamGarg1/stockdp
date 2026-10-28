import { parse } from "acorn"

// THE CORE. runTrace(source, input) runs a solution from src/solutions/ and records what the program
// looked like at every statement. It returns frames, and the page just shows frames[step]:
//
//   { line, depth, fn, args, vars, mem, ret? }
//   line   the line about to run          depth  0 = the entry method, 1 = a call it made, ...
//   vars   arguments and locals so far    mem    class fields (this.dp, this.n, ...)
//   ret    what a call returned since the previous frame
//
// How: instrument() copies the code and puts a __s(line, ...) call in front of every statement
// (on the same line, so line numbers never move), then the copy is run for real.

const MAX_STEPS = 2000
const MAX_LEN = 15 // longest list / string the page accepts
const MAX_ABS = 1000 // biggest number the page accepts

// JS has no `int dp[A][B][C]`. grid([A, B, C], -1) is the same table: A x B x C nested arrays.
const grid = (dims, v = 0) => (dims.length === 1 ? Array(dims[0]).fill(v) : Array.from({ length: dims[0] }, () => grid(dims.slice(1), v)))

// ---------- reading the code ----------

const kids = (node) => Object.values(node).flatMap((x) => (Array.isArray(x) ? x : [x])).filter((x) => x && typeof x.type === "string")
const isFn = (node) => /Function/.test(node.type)
const isStmt = (node) => /(Statement|Declaration)$/.test(node.type) && !["BlockStatement", "EmptyStatement"].includes(node.type)

function names(pattern) {
  if (pattern.type === "Identifier") return [pattern.name]
  if (pattern.type === "ArrayPattern") return pattern.elements.filter(Boolean).flatMap(names)
  if (pattern.type === "AssignmentPattern") return names(pattern.left)
  return []
}

// every variable declared in this method (not inside nested functions)
const declared = (node) => (node.type === "VariableDeclarator" ? names(node.id) : []).concat(kids(node).filter((k) => !isFn(k)).flatMap(declared))

const classes = (ast) => ast.body.filter((n) => n.type === "ClassDeclaration")
const methods = (cls) => cls.body.body.filter((m) => m.type === "MethodDefinition" && m.kind === "method")

// the method the judge calls = the last method of class Solution
export function signature(source) {
  const solution = classes(parse(source, { ecmaVersion: 2022 })).find((c) => c.id.name === "Solution")
  const entry = methods(solution).at(-1)
  return { name: entry.key.name, params: entry.value.params.flatMap(names) }
}

// ---------- instrumenting ----------

export function instrument(source) {
  const ast = parse(source, { ecmaVersion: 2022, locations: true })
  const edits = [] // [position, text]
  const at = (pos, text) => edits.push([pos, text])

  for (const cls of classes(ast)) {
    for (const m of methods(cls)) {
      const fn = m.value
      const params = fn.params.flatMap(names)
      const vars = [...new Set([...params, ...declared(fn.body)])]
      // reading a `let` before its declaration throws, and the tracer skips it: that is "not declared yet"
      const stop = (node) => `__s(${node.loc.start.line},{${vars.map((v) => `${v}:()=>${v}`).join(",")}},this);`

      const visit = (node) => {
        for (const k of kids(node)) {
          if (isFn(k)) continue
          if (k.type === "ReturnStatement") {
            if (k.argument) (at(k.argument.start, `__r(${k.loc.start.line},`), at(k.argument.end, ")"))
            else at(k.start + 6, ` __r(${k.loc.start.line})`)
          }
          const listed = node.type === "BlockStatement" || node.type === "SwitchCase"
          if (isStmt(k) && !(k.type === "VariableDeclaration" && /^For/.test(node.type))) {
            if (listed) at(k.start, stop(k))
            else {
              // `if (x) stmt;` / `for (...) stmt;` / `else stmt;` need braces to hold the extra call
              at(k.start, `{${stop(k)}`)
              visit(k)
              at(k.end, "}")
              continue
            }
          }
          visit(k)
        }
      }
      visit(fn.body)
      at(fn.body.start + 1, `__in(${JSON.stringify(m.key.name)},${JSON.stringify(params)});try{`)
      at(fn.body.end - 1, "}finally{__out()}")
    }
  }

  edits.sort((a, b) => a[0] - b[0]) // stable: equal positions keep the order they were added in
  let out = ""
  let last = 0
  for (const [pos, text] of edits) (out += source.slice(last, pos) + text, (last = pos))
  return out + source.slice(last)
}

// ---------- running ----------

class TooLong extends Error {}

const copy = (v) => {
  if (Array.isArray(v)) return v.map(copy)
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copy(x)]))
  return v
}
const defined = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))

const show = (r) => (Array.isArray(r) ? `[${r.join(",")}]` : String(r))

export function runTrace(source, input) {
  const frames = []
  const calls = [] // one record per call still running: { fn, args, ret, line }
  let pending = [] // what finished calls returned since the last frame, innermost first
  let top // the latest frame of the entry method
  let result, error, truncated, exit

  const hooks = {
    __in: (fn, args) => calls.push({ fn, args }),
    __out: () => {
      exit = calls.pop()
      pending.push(exit.ret)
    },
    __r: (line, value) => ((calls.at(-1).line = line), (calls.at(-1).ret = value)),
    __s: (line, peek, self) => {
      if (frames.length >= MAX_STEPS) throw new TooLong()
      const vars = {}
      for (const name in peek) {
        try {
          vars[name] = copy(peek[name]())
        } catch {} // not declared yet
      }
      const call = calls.at(-1)
      const frame = { line, depth: calls.length - 1, fn: call.fn, args: call.args.filter((a) => a in vars), vars: defined(vars), mem: defined(copy({ ...self })) }
      if (pending.length) Object.assign(frame, { rets: pending, ret: pending[0] }), (pending = [])
      if (frame.ret === undefined) delete frame.ret
      frames.push(frame)
      if (frame.depth === 0) top = frame
    },
  }

  try {
    const { name } = signature(source)
    const code = `${instrument(source)}\nreturn Solution`
    const Solution = new Function("__in", "__out", "__r", "__s", "grid", code)(hooks.__in, hooks.__out, hooks.__r, hooks.__s, grid)
    result = show(new Solution()[name](...copy(input)))
  } catch (e) {
    if (e instanceof TooLong) truncated = true
    else error = e.message
  }
  // the entry method's own `return` has no statement after it, so give it a last frame
  if (!truncated && !error && pending.length && top) frames.push({ ...top, line: exit.line ?? top.line, rets: pending, ret: pending.at(-1) })

  return { frames, result, truncated, error }
}

// ---------- what the page lets you type ----------

// `example` is the problem's default input; a custom input must have the same shape.
export function checkInput(values, example) {
  for (let k = 0; k < example.length; k++) {
    const v = values[k]
    const want = example[k]
    if (typeof want === "string") {
      if (typeof v !== "string" || v.length > MAX_LEN) return `argument ${k + 1}: a string of at most ${MAX_LEN} characters`
    } else if (Array.isArray(want)) {
      const ok = Array.isArray(v) && v.length >= 1 && v.length <= MAX_LEN && v.every((x) => Number.isInteger(x) && Math.abs(x) <= MAX_ABS)
      if (!ok) return `argument ${k + 1}: a list of 1 to ${MAX_LEN} integers, each between -${MAX_ABS} and ${MAX_ABS}`
    } else if (!Number.isInteger(v) || Math.abs(v) > MAX_ABS) return `argument ${k + 1}: an integer between -${MAX_ABS} and ${MAX_ABS}`
  }
  return ""
}
