import { useState } from "react"
import problems from "./problems.json"
import { solutions } from "./solutions"
import { runTrace, signature } from "./trace"
import { Sidebar, Header, InputForm, Code, Bars, Tree, Variables, Controls } from "./ui"

// Ye page 3 cheezein yaad rakhta hai:
//   problem : kaunsi problem khuli hai
//   out     : uska trace = solution ko input par chalane ka record (frames ki list)
//   step    : abhi kaunsa frame dikh raha hai (0, 1, 2, ...)
// Ek frame = "us line par program kaisa dikhta tha": { line, vars, mem, depth, ... }
// Page bas frames[step] ko dikhata hai.

const first = problems[0]
const firstOut = runTrace(solutions[first.id].js, first.example)

export default function App() {
  const [problem, setProblem] = useState(first)
  const [out, setOut] = useState(firstOut)
  const [step, setStep] = useState(0)

  // problem ko input par chalao, trace save karo, aur step 0 se shuru karo
  function run(p, input) {
    setProblem(p)
    setOut(runTrace(solutions[p.id].js, input))
    setStep(0)
  }

  const { js, cpp } = solutions[problem.id]
  const frame = out.frames[step]

  return (
    <div className="flex h-full">
      <Sidebar problems={problems} id={problem.id} onPick={(p) => run(p, p.example)} />
      <main className="min-w-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl space-y-4 p-6">
          <Header problem={problem} />
          <InputForm
            key={problem.id}
            params={signature(js).params}
            example={problem.example}
            onRun={(values) => run(problem, values)}
            result={out.result}
            error={out.error}
            truncated={out.truncated}
          />
          {frame && (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                <Code code={js} cpp={cpp} line={frame.line} />
                <div className="min-w-0 space-y-3">
                  <Bars frames={out.frames} frame={frame} />
                  <Tree frames={out.frames} step={step} />
                  <Variables frame={frame} before={out.frames[step - 1]} />
                </div>
              </div>
              <Controls step={step} setStep={setStep} total={out.frames.length} />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
