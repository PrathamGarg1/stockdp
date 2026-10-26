import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { isScalar, type Node, type V } from "./trace"

const same = (a: V | undefined, b: V | undefined) => JSON.stringify(a) === JSON.stringify(b)

// ---- Value: draws any value the debugger gave us. `prev` is the same value one step ago. ----
// number -> cell · [numbers] -> row · [[numbers]] -> grid · {first,second} -> (a, b) · deeper -> stacked

function Cell({ v, changed, label }: { v: V; changed: boolean; label?: string | number }) {
  return (
    <span className="inline-flex flex-col items-center">
      {label !== undefined && <span className="text-[9px] leading-3 text-muted-foreground">{label}</span>}
      <span
        className={cn(
          "num min-w-7 rounded border px-1.5 py-0.5 text-center font-mono text-xs transition-colors",
          changed ? "border-amber-400 bg-amber-200 font-semibold" : "bg-white",
          v === -1 && !changed && "text-slate-300", // -1 = memo cell not filled yet
        )}
      >
        {String(v)}
      </span>
    </span>
  )
}

export function Value({ v, prev, index }: { v: V; prev?: V; index?: number }): JSX.Element {
  const changed = prev !== undefined && !same(v, prev)
  if (isScalar(v)) return <Cell v={v} changed={changed} label={index} />

  if (!Array.isArray(v)) {
    const pair = Object.keys(v).join() === "first,second"
    return (
      <span className="inline-flex flex-wrap items-center gap-1 rounded-md bg-sky-50 px-1.5 py-0.5 ring-1 ring-sky-200">
        {Object.entries(v).map(([key, x]) => (
          <span key={key} className="inline-flex items-center gap-1">
            {!pair && <span className="text-[10px] text-muted-foreground">{key}</span>}
            <Value v={x} prev={(prev as Record<string, V> | undefined)?.[key]} />
          </span>
        ))}
      </span>
    )
  }

  const old = Array.isArray(prev) ? prev : undefined
  const dim = (x: V): number => (Array.isArray(x) ? 1 + dim(x[0]) : 0) // 1 row, 2 grid, 3 grids
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

export function Named({ name, v, prev }: { name: string; v: V; prev?: V }) {
  const inline = isScalar(v)
  return (
    <div className={cn("flex gap-2", inline ? "items-center" : "flex-col")}>
      <span className="font-mono text-xs font-semibold text-violet-700">{name}</span>
      <Value v={v} prev={prev} />
    </div>
  )
}

// ---- Bars: the entry method's first array argument, with pointer chips ----

const CHIP = ["bg-violet-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-pink-500"]

export function Bars({ values, ptr }: { values: number[]; ptr: Record<string, number> }) {
  const lo = Math.min(0, ...values)
  const span = Math.max(...values) - lo || 1
  const names = Object.keys(ptr)
  return (
    <div className="flex items-end gap-1.5 overflow-x-auto pb-1 pt-6">
      {values.map((x, k) => {
        const here = names.filter((n) => ptr[n] === k)
        return (
          <div key={k} className="relative flex w-9 shrink-0 flex-col items-center">
            <div className="absolute -top-6 flex gap-0.5">
              {here.map((n) => (
                <motion.span
                  key={n}
                  layoutId={`chip-${n}`}
                  className={cn("rounded px-1 text-[10px] font-semibold text-white", CHIP[names.indexOf(n) % CHIP.length])}
                >
                  {n}
                </motion.span>
              ))}
            </div>
            <motion.div
              className={cn("w-full rounded-t", here.length ? "bg-violet-500" : "bg-violet-200")}
              animate={{ height: 12 + ((x - lo) / span) * 70 }}
            />
            <span className="num text-xs font-medium">{x}</span>
            <span className="text-[9px] text-muted-foreground">{k}</span>
          </div>
        )
      })}
    </div>
  )
}

// ---- Tree: the recursion tree, grown from the frames ----

const GAP_X = 74
const GAP_Y = 54

export function Tree({ nodes, step, now }: { nodes: Node[]; step: number; now: number }) {
  const shown = nodes.filter((n) => n.open <= step)
  const kids = (id: number) => shown.filter((n) => n.parent === id)
  const pos = new Map<number, { x: number; y: number }>()
  let leaf = 0
  const place = (n: Node, depth: number): number => {
    const ch = kids(n.id).map((c) => place(c, depth + 1))
    const x = ch.length ? (ch[0] + ch.at(-1)!) / 2 : leaf++
    pos.set(n.id, { x, y: depth })
    return x
  }
  kids(-1).forEach((r) => place(r, 0))

  const width = Math.max(leaf, 1) * GAP_X
  const height = (Math.max(...[...pos.values()].map((p) => p.y), 0) + 1) * GAP_Y + 20
  const at = (id: number) => ({ x: pos.get(id)!.x * GAP_X + GAP_X / 2, y: pos.get(id)!.y * GAP_Y + 24 })
  return (
    <div className="max-h-80 overflow-auto rounded-lg border bg-white">
      <svg width={width} height={height}>
        {shown.filter((n) => n.parent >= 0).map((n) => (
          <line key={n.id} x1={at(n.parent).x} y1={at(n.parent).y} x2={at(n.id).x} y2={at(n.id).y} stroke="#cbd5e1" />
        ))}
        {shown.map((n) => {
          const done = n.close !== undefined && n.close <= step
          const { x, y } = at(n.id)
          return (
            <motion.g key={n.id} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ originX: `${x}px`, originY: `${y}px` }}>
              <rect
                x={x - 33} y={y - 17} width={66} height={34} rx={8}
                fill={n.id === now ? "#fde68a" : done ? "#d1fae5" : "#ede9fe"}
                stroke={n.id === now ? "#f59e0b" : done ? "#34d399" : "#a78bfa"}
                strokeWidth={n.id === now ? 2.5 : 1.5}
              />
              <text x={x} y={y - 3} textAnchor="middle" fontSize={9} fontFamily="monospace">{n.label.slice(0, 13)}</text>
              <text x={x} y={y + 10} textAnchor="middle" fontSize={11} fontWeight={700}>{done ? String(n.ret ?? "") : "..."}</text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
