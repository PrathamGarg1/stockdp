import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pause, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { PATTERNS, type PatternId } from "./patterns"
import problems from "./problems.json"
import { buildTree, current, isScalar, pointers, type Problem, type Trace } from "./trace"
import { Bars, Named, Tree } from "./views"

const list = problems as Problem[]
const loaders = import.meta.glob<{ default: Trace }>("./traces/*.json") // loaded only when a problem is opened

export default function App() {
  const [id, setId] = useState(() => location.hash.slice(1) || list[0].id)
  useEffect(() => {
    const onHash = () => setId(location.hash.slice(1) || list[0].id)
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  const problem = list.find((p) => p.id === id) ?? list[0]
  const [trace, setTrace] = useState<Trace | null>(null)
  useEffect(() => {
    setTrace(null)
    loaders[`./traces/${problem.id}.json`]().then((m) => setTrace(m.default))
  }, [problem.id])

  return (
    <div className="flex h-full">
      <aside className="w-72 shrink-0 border-r bg-slate-50">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h1 className="text-lg font-bold">Stocks & Stones</h1>
            <p className="mb-4 text-xs text-muted-foreground">Your C++, run line by line. Grouped by pattern.</p>
            {(Object.keys(PATTERNS) as PatternId[]).map((pid) => (
              <div key={pid} className="mb-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className={cn("h-2 w-2 rounded-full", PATTERNS[pid].dot)} />
                  {PATTERNS[pid].name}
                </div>
                {list.filter((p) => p.pattern === pid).map((p) => (
                  <a
                    key={p.id}
                    href={`#${p.id}`}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-sm hover:bg-white",
                      p.id === problem.id && "bg-white font-medium shadow-sm ring-1 ring-primary/30",
                    )}
                  >
                    {p.title}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto">
        {trace ? <Player key={problem.id} problem={problem} trace={trace} /> : <p className="p-8 text-muted-foreground">Loading...</p>}
      </main>
    </div>
  )
}

function Player({ problem, trace }: { problem: Problem; trace: Trace }) {
  const { frames, cpp } = trace
  const [step, setStep] = useState(() => Math.min(Number(new URLSearchParams(location.search).get("step") ?? 0), frames.length - 1))
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(400)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStep((s) => (s + 1 < frames.length ? s + 1 : (setPlaying(false), s))), speed)
    return () => clearInterval(t)
  }, [playing, speed, frames.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, frames.length - 1))
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0))
      if (e.key === " ") (e.preventDefault(), setPlaying((p) => !p))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [frames.length])

  const f = frames[step]
  const before = frames[step - 1]
  const nodes = useMemo(() => buildTree(frames), [frames])
  const hasTree = frames.some((x) => x.depth >= 2)

  // the input array, drawn as bars
  const first = frames[0]
  const barName = first.args.find((a) => Array.isArray(first.vars[a]) && (first.vars[a] as unknown[]).every((x) => typeof x === "number"))
  const bars = barName ? (first.vars[barName] as number[]) : undefined

  const prevVars = before && before.fn === f.fn && before.depth === f.depth ? before.vars : {}
  const vars = Object.entries(f.vars).filter(([name]) => name !== barName)
  const scalars = vars.filter(([, v]) => isScalar(v))
  const pattern = PATTERNS[problem.pattern]

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-bold">{problem.title}</h2>
          <Badge className="gap-1.5 bg-white text-foreground ring-1 ring-border hover:bg-white">
            <span className={cn("h-2 w-2 rounded-full", pattern.dot)} />
            {pattern.name}
          </Badge>
        </div>
        <p className="mt-1 text-sm">{problem.note}</p>
        <p className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-muted-foreground">
          <b className="text-foreground">Spot it:</b> {pattern.spot} <b className="text-foreground">Rule:</b> {pattern.rule}
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          input {JSON.stringify(problem.example)} → <b className="text-foreground">{trace.result}</b>
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Code cpp={cpp} line={f.line} />

        <div className="min-w-0 space-y-3">
          {bars && <Bars values={bars} ptr={pointers(f, bars.length)} />}
          {hasTree && <Tree nodes={nodes} step={step} now={current(nodes, step)} />}

          <div className="rounded-lg border bg-white p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                inside <b className="font-mono text-foreground">{f.fn}</b>
              </span>
              {f.ret !== undefined && (
                <span className="rounded bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800">
                  returned {JSON.stringify(f.ret)}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {scalars.map(([name, v]) => (
                <Named key={name} name={name} v={v} prev={prevVars[name]} />
              ))}
            </div>
            <div className="mt-2 space-y-3">
              {vars.filter(([, v]) => !isScalar(v)).map(([name, v]) => (
                <Named key={name} name={name} v={v} prev={prevVars[name]} />
              ))}
              {Object.entries(f.mem).map(([name, v]) => (
                <div key={name} className="border-t pt-2">
                  <Named name={`this->${name}`} v={v} prev={before?.mem[name]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 rounded-lg border bg-white/95 p-3 shadow-sm backdrop-blur">
        <Button size="icon" variant="outline" onClick={() => setStep(0)}><ChevronsLeft /></Button>
        <Button size="icon" variant="outline" onClick={() => setStep(Math.max(step - 1, 0))}><ChevronLeft /></Button>
        <Button size="icon" onClick={() => setPlaying(!playing)}>{playing ? <Pause /> : <Play />}</Button>
        <Button size="icon" variant="outline" onClick={() => setStep(Math.min(step + 1, frames.length - 1))}><ChevronRight /></Button>
        <Button size="icon" variant="outline" onClick={() => setStep(frames.length - 1)}><ChevronsRight /></Button>
        <Slider className="min-w-40 flex-1" min={0} max={frames.length - 1} value={[step]} onValueChange={([s]) => setStep(s)} />
        <span className="num w-20 text-right text-xs text-muted-foreground">{step + 1} / {frames.length}</span>
        <select className="rounded border bg-white px-2 py-1 text-xs" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
          <option value={800}>slow</option>
          <option value={400}>normal</option>
          <option value={120}>fast</option>
        </select>
      </div>
    </div>
  )
}

// Your code, untouched. The highlighted line is the one the debugger is stopped on.
function Code({ cpp, line }: { cpp: string; line: number }) {
  const now = useRef<HTMLDivElement>(null)
  useEffect(() => now.current?.scrollIntoView({ block: "nearest" }), [line])
  return (
    <pre className="max-h-[34rem] overflow-auto rounded-lg border bg-slate-950 py-2 text-[12px] leading-5 text-slate-100">
      {cpp.split("\n").map((text, k) => (
        <div key={k} ref={k + 1 === line ? now : undefined} className={cn("flex px-2", k + 1 === line && "bg-amber-400/25")}>
          <span className="w-8 shrink-0 select-none pr-3 text-right text-slate-500">{k + 1}</span>
          <code className={cn("whitespace-pre", text.trim().startsWith("//") && "text-slate-500")}>{text || " "}</code>
        </div>
      ))}
    </pre>
  )
}
