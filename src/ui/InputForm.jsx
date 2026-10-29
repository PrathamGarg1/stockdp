import { useState } from "react"

const MAX_LEN = 15 // longest list / string the page accepts
const MAX_ABS = 1000 // biggest number the page accepts

// A typed input must have the same shape as the problem's example: list, string or number.
function checkInput(values, example) {
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

// One box per parameter of the solution, filled with the default example. Edit, press Run.
export function InputForm({ params, example, onRun, result, error }) {
  const start = example.map((x) => JSON.stringify(x))
  const [texts, setTexts] = useState(start)
  const [complaint, setComplaint] = useState("")

  const run = (e, from = texts) => {
    e?.preventDefault()
    try {
      const values = from.map((t) => JSON.parse(t))
      const bad = checkInput(values, example)
      setComplaint(bad)
      if (!bad) onRun(values)
    } catch {
      setComplaint('each box must be valid JSON, like [1,2,3]  or  5  or  "0110"')
    }
  }
  const reset = () => (setTexts(start), run(null, start))

  return (
    <form onSubmit={run} className="rounded-lg border bg-white p-3">
      <div className="flex flex-wrap items-end gap-3">
        {params.map((name, k) => (
          <label key={name} className="text-xs text-muted-foreground">
            <span className="font-mono font-semibold text-violet-700">{name}</span>
            <input
              className="mt-1 block rounded border px-2 py-1 font-mono text-sm text-foreground"
              style={{ width: `${Math.max(texts[k].length + 2, 8)}ch` }}
              value={texts[k]}
              onChange={(e) => setTexts(texts.map((t, j) => (j === k ? e.target.value : t)))}
            />
          </label>
        ))}
        <button className="h-8 rounded-md bg-violet-600 px-4 text-sm font-medium text-white">Run</button>
        <button type="button" onClick={reset} className="h-8 rounded-md border px-3 text-sm hover:bg-slate-50">Example</button>
        {result !== undefined && (
          <span className="ml-auto font-mono text-sm">returns <b>{result}</b></span>
        )}
      </div>
      {complaint && <p className="mt-2 text-xs text-red-600">{complaint}</p>}
      {error && <p className="mt-2 text-xs text-red-600">The solution crashed on this input: {error}</p>}
    </form>
  )
}
