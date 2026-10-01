// Draws one frame. The trace says what to mark. This file only paints it.
import type { DpTable, Frame, MarkTone } from "@/engine/types"
import { cn } from "@/lib/utils"

const toneClass: Partial<Record<MarkTone, string>> = {
  cursor: "border-primary bg-primary text-primary-foreground",
  best: "border-emerald-600 bg-emerald-100 text-emerald-950",
  take: "border-emerald-600 bg-emerald-100 text-emerald-950",
  lock: "border-destructive bg-destructive/10 text-destructive",
  wall: "border-border bg-muted text-muted-foreground",
  win: "border-emerald-600 bg-emerald-100 text-emerald-950",
  loss: "border-destructive bg-destructive/10 text-destructive",
  alice: "border-amber-500 bg-amber-100 text-amber-950",
  bob: "border-sky-600 bg-sky-100 text-sky-950",
}

export function Board({ frame }: { frame: Frame }) {
  const values = frame.values ?? []
  const max = Math.max(...values.map((value) => Math.abs(value)), 1)
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-2">
        {values.map((value, i) => {
          const tone = [...frame.marks]
            .reverse()
            .find((mark): mark is Extract<typeof mark, { kind: "index" }> => mark.kind === "index" && mark.i === i)
          const ranged = frame.marks.some((mark) => mark.kind === "range" && mark.tone !== "muted" && i >= mark.from && i <= mark.to)
          return (
            <div key={i} className="flex w-12 flex-col items-center gap-1">
              {frame.labels?.[i] && <span className="font-mono text-[11px] text-muted-foreground">{frame.labels[i]}</span>}
              <div
                className={cn(
                  "num flex w-12 items-center justify-center rounded-md border font-mono text-sm",
                  tone ? toneClass[tone.tone] : ranged ? "border-emerald-600 bg-emerald-50 text-emerald-950" : "border-border bg-background",
                )}
                style={{ height: frame.skyline ? Math.max(28, (Math.abs(value) / max) * 96) : 40 }}
              >
                {value}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
            </div>
          )
        })}
      </div>
      <Marks frame={frame} n={values.length} />
      {frame.meters.length > 0 && (
        <p className="num font-mono text-xs text-muted-foreground">{frame.meters.map((meter) => `${meter.label} ${meter.value}`).join("   ")}</p>
      )}
      {frame.table && <Grid table={frame.table} />}
    </div>
  )
}

function Marks({ frame, n }: { frame: Frame; n: number }) {
  const band = frame.marks.find((mark) => mark.kind === "band")
  const arcs = frame.marks.filter((mark) => mark.kind === "arc")
  return (
    <div className="space-y-1 text-xs text-muted-foreground">
      {band && band.kind === "band" && n > 0 && <p>reachable through index {band.to}</p>}
      {arcs.length > 0 && <p>{arcs.map((mark) => (mark.kind === "arc" ? `${mark.from}→${mark.to}` : "")).join("  ")}</p>}
      {frame.deque && <p>deque {frame.deque.join(" ")}</p>}
      {frame.stacks?.map((stack) => (
        <p key={stack.name}>
          {stack.name} {stack.values.join(" ")}
        </p>
      ))}
      {frame.secondary && (
        <p>
          {frame.secondary.label} {frame.secondary.values.join(" ")}
        </p>
      )}
      {frame.guides?.map((guide) => (
        <p key={guide.label}>
          {guide.label} {guide.value}
        </p>
      ))}
    </div>
  )
}

function Grid({ table }: { table: DpTable }) {
  return (
    <div className="overflow-x-auto">
      {table.caption && <p className="mb-1 font-mono text-xs text-muted-foreground">{table.caption}</p>}
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th />
            {table.colLabels.map((label) => (
              <th key={label} className="px-2 text-left font-mono text-xs font-normal text-muted-foreground">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.cells.map((row, r) => (
            <tr key={table.rowLabels[r] ?? r}>
              <th className="pr-2 text-left font-mono text-xs font-normal text-muted-foreground">{table.rowLabels[r]}</th>
              {row.map((cell, c) => {
                const active = table.active?.[0] === r && table.active?.[1] === c
                return (
                  <td key={c} className={cn("num border px-2 py-1 text-center font-mono", active && "border-primary bg-accent")}>
                    {cell.text}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
