import { useEffect, useMemo, useState } from "react"
import problems from "./problems.json"
import { runTrace, signature } from "./trace"
import { Sidebar, Header, InputForm, Code, Bars, Tree, Variables, Controls } from "./ui"

// src/solutions/<id>.js is your solution (a line-for-line port of the C++ in mysolutions/).
// runTrace() runs it on an input and records one frame per statement:
//   { line, depth, fn, args, vars, mem, ret? }  = "what the program looked like at that line"
// This page shows frames[step]. Type a different input and the trace is recorded again.
const solutions = import.meta.glob("./solutions/*.js", { query: "?raw", import: "default" }) // loaded when opened

export default function App() {
  const [id, setId] = useState(location.hash.slice(1))
  const [source, setSource] = useState(null) // the solution's code
  const [input, setInput] = useState(null) // what it runs on
  const [step, setStep] = useState(Number(new URLSearchParams(location.search).get("step")) || 0)

  const problem = problems.find((p) => p.id === id) ?? problems[0]

  useEffect(() => {
    const open = () => (setId(location.hash.slice(1)), setStep(0))
    window.addEventListener("hashchange", open)
    return () => window.removeEventListener("hashchange", open)
  }, [])

  useEffect(() => {
    setSource(null)
    setInput(problem.example)
    solutions[`./solutions/${problem.id}.js`]().then(setSource)
  }, [problem])

  const params = useMemo(() => (source ? signature(source).params : []), [source])
  const out = useMemo(() => source && runTrace(source, input), [source, input])
  const frames = out?.frames
  const frame = frames?.[step]

  return (
    <div className="flex h-full">
      <Sidebar problems={problems} id={problem.id} />
      <main className="min-w-0 flex-1 overflow-auto">
        {out ? (
          <div className="mx-auto max-w-6xl space-y-4 p-6">
            <Header problem={problem} />
            <InputForm
              key={problem.id}
              params={params}
              example={problem.example}
              onRun={(values) => (setInput(values), setStep(0))}
              result={out.result}
              error={out.error}
              truncated={out.truncated}
            />
            {frame && (
              <>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Code code={source} line={frame.line} />
                  <div className="min-w-0 space-y-3">
                    <Bars frames={frames} frame={frame} />
                    <Tree frames={frames} step={step} />
                    <Variables frame={frame} before={frames[step - 1]} />
                  </div>
                </div>
                <Controls step={step} setStep={setStep} total={frames.length} />
              </>
            )}
          </div>
        ) : (
          <p className="p-8 text-muted-foreground">Loading...</p>
        )}
      </main>
    </div>
  )
}
