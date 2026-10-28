import { cn } from "./patterns"

const isScalar = (v) => typeof v !== "object"
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// Draws any value the debugger gave us. `prev` is the same value one step ago (changed cells light up).
// number -> cell · [numbers] -> row · [[numbers]] -> grid · {first, second} -> pair · deeper -> stacked
function Cell({ v, changed, label }) {
  return (
    <span className="inline-flex flex-col items-center">
      {label !== undefined && <span className="text-[9px] leading-3 text-muted-foreground">{label}</span>}
      <span
        className={cn(
          "min-w-7 rounded border px-1.5 py-0.5 text-center font-mono text-xs transition-colors",
          changed ? "border-amber-400 bg-amber-200 font-semibold" : "bg-white",
          v === -1 && !changed && "text-slate-300", // -1 = memo cell not filled yet
        )}
      >
        {String(v)}
      </span>
    </span>
  )
}

function Value({ v, prev, index }) {
  const changed = prev !== undefined && !same(v, prev)
  if (isScalar(v)) return <Cell v={v} changed={changed} label={index} />

  if (!Array.isArray(v)) {
    const pair = Object.keys(v).join() === "first,second"
    return (
      <span className="inline-flex flex-wrap items-center gap-1 rounded-md bg-sky-50 px-1.5 py-0.5 ring-1 ring-sky-200">
        {Object.entries(v).map(([key, x]) => (
          <span key={key} className="inline-flex items-center gap-1">
            {!pair && <span className="text-[10px] text-muted-foreground">{key}</span>}
            <Value v={x} prev={prev?.[key]} />
          </span>
        ))}
      </span>
    )
  }

  const old = Array.isArray(prev) ? prev : undefined
  const dim = (x) => (Array.isArray(x) ? 1 + dim(x[0]) : 0) // 1 row, 2 grid, 3 grids
  const grid = dim(v) === 2
  const stacked = dim(v) > 2
  return (
    <div className={cn("flex gap-1", grid ? "flex-col" : "flex-wrap items-end", stacked && "gap-3")}>
      {v.length === 0 && <span className="text-xs italic text-muted-foreground">empty</span>}
      {v.map((x, k) => (
        <div key={k} className={cn((grid || stacked) && "flex items-start gap-1")}>
          {(grid || stacked) && <span className="w-5 pt-1 text-right text-[9px] text-muted-foreground">{k}</span>}
          <Value v={x} prev={old && (k < old.length ? old[k] : "new")} index={grid || stacked ? undefined : k} />
        </div>
      ))}
    </div>
  )
}

function Named({ name, v, prev }) {
  return (
    <div className={cn("flex gap-2", isScalar(v) ? "items-center" : "flex-col")}>
      <span className="font-mono text-xs font-semibold text-violet-700">{name}</span>
      <Value v={v} prev={prev} />
    </div>
  )
}

// The variables panel: locals (scalars first), then class members as this->name.
export function Variables({ frame, before }) {
  const prev = before && before.fn === frame.fn && before.depth === frame.depth ? before.vars : {}
  const vars = Object.entries(frame.vars)
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>inside <b className="font-mono text-foreground">{frame.fn}</b></span>
        {frame.ret !== undefined && (
          <span className="rounded bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800">returned {JSON.stringify(frame.ret)}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {vars.filter(([, v]) => isScalar(v)).map(([name, v]) => <Named key={name} name={name} v={v} prev={prev[name]} />)}
      </div>
      <div className="mt-2 space-y-3">
        {vars.filter(([, v]) => !isScalar(v)).map(([name, v]) => <Named key={name} name={name} v={v} prev={prev[name]} />)}
        {Object.entries(frame.mem).map(([name, v]) => (
          <div key={name} className="border-t pt-2">
            <Named name={`this->${name}`} v={v} prev={before?.mem[name]} />
          </div>
        ))}
      </div>
    </div>
  )
}
