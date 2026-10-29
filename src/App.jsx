import { useState } from "react"
import problems from "./problems.json"
import { solutions, show } from "./solutions"
import { Sidebar, Header, InputForm, Code, Bars, Variables, Controls } from "./ui"

// Ye page 3 cheezein yaad rakhta hai:
//   problem : kaunsi problem khuli hai
//   out     : solve() chalane ka record = { input, answer, steps }
//   step    : abhi kaunsa step dikh raha hai (0, 1, 2, ...)
// Ek step = us moment par variables, jaise { i: 2, ans: 4, dp: [...] }. Page bas steps[step] dikhata hai.

function run(p, input) {
  try {
    const { answer, steps } = solutions[p.id].solve(...structuredClone(input))
    return { input, answer: show(answer), steps }
  } catch (e) {
    return { input, steps: [], error: e.message }
  }
}

const first = problems[0]
const firstOut = run(first, first.example)

export default function App() {
  const [problem, setProblem] = useState(first)
  const [out, setOut] = useState(firstOut)
  const [step, setStep] = useState(0)

  // problem ko input par chalao, steps save karo, aur step 0 se shuru karo
  function open(p, input) {
    setProblem(p)
    setOut(run(p, input))
    setStep(0)
  }

  const now = out.steps[step]
  const bars = out.input.find((x) => Array.isArray(x) && typeof x[0] === "number") // the first list of numbers in the input

  return (
    <div className="flex h-full">
      <Sidebar problems={problems} id={problem.id} onPick={(p) => open(p, p.example)} />
      <main className="min-w-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl space-y-4 p-6">
          <Header problem={problem} />
          <InputForm
            key={problem.id}
            params={problem.params}
            example={problem.example}
            onRun={(values) => open(problem, values)}
            result={out.answer}
            error={out.error}
          />
          {now && (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                <Code cpp={solutions[problem.id].cpp} />
                <div className="min-w-0 space-y-3">
                  {bars && <Bars values={bars} vars={now} />}
                  <Variables vars={now} prev={out.steps[step - 1]} />
                </div>
              </div>
              <Controls step={step} setStep={setStep} total={out.steps.length} />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
