import { motion } from "motion/react"
import { cn } from "./patterns"

const CHIP = ["bg-violet-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-pink-500"]
const POINTER = /^(i|j|k|l|r|lo|hi|idx|start|end|mid|cur|pos)$/

// The input array as bars. Step variables named like indices (i, j, l, r ...) become chips above their bar.
export function Bars({ values, vars }) {
  const ptr = Object.fromEntries(Object.entries(vars).filter(([n, v]) => typeof v === "number" && POINTER.test(n) && v >= 0 && v < values.length))
  const names = Object.keys(ptr)
  const lo = Math.min(0, ...values)
  const span = Math.max(...values) - lo || 1
  return (
    <div className="flex items-end gap-1.5 overflow-x-auto pb-1 pt-6">
      {values.map((x, k) => {
        const here = names.filter((n) => ptr[n] === k)
        return (
          <div key={k} className="relative flex w-9 shrink-0 flex-col items-center">
            <div className="absolute -top-6 flex gap-0.5">
              {here.map((n) => (
                <motion.span key={n} layoutId={`chip-${n}`} className={cn("rounded px-1 text-[10px] font-semibold text-white", CHIP[names.indexOf(n) % CHIP.length])}>
                  {n}
                </motion.span>
              ))}
            </div>
            <motion.div className={cn("w-full rounded-t", here.length ? "bg-violet-500" : "bg-violet-200")} animate={{ height: 12 + ((x - lo) / span) * 70 }} />
            <span className="text-xs font-medium">{x}</span>
            <span className="text-[9px] text-muted-foreground">{k}</span>
          </div>
        )
      })}
    </div>
  )
}
